# AWS SNS Complete Operations Lab with AWS SDK for JavaScript (v3)


## Prerequisites
- Node.js installed on your system
- AWS Account with appropriate permissions
- AWS CLI configured with valid credentials
- Valid email address for subscription testing
- Basic understanding of JavaScript and AWS SNS

## Learning Objectives
By completing this lab, you will:
- Set up AWS SDK for JavaScript v3 in a Node.js project
- Create, list, and delete SNS topics programmatically
- Publish messages to SNS topics
- Subscribe endpoints (email) to SNS topics
- Confirm subscriptions
- List subscriptions for a topic
- Unsubscribe from SNS topics
- Understand SNS Client usage and command pattern

## Setup Instructions

### 1. Initialize Node.js Project

In VS Code:

1. Open a new empty folder

2. Open **Terminal** in VS Code

3. Run: `npm init -y`

This creates `package.json`.

* * *

### 2. Install AWS SDK Client libraries For SNS

Run: `npm install @aws-sdk/client-sns`

* * *

### 3. Enable ES Modules (IMPORTANT)

Your code uses `import`, so Node.js must know this.

Open **package.json** and add:

`{ "type": "module"}`

Your `package.json` should look like:

```
{
  "name": "aws-s3-test",
  "version": "1.0.0",
  "type": "module"
}

```

* * *

### 4. Confirm AWS Credentials Are Available

In your terminal, run:

`aws-vault exec {aws-profile} -- aws sts get-caller-identity`

If you see your AWS Account ID → credentials are working ✅

* * *


## Part 1: Basic Topic Operations

### 1. SNS Client Configuration

#### Ceate a file `sns-client.js`
This module initializes and exports an SNS client instance called `snsClient`. All other modules in this lab exercise will import and reuse this shared client

```javascript
import { SNSClient } from '@aws-sdk/client-sns';
const REGION = "us-east-2";
const snsClient = new SNSClient({ region: REGION });
export { snsClient };
```


### 2. Create SNS Topic

#### Ceate a file `create-topic.js`

```javascript
import { CreateTopicCommand } from "@aws-sdk/client-sns";
import { snsClient } from "./sns-client.js";

const input = {
    Name: "sns-topic"
}

export const run = async () => {
    try {
        const response = await snsClient.send(new CreateTopicCommand(input));
        console.log("Success : ", response);
    } catch (error) {
        console.log("Error : ", error);
    }
}
run();
```

**Run the code from VS Code terminal::**

`aws-vault exec admin -- node create-topic.js`


**Expected Output:**
```
Success :  {
  '$metadata': {
    httpStatusCode: 200,
    requestId: '30af578a-1132-573a-84e3-3658ee250612',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  TopicArn: 'arn:aws:sns:us-east-2:165015980598:sns-topic'
}
```

---

### 3. List SNS Topics

#### Ceate a file`list-topics.js`

```javascript
import { ListTopicsCommand } from "@aws-sdk/client-sns";
import { snsClient } from "./sns-client.js";

export const run = async () => {
    try {
        const response = await snsClient.send(new ListTopicsCommand());
        console.log("Success : ", response);
    } catch (error) {
        console.log("Error : ", error);
    }
}
run();
```
**Run the code from VS Code terminal::**

`aws-vault exec admin -- node list-topic.js`

**Expected Output:**
```
Success :  {
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'eeccb539-17d2-5e74-8515-d4ebe8edfad7',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Topics: [ { TopicArn: 'arn:aws:sns:us-east-2:165015980598:sns-topic' } ]
}
```

---

### 4. Delete SNS Topic

#### Ceate a file `delete-topic.js`

```javascript
import { DeleteTopicCommand } from "@aws-sdk/client-sns";
import { snsClient } from "./sns-client.js";

const input = {
    TopicArn: "arn:aws:sns:us-east-2:165015980598:sns-topic"
}
export const run = async () => {
    try {
        const response = await snsClient.send(new DeleteTopicCommand(input));
        console.log("Success : ", response);
    } catch (error) {
        console.log("Error : ", error);
    }
}
run();
```

**Run the code from VS Code terminal::**

`aws-vault exec admin -- node delete-topic.js`

**Expected Output:**
```
Success :  {
  '$metadata': {
    httpStatusCode: 200,
    requestId: '67073bc0-e254-5df1-971a-5a121d0881bd',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  }
}
```

---

## Part 2: Publishing Messages

### 1. Publish Message to Topic

#### Ceate a file `publish-message.js`

```javascript
import { PublishCommand } from "@aws-sdk/client-sns";
import { snsClient } from "./sns-client.js";

const input = {
    TopicArn: "arn:aws:sns:us-east-2:165015980598:sns-topic",
    Message: "Publishing a message to SNS topic"
}

export const run = async () => {
    try {
        const response = await snsClient.send(new PublishCommand(input));
        console.log("Success : ", response);
    } catch (error) {
        console.log("Error : ", error);
    }
}
run();
```
**Run the code from VS Code terminal::**

⚠️ **Note:** Ensure the topic referenced in the code already exists.

`aws-vault exec admin -- node publish-message.js`

**Expected Output:**
```
Success :  {
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'bed05560-e418-5dbb-b1fb-34b3ee9ebeb0',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  MessageId: '2fb861f9-d5d2-5df8-baf7-002adf546ef3'
}
```

**Note:** When a message is published to a topic, Amazon SNS delivers the message to each endpoint that is subscribed to the topic. The format of the message depends on the notification protocol for each subscribed endpoint.

---

## Part 3: Subscription Management

### 1. Subscribe to Topic

#### Ceate a file `subscribe-topic.js`

```javascript
import { SubscribeCommand } from "@aws-sdk/client-sns";
import { snsClient } from "./sns-client.js";

const input = {
    Protocol: "email",
    TopicArn: "arn:aws:sns:us-east-2:165015980598:sns-topic",
    Endpoint: "relabos612@dubokutv.com"
};

export const run = async () => {
    try {
        const response = await snsClient.send(new SubscribeCommand(input));
        console.log("Success : ", response);
    } catch (error) {
        console.log("Error : ", error);
    }
};
run();
```

**Run the code from VS Code terminal::**

`aws-vault exec admin -- node subscribe-topic.js`

**Expected Output:**
```
Success :  {
  '$metadata': {
    httpStatusCode: 200,
    requestId: '003637ce-53f2-5c57-aea4-561d5876c591',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  SubscriptionArn: 'pending confirmation'
}
```

**Important:** For email endpoints, you must confirm the subscription by clicking the confirmation link sent to your email address. The subscription will remain in "pending confirmation" status until confirmed.

---

### 2. Subscription Confirmation ( Manual )


1. Check your inbox for the confirmation email  
   **Subject:** *AWS Notification – Subscription Confirmation*

2. Open the **Confirm subscription** link in the email.

3. Note down the `SubscriptionArn` to use in `unsubscribe-topics.js`.


---

### 3. List Subscriptions by Topic

#### Ceate a file `subscription-list.js`

```javascript
import { ListSubscriptionsByTopicCommand } from "@aws-sdk/client-sns";
import { snsClient } from "./sns-client.js";

const input = {
    TopicArn: "arn:aws:sns:us-east-2:165015980598:sns-topic"
};

export const run = async () => {
    try {
        const response = await snsClient.send(new ListSubscriptionsByTopicCommand(input));
        console.log("Success : ", response);
    } catch (error) {
        console.log("Error : ", error);
    }
};
run();
```

**Run the code from VS Code terminal::**

`aws-vault exec admin -- node subscribe-list.js`

**Expected Output:**
```
Success :  {
  '$metadata': {
    httpStatusCode: 200,
    requestId: '83d69d23-fd42-5703-a6a6-fcf0f0f490cf',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Subscriptions: [
    {
      SubscriptionArn: 'arn:aws:sns:us-east-2:165015980598:sns-topic:d3a2e88e-2cf1-46d2-9d54-2db478e54207',
      Owner: '165015980598',
      Protocol: 'email',
      Endpoint: 'relabos612@dubokutv.com',
      TopicArn: 'arn:aws:sns:us-east-2:165015980598:sns-topic'
    }
  ]
}
```

---

### 4. Publish messages to the topic and verify its reception (Manual)

1. Publish a message using code
   `aws-vault exec admin -- node publish-message.js`

2. Check your inbox for a new message
(Body: "Publishing a message to SNS topic")

3. Publish a message using AWS console

a. Open the topic in SNS Console and click `Publish message`

![alt text](images\1.png)

b. Fill subject & message body, then click `Publish message`

![alt text](images\2.png)

4. Check your inbox for the second message sent from the console.


---
### 5. Unsubscribe from Topic

#### Ceate a file `unsubscribe-topic.js`

**Note:** Get the `SubscriptionArn` from management console or from subcription confirmation email or from `subscribe-list.js` output

```javascript
import { UnsubscribeCommand } from "@aws-sdk/client-sns";
import { snsClient } from "./sns-client.js";

const input = {
    SubscriptionArn: "arn:aws:sns:us-east-2:165015980598:sns-topic:d3a2e88e-2cf1-46d2-9d54-2db478e54207"
};

export const run = async () => {
    try {
        const response = await snsClient.send(new UnsubscribeCommand(input));
        console.log("Success : ", response);
    } catch (error) {
        console.log("Error : ", error);
    }
};
run();
```

**Run the code from VS Code terminal::**

`aws-vault exec admin -- node unsubscribe-topic.js`

**Expected Output:**
```
Success :  {
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'd8c81f24-0f9d-573c-8fde-7ef700bc43d6',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  }
}
```

---


## Verification Using AWS Console

#### Verify Topics
1. Navigate to AWS SNS Console
2. Click on "Topics" in the left sidebar
3. Verify topics are created/deleted as expected

#### Verify Subscriptions
1. In SNS Console, click on a topic
2. Go to "Subscriptions" tab
3. Check subscription status (Confirmed/Pending)

#### Verify Messages
1. Check your email inbox
2. Look for emails from "AWS Notifications"
3. Verify message content

---

## Email Confirmation Flow

1. **Subscribe Request**: Application sends subscribe request
2. **Pending Status**: Subscription created with "pending confirmation" status
3. **Email Sent**: AWS sends confirmation email to endpoint
4. **User Action**: User clicks "Confirm subscription" link in email
5. **Confirmed Status**: Subscription status changes to "confirmed"
6. **Ready**: Subscription is now active and will receive messages

---

## Cleanup Instructions

### 1. Unsubscribe all endpoints

`aws-vault exec admin -- node unsubscribe-topic.js`

### 2. Delete all topics

`aws-vault exec admin -- node delete-topic.js`

---

## Additional Resources

### AWS Documentation
- [AWS SDK for JavaScript v3 Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/)
- [AWS SDK SNS Client Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sns/)
- [SNS API Reference](https://docs.aws.amazon.com/sns/latest/api/Welcome.html)


---

## Next Steps

After completing this lab, consider exploring:
- **Message Attributes**: Add metadata to messages
- **Message Filtering**: Filter messages at subscription level
- **SMS Notifications**: Send text messages
- **Mobile Push Notifications**: Integrate with mobile platforms
- **Lambda Integration**: Trigger Lambda functions
- **SQS Integration**: Fanout messages to multiple queues
- **DLQ Configuration**: Handle message delivery failures
- **CloudWatch Monitoring**: Monitor SNS metrics

---

## Lab Summary

**Lab Duration:** 60-90 minutes  
**Difficulty Level:** Beginner to Intermediate  
**Last Updated:** January 2026  

---
