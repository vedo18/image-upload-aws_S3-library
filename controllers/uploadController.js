const uploadFileToS3 = require('../services/uploadService');

const uploadController = async (req, res) => {
    const { accessKeyId, secretAccessKey, region, bucketName, files } =
        req.body;

    if (!files || !files.length) {
        return res.status(400).json({ error: 'Files array is required' });
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

        res.status(200).json({
            message: 'Files uploaded successfully',
            uploadedFiles,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = uploadController;
