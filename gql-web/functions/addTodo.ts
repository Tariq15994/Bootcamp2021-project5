const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

async function addTodo(todo:Todo) {
    const params = {
        TableName: process.env.TODOS_TABLE,
        Key: {
            Item: todo 
        }
    }
    try{
        await docClient.put(params).promise();
        return todo;
    }catch(err) {
        console.log("Dynamodb error :", err);
    }

}
export default addTodo;