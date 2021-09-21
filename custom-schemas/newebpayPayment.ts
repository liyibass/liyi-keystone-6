import {
  Frequency,
  MemberType,
  NewebpayStatus,
  PeriodInterval,
  Status,
} from './constants'

const maxPeriodFailureTimes = process.env.SUBSCRIPTION_MAX_PERIOD_FAILURE_TIMES || 3

interface Subscription {
  memberId?: number;
  status?: string;
  periodLastSuccessDatetime?: string;
  periodNextPayDatetime?: string;
  periodCreateDatetime?: string;
  periodFirstDatetime?: string;
  periodEndDatetime?: string;
  periodFailureTimes?: number;
  oneTimeStartDatetime?: string;
  oneTimeEndDatetime?: string;
  frequency?: Frequency;
  nextFrequency?: Frequency;
  isActive?: boolean;
}

export function getNextPeriodRelatedDatetime (params: {
  periodCreateDatetime?: string,
  periodEndDatetime?: string,
  periodNextPayDatetime?: string,
  paymentTime: string,
  periodInterval: number,
}) {
  const next = {
    periodCreateDatetime: params.periodCreateDatetime || params.paymentTime,
    periodEndDatetime: '',
    periodFirstDatetime: params.periodEndDatetime || params.paymentTime,
    periodLastSuccessDatetime: params.paymentTime,
    periodNextPayDatetime: '',
  }

  const keys = ['periodEndDatetime', 'periodNextPayDatetime']

  keys.forEach((key) => {
    const date = isNaN(Date.parse(params[key])) ?
      new Date(params.paymentTime) : new Date(params[key]) 
    date.setDate(date.getDate() + params.periodInterval)
    next[key] = date.toISOString()
  })

  return next
}

export const subscriptionManager = {
  getOneTimeUpdateInput: ({
    paymentStatus,
    paymentTime,
  }: {
    paymentStatus: string,
    paymentTime: string,
  }) : Subscription => {
    let updateSubscriptionInput: Subscription = {}

    if (paymentStatus !== NewebpayStatus.Success) { 
      updateSubscriptionInput.status = Status.Fail
    } else {
      updateSubscriptionInput.status = Status.Paid
      updateSubscriptionInput.oneTimeStartDatetime = paymentTime
      const endDate = new Date(paymentTime)
      // add 10 days
      endDate.setDate(endDate.getDate() + PeriodInterval.OneTime)
      updateSubscriptionInput.oneTimeEndDatetime = endDate.toISOString()
    }

    return updateSubscriptionInput
  },

  getPeriodUpdateInput: ({
    subscription,
    paymentStatus,
    paymentTime,
    subsFrequency,
  }: {
    subscription: Subscription,
    paymentStatus: string,
    paymentTime: string,
    subsFrequency: Frequency,
  }) : Subscription => {
    let updateSubscriptionInput: Subscription = {}

    if (paymentStatus !== NewebpayStatus.Success) {
      // The first payment fails
      if (!subscription.periodEndDatetime) {
        updateSubscriptionInput.status = Status.Fail
        updateSubscriptionInput.isActive = false
        return updateSubscriptionInput
      } 

      // There are more than `maxPeriodFailureTimes` excessive failures
      // then mark subscription.status as `stopped`
      if (subscription.periodFailureTimes + 1 > maxPeriodFailureTimes) {
        updateSubscriptionInput.status = Status.Stopped
      } else {
        updateSubscriptionInput.status = Status.Fail
      }

      updateSubscriptionInput.periodFailureTimes = subscription.periodFailureTimes + 1

      // subscription is no longer active if subscription.periodEndDatetime + delay buffer < now
      updateSubscriptionInput.isActive = new Date(subscription.periodEndDatetime).getTime() +
        PeriodInterval.DelayBufferInSecs > Date.now()
      return updateSubscriptionInput
    }

    updateSubscriptionInput.status = Status.Paid
    // reset periodFailureTimes
    updateSubscriptionInput.periodFailureTimes = 0

    // calculate next round period datetimes
    const nextPeriodDatetimes = getNextPeriodRelatedDatetime({
      periodCreateDatetime: subscription.periodCreateDatetime,
      periodEndDatetime: subscription.periodEndDatetime,
      periodNextPayDatetime: subscription.periodNextPayDatetime,
      paymentTime, 
      periodInterval: subsFrequency === Frequency.Yearly ? PeriodInterval.Yearly : PeriodInterval.Monthly,
    })
    Object.assign(updateSubscriptionInput, nextPeriodDatetimes)

    updateSubscriptionInput.frequency = subsFrequency

      // subscription is no longer active if updateSubscriptionInput.periodEndDatetime < now
    updateSubscriptionInput.isActive = new Date(updateSubscriptionInput.periodEndDatetime).getTime() > Date.now()

    return updateSubscriptionInput
  },
}

export const typeDefs = 
`
input RawNewebpayPaymentInput {
  amount: Int!
  status: String!
  paymentTime: String!
  tradeNumber: String!
  message: String
  merchantId: String!
  orderNumber: String!
  tokenUseStatus: Int
  respondCode: String
  ECI: String
  authCode: String
  authBank: String
  cardInfoLastFour: String
  cardInfoFirstSix: String
  cardInfoExp: String
  tokenValue: String
  tokenLife: String
  subscriptionFrequency: subscriptionFrequencyType!
  subscriptionOrderNumber: String!
}

type Mutation {
  """ 
  Create a newebpay payment and update its corresponding subscription which matches all the following conditions
  1. status === 'paying'
  2. periodEndDatetime <= paymentData.paymentTime
  4. orderNumber === subsOrderNumber
  """
  createNewebpayPaymentAndUpdateSubscription(paymentData: RawNewebpayPaymentInput!): newebpayPayment
}
`

export const resolvers = {
  Mutation: {
    createNewebpayPaymentAndUpdateSubscription: async (root, { paymentData }, context) => {
      const subsOrderNumber = paymentData.subscriptionOrderNumber
      let updateSubscriptionInput: Subscription = {}

      if (isNaN(Date.parse(paymentData.paymentTime))) {
        throw new Error('paymentData.paymentTime is a invalid date string')
      }

      try {
        const paymentTime = new Date(paymentData.paymentTime).toISOString()

        paymentData.paymentTime = paymentTime

        const where = {
          AND: {
            orderNumber: subsOrderNumber,
            // The reason we hard code 'paying' here is:
            // if status is not 'paying', 
            // which means the subscription is already updated by other payment.
            // Therefore, we should not update the current subscription.
            status: Status.Paying,
          },
          OR: [
            // Avoid from updating subscription mistakenly,
            // therefore, periodEndDatetime to update should be
            // larger than current periodEndDatetime
            {
              periodEndDatetime: {
                lt: paymentTime,
              },
            }, {
              periodEndDatetime: {
                equals: null,
              },
            }
          ]
        }

        const targetSubscription: Subscription = await context.prisma.subscription.findFirst({
          where,
        })

        if (!targetSubscription) {
          throw new Error('Subscription with orderNumber \'' + subsOrderNumber + 
            '\' status: \'paying\' and periodEndDatetime less than \'' + 
            paymentTime + '\' is not found')
        }

        const subsFrequency = paymentData.subscriptionFrequency
        switch(subsFrequency) {
          case Frequency.OneTime:
            updateSubscriptionInput = subscriptionManager.getOneTimeUpdateInput({
              paymentStatus: paymentData.status,
              paymentTime,
            })
            break
          case Frequency.Yearly:
          case Frequency.Monthly:
            updateSubscriptionInput = subscriptionManager.getPeriodUpdateInput({
              subscription: targetSubscription,
              paymentStatus: paymentData.status,
              paymentTime,
              subsFrequency,
            })
            break
          default:
            throw new Error(`frequency should be one of ['one-time', 'yearly', 'monthly'], but got ${subsFrequency}`)
        }

        // upadte subscription record in databsase
        const updateSubscription = context.prisma.subscription.updateMany({
          where,
          data: {
            ...updateSubscriptionInput,
          },
        })

        const { subscriptionFrequency, subscriptionOrderNumber,
          tokenLife, tokenValue, ...paymentCreateInput } = paymentData
        // create newebpayPayment record in database
        const createNewebpayPayment = context.prisma.newebpayPayment.create({
          data: {
            ...paymentCreateInput,
            subscription: {
              // add relationship to the subscription
              connect: {
                orderNumber: subsOrderNumber,
              },
            },
          }
        })

        const txns = [updateSubscription, createNewebpayPayment]

        if (tokenValue) {
          const member = await context.prisma.member.findUnique({
            where: {
              id: targetSubscription.memberId,
            },
          })

          const createNewebpayPaymentInfo = context.prisma.newebpayPaymentInfo.create({
            // create newebpayPayment record in database
            data: {
              tokenTerm: member.firebaseId,
              tokenValue,
              tokenLife: !isNaN(Date.parse(tokenLife)) ? new Date(tokenLife).toISOString() : undefined,
              subscription: {
                // add relationship to the subscription
                connect: {
                  orderNumber: subsOrderNumber,
                }
              }
            },
          })
          txns.push(createNewebpayPaymentInfo)
        }

        const [ updateResult, createResult ] = await context.prisma.$transaction(txns)

        if (updateResult?.count !== 1) {
          throw new Error(`Can not update subscription with orderNumber: ${subsOrderNumber}. Update value would be ${JSON.stringify(updateSubscriptionInput)}`)
        }

        return createResult
      } catch (err) {
        console.error(err)
        // TODO wrap err without new Error
        throw new Error(`Can not update subscription with orderNumber: ${subsOrderNumber}. Update value would be ${JSON.stringify(updateSubscriptionInput)}`)
      }
    },
  }
}

export default {
  typeDefs,
  resolvers,
}
