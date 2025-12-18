&nbsp;

![Lab](images/lab.png)

(1) Create Lambda function

&nbsp;

<img src="images/create-fun.png" alt="Create Function" width="1082" height="527">

- use default execution role & additional configurations
- change code & deploy : index.js

&nbsp;

(2) Create API

- Create HTTP API
    
- API name : Product API
    
- Integration : Lambda Integration
    
    - select above created lambda function here

<img src="images/configure-api.png" alt="Configure API" width="1082" height="404">

- Configure Routes
    
    | Method | Resource Path | Integration Traget |
    | --- | --- | --- |
    | GET | /product | Lambda function |
    | GET | /product/{id} | Lambda function |
    | POST | /product | Lambda function |
    | DELETE | /product/{id} | Lambda function |
    
    &nbsp;
    
    <img src="images/configure-route.png" alt="Configure Route" width="1048" height="340">
    
- Configure Stage : default
    

(3) Test API

- Test the API using Postman
- Use "Invoke URL" from Product API created
- Verify the response

| Method | URL | Body | Response |
| :---: | :---: | :---: | :---: |
| GET | https://lux0kqow43.execute-api.us-east-1.amazonaws.com/product[](https://tbcilo5gwb.execute-api.us-east-1.amazonaws.com/product) |     | {"message":"Successfully finished operation: \\"GET /product\\"","body":"Processing Get All Products"} |
| GET | https://lux0kqow43.execute-api.us-east-1.amazonaws.com/product/105[](https://tbcilo5gwb.execute-api.us-east-1.amazonaws.com/product/5) |     | {"message":"Successfully finished operation: \\"GET /product/{id}\\"","body":"Processing Get Product Id with \\"105\\""} |
| POST | https://tbcilo5gwb.execute-api.us-east-1.amazonaws.com/product  <br><br/> | raw body:  <br><br/>{  <br><br/>"name": "IPhone",  <br><br/>"price": "950"  <br><br/>} | {"message":"Successfully finished operation: \\"POST /product\\"","body":"Processing Post Product Id with \\"\[object Object\]\\""} |
| DELETE | [https://tbcilo5gwb.execute-api.us-east-1.amazonaws.com/product/5?category=phone](https://tbcilo5gwb.execute-api.us-east-1.amazonaws.com/product/5) |     | {"message":"Successfully finished operation: \\"DELETE /product/{id}\\"","body":"Processing Delete Product Id with \\"105\\""} |

&nbsp;

&nbsp;