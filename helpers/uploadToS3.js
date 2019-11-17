require('dotenv').config()
const AWS = require('aws-sdk')
const uuid = require('uuid')
const ID = process.env.ID
const SECRET = process.env.SECRET
const BUCKET_NAME = process.env.BUCKET_NAME

module.exports = async function(req){
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET
        })
        const filename = uuid.v4()
        const params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        const s3Response = await s3.upload(params).promise();
        const filePath = s3Response.Location
        return filePath
}