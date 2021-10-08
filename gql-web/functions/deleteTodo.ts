const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();


async function deleteTodo(todoId:string) {

    const params = {
        TableName : process.env.TODOS_TABLE,
        Key:{
            id : todoId
        },
    };

    try {
        const data = await docClient(params).promise()
        return data.Items;
    }catch(err) {
        console.log("Dynamodb error : ", err);
        return null;
    }
    
}
export default deleteTodo;