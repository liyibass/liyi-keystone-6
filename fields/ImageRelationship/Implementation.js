const { Relationship } = require('@keystonejs/fields')

class ImageRelationShipImplementation extends Relationship.implementation {
    constructor(path, { editorConfig }) {
        super(...arguments)
    }
}

module.exports = {
    Implementation: ImageRelationShipImplementation,
    MongoRelationshipInterface: Relationship.adapters.mongoose,
    KnexRelationshipInterface: Relationship.adapters.knex,
    PrismaRelationshipInterface: Relationship.adapters.prisma,
}
