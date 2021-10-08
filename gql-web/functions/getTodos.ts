const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getTodos() {
    const params = {
        TableName: process.env.TODOS_TABLE
    };
    try {
        const data = new docClient.scan(params).promise();
        return data.Items
    }
    catch (err) {
        console.log("Dynamodb error ", err);
        return null;
    }



}