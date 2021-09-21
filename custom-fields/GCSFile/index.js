const { GCSFile, KnexIntegerInterface } = require('./Implementation');
const { CloudinaryAdapter } = require('@keystonejs/file-adapters');
const { File } = require('@keystonejs/fields');

module.exports = {
    type: 'GCSFile',
    implementation: GCSFile,
    views: {
        Controller: File.views.Controller,
        Field: require.resolve('./views/Field'),
        Filter: File.views.Filter,
        Cell: require.resolve('./views/Cell'),
    },
    adapters: {
        // mongoose: MongoIntegerInterface,
        knex: KnexIntegerInterface,
    },
};