const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const uploadFileToS3 = async ({
    accessKeyId,
    secretAccessKey,
    region,
    bucketName,
    fileName,
    fileBuffer,
    contentType,
}) => {
    if (
        !accessKeyId ||
        !secretAccessKey ||
        !bucketName ||
        !fileBuffer ||
        !contentType
    ) {
        throw new Error(
            'AWS credentials, bucket name, file buffer, and content type are required'
        );
    }

    const s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        region,
    });

    const params = {
        Bucket: bucketName,
        Key: `${uuidv4()}_${fileName}`,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: 'public-read',
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location;
    } catch (error) {
        throw new Error(`Error uploading file: ${error.message}`);
    }
};

module.exports = uploadFileToS3;
