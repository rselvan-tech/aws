# AWS Lambda SQS Event Source Mapping Lab

## Lab Overview
In this hands-on lab, you will learn how to integrate Amazon SQS (Simple Queue Service) with AWS Lambda using Event Source Mapping for poll-based invocations. You'll understand Lambda invocation types, configure SQS as an event source, implement message polling, and apply event filtering for selective processing.

**Use Case:** Customer creation system where SQS queues customer data and Lambda processes only corporate customers using event filters.

---

## Prerequisites
- AWS Account with appropriate permissions
- Basic understanding of AWS SQS and Lambda
- AWS Management Console access
- Understanding of Lambda invocation types

---

## Lab Objectives
By the end of this lab, you will be able to:
- Understand Lambda invocation types (synchronous vs asynchronous vs poll-based)
- Create an SQS queue
- Create a Lambda function
- Configure Event Source Mapping between SQS and Lambda
- Set up proper IAM permissions for Lambda to poll SQS
- Implement Lambda function to process SQS messages
- Configure batch size and batch window for message processing
- Apply event filtering to selectively process messages
- Monitor Lambda executions in CloudWatch

---

## Understanding Lambda Invocation Types

### Synchronous Invocation
- **Use Case**: API Gateway integration
- **Behavior**: Caller waits for response
- **Example**: HTTP API requests

### Asynchronous Invocation
- **Use Case**: SNS, S3 event notifications
- **Behavior**: Event queued, Lambda returns immediately
- **Example**: S3 object uploads triggering Lambda

### Poll-Based Invocation (Event Source Mapping)
- **Use Case**: SQS, Kinesis, DynamoDB Streams
- **Behavior**: Lambda polls the source for events
- **Example**: SQS queues, data streams
- **Important**: Lambda pulls messages from the queue automatically

---

## Architecture Overview

```
Amazon SQS Queue → Lambda Polls (Event Source Mapping) → Lambda Function Executes
```

**Flow:**
1. Messages sent to Amazon SQS queue
2. Lambda polls queue automatically (Event Source Mapping)
3. Lambda retrieves messages in batches
4. Lambda function processes messages
5. Messages deleted from queue after successful processing

![Placeholder for architecture diagram]

---

## Part 1: Create Infrastructure on AWS Console

### Step 1: Create Amazon SQS Queue

Open **Simple Queue Service**

1. Click **Queues** in the left navigation
2. Click **Create queue** button
3. Select **Standard** queue type
4. Enter Queue name: `MyQueue`
5. Leave other settings as default
6. Click **Create queue**

![Placeholder for screenshot]

**Important:** Note the Queue URL for later use.

---

### Step 2: Create Lambda Function

Open **Lambda Service**

1. Click **Create function**
2. Select **Author from scratch**
3. Function name: `MySQSFunction`
4. Runtime: **Node.js** (latest version)
5. Leave other settings as default
6. Click **Create function**

![Placeholder for screenshot]

---

### Step 3: Add SQS Trigger to Lambda (Initial Attempt)

1. In Lambda function page, click **Add trigger**
2. Select trigger source: **SQS**
3. Select SQS queue: **MyQueue**
4. Configure settings:
   - **Batch size**: 10
   - **Batch window**: 0 seconds
5. Click **Add**

**Expected Result:** ❌ Error - Missing permissions

![Placeholder for screenshot showing error]

**Error Message:**
```
Exception occurred while creating trigger.
Lambda does not have permission to receive messages from SQS queue.
```

**Why?** Lambda needs IAM permissions to:
- Receive messages from SQS (`sqs:ReceiveMessage`)
- Delete messages from SQS (`sqs:DeleteMessage`)
- Get queue attributes (`sqs:GetQueueAttributes`)

---

### Step 4: Add Required IAM Permissions

1. Go to **Configuration** tab
2. Click **Permissions** in the left panel
3. Click on the **Execution role name** (opens IAM console)
4. In IAM console, click **Add permissions** → **Attach policies**
5. Search for: `AWSLambdaSQSQueueExecutionRole`
6. Select the policy checkbox
7. Click **Add permissions**

![Placeholder for screenshot]

**Policy Details:**
- **Policy Name**: AWSLambdaSQSQueueExecutionRole
- **Permissions Granted**:
  - `sqs:ReceiveMessage`
  - `sqs:DeleteMessage`
  - `sqs:GetQueueAttributes`

![Placeholder for screenshot showing policy details]

---

### Step 5: Add SQS Trigger (Second Attempt)

1. Go back to Lambda function
2. Click **Add trigger** again
3. Select trigger source: **SQS**
4. Select SQS queue: **MyQueue**
5. Configure settings:
   - **Batch size**: 10
   - **Batch window**: 0 seconds
6. Enable trigger: **Checked**
7. Click **Add**

**Expected Result:** ✅ Success - Trigger created

![Placeholder for screenshot]

---

### Step 6: Verify Trigger in SQS Console

1. Go to **SQS Console**
2. Open **MyQueue**
3. Scroll down to **Lambda triggers** tab
4. You should see **MySQSFunction** listed

![Placeholder for screenshot]

**Confirmation:** SQS queue is now configured to be polled by Lambda function.

---

## Part 2: Develop Lambda Function Code

### Step 1: Understand SQS Event Structure

**Sample SQS Event JSON:**
```json
{
  "Records": [
    {
      "messageId": "059f36b4-87a3-44ab-83d2-661975830a7d",
      "receiptHandle": "{receiptHandle}",
      "body": "Hello from SQS",
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1545082649183",
        "SenderId": "AIDAIENQZJOLO23YVJ4VO",
        "ApproximateFirstReceiveTimestamp": "1545082649185"
      },
      "messageAttributes": {},
      "md5OfBody": "{md5OfBody}",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:MyQueue",
      "awsRegion": "us-east-2"
    }
  ]
}
```

**Key Fields:**
- `Records`: Array of messages (up to batch size)
- `body`: Message content
- `receiptHandle`: Required for deleting message
- `messageId`: Unique identifier

---

### Step 2: Create Test Event in VS Code

Create a file `event.json` in your project folder:

```json
// Placeholder for SQS event JSON
```

---

### Step 3: Implement Lambda Function

Create a file `index.js`:

```javascript
// Placeholder for Lambda function code
```

**Function Logic:**
1. Log entire incoming event
2. Iterate through `Records` array
3. Extract `body` from each record
4. Log the body content
5. Return success response

---

### Step 4: Deploy Code to Lambda

1. Copy the code from your editor
2. Go to **Lambda Console**
3. Open **MySQSFunction**
4. Go to **Code** tab
5. Replace existing code with your code
6. Click **Deploy**

![Placeholder for screenshot]

**Success Message:** "Changes deployed successfully"

---

## Part 3: Test and Verify

### Step 1: Send Test Message to SQS

1. Go to **SQS Console**
2. Open **MyQueue**
3. Click **Send and receive messages**
4. In message body, enter: `Test message from SQS`
5. Leave delivery delay as: **0 seconds**
6. Click **Send message**

![Placeholder for screenshot]

**Confirmation:** "Message sent successfully"

---

### Step 2: Verify Lambda Execution

1. Go to **Lambda Console**
2. Open **MySQSFunction**
3. Click **Monitor** tab
4. Click **View CloudWatch logs**
5. Click on the latest **Log stream**

![Placeholder for screenshot]

**Expected Output:**
```
// Placeholder for CloudWatch logs output
```

**You should see:**
- Full event JSON with Records array
- Message ID and receipt handle
- Body content: "Test message from SQS"
- Info log showing parsed body

---

### Step 3: Test Batch Processing

1. Go to **SQS Console**
2. Open **MyQueue** → **Send and receive messages**
3. Set **Delivery delay**: **20 seconds**
4. Send multiple messages:
   - Message 1: `Test message 1`
   - Message 2: `Test message 2`
   - Message 3: `Test message 3`
   - Message 4: `Test message 4`
   - Message 5: `Test message 5`
5. Click **Send message** for each

![Placeholder for screenshot]

---

### Step 4: Wait and Verify Batch Processing

Wait 20 seconds (for delivery delay), then:

1. Go to **CloudWatch Logs**
2. Refresh and open latest log stream
3. You should see all 5 messages processed in one invocation

**Expected Log Output:**
```
// Placeholder for batch processing logs
```

**Key Observation:**
- All 5 messages processed in single Lambda invocation
- This is because batch size = 10, and we sent 5 messages
- Lambda waits for batch window or batch size, whichever comes first

---

### Step 5: Understanding Batch Size

**Current Configuration:**
- Batch size: 10
- Batch window: 0 seconds

**Scenarios:**

**Scenario 1:** Send 11 messages
- First invocation: 10 messages
- Second invocation: 1 message

**Scenario 2:** Send 5 messages
- One invocation: 5 messages (batch size not reached)

**Scenario 3:** Send 25 messages
- First invocation: 10 messages
- Second invocation: 10 messages
- Third invocation: 5 messages

![Placeholder for diagram showing batch processing]

---

## Part 4: Lambda Event Filtering

### Understanding Event Filtering

**What is Event Filtering?**
Lambda can filter events before invoking your function. For event sources like SQS, Kinesis, and DynamoDB Streams, you can define filter criteria to process only specific records.

**Benefits:**
- Reduces unnecessary Lambda invocations
- Saves costs
- Simplifies function logic
- Improves performance

**How it Works:**
1. Define filter patterns in JSON format
2. Lambda evaluates incoming messages against filters
3. If message matches ANY filter → Lambda invokes function
4. If message doesn't match → Lambda discards event (no invocation)

![Placeholder for event filtering diagram]

---

### Use Case: Corporate Customer Processing

**Scenario:**
- Queue receives customer creation messages
- Customers have two types: "corporate" and "individual"
- Lambda should process ONLY corporate customers
- Individual customers should be discarded

**Customer Message Format:**
```json
{
  "customerId": "C001",
  "name": "Acme Corporation",
  "type": "corporate"
}
```

---

### Step 1: Design Customer Payloads

Create customer test messages in VS Code:

**Message 1 (Corporate - Should be processed):**
```json
{
  "customerId": "C001",
  "name": "Acme Corporation",
  "type": "corporate"
}
```

**Message 2 (Individual - Should be discarded):**
```json
{
  "customerId": "C002",
  "name": "John Doe",
  "type": "individual"
}
```

---

### Step 2: Design Filter Pattern

**Filter Pattern JSON:**
```json
{
  "body": {
    "type": ["corporate"]
  }
}
```

**Explanation:**
- `body`: Matches against the message body content
- `type`: Field in the message body
- `["corporate"]`: Only messages with type = "corporate" will be processed

---

### Step 3: Delete Existing Trigger

1. Go to **Lambda Console**
2. Open **MySQSFunction**
3. Go to **Configuration** → **Triggers**
4. Select the SQS trigger
5. Click **Delete**
6. Confirm deletion
7. Wait until deletion completes (refresh page)

![Placeholder for screenshot]

**Status:** Trigger successfully deleted

---

### Step 4: Add New Trigger with Filter

1. Click **Add trigger**
2. Select: **SQS**
3. Select queue: **MyQueue**
4. Configure:
   - **Batch size**: 10
   - **Batch window**: 0 seconds
5. Expand **Additional settings**
6. Click **Add filter criteria**
7. Paste the filter pattern JSON:
```json
{
  "body": {
    "type": ["corporate"]
  }
}
```
8. Click **Add** button to add the filter
9. Click **Add** button to create trigger

![Placeholder for screenshot showing filter configuration]

---

### Step 5: Verify Filter Configuration

1. Go to **Configuration** → **Triggers**
2. View trigger details
3. Scroll down to see **Filter criteria**
4. Confirm: `body.type = ["corporate"]`

![Placeholder for screenshot]

**Status:** Wait for state to change from "Creating" to "Enabled"

---

### Step 6: Test Event Filtering

**Test 1: Send Corporate Customer**

1. Go to **SQS Console**
2. Open **MyQueue** → **Send and receive messages**
3. Send message:
```json
{
  "customerId": "C001",
  "name": "Acme Corporation",
  "type": "corporate"
}
```
4. Click **Send message**

![Placeholder for screenshot]

---

**Test 2: Send Individual Customer**

1. In the same screen, send message:
```json
{
  "customerId": "C002",
  "name": "John Doe",
  "type": "individual"
}
```
2. Click **Send message**

![Placeholder for screenshot]

**Result:** Two messages sent to queue

---

### Step 7: Verify Filtered Processing

1. Go to **Lambda Console**
2. Open **MySQSFunction**
3. Click **Monitor** → **View CloudWatch logs**
4. Open latest log stream

![Placeholder for screenshot]

**Expected Results:**
```
// Placeholder for filtered logs showing only corporate customer
```

**Observations:**
- ✅ Only ONE invocation occurred
- ✅ Only corporate customer message was processed
- ✅ Individual customer message was discarded (no Lambda invocation)
- ✅ Body shows: `"type": "corporate"`

---

### Step 8: Verify Message Handling

**Corporate Message:**
- ✅ Processed by Lambda
- ✅ Deleted from queue (after successful processing)

**Individual Message:**
- ❌ Discarded by filter (never reached Lambda)
- ⚠️ Remains in queue OR deleted by Lambda (depending on configuration)

---

## Key Concepts

### Event Source Mapping
- **Poll-Based Invocation**: Lambda polls SQS for messages
- **Automatic Scaling**: Lambda scales consumers based on queue depth
- **Batch Processing**: Messages processed in batches
- **Synchronous Processing**: Within batch, messages processed synchronously

### Batch Configuration
- **Batch Size**: Maximum messages per invocation (1-10,000 for standard queues)
- **Batch Window**: Maximum time to wait for batch (0-300 seconds)
- **Behavior**: Lambda invokes when batch size reached OR batch window expires

### IAM Permissions Required
Lambda execution role must have:
- `sqs:ReceiveMessage` - Poll messages from queue
- `sqs:DeleteMessage` - Delete processed messages
- `sqs:GetQueueAttributes` - Get queue metadata

### Event Filtering
- **Filter Location**: Evaluated before Lambda invocation
- **Cost Savings**: No charge for filtered messages
- **Multiple Filters**: Up to 5 filters per trigger (OR logic)
- **Filter Syntax**: JSON pattern matching on event fields

### Message Deletion
- **Automatic Deletion**: Lambda deletes messages after successful processing
- **Failure Handling**: Failed messages return to queue (based on visibility timeout)
- **Visibility Timeout**: Message hidden from other consumers during processing

---

## Part 5: Cleanup Resources

### Step 1: Delete Lambda Function

1. Go to **Lambda Console**
2. Select **MySQSFunction**
3. Click **Actions** → **Delete**
4. Type `delete` to confirm
5. Click **Delete**

---

### Step 2: Delete SQS Queue

1. Go to **SQS Console**
2. Select **MyQueue**
3. Click **Delete**
4. Type `delete` to confirm
5. Click **Delete**

---

### Step 3: Delete CloudWatch Log Groups

1. Go to **CloudWatch Console**
2. Navigate to **Logs** → **Log groups**
3. Select log group: `/aws/lambda/MySQSFunction`
4. Click **Actions** → **Delete log group(s)**
5. Confirm deletion

---

## Troubleshooting

### Issue 1: Cannot Add SQS Trigger
**Error:** "Lambda does not have permission to access SQS"

**Solution:**
- Attach `AWSLambdaSQSQueueExecutionRole` policy to Lambda execution role
- Verify IAM permissions in Configuration → Permissions

---

### Issue 2: Messages Not Being Processed
**Possible Causes:**
1. Trigger is disabled - Enable in Configuration → Triggers
2. Visibility timeout too short - Increase queue visibility timeout
3. Lambda execution time exceeds timeout - Increase Lambda timeout
4. Event filter blocking messages - Review filter criteria

**Solution:** Check CloudWatch Logs for errors

---

### Issue 3: Batch Size Confusion
**Question:** Why are 15 messages processed in 2 invocations?

**Answer:**
- Batch size = 10
- First invocation: 10 messages
- Second invocation: 5 messages
- Lambda automatically handles batching

---

### Issue 4: Event Filter Not Working
**Symptoms:** All messages being processed despite filter

**Solution:**
1. Verify filter syntax (must be valid JSON)
2. Check message body structure matches filter pattern
3. Test with simple filter first: `{"body": {"type": ["corporate"]}}`
4. Review CloudWatch Logs for filter evaluation

---

## Best Practices

1. **Set Appropriate Batch Size**
   - Consider message processing time
   - Balance between latency and throughput
   - Start with 10, adjust based on monitoring

2. **Configure Visibility Timeout**
   - Set to 6x Lambda function timeout
   - Prevents duplicate processing
   - Allows for retries on failure

3. **Implement Error Handling**
   - Use try-catch in Lambda function
   - Partial batch failures handling
   - Configure DLQ for failed messages

4. **Monitor CloudWatch Metrics**
   - Number of messages processed
   - Lambda invocations
   - Error rates
   - Queue depth

5. **Use Event Filtering**
   - Reduce unnecessary invocations
   - Filter at source, not in function code
   - Save on Lambda execution costs

6. **Set Up Dead Letter Queue (DLQ)**
   - Capture failed messages
   - Separate analysis and debugging
   - Prevent message loss

---

## Advanced Topics

### Partial Batch Failure Handling
Configure Lambda to report partial batch failures:
```javascript
return {
  batchItemFailures: [
    { itemIdentifier: "message-id-1" },
    { itemIdentifier: "message-id-2" }
  ]
};
```

### FIFO Queue Considerations
- Batch size impacts message group processing
- Order preserved within message group
- Deduplication based on message deduplication ID

### Scaling Behavior
- Lambda scales up to 1,000 concurrent executions (default)
- For standard queues: up to 60 concurrent functions
- For FIFO queues: number of active message groups

---

## Additional Resources

### AWS Documentation
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/)
- [Using Lambda with SQS](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html)
- [Lambda Event Filtering](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html)
- [Amazon SQS Developer Guide](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/)

### Tutorials & Examples
- [Serverless Event Filtering Patterns](https://aws.amazon.com/blogs/compute/filtering-event-sources-for-aws-lambda-functions/)
- [SQS Best Practices](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-best-practices.html)

---

## Next Steps

After completing this lab, explore:

1. **Dead Letter Queues (DLQ)**
   - Handle failed message processing
   - Analyze failures separately
   - Configure max receive count

2. **Message Attributes & Filtering**
   - Use message attributes for routing
   - Complex filter patterns
   - Multi-criteria filtering

3. **FIFO Queues with Lambda**
   - Guaranteed message ordering
   - Exactly-once processing
   - Message group processing

4. **Fan-Out Pattern**
   - SNS → Multiple SQS queues
   - Each queue triggers different Lambda
   - Parallel processing

5. **Step Functions Integration**
   - Orchestrate complex workflows
   - Error handling and retries
   - State management

6. **Cost Optimization**
   - Long polling configuration
   - Batch size optimization
   - Reserved concurrency

7. **Monitoring & Alerting**
   - CloudWatch dashboards
   - Alarm on queue depth
   - Lambda error rates

---

## Lab Summary

**Lab Duration:** 90-120 minutes  
**Difficulty Level:** Intermediate  
**AWS Services Used:** Lambda, SQS, IAM, CloudWatch  
**Key Concepts:** Event Source Mapping, Poll-Based Invocation, Event Filtering, Batch Processing  
**Last Updated:** January 2026  

---

## Appendix

### Lambda Invocation Type Comparison

| Feature | Synchronous | Asynchronous | Poll-Based (Event Source Mapping) |
|---------|-------------|--------------|-----------------------------------|
| **Caller Waits** | Yes | No | N/A (Lambda polls) |
| **Use Cases** | API Gateway, SDK calls | S3, SNS | SQS, Kinesis, DynamoDB Streams |
| **Retries** | Caller handles | Lambda retries (2x) | Based on message visibility |
| **Error Handling** | Returned to caller | DLQ, failed event destination | DLQ at queue level |
| **Scaling** | Based on requests | Event queue depth | Based on queue/stream shards |

---

### Filter Pattern Examples

**Example 1: Multiple Values**
```json
{
  "body": {
    "type": ["corporate", "enterprise"]
  }
}
```

**Example 2: Numeric Comparison**
```json
{
  "body": {
    "amount": [{"numeric": [">", 1000]}]
  }
}
```

**Example 3: Exists Check**
```json
{
  "body": {
    "priority": [{"exists": true}]
  }
}
```

**Example 4: Nested Fields**
```json
{
  "body": {
    "customer": {
      "type": ["corporate"],
      "region": ["us-east"]
    }
  }
}
```

---
