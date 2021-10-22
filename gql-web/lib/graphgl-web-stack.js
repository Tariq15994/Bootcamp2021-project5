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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhnbC13ZWItc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncmFwaGdsLXdlYi1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsZ0RBQWdEO0FBQ2hELDZDQUE2QztBQUM3Qyw4Q0FBOEM7QUFFOUMsTUFBYSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzVDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkIsNkNBQTZDO1FBSTlDLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQzlDLElBQUksRUFBRSxvQkFBb0I7WUFDMUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1lBQzFELG1CQUFtQixFQUFFO2dCQUNuQixvQkFBb0IsRUFBRTtvQkFDcEIsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU87b0JBQ3BELGtCQUFrQjtvQkFDbEIsMkRBQTJEO29CQUMzRCxLQUFLO2lCQUNOO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFDTCxnQ0FBZ0M7UUFDOUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDMUQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsY0FBYztZQUN2QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBQ3hDLFVBQVUsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztRQUNILGtDQUFrQztRQUNsQyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDeEUsc0JBQXNCO1FBQ3RCLDhCQUE4QjtRQUM5QixRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFNBQVMsRUFBRSxVQUFVO1NBQ3RCLENBQUMsQ0FBQztRQUNILDJDQUEyQztRQUUzQyxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUMsQ0FBQztRQUNILG9DQUFvQztRQUNwQyxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FBQztRQUNILHdCQUF3QjtRQUN4QixRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FBQztRQUNILG9EQUFvRDtRQUNwRCxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNuRCxZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUMvQjtTQUNGLENBQUMsQ0FBQztRQUNILDRDQUE0QztRQUM1QyxVQUFVLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLCtDQUErQztRQUMvQyxXQUFXLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxnREFBZ0Q7UUFDakgsdURBQXVEO1FBRXZELDBEQUEwRDtRQUMxRCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN2QyxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVU7U0FDdEIsQ0FBQyxDQUFDO1FBRUgseURBQXlEO1FBQ3pELElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3ZDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxJQUFJLEVBQUU7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsOENBQThDO1FBQzlDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3RDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFoRkQsMENBZ0ZDO0FBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tIFwiQGF3cy1jZGsvYXdzLWFwcHN5bmNcIjtcbmltcG9ydCAqIGFzIGRkYiBmcm9tIFwiQGF3cy1jZGsvYXdzLWR5bmFtb2RiXCI7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSBcIkBhd3MtY2RrL2F3cy1sYW1iZGFcIjtcblxuZXhwb3J0IGNsYXNzIEdyYXBoZ2xXZWJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG4gICAgXG4gXG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBwc3luYy5HcmFwaHFsQXBpKHRoaXMsIFwiQXBpXCIsIHtcbiAgICAgIG5hbWU6IFwidG9kb3Mtd2l0aC1ncmFwaHFsXCIsXG4gICAgICBzY2hlbWE6IGFwcHN5bmMuU2NoZW1hLmZyb21Bc3NldChcImdyYXBocWwvc2NoZW1hLmdyYXBocWxcIiksXG4gICAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XG4gICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuQVBJX0tFWSxcbiAgICAgICAgICAvLyBhcGlLZXlDb25maWc6IHtcbiAgICAgICAgICAvLyAgIGV4cGlyZXM6IGNkay5FeHBpcmF0aW9uLmFmdGVyKGNkay5EdXJhdGlvbi5kYXlzKDM2NSkpLFxuICAgICAgICAgIC8vIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgeHJheUVuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG4gIC8vICBIZXJlIGlzIG91ciBsYW1iZGEgZnVuY3Rpb24gXG4gICAgY29uc3QgdG9kb3NMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIFwiVG9kb0xhbWJkYVwiLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgIGhhbmRsZXI6IFwibWFpbi5oYW5kbGVyXCIsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoXCJmdW5jdGlvbnNcIiksXG4gICAgICBtZW1vcnlTaXplOiAxMDI0LFxuICAgIH0pO1xuICAgIC8vIEhlcmUgd2UgYWRkZWQgbGFtYmRhRGF0YSBTb3VyY2VcbiAgICBjb25zdCBsYW1iZGFEcyA9IGFwaS5hZGRMYW1iZGFEYXRhU291cmNlKFwiVG9kb0RhdGFzb3VyY2VcIiwgdG9kb3NMYW1iZGEpO1xuICAgIC8vIFRoZXJlIGFyZSByZXNvbHZlcnNcbiAgICAvLyB0aGlzIHdpbGwgZ2V0IGFsbCB0aGUgVG9kb3NcbiAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7XG4gICAgICB0eXBlTmFtZTogXCJRdWVyeVwiLFxuICAgICAgZmllbGROYW1lOiBcImdldFRvZG9zXCIsXG4gICAgfSk7XG4gICAgLy8gVGhpcyB3aWxsIGFkZCBUb2RvIHRvIG91ciBkeW5hbW9kYiBUYWJsZVxuXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJhZGRUb2RvXCIsXG4gICAgfSk7XG4gICAgLy8gVGhpcyB3aWxsIHVwZGF0ZSBvdXIgVG9kbydzIHRhYmxlXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJ1cGRhdGVUb2RvXCIsXG4gICAgfSk7XG4gICAgLy8gVGhpcyB3aWxsIGRlbGV0ZSBUb2RvXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJkZWxldGVUb2RvXCIsXG4gICAgfSk7XG4gICAgLy8gVGhpcyB3aWxsIGNyZWF0ZSBUYWJsZSB3aXRoIHBhcnRpdGlvbiBrZXkgb2YgXCJpZFwiXG4gICAgY29uc3QgdG9kb3NUYWJsZSA9IG5ldyBkZGIuVGFibGUodGhpcywgXCJUb2Rvc1RhYmxlXCIsIHtcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiBcImlkXCIsXG4gICAgICAgIHR5cGU6IGRkYi5BdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8gSGVyZSB3ZSBncmFudGZ1bGxBY3Nlc3MgdG8gbGFtYmRhIGZ1bnRpb25cbiAgICB0b2Rvc1RhYmxlLmdyYW50RnVsbEFjY2Vzcyh0b2Rvc0xhbWJkYSk7XG4gICAgLy8gSGVyZSB3ZSBhZGRlZCBFbnZpcm9tZW50IHdpdGggbGFtYmRhIEZ1bnRpb25cbiAgICB0b2Rvc0xhbWJkYS5hZGRFbnZpcm9ubWVudChcIlRPRE9TX1RBQkxFXCIsIHRvZG9zVGFibGUudGFibGVOYW1lKTsgLy8gc2lyIGlzIGthIGtpYSBhZHZhbnRhZ2UgaCBvciB5YSBraWEga3IgcmhhIGggXG4gICAgLy8ga2lhIHlhIHByb2Nlc3MuZW52LnRhYmxlTmFtZSBtYSB1c2UgdG8gIG5oZSBob3JoYSBoIFxuXG4gICAgLy8gUHJpbnRzIG91dCB0aGUgQXBwU3luYyBHcmFwaFFMIGVuZHBvaW50IHRvIHRoZSB0ZXJtaW5hbFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiR3JhcGhRTEFQSVVSTFwiLCB7XG4gICAgICB2YWx1ZTogYXBpLmdyYXBocWxVcmwsXG4gICAgfSk7XG5cbiAgICAvLyBQcmludHMgb3V0IHRoZSBBcHBTeW5jIEdyYXBoUUwgQVBJIGtleSB0byB0aGUgdGVybWluYWxcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIkdyYXBoUUxBUElLZXlcIiwge1xuICAgICAgdmFsdWU6IGFwaS5hcGlLZXkgfHwgXCJcIixcbiAgICB9KTtcblxuICAgIC8vIFByaW50cyBvdXQgdGhlIHN0YWNrIHJlZ2lvbiB0byB0aGUgdGVybWluYWxcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIlN0YWNrIFJlZ2lvblwiLCB7XG4gICAgICB2YWx1ZTogdGhpcy5yZWdpb24sXG4gICAgfSk7XG4gIH1cbn07XG4iXX0=