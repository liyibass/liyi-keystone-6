import { graphQLSchemaExtension } from '@keystone-next/keystone'
// https://keystonejs.com/docs/apis/config#extend-graphql-schema

// import memberCs from './custom-schemas/member'
// import newebpayPaymentCs from './custom-schemas/newebpayPayment'

// const typeDefs = `
// ${memberCs.typeDefs}
// ${newebpayPaymentCs.typeDefs}
// `

export const extendGraphqlSchema = graphQLSchemaExtension({
    typeDefs: '',
    resolvers: {
        Mutation: {
            // ...memberCs.resolvers.Mutation,
            // ...newebpayPaymentCs.resolvers.Mutation,
        },
    },
})
