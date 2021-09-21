import { 
  Frequency,
  PeriodInterval,
  MemberType,
} from './constants'

export const typeDefs = 
`
input updateMemberTypeWhereInput {
  OR: [updateMemberTypeWhereInput!]
  id: ID
  updatedAt: String
}

type Mutation {
  """
  Israfel does provide \`updateMembers\` mutation, however, that mutation updates member records
  without optimistic concurrency control (OCC).

  Note: 
  Optimistic concurrency control reference:
  https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#optimistic-concurrency-control

  \`updateMemberType\` will only update those records whose \`updatedAt\` and \`id\` matches.
  """
  updateMemberType(targetType: memberTypeType!, where: updateMemberTypeWhereInput!): [member]
}
`

interface Where {
  id: string | number;
  updatedAt: string;
  OR: Where[];
}

function deletePropRecursively(obj: Where, key: string) {
  if (obj.hasOwnProperty(key)) {
    delete obj[key]
  }
  if (obj.hasOwnProperty('OR')) {
    for(let innerObj of obj.OR) {
      deletePropRecursively(innerObj, key)
    }
  }
}

function parseIntPropRecursively(obj: Where, key: string) {
  if (obj.hasOwnProperty(key)) {
    obj[key] = parseInt(obj[key])
  }
  if (obj.hasOwnProperty('OR')) {
    for(let innerObj of obj.OR) {
      parseIntPropRecursively(innerObj, key)
    }
  }
}

export const resolvers = {
  Mutation: {
    updateMemberType: async (root, {targetType, where}:{targetType: MemberType, where: Where}, context) => {
      // `id` in database definition is `int` type,
      // but in k6 graphql, ID type would be changed to `string` type.
      // Therefore, we need to parse it back to integer.
      parseIntPropRecursively(where, 'id')
      await context.prisma.member.updateMany({
        where,
        data: {
          type: targetType,
          updatedAt: new Date().toISOString(),
          // TODO add updatedBy
        },
      })

      // after updates, affected records' `updatedAt` would be updated,
      // therefore, we need to remove it from `where` object.
      deletePropRecursively(where, 'updatedAt')
      const members = context.prisma.member.findMany({
        where,
      })

      return members
    },
  },
}

export default {
  typeDefs,
  resolvers,
}
