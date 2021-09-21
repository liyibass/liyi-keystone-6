import axios from 'axios'
import { accessControl } from '../configs/config.js'

class MemberMutation {
    memberId: number | null
    isNeedAdminControl: boolean
    sessionToken: string
    constructor(memberId?: number, isNeedAdminControl?: boolean) {
        this.memberId = memberId
        this.isNeedAdminControl = isNeedAdminControl
        this.sessionToken = ''
    }

    async setMemberIdViaNewebPayPaymentInfo(NewebPayPaymentInfoId: number) {
        try {
            const query = `
                query getMemberId($id: ID!) {
                    newebpayPaymentInfo(where: { id: $id }) {
                        newebpayPayment {
                            tradeNumber
                            subscription {
                                orderNumber
                                member {
                                    id
                                    name
                                }
                            }
                        }
                    }
                }
            `
            const variables = {
                id: NewebPayPaymentInfoId,
            }

            await this.setSessionToken()
            const result = await this.fireGraphQLRequest(query, variables)
            const correspondMemberId =
                result?.newebpayPaymentInfo?.newebpayPayment?.subscription
                    ?.member?.id

            this.memberId = parseInt(correspondMemberId)
        } catch (error) {
            console.log(error)
        }
    }

    async getMemberRelationship() {
        try {
            const query = `
                query getMemberRelationship($id:ID!){
                    member(where:{id:$id}){
                    name
                    marketingMembership{
                        id
                        status
                    }
                    subscription{
                        status
                        paymentMethod
                        newebpayPaymentCount
                        applepayPaymentCount
                        androidpayPaymentCount
                        
                    }
                    }
                }
            `
            const variables = {
                id: this.memberId,
            }

            await this.setSessionToken()

            const result = await this.fireGraphQLRequest(query, variables)
            return result
        } catch (error) {
            console.log(error)
            return error
        }
    }

    /** Pass memberType, then fire mutation request to member list to update member's type field
     * @param {string} memberType marketing || subscribe || none
     * @param {boolean} isNeedAdminControl if target list has access control, this flag can help us to CRUD target with top-level-access-permission
     */
    async setMemberType(memberType: string) {
        try {
            const query = `
            mutation UpdateMemberType($id: ID!, $type: memberTypeType!) {
                updatemember(id: $id, data: { type: $type }) {
                    firebaseId
                    email
                    type
                }
            }
            `
            const variables = {
                id: this.memberId,
                type: memberType,
            }

            await this.setSessionToken()

            const result = await this.fireGraphQLRequest(query, variables)
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    /** set up sessionToken before every request,
     * if there's no sessionToken, then fetch and put it into props.
     * it also prevents duplicate requests.
     */
    async setSessionToken() {
        if (!this.sessionToken) {
            this.sessionToken = await this.getAdminSessionToken()
        }
    }

    /** get admin token via authenticateuserWithPassword(),
     * return a sessionToken for request.headers.cookie
     */
    async getAdminSessionToken() {
        if (!this.isNeedAdminControl) return ''

        try {
            const query = `
                    mutation logInAsAdmin($identity: String!,$secret:String!){
                        authenticateuserWithPassword(email:$identity, password:$secret){
                    ... on userAuthenticationWithPasswordSuccess{
                        sessionToken
                        item{
                        name
                        }
                    }
                        ... on  userAuthenticationWithPasswordFailure{
                        code
                        message
                        }
                    }
                    }
                `

            const variables = {
                identity: accessControl.adminEmail,
                secret: accessControl.adminPassword,
            }
            // ready to fire auth request
            const result = await this.fireGraphQLRequest(query, variables)
            const sessionToken: string =
                result?.authenticateuserWithPassword?.sessionToken

            console.log(
                'admin login for top-level access control is success, continue with admin access permission'
            )
            return sessionToken
        } catch (error) {
            // no need to throw error
            // login failed, return empty token
            console.log(
                'admin login for top-level access control is failed, continue with anonymous mode'
            )
            return ''
        }
    }

    /** Pass query and variables to fire graphql request
     * @param {string} query
     * @param {object} variables
     */
    async fireGraphQLRequest(query: string, variables: object) {
        const cookieForLoginAsAdmin = this.sessionToken?.length
            ? `keystonejs-session=${this.sessionToken}`
            : null

        return axios({
            url: `http://localhost:3000/api/graphql`,
            method: 'post',
            data: {
                query,
                variables,
            },
            headers: {
                'content-type': 'application/json',
                cookie: cookieForLoginAsAdmin,
                'request-from': 'gql',
            },
        })
            .then((result) => {
                const { data, errors } = result.data

                if (errors) {
                    // GraphQL errors are optional,
                    // error reason contains access denied
                    throw new Error(errors[0].message)
                } else {
                    return data
                }
            })
            .catch((errors) => {
                // respond to a network error
                throw errors
            })
    }
}

export default MemberMutation
