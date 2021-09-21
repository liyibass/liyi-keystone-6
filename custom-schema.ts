import memberCs from './custom-schemas/member'
import newebpayPaymentCs from './custom-schemas/newebpayPayment' 
import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';

const typeDefs =
`
${memberCs.typeDefs}
${newebpayPaymentCs.typeDefs}
`

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs,
  resolvers: {
    Mutation: {
      ...memberCs.resolvers.Mutation,
      ...newebpayPaymentCs.resolvers.Mutation,
    },
  },
});
