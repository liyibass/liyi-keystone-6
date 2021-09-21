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

    addWatermark() {
        console.log('start watermark process')
    }
}
