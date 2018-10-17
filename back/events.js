const AWS = require('aws-sdk')
const moment = require('moment')

let options = {}
const dynamodb = new AWS.DynamoDB.DocumentClient(options)

/*
* Save Event
*/

const save = (event, context, callback) => {

  try {
    event = JSON.parse(event)
  } catch(e) {}

  event.traceId = '123123'

  // Convert eventTime to miliseconds for storage
  if (event.eventTime) {
    event.eventTime = moment().utc(event.eventTime).format('x')
  } else {
    event.eventTime = moment().utc().format('x')
  }
  event.eventTime = parseInt(event.eventTime)

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: event,
  }

  // write the todo to the database
  dynamodb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(error, null)
      return
    }

    callback(null, {})
  })
}

/*
* Fetch Events
*/

const fetch = (event, context, callback) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  }

  // fetch all todos from the database
  dynamodb.scan(params, (error, result) => {

    if (error) {
      console.error(error)
      return callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      })
    }

    callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(result.Items),
    })
  })
}

/*
* Delete Events
*/

// const delete = (event, context, callback) => {
//
//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//   }
//
//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//     Key: {
//       id: event.pathParameters.id,
//     },
//   }
//
//   dynamodb.delete(params, (error) => {
//
//     if (error) {
//       console.error(error)
//       return callback(null, {
//         statusCode: error.statusCode || 501,
//         headers: { 'Content-Type': 'text/plain' },
//         body: 'Couldn\'t remove the todo item.',
//       })
//     }
//
//     // create a response
//     const response = {
//       statusCode: 200,
//       body: JSON.stringify({}),
//     }
//     callback(null, response)
//   })
// }

module.exports = {
  save: save,
  fetch: fetch,
}
