![Lab.png](images/lab.png)

&nbsp;

(1) Create a Lambda function

- - use default code
        - Add trigger
            - REST API

![471600af26902d15b7f9a7dce1130297.png](images/1.1.png)

![0019a408971529ed8a97cfd5882a307b.png](images/1.2.png)

![89e087124f6850cea9d0ae042fb98cda.png](images/1.3.png)

* * *

* * *

(2) Test API

- Open API endpoint URL
- Result : "Hello from Lambda!"

![08097189bc9d642d80f301147aca7d65.png](images/2.1.png)

&nbsp;

* * *

* * *

(3) Create a Cognito User pool

![880e932b5b73bf7494131fc9fb4a8dec.png](images/3.1.png)

- Edit password policy
    - configure custom policy settings

![ec1839e05b754072e7a76b12d5a57c23.png](images/3.2.png)

- App client : test-cognito

![4fb622508be24844d4801c7d30a138b5.png](images/3.3.png)

- change "Oauth 2.0 grant types"
    - include "implicit grant" ==( to get access token in URL , not recommended for production )==

&nbsp;

- ![b5bba59c77789e267f2fe1b1a5e0badb.png](images/3.4.png)

&nbsp;

![570941b181a6629f2d5a9873989f510c.png](images/3.5.png)

* * *

* * *

&nbsp;

(4) Update API Gateway

![bb455faa82e982312981c38057a9839e.png](images/4.1.png)

- Add authorizer
    - Authorizer type : Cognito
    - select create Cognito user pool
    - Token source : Authorization ==( Header that contains authorization token )==

![3f8bd873ee897ff5e82ef0b0822c6294.png](images/4.2.png)

- "ANY" Method of "/cognito-fun" resource
    - Edit and change Authorization

&nbsp;

![a601fe38406c0eed3852313e7bfec8ac.png](images/4.3.png)

![827a2b02f59795ba0283637310ccafcf.png](images/4.4.png)

&nbsp;

- Deploy API
    - select "default" stage

![17a05316a89aac1bb43a5467c1bd59c7.png](images/4.5.png)

* * *

* * *

&nbsp;

(5) Test API

- Send GET API Request  to the "Invoke URL"
- Result : "Unauthorized"

![8d4eaee9f704b9acc74d933caa993930.png](images/5.1.png)

* * *

* * *

&nbsp;

(6) Get Access token from Cognito

- Step-1 : Open "View login page" from created App client

![07901a908fe1dd3281ef456a139e6144.png](images/6.1.png)![58be0b19474e3489c5dd8fc047d4320b.png](images/6.2.png)

- Step-2: Create Account

![782ded9cc60cb77fa175b10b406d33a7.png](images/6.2.2.png)

&nbsp;

- Step-3: Copy URL & reopen the changed URL
    - change response_type=token in the URL
    - paste changed URL and re-open the page
    - Fill user info
    - use temporary email address
    - sign up

```
Original :
https://us-east-2adz7o2xho.auth.us-east-2.amazoncognito.com/signup?client_id=46t0gho7vu7t8pnrjqce1qmevr&redirect_uri=https%3A%2F%2Fd84l1y8p4kdic.cloudfront.net&response_type=code&scope=email+openid+phone

https://us-east-2adz7o2xho.auth.us-east-2.amazoncognito.com/signup?client_id=46t0gho7vu7t8pnrjqce1qmevr&
redirect_uri=https%3A%2F%2Fd84l1y8p4kdic.cloudfront.net&
response_type=code&
scope=email+openid+phone

Change to: 

https://us-east-2adz7o2xho.auth.us-east-2.amazoncognito.com/signup?client_id=46t0gho7vu7t8pnrjqce1qmevr&redirect_uri=https%3A%2F%2Fd84l1y8p4kdic.cloudfront.net&response_type=token&scope=email+openid+phone

https://us-east-2adz7o2xho.auth.us-east-2.amazoncognito.com/signup?client_id=46t0gho7vu7t8pnrjqce1qmevr&
redirect_uri=https%3A%2F%2Fd84l1y8p4kdic.cloudfront.net&
response_type=token&
scope=email+openid+phone
```

&nbsp;

![baa3a54ffebe1fa2b4566d7b91b30ef0.png](images/6.3.png)

- Step-3: confirm account
    - enter the code received to the email
    - confirm account

![fc5e9e7acb44e24c062554824b716cbe.png](images/6.4.png)

![900a7d1de0a108c0f81ab0bce7307099.png](images/6.5.png)

&nbsp;

![ff22e11a4a42ee1ebef6d6738fe6e7b6.png](images/6.6.png)

&nbsp;

- Step-4: Get Access token from the URL
    - copy the URL to editot
    - extract the access_token from the URL

```
https://d84l1y8p4kdic.cloudfront.net/#id_token=eyJraWQiOiJobTRaNjM5RytYeHZhSm5PWFlJTENTa0N5M2pPSnRiYWpwVVV5SUVqRW9VPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiQnRLWF8zUzdrUzItajI0b09WbjVaZyIsInN1YiI6ImYxZWI5NTMwLTIwYTEtNzBiMS1iNjljLTY5MDYyMWRlNDUzOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9BRFo3TzJ4aG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiZjFlYjk1MzAtMjBhMS03MGIxLWI2OWMtNjkwNjIxZGU0NTM5IiwiYXVkIjoiNDZ0MGdobzd2dTd0OHBucmpxY2UxcW1ldnIiLCJldmVudF9pZCI6IjU0MjNjOWFjLThlZDYtNGZhZi05NmZhLTU2MzcwYTE5MDk3MiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzY3MDAzOTIzLCJleHAiOjE3NjcwMDc1MjMsImlhdCI6MTc2NzAwMzkyMywianRpIjoiM2IwNjRhNGYtYzI2OS00NTY2LWE4ZWUtOWEzOWM4MzE2MGNjIiwiZW1haWwiOiJkaW1vZjQzOTY4QG11Y2F0ZS5jb20ifQ.mnvAt1KLqpfR0sLm3smQbW80ASgu0aeBau5s0uWMRHR5S4IC__v5GRsVkaoaM0CPW0mkR8DXYxN7B92jy1rfgc39i-mHlzjxpxHYe8FgwMsOHRM4TlJjk5G79AdzvCL5Eyl-pnFB_-nW-55t-8SN4L_XAbNdhkP3PDFB5k_9kWtv4uSpGv7hEM0W2EJzZQU1TotyKEPKIAdSHmkzgLoYQFrG1_19UxexMa1cllyfP-9klz_m410-MHVyyO4tqfcyBN6xYEhRIXeN4Iat5DD6c7PxrWVaGDSCxcTaqtuy7ujtViUGaePgQfmIOWaaGoFTN-bJ2IC-EVsHNKXeyqewLQ&access_token=eyJraWQiOiJMZGcrYlN1VUpJdXhNZUtNdDQxZ0NUZkkyZXZzK0lLVk9kd1ZtZGZ5dUZBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmMWViOTUzMC0yMGExLTcwYjEtYjY5Yy02OTA2MjFkZTQ1MzkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9BRFo3TzJ4aG8iLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI0NnQwZ2hvN3Z1N3Q4cG5yanFjZTFxbWV2ciIsImV2ZW50X2lkIjoiNTQyM2M5YWMtOGVkNi00ZmFmLTk2ZmEtNTYzNzBhMTkwOTcyIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJwaG9uZSBvcGVuaWQgZW1haWwiLCJhdXRoX3RpbWUiOjE3NjcwMDM5MjMsImV4cCI6MTc2NzAwNzUyMywiaWF0IjoxNzY3MDAzOTIzLCJqdGkiOiJkZjk5NTkwNi0yNjhlLTQ5NDAtOTFiZS0wZjI0MWM5MjViOGUiLCJ1c2VybmFtZSI6ImYxZWI5NTMwLTIwYTEtNzBiMS1iNjljLTY5MDYyMWRlNDUzOSJ9.SZMXBnsmZZaNmKApOoCu8v8mJewlo1cOeDSMJRuTOJvOq-QDmDPFsC9b5XPJNF7Abn6jhI-pfXlcXektKwRW4Vy6Pl2JI5AFzSApUgUz-1dfTHs0BNDR_IgjOeCuD7LCNH033bNzO_F4cWe_jzqmUrNEIIixOzvbCYB7SoEwPHiYI8t3kjtJrQYf5WnNuPcia3iXnmgFYxuQoeScbRP-mk31c57ADIBm1D6Al8D7vGkEFVF42m9ddZa0nETRMdUVsTgg5QDrBoCU8lPb_v5KdIbaegpWfOj6zqqH86GC1-p5r0Dsm51nFgX22XuTdC5-Vpf-8rL9q4a-idsuslgTdg&expires_in=3600&token_type=Bearer
```

&nbsp;

```
https://d84l1y8p4kdic.cloudfront.net/#

id_token=eyJraWQiOiJobTRaNjM5RytYeHZhSm5PWFlJTENTa0N5M2pPSnRiYWpwVVV5SUVqRW9VPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiQnRLWF8zUzdrUzItajI0b09WbjVaZyIsInN1YiI6ImYxZWI5NTMwLTIwYTEtNzBiMS1iNjljLTY5MDYyMWRlNDUzOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9BRFo3TzJ4aG8iLCJjb2duaXRvOnVzZXJuYW1lIjoiZjFlYjk1MzAtMjBhMS03MGIxLWI2OWMtNjkwNjIxZGU0NTM5IiwiYXVkIjoiNDZ0MGdobzd2dTd0OHBucmpxY2UxcW1ldnIiLCJldmVudF9pZCI6IjU0MjNjOWFjLThlZDYtNGZhZi05NmZhLTU2MzcwYTE5MDk3MiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzY3MDAzOTIzLCJleHAiOjE3NjcwMDc1MjMsImlhdCI6MTc2NzAwMzkyMywianRpIjoiM2IwNjRhNGYtYzI2OS00NTY2LWE4ZWUtOWEzOWM4MzE2MGNjIiwiZW1haWwiOiJkaW1vZjQzOTY4QG11Y2F0ZS5jb20ifQ.mnvAt1KLqpfR0sLm3smQbW80ASgu0aeBau5s0uWMRHR5S4IC__v5GRsVkaoaM0CPW0mkR8DXYxN7B92jy1rfgc39i-mHlzjxpxHYe8FgwMsOHRM4TlJjk5G79AdzvCL5Eyl-pnFB_-nW-55t-8SN4L_XAbNdhkP3PDFB5k_9kWtv4uSpGv7hEM0W2EJzZQU1TotyKEPKIAdSHmkzgLoYQFrG1_19UxexMa1cllyfP-9klz_m410-MHVyyO4tqfcyBN6xYEhRIXeN4Iat5DD6c7PxrWVaGDSCxcTaqtuy7ujtViUGaePgQfmIOWaaGoFTN-bJ2IC-EVsHNKXeyqewLQ&

access_token=eyJraWQiOiJMZGcrYlN1VUpJdXhNZUtNdDQxZ0NUZkkyZXZzK0lLVk9kd1ZtZGZ5dUZBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmMWViOTUzMC0yMGExLTcwYjEtYjY5Yy02OTA2MjFkZTQ1MzkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9BRFo3TzJ4aG8iLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI0NnQwZ2hvN3Z1N3Q4cG5yanFjZTFxbWV2ciIsImV2ZW50X2lkIjoiNTQyM2M5YWMtOGVkNi00ZmFmLTk2ZmEtNTYzNzBhMTkwOTcyIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJwaG9uZSBvcGVuaWQgZW1haWwiLCJhdXRoX3RpbWUiOjE3NjcwMDM5MjMsImV4cCI6MTc2NzAwNzUyMywiaWF0IjoxNzY3MDAzOTIzLCJqdGkiOiJkZjk5NTkwNi0yNjhlLTQ5NDAtOTFiZS0wZjI0MWM5MjViOGUiLCJ1c2VybmFtZSI6ImYxZWI5NTMwLTIwYTEtNzBiMS1iNjljLTY5MDYyMWRlNDUzOSJ9.SZMXBnsmZZaNmKApOoCu8v8mJewlo1cOeDSMJRuTOJvOq-QDmDPFsC9b5XPJNF7Abn6jhI-pfXlcXektKwRW4Vy6Pl2JI5AFzSApUgUz-1dfTHs0BNDR_IgjOeCuD7LCNH033bNzO_F4cWe_jzqmUrNEIIixOzvbCYB7SoEwPHiYI8t3kjtJrQYf5WnNuPcia3iXnmgFYxuQoeScbRP-mk31c57ADIBm1D6Al8D7vGkEFVF42m9ddZa0nETRMdUVsTgg5QDrBoCU8lPb_v5KdIbaegpWfOj6zqqH86GC1-p5r0Dsm51nFgX22XuTdC5-Vpf-8rL9q4a-idsuslgTdg

&expires_in=3600&token_type=Bearer
```

* * *

* * *

&nbsp;

(7) Test API

- - Send GET API Request  to the "Invoke URL"
        - Add "Authorization" header
        - Paste access_token as value

![62dac807661f6fd351a2702dd17e4442.png](images/7.1.png)

- Result : "Hello from Lambda!"

![016a68649be72060c32019fbfe8cff6e.png](images/7.2.png)