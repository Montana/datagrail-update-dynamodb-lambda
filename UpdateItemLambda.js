const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const params = {
        TableName: 'your-table-name',
        Key: { 'primaryKeyAttribute': event.primaryKeyValue },
        UpdateExpression: 'set #attrName = :attrValue',
        ExpressionAttributeNames: { '#attrName': 'attributeName' },
        ExpressionAttributeValues: { ':attrValue': event.newValue },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const data = await ddb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Attributes)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
