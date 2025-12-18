&nbsp;

![Section 11 Lab](./images/section-11-lab.png)


(1) Create Lambda function

- use default source code
- add a instruction to log incoming event

&nbsp;

```
export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
```

&nbsp;

(2) Create API

- Create HTTP API
    
- API name : Product API
    
- Integration : Lambda Integration
    
    - select above created lambda function here
- Configure Routes
    
    | Method | Resource Path | Integration Traget |
    | --- | --- | --- |
    | GET | /product | Lambda function |
    | GET | /product/{id} | Lambda function |
    | POST | /product | Lambda function |
    | DELETE | /product/{id} | Lambda function |
    
- Configure Stage : default
    

(3) Test API

- Test the API using Postman
- Use "Invoke URL" from Product API created

| GET | https://tbcilo5gwb.execute-api.us-east-1.amazonaws.com/product |
| --- | --- |
| GET | https://tbcilo5gwb.execute-api.us-east-1.amazonaws.com/product/5 |
| POST | https://tbcilo5gwb.execute-api.us-east-1.amazonaws.com/product  <br><br/>raw body:  <br><br/>{  <br><br/>"name": "IPhone",  <br><br/>"price": "950"  <br><br/>} |
| GET  | [https://tbcilo5gwb.execute-api.us-east-1.amazonaws.com/product/5?category=phone](https://tbcilo5gwb.execute-api.us-east-1.amazonaws.com/product/5) |

&nbsp;

- Response for all above will be : Hello from Lambda!
- CloudWatch : Capture genrated event objects for each API request from CloudWatch logs
- Explore the event objects and its parameters
- Event generated for GET /product/{id}?query-parameter

```
{
    "version": "2.0",
    "routeKey": "GET /product/{id}",
    "rawPath": "/product/5",
    "rawQueryString": "category=phone",
    "headers": {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "cache-control": "no-cache",
        "content-length": "0",
        "host": "tbcilo5gwb.execute-api.us-east-1.amazonaws.com",
        "postman-token": "37824ab2-3af4-4c85-9f82-eda2b538ffa5",
        "user-agent": "PostmanRuntime/7.51.0",
        "x-amzn-trace-id": "Root=1-69431ab2-52b6dc4a6fcdb5ba5aafd285",
        "x-forwarded-for": "174.95.17.3",
        "x-forwarded-port": "443",
        "x-forwarded-proto": "https"
    },
    "queryStringParameters": {
        "category": "phone"
    },
    "requestContext": {
        "accountId": "165015980598",
        "apiId": "tbcilo5gwb",
        "domainName": "tbcilo5gwb.execute-api.us-east-1.amazonaws.com",
        "domainPrefix": "tbcilo5gwb",
        "http": {
            "method": "GET",
            "path": "/product/5",
            "protocol": "HTTP/1.1",
            "sourceIp": "174.95.17.3",
            "userAgent": "PostmanRuntime/7.51.0"
        },
        "requestId": "VwEb4gYhoAMES1w=",
        "routeKey": "GET /product/{id}",
        "stage": "$default",
        "time": "17/Dec/2025:21:03:46 +0000",
        "timeEpoch": 1766005426013
    },
    "pathParameters": {
        "id": "5"
    },
    "isBase64Encoded": false
}

```

&nbsp;