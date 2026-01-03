export const handler = async (event) => {
    // Log the entire incoming event from SNS
    console.log('Received event from SNS:', JSON.stringify(event, null, 2));

    // Extract message from SNS event
    const message = event.Records[0].Sns.Message;

    // Log the message
    console.log('Message from SNS:', message);
};
