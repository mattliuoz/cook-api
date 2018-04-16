const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const uuid = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();
//const env = process.env.ENV;
const dynamodbTableName = process.env.DYNAMODB_TABLE
//Get env specific config
// const config = require('./config/config');

const buildBadRequestResponse = function buildBadRequestResponse(message, requestId) {
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: message,
            requestId: requestId
        }),
        isBase64Encoded: false
    };
}
const buildInternalErrorResponse = function buildInternalErrorResponse(message, requestId) {
    return {
        statusCode: 500,
        body: JSON.stringify({
            message: message,
            requestId: requestId
        }),
        isBase64Encoded: false
    }
}

exports.handler = async (event, context, callback) => {
    try {
        const timestamp = new Date().getTime();
        console.log(event);

        const data = JSON.parse(event.body);
        
        if (typeof data.ingredients !== 'string') {
            const response = buildBadRequestResponse("ingredients is not string", context.requestId);
            callback(null, response);
            return;
        }

        if (typeof data.method !== 'string') {
            const response = buildBadRequestResponse("method is not string", context.requestId);
            callback(null, response);
            return;
        }

        if (typeof data.duration !== 'string') {
            const response = buildBadRequestResponse("duration is not string", context.requestId);
            callback(null, response);
            return;
        }

        if (typeof data.logo !== 'string') {
            const response = buildBadRequestResponse("logo is not string", context.requestId);
            callback(null, response);
            return;
        }
        console.log(dynamodbTableName);
        const payload = {
            TableName: dynamodbTableName,
            Item: {
                id: uuid.v1(),
                ingredients: data.ingredients,
                method: data.method,
                duration: data.duration,
                logo: data.logo,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
        };


        const cb = (err, data) => {
            if (err) {
                const response = buildInternalErrorResponse(err, context.requestId);
                context.done(null, response);
            } else {
                const response = {
                    isBase64Encoded: false,
                    statusCode: 200,
                    body: JSON.stringify({
                        'message': JSON.stringify(payload.Item),
                        'input': event,
                    }),
                };
                context.done(null, response);
            }
        }
        dynamo.put(payload, cb);
    } catch (error) {
        const response = buildInternalErrorResponse(error);
        context.done(null, response);
    }
};