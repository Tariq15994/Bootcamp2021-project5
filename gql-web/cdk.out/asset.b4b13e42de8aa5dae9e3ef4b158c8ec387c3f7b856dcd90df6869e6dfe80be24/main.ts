import Todo from "./Todo";
import addTodo from "./addTodo";
import updateTodo from "./updateTodo";
import deleteTodo from "./deleteTodo";
import getTodos from "./getTodos";

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
    switch(event.info.fieldName) {
        case "addTodo":
            return await addTodo(event.arguments.todo);

        case "getTodo":
            return await getTodos();

        case "updateTodo":
            return await updateTodo(event.arguments.todo);

        case "deleteTodo":
            return await deleteTodo(event.arguments.todoId);

        default:
            return null;
    }
};