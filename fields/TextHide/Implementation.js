const { Text } = require('@keystonejs/fields')

class TextHideImplementation extends Text.implementation {
    constructor(path, { hideConfig }) {
        super(...arguments)
        this.hideConfig = hideConfig
    }

    extendAdminMeta(meta) {
        return {
            ...meta,
            hideConfig: this.hideConfig,
        }
    }

    render() {}
}

module.exports = {
    Implementation: TextHideImplementation,
    MongoIntegerInterface: Text.adapters.mongoose,
    KnexIntegerInterface: Text.adapters.knex,
}
