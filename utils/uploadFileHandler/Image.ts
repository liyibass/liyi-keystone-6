import File from './File'

export default class Image extends File {
    extension: string
    width: number
    height: number

    constructor(id: string, extension: string, width: number, height: number) {
        super(id)
        this.extension = extension
        this.width = width
        this.height = height
    }

    async addWatermark() {
        console.log('start watermark process......')
        await simProcess()
        console.log('end watermark process')
    }

    async compressImage() {
        console.log('start compress image process......')
        await simProcess()
        console.log('end compress image process')
    }

    async uploadFirstImage() {
        console.log(`image 1 is resizing`)
        await simProcess()
        console.log(`image 1 is done resizing`)
        await this.uploadFile(1)
    }

    resizeAndUploadRestSizeImages() {
        for (let i = 2; i <= 5; i++) {
            this.uploadFile(i)
        }
    }
}

function simProcess() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('done')
        }, 1000)
    })
}
