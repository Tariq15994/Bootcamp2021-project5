"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphglWebStack = void 0;
const cdk = require("@aws-cdk/core");
const appsync = require("@aws-cdk/aws-appsync");
const ddb = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
class GraphglWebStack extends cdk.Stack {
    constructor(scope, id, props) {
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
exports.GraphglWebStack = GraphglWebStack;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhnbC13ZWItc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncmFwaGdsLXdlYi1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsZ0RBQWdEO0FBQ2hELDZDQUE2QztBQUM3Qyw4Q0FBOEM7QUFFOUMsTUFBYSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzVDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkIsNkNBQTZDO1FBQzlDLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQzlDLElBQUksRUFBRSxvQkFBb0I7WUFDMUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1lBQzFELG1CQUFtQixFQUFFO2dCQUNuQixvQkFBb0IsRUFBRTtvQkFDcEIsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU87b0JBQ3BELGtCQUFrQjtvQkFDbEIsMkRBQTJEO29CQUMzRCxLQUFLO2lCQUNOO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFDTCxnQ0FBZ0M7UUFDOUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDMUQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsY0FBYztZQUN2QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBQ3hDLFVBQVUsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztRQUNILGtDQUFrQztRQUNsQyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDeEUsc0JBQXNCO1FBQ3RCLDhCQUE4QjtRQUM5QixRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFNBQVMsRUFBRSxVQUFVO1NBQ3RCLENBQUMsQ0FBQztRQUNILDJDQUEyQztRQUUzQyxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUMsQ0FBQztRQUNILG9DQUFvQztRQUNwQyxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FBQztRQUNILHdCQUF3QjtRQUN4QixRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FBQztRQUNILG9EQUFvRDtRQUNwRCxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNuRCxZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUMvQjtTQUNGLENBQUMsQ0FBQztRQUNILDRDQUE0QztRQUM1QyxVQUFVLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLCtDQUErQztRQUMvQyxXQUFXLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxnREFBZ0Q7UUFDakgsdURBQXVEO1FBRXZELDBEQUEwRDtRQUMxRCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN2QyxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVU7U0FDdEIsQ0FBQyxDQUFDO1FBRUgseURBQXlEO1FBQ3pELElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3ZDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxJQUFJLEVBQUU7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsOENBQThDO1FBQzlDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3RDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUE3RUQsMENBNkVDO0FBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tIFwiQGF3cy1jZGsvYXdzLWFwcHN5bmNcIjtcbmltcG9ydCAqIGFzIGRkYiBmcm9tIFwiQGF3cy1jZGsvYXdzLWR5bmFtb2RiXCI7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSBcIkBhd3MtY2RrL2F3cy1sYW1iZGFcIjtcblxuZXhwb3J0IGNsYXNzIEdyYXBoZ2xXZWJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG4gICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCBcIkFwaVwiLCB7XG4gICAgICBuYW1lOiBcInRvZG9zLXdpdGgtZ3JhcGhxbFwiLFxuICAgICAgc2NoZW1hOiBhcHBzeW5jLlNjaGVtYS5mcm9tQXNzZXQoXCJncmFwaHFsL3NjaGVtYS5ncmFwaHFsXCIpLFxuICAgICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xuICAgICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVksXG4gICAgICAgICAgLy8gYXBpS2V5Q29uZmlnOiB7XG4gICAgICAgICAgLy8gICBleHBpcmVzOiBjZGsuRXhwaXJhdGlvbi5hZnRlcihjZGsuRHVyYXRpb24uZGF5cygzNjUpKSxcbiAgICAgICAgICAvLyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHhyYXlFbmFibGVkOiB0cnVlLFxuICAgIH0pO1xuICAvLyAgSGVyZSBpcyBvdXIgbGFtYmRhIGZ1bmN0aW9uIFxuICAgIGNvbnN0IHRvZG9zTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcIlRvZG9MYW1iZGFcIiwge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICBoYW5kbGVyOiBcIm1haW4uaGFuZGxlclwiLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KFwiZnVuY3Rpb25zXCIpLFxuICAgICAgbWVtb3J5U2l6ZTogMTAyNCxcbiAgICB9KTtcbiAgICAvLyBIZXJlIHdlIGFkZGVkIGxhbWJkYURhdGEgU291cmNlXG4gICAgY29uc3QgbGFtYmRhRHMgPSBhcGkuYWRkTGFtYmRhRGF0YVNvdXJjZShcIlRvZG9EYXRhc291cmNlXCIsIHRvZG9zTGFtYmRhKTtcbiAgICAvLyBUaGVyZSBhcmUgcmVzb2x2ZXJzXG4gICAgLy8gdGhpcyB3aWxsIGdldCBhbGwgdGhlIFRvZG9zXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6IFwiUXVlcnlcIixcbiAgICAgIGZpZWxkTmFtZTogXCJnZXRUb2Rvc1wiLFxuICAgIH0pO1xuICAgIC8vIFRoaXMgd2lsbCBhZGQgVG9kbyB0byBvdXIgZHluYW1vZGIgVGFibGVcblxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiYWRkVG9kb1wiLFxuICAgIH0pO1xuICAgIC8vIFRoaXMgd2lsbCB1cGRhdGUgb3VyIFRvZG8ncyB0YWJsZVxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwidXBkYXRlVG9kb1wiLFxuICAgIH0pO1xuICAgIC8vIFRoaXMgd2lsbCBkZWxldGUgVG9kb1xuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiZGVsZXRlVG9kb1wiLFxuICAgIH0pO1xuICAgIC8vIFRoaXMgd2lsbCBjcmVhdGUgVGFibGUgd2l0aCBwYXJ0aXRpb24ga2V5IG9mIFwiaWRcIlxuICAgIGNvbnN0IHRvZG9zVGFibGUgPSBuZXcgZGRiLlRhYmxlKHRoaXMsIFwiVG9kb3NUYWJsZVwiLCB7XG4gICAgICBwYXJ0aXRpb25LZXk6IHtcbiAgICAgICAgbmFtZTogXCJpZFwiLFxuICAgICAgICB0eXBlOiBkZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vIEhlcmUgd2UgZ3JhbnRmdWxsQWNzZXNzIHRvIGxhbWJkYSBmdW50aW9uXG4gICAgdG9kb3NUYWJsZS5ncmFudEZ1bGxBY2Nlc3ModG9kb3NMYW1iZGEpO1xuICAgIC8vIEhlcmUgd2UgYWRkZWQgRW52aXJvbWVudCB3aXRoIGxhbWJkYSBGdW50aW9uXG4gICAgdG9kb3NMYW1iZGEuYWRkRW52aXJvbm1lbnQoXCJUT0RPU19UQUJMRVwiLCB0b2Rvc1RhYmxlLnRhYmxlTmFtZSk7IC8vIHNpciBpcyBrYSBraWEgYWR2YW50YWdlIGggb3IgeWEga2lhIGtyIHJoYSBoIFxuICAgIC8vIGtpYSB5YSBwcm9jZXNzLmVudi50YWJsZU5hbWUgbWEgdXNlIHRvICBuaGUgaG9yaGEgaCBcblxuICAgIC8vIFByaW50cyBvdXQgdGhlIEFwcFN5bmMgR3JhcGhRTCBlbmRwb2ludCB0byB0aGUgdGVybWluYWxcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIkdyYXBoUUxBUElVUkxcIiwge1xuICAgICAgdmFsdWU6IGFwaS5ncmFwaHFsVXJsLFxuICAgIH0pO1xuXG4gICAgLy8gUHJpbnRzIG91dCB0aGUgQXBwU3luYyBHcmFwaFFMIEFQSSBrZXkgdG8gdGhlIHRlcm1pbmFsXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJHcmFwaFFMQVBJS2V5XCIsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpS2V5IHx8IFwiXCIsXG4gICAgfSk7XG5cbiAgICAvLyBQcmludHMgb3V0IHRoZSBzdGFjayByZWdpb24gdG8gdGhlIHRlcm1pbmFsXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJTdGFjayBSZWdpb25cIiwge1xuICAgICAgdmFsdWU6IHRoaXMucmVnaW9uLFxuICAgIH0pO1xuICB9XG59O1xuIl19