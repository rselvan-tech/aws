# AWS SQS Complete Operations Lab with AWS SDK for JavaScript (v3)

## Prerequisites
- Node.js installed on your system
- AWS Account with appropriate permissions
- AWS CLI configured with valid credentials
- Basic understanding of JavaScript and AWS SQS

## Learning Objectives
By completing this lab, you will:
- Set up AWS SDK for JavaScript v3 in a Node.js project
- Create, list, and delete SQS queues programmatically
- Send messages to SQS queues
- Receive messages from SQS queues
- Delete messages after processing
- Understand SQS Client usage and command pattern
- Learn about message visibility timeout and queue operations

## Setup Instructions

### 1. Initialize Node.js Project

In VS Code:

1. Open a new empty folder

2. Open **Terminal** in VS Code

3. Run: `npm init -y`

This creates `package.json`.

* * *

### 2. Install AWS SDK Client libraries For SQS

Run: `npm install @aws-sdk/client-sqs`

* * *

### 3. Enable ES Modules (IMPORTANT)

Your code uses `import`, so Node.js must know this.

Open **package.json** and add:

`{ "type": "module"}`

Your `package.json` should look like:

```json
{
  "name": "aws-sqs-lab",
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

## Part 1: Basic Queue Operations

### 1. SQS Client Configuration

#### Create a file `sqs-client.js`
This module initializes and exports an SQS client instance called `sqsClient`. All other modules in this lab exercise will import and reuse this shared client.

```javascript
import { SQSClient } from "@aws-sdk/client-sqs";
const REGION = "us-east-2";
const sqsClient = new SQSClient({ region: REGION });
export { sqsClient };
```

---

### 2. Create SQS Queue

#### Create a file `create-queue.js`

```javascript
import { CreateQueueCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./sqs-client.js";

const input = {
    QueueName: "demo-queue",
    Attributes: {
        DelaySeconds: "60",
        MessageRetentionPeriod: "86400"
    }
};

export const run = async () => {
    try {
        const response = await sqsClient.send(new CreateQueueCommand(input));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
```

**Run the code from VS Code terminal:**

`aws-vault exec admin -- node create-queue.js`

**Expected Output:**
```
// Placeholder for expected output
```

---

### 3. List SQS Queues

#### Create a file `list-queues.js`

```javascript
import { ListQueuesCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./sqs-client.js";

export const run = async () => {
    try {
        const response = await sqsClient.send(new ListQueuesCommand({}));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
```

**Run the code from VS Code terminal:**

`aws-vault exec admin -- node list-queues.js`

**Expected Output:**
```
// Placeholder for expected output
```

---

### 4. Delete SQS Queue

#### Create a file `delete-queue.js`

```javascript
import { DeleteQueueCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./sqs-client.js";

const input = {
    QueueUrl: "https://sqs.us-east-2.amazonaws.com/308360398142/new-queue"
};

export const run = async () => {
    try {
        const response = await sqsClient.send(new DeleteQueueCommand(input));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
```

**Run the code from VS Code terminal:**

`aws-vault exec admin -- node delete-queue.js`

**Expected Output:**
```
// Placeholder for expected output
```

---

## Part 2: Sending Messages

### 1. Send Message to Queue

#### Create a file `send-message.js`

```javascript
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./sqs-client.js";

const input = {
    QueueUrl: "https://sqs.us-east-2.amazonaws.com/308360398142/new-queue",
    DelaySeconds: 10,
    MessageBody: "test send message from nodejs app using aws sdk"
};


export const run = async () => {
    try {
        const response = await sqsClient.send(new SendMessageCommand(input));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
```

**Run the code from VS Code terminal:**

⚠️ **Note:** Ensure the queue referenced in the code already exists.

`aws-vault exec admin -- node send-message.js`

**Expected Output:**
```
// Placeholder for expected output
```

**Note:** When a message is sent to a queue, Amazon SQS stores the message and makes it available for consumers to retrieve and process.

---

## Part 3: Receiving and Deleting Messages

### 1. Receive & Delete Message from Queue

#### Create a file `receive-message.js`

**Important Concepts:**
- **Short Polling**: The default behavior for the receive message API call from Amazon SQS
- **Visibility Timeout**: After receiving a message, it becomes temporarily invisible to other consumers
- **Consumer Pattern**: Applications should receive, process, and then delete messages from the queue

**Why Delete Messages?**
When a consumer application receives a message from the queue and successfully processes it, the message should be deleted from the queue to prevent it from being processed again. This is a critical part of the consumer pattern.

```javascript
import { ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./sqs-client.js";

const queueURL = "https://sqs.us-east-2.amazonaws.com/308360398142/new-queue";

const input = {
    QueueUrl: queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0,
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ["All"]
};

export const run = async () => {
    try {
        const response = await sqsClient.send(new ReceiveMessageCommand(input));
        // put your business logic

        if (response.Messages) {
            var deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: data.Messages[0].ReceiptHandle,
            };
            try {
                const data = await sqsClient.send(new DeleteMessageCommand(deleteParams));
                console.log("Message deleted", data);
            } catch (err) {
                console.log("Error :", err);
            }
        } else {
            console.log("No messages to delete");
        }

        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
```

**Run the code from VS Code terminal:**

`aws-vault exec admin -- node receive-and-delete-message.js`

**Expected Output:**
```
// Placeholder for expected output
```

**Note:**
1. The receive message command returns message details including MessageId, ReceiptHandle, and Body. The ReceiptHandle is required for deleting the message
2. After deleting a message, verify in the AWS Console that the "Messages Available" count has decreased.

---

## Verification Using AWS Console

#### Verify Queues
1. Navigate to AWS SQS Console
2. Click on "Queues" in the left sidebar
3. Verify queues are created/deleted as expected

#### Verify Messages
1. In SQS Console, click on a queue
2. Check "Messages Available" count
3. Use "Send and receive messages" to manually test
4. Monitor "Messages in Flight" (messages being processed)

---

## Message Flow

1. **Create Queue**: Application creates a queue
2. **Send Message**: Producer sends message to queue
3. **Message Stored**: SQS stores the message
4. **Receive Message**: Consumer retrieves message from queue
5. **Visibility Timeout**: Message becomes invisible to other consumers
6. **Process Message**: Consumer processes the message
7. **Delete Message**: Consumer deletes message after successful processing

---

## Cleanup Instructions

### 1. Delete all messages (if needed)

Purge the queue or delete messages individually

### 2. Delete all queues

`aws-vault exec admin -- node delete-queue.js`

---

## Additional Resources

### AWS Documentation
- [AWS SDK for JavaScript v3 Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Amazon SQS Developer Guide](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/)
- [AWS SDK SQS Client Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/)
- [SQS API Reference](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/Welcome.html)

---

## Next Steps

After completing this lab, consider exploring:
- **Long Polling**: Reduce empty responses and costs
- **Message Attributes**: Add metadata to messages
- **Dead Letter Queues (DLQ)**: Handle failed message processing
- **FIFO Queues**: Guarantee message ordering and exactly-once processing
- **Batch Operations**: Send, receive, and delete multiple messages at once
- **Lambda Integration**: Trigger Lambda functions from SQS
- **CloudWatch Monitoring**: Monitor queue metrics and set alarms
- **Message Delay**: Delay message delivery

---

## Lab Summary

**Lab Duration:** 60-90 minutes  
**Difficulty Level:** Beginner to Intermediate  
**Last Updated:** January 2026  

---
