import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";

export class GraphglWebStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, "Api", {
      name: "todos-with-graphql",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          // apiKeyConfig: {
          //   expires: cdk.Expiration.after(cdk.Duration.days(365)),
          // },
        },
      },
      xrayEnabled: true,
    });
  //  Here is our lambda function 
    const todosLambda = new lambda.Function(this, "TodoLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset("functions"),
      memorySize: 1024,
    });
    // Here we added lambdaData Source
    const lambdaDs = api.addLambdaDataSource("TodoDatasource", todosLambda);
    // There are resolvers
    // this will get all the Todos
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getTodos",
    });
    // This will add Todo to our dynamodb Table

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addTodo",
    });
    // This will update our Todo's table
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateTodo",
    });
    // This will delete Todo
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteTodo",
    });
    // This will create Table with partition key of "id"
    const todosTable = new ddb.Table(this, "TodosTable", {
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
    // Here we grantfullAcsess to lambda funtion
    todosTable.grantFullAccess(todosLambda);
    // Here we added Enviroment with lambda Funtion
    todosLambda.addEnvironment("TODOS_TABLE", todosTable.tableName); // sir is ka kia advantage h or ya kia kr rha h 
    // kia ya process.env.tableName ma use to  nhe horha h 

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });
  }
}
