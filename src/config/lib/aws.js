const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  endpoint: `https://${process.env.ENDPOINT_BUCKET}`,
  region: process.env.LOCATION_BUCKET,
  credentials: {
    accessKeyId: process.env.KEY_ID_BUCKET,
    secretAccessKey: process.env.APP_KEY_BUCKET
  }
});

module.exports = {
  s3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
};
