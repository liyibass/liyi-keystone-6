import Image from './Image'

async function uploadFileHandler(
    resolvedData,
    existingItem,
    operation: string,
    fileType: string
) {
    // console.log(operation)
    // console.log(resolvedData)
    // console.log(existingItem)

    const operationStatus = getOperationStatus()
    if (
        operationStatus === 'no update' ||
        operationStatus === 'create list but no file'
    )
        return

    // has file which is waiting for uploaded
    if (fileType === 'image') {
        const { id, extension, width, height } = resolvedData.file

        var image = new Image(id, extension, width, height)

        const isNeedWatermark = ifWatermarkIsNeeded()
        if (isNeedWatermark) {
            await image.addWatermark()
        }

        await image.compressImage()
        await image.uploadFirstImage()
        image.resizeAndUploadRestSizeImages()
    } else return

    // handle file uploading
    switch (operationStatus) {
        case 'create file':
            console.log('create file')
            break
        case 'update file':
            console.log('update file')
            break
    }
    console.log('upload image succeed')

    return 'upload file success'

    function ifWatermarkIsNeeded() {
        return (
            resolvedData.needWatermark ||
            (existingItem?.needWatermark &&
                resolvedData.needWatermark === undefined)
        )
    }

    function getOperationStatus() {
        switch (operation) {
            case 'create':
                // create mode, but no upload file
                if (!resolvedData.file.id) {
                    return 'create list but no file'
                } else {
                    // create mode, and has file uploaded
                    return 'create file'
                }

            case 'update':
                if (resolvedData?.file?.id) {
                    // update mode, and has file uploaded
                    return 'update file'
                } else {
                    // update mode, but no file is updated
                    return 'no update'
                }

            default:
                return 'no update'
        }
    }
}

function deleteFileHandler(existingItem) {
    return null
}

export { uploadFileHandler, deleteFileHandler }
