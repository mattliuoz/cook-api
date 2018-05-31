const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const uuid = require('uuid');
const dynamodb = require('./dynamodb');

const dynamodbTableName = process.env.DYNAMODB_TABLE


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
    console.log(message);
    return {
        statusCode: 500,
        //body: '',
        isBase64Encoded: false
    }
}

exports.handler = async (event, context, callback) => {
    try {
        const timestamp = new Date().getTime();
        console.log(event.body);
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

        console.log(payload);
        
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

        dynamodb.put(payload, cb);
    } catch (error) {
        const response = buildInternalErrorResponse(error);
        context.done(null, response);
    }
};