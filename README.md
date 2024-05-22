# DataGrail Update DynamoDB Lambda Function

This AWS Lambda function updates an item in a DynamoDB table based on the provided event data. The function is written in JavaScript (Node.js) and uses the AWS SDK for JavaScript to interact with DynamoDB.

## Prerequisites

- AWS Account
- AWS CLI configured with appropriate permissions
- Node.js installed
- An existing DynamoDB table

## Files

- `index.js`: The Lambda function code
- `datagrail_update_dynamodb_event.json`: A sample test event

## Lambda Function Code (`index.js`)

```javascript
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const tableName = "YourDynamoDBTable";
    const { id, attributes } = event.detail.item;

    const params = {
        TableName: tableName,
        Key: {
            id: id
        },
        UpdateExpression: 'set ' + Object.keys(attributes).map((attr, index) => `#${attr} = :${attr}`).join(', '),
        ExpressionAttributeNames: Object.keys(attributes).reduce((acc, attr) => ({ ...acc, [`#${attr}`]: attr }), {}),
        ExpressionAttributeValues: Object.keys(attributes).reduce((acc, attr) => ({ ...acc, [`:${attr}`]: attributes[attr] }), {}),
        ReturnValues: "UPDATED_NEW"
    };

    try {
        const result = await dynamoDb.update(params).promise();
        console.log('Update succeeded:', result);
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error('Update failed:', error);
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        };
    }
};
```

## Sample Test Event (`datagrail_update_dynamodb_event.json`)

```json
{
  "label": "datagrail_update_dynamodb_event",
  "detail": {
    "operation": "update",
    "item": {
      "id": "123",
      "attributes": {
        "name": "Sample Item",
        "status": "active"
      }
    }
  }
}
```

## Deployment

1. **Create the Lambda Function:**
   - Go to the AWS Lambda console.
   - Click on "Create function".
   - Choose "Author from scratch".
   - Provide a function name and select "Node.js" as the runtime.
   - Click "Create function".

2. **Upload the Code:**
   - In the function's configuration page, go to the "Code" tab.
   - Click on "Upload from" and select "File".
   - Upload `index.js`.

3. **Set Up Test Event:**
   - Go to the "Test" tab.
   - Click on "Configure test events".
   - Create a new test event with the contents of `datagrail_update_dynamodb_event.json`.
   - Save the test event.

4. **Run the Test:**
   - Click on "Test" to run the function with the test event.
   - Check the output logs to see the result of the update operation.

## Configuration

- Replace `"YourDynamoDBTable"` in the Lambda function code with the actual name of your DynamoDB table.
