## Setup

npm install -g serverless  

## Local Dev

### Run
To run api at local, use commannd  
```
export AWS_REGION=eu-west-2
serverless offline start
```   

### Unit test
```
export LAMBDA_TESTER_NODE_VERSION_CHECK=false 
npm run test
```  

## Deployment
To kick off deployment locally:   
1) Assume role in aws that has all required access to deploy  
2) use command ```serverless deploy ```  
