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

exports.handler =  (event, context, callback) => {
    try {
        const timestamp = new Date().getTime();
        console.log("*****incoming body*****");
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
        console.log("*****dynamo payload*****");
        console.log(payload);
        
        const cb = (err, data) => {
            console.log("*****dynamo data*****");
            console.log(data);
            if (err) {
                const response = buildInternalErrorResponse(err, context.requestId);
                console.log("*****error*****");
                context.done(null, response);
            } else {
                const response = {
                    isBase64Encoded: false,
                    statusCode: 200,
                    body: JSON.stringify({
                        'message': JSON.stringify(data.Item),
                        'input': event,
                    }),
                };
                console.log("*****done*****");
                
                context.done(null, response);
            }
        }
        dynamodb.put(payload, function(err, data) {
            console.log("start putting");
            if (err) {
              console.log("Error", err);
              const response = {
                isBase64Encoded: false,
                statusCode: 500,
                body: JSON.stringify(err),
            };
              context.done(null, response);
            } else {
              console.log("Success", data);
              const response = {
                isBase64Encoded: false,
                statusCode: 200,
                body: "",
            };
            context.done(null, response);
            }
          });
        //dynamodb.putItem(payload, cb);
    } catch (error) {
        console.log("*****error*****");
                console.log(error);
        const response = buildInternalErrorResponse(error);
        context.done(null, response);
    }
};