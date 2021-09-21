import { keystone } from '../../index'

const { File } = require('@keystonejs/fields')
const CloudStorageAdapter = require('keystone-storage-adapter-cloud-storage')
// const keyFilename = require('./configs/gcskeyfile')
const keyFilename = '../../configs/gcskeyfile.json'

const { KnexAdapter } = require('@keystonejs/adapter-knex')
require('dotenv').load()
const cloudStorageAdapter = CloudStorageAdapter({ keyFilename: keyFilename })

class GCSFile extends File.implementation {
    constructor(keystone, cloudStorageAdapter) {
        super(...arguments)
        this.keystone = keystone
        this.fileAdapter = cloudStorageAdapter
    }

    extendAdminMeta(meta) {
        return { ...meta }
    }
}

module.exports = {
    GCSFile,
    // KnexAdapter,
}
