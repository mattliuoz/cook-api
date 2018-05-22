[![Build Status](https://travis-ci.org/mattliuoz/cook-api.svg?branch=master)](https://travis-ci.org/mattliuoz/cook-api)

## Setup

```
npm install -g serverless  
npm i  
serverless dynamodb install  
```

## Local Dev

### Run
To run api at local, use commannd  
```
export AWS_REGION=eu-west-2
serverless offline start
```   
You may be asked to install java which is required by dynamodb local  

### Unit test
```
export LAMBDA_TESTER_NODE_VERSION_CHECK=false 
npm run test
```  

## Deployment
To kick off deployment locally:   
1) Assume role in aws that has all required access to deploy  
2) use command ```serverless deploy ```  
3) yES
