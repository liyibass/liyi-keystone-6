const {
    Implementation,
    MongoRelationshipInterface,
    KnexRelationshipInterface,
} = require('./Implementation')
const { importView } = require('@keystonejs/build-field-types')

module.exports = {
    type: 'ImageRelationship',
    isRelationship: true, // Used internally for this special case
    implementation: Implementation,
    views: {
        Controller: require.resolve('./views/Controller'),
        Field: importView('./views/Field'),
        Filter: require.resolve('./views/Filter'),
        Cell: require.resolve('./views/Cell'),
    },
    adapters: {
        mongoose: MongoRelationshipInterface,
        knex: KnexRelationshipInterface,
    },
}
