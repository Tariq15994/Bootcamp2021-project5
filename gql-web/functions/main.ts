import Todo from "./Todo";
import addTodo from "./addTodo";
import updateTodo from "./updateTodo";
import getTodo from "./getTodo";
import deleteTodo from "./deleteTodo";

type AppSyncEvent = {
    info : {
        fieldName: string,
    },
    arguments: {
        todoId: string;
        todo: Todo;
    }
    
}

exports.handler = async (event:AppSyncEvent)=>{
    switch(event.info.fieldName){
        case "addTodo":
            return await addTodo(event.arguments.todo);

        case "getTodo":
            return await getTodo();

        case "updateTodo":
            return await updateTodo(event.arguments.todo);

        case "deleteTodo":
            return await deleteTodo(event.arguments.todoId);

        default:
            return null;
    }
}