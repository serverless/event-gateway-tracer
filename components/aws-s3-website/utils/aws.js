/*
* AWS Utils
*/

const fs = require('fs')
const path = require('path')
const klawSync = require('klaw-sync')
const AWS = require('aws-sdk')

/*
* Create Website Bucket
*/

const createWebsiteBucket = async (bucketName) => {
  // Defaults
  const s3BucketPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: {
          AWS: '*'
        },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`]
      }
    ]
  }
  const staticHostParams = {
    Bucket: bucketName,
    WebsiteConfiguration: {
      ErrorDocument: {
        Key: 'error.html'
      },
      IndexDocument: {
        Suffix: 'index.html'
      }
    }
  }
  const putPostDeleteHeadRule = {
    AllowedMethods: ['PUT', 'POST', 'DELETE', 'HEAD'],
    AllowedOrigins: ['https://*.amazonaws.com'],
    AllowedHeaders: ['*'],
    MaxAgeSeconds: 0
  }
  const getRule = {
    AllowedMethods: ['GET'],
    AllowedOrigins: ['*'],
    AllowedHeaders: ['*'],
    MaxAgeSeconds: 0
  }

  const awsS3 = new AWS.S3()

  // Create Bucket
  return awsS3
    .createBucket({ Bucket: bucketName })
    .promise()
    .then(() => {
      return awsS3
        .putBucketPolicy({
          Bucket: bucketName,
          Policy: JSON.stringify(s3BucketPolicy)
        })
        .promise()
    })
    .then(() => {
      return awsS3
        .putBucketCors({
          Bucket: bucketName,
          CORSConfiguration: {
            CORSRules: [putPostDeleteHeadRule, getRule]
          }
        })
        .promise()
    })
    .then(() => {
      return awsS3.putBucketWebsite(staticHostParams).promise()
    })
}

/*
* Delete Bucket
*/

const deleteWebsiteBucket = async (bucketName) => {
  const awsS3 = new AWS.S3()

  return awsS3
    .listObjects({ Bucket: bucketName })
    .promise()
    .then((data) => {
      const items = data.Contents
      const promises = []

      for (var i = 0; i < items.length; i += 1) {
        var deleteParams = { Bucket: bucketName, Key: items[i].Key }
        const delObj = awsS3.deleteObject(deleteParams).promise()
        promises.push(delObj)
      }

      return Promise.all(promises)
    })
    .then(() => {
      return awsS3.deleteBucket({ Bucket: bucketName }).promise()
    })
    .catch((e) => {
      throw new Error(e)
    })
}

/*
* Upload Directory Files
*/

const uploadDir = (bucketName, assets, env) => {
  return new Promise((resolve, reject) => {
    const awsS3 = new AWS.S3({ params: { Bucket: bucketName } })

    let items
    try {
      items = klawSync(assets)
    } catch (error) {
      reject(error)
    }

    let uploadItems = []
    items.forEach((item) => {
      if (item.stats.isDirectory()) return

      let itemParams = {
        Key: path.relative(assets, item.path),
        Body: fs.readFileSync(item.path)
      }
      let file = path.basename(item.path)

      if (file.slice(-5) == '.html') itemParams.ContentType = 'text/html'
      if (file.slice(-4) == '.css') itemParams.ContentType = 'text/css'
      if (file.slice(-3) == '.js') itemParams.ContentType = 'application/javascript'
      if (file.slice(-5) == '.json') itemParams.ContentType = 'application/json'
      if (file.slice(-4) == '.zip') itemParams.ContentType = 'application/zip'
      if (file.slice(-4) == '.png') itemParams.ContentType = 'text/png'
      if (file.slice(-4) == '.jpg') itemParams.ContentType = 'text/jpeg'
      if (file.slice(-5) == '.jpeg') itemParams.ContentType = 'text/jpeg'
      if (file.slice(-4) == '.gif') itemParams.ContentType = 'text/gif'
      if (file.slice(-4) == '.svg') itemParams.ContentType = 'image/svg+xml'
      if (file.slice(-5) == '.woff') itemParams.ContentType = 'font/woff'
      if (file.slice(-6) == '.woff2') itemParams.ContentType = 'font/woff2'

      let uploadItem = () => {
        return new Promise((res) => {
          awsS3
            .upload(itemParams)
            .promise()
            .catch(() => {})
            .then(res)
        })
      }

      uploadItems.push(uploadItem())
    })

    return Promise.all(uploadItems)
      .then(() => {
        // Include Environment Variables if they exist
        let script = 'env = {};'
        if (env) {
          for (e in env) { // eslint-disable-line
            script = script + `env.${e}="${env[e]}";` // eslint-disable-line
          }
        }

        return awsS3
          .upload({
            Key: 'env.js',
            Body: Buffer.from(script, 'utf8')
          })
          .promise()
          .catch((error) => {
            console.log(error) // eslint-disable-line
          })
      })
      .then(resolve)
  })
}

module.exports = {
  createWebsiteBucket: createWebsiteBucket,
  deleteWebsiteBucket: deleteWebsiteBucket,
  uploadDir: uploadDir
}
