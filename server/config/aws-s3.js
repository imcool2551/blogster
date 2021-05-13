const AWS = require('aws-sdk');

module.exports = new AWS.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  Bucket: 'legends-guide-archive-2021',
  signatureVersion: 'v4',
  region: 'ap-northeast-2',
});
