export default class File {
    id: string

    constructor(fileId: string) {
        this.id = fileId
    }
    async uploadFile(filename) {
        console.log(`image ${filename} is processing uploading...`)
        await simProcess(filename)
        console.log(`image ${filename} is uploaded`)
    }
}

function simProcess(filename) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('done')
        }, 1000 * filename)
    })
}
