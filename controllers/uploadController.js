const { uploadFileToS3 } = require('../services/uploadService.js');

const uploadFiles = async ({
    accessKeyId,
    secretAccessKey,
    region,
    bucketName,
    files,
}) => {
    if (!files || !files.length) {
        throw new Error('Files array is required');
    }

    try {
        const uploadPromises = files.map(async (file) => {
            const { fileName, fileBase64 } = file;

            if (!fileBase64 || !fileName) {
                throw new Error(
                    'File base64 and file name are required for each file'
                );
            }

            let contentType = 'image/jpeg';
            if (fileName.toLowerCase().endsWith('.png')) {
                contentType = 'image/png';
            } else if (fileName.toLowerCase().endsWith('.gif')) {
                contentType = 'image/gif';
            }

            const fileBuffer = Buffer.from(fileBase64, 'base64');

            const fileUrl = await uploadFileToS3({
                accessKeyId,
                secretAccessKey,
                region,
                bucketName,
                fileName,
                fileBuffer,
                contentType,
            });

            return { fileName, fileUrl };
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        return uploadedFiles;
    } catch (error) {
        throw new Error(`Error uploading files: ${error.message}`);
    }
};

module.exports = {
    uploadFiles,
};
