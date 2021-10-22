"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addTodo_1 = require("./addTodo");
const updateTodo_1 = require("./updateTodo");
const deleteTodo_1 = require("./deleteTodo");
const getTodos_1 = require("./getTodos");
exports.handler = async (event) => {
    switch (event.info.fieldName) {
        case "addTodo":
            return await (0, addTodo_1.default)(event.arguments.todo);
        case "getTodo":
            return await (0, getTodos_1.default)();
        case "updateTodo":
            return await (0, updateTodo_1.default)(event.arguments.todo);
        case "deleteTodo":
            return await (0, deleteTodo_1.default)(event.arguments.todoId);
        default:
            return null;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx1Q0FBZ0M7QUFDaEMsNkNBQXNDO0FBQ3RDLDZDQUFzQztBQUN0Qyx5Q0FBa0M7QUFhbEMsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBa0IsRUFBQyxFQUFFO0lBQzFDLFFBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDekIsS0FBSyxTQUFTO1lBQ1YsT0FBTyxNQUFNLElBQUEsaUJBQU8sRUFBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRS9DLEtBQUssU0FBUztZQUNWLE9BQU8sTUFBTSxJQUFBLGtCQUFRLEdBQUUsQ0FBQztRQUU1QixLQUFLLFlBQVk7WUFDYixPQUFPLE1BQU0sSUFBQSxvQkFBVSxFQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEQsS0FBSyxZQUFZO1lBQ2IsT0FBTyxNQUFNLElBQUEsb0JBQVUsRUFBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXBEO1lBQ0ksT0FBTyxJQUFJLENBQUM7S0FDbkI7QUFDTCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVG9kbyBmcm9tIFwiLi9Ub2RvXCI7XG5pbXBvcnQgYWRkVG9kbyBmcm9tIFwiLi9hZGRUb2RvXCI7XG5pbXBvcnQgdXBkYXRlVG9kbyBmcm9tIFwiLi91cGRhdGVUb2RvXCI7XG5pbXBvcnQgZGVsZXRlVG9kbyBmcm9tIFwiLi9kZWxldGVUb2RvXCI7XG5pbXBvcnQgZ2V0VG9kb3MgZnJvbSBcIi4vZ2V0VG9kb3NcIjtcblxudHlwZSBBcHBTeW5jRXZlbnQgPSB7XG4gICAgaW5mbyA6IHtcbiAgICAgICAgZmllbGROYW1lOiBzdHJpbmcsXG4gICAgfSxcbiAgICBhcmd1bWVudHM6IHtcbiAgICAgICAgdG9kb0lkOiBzdHJpbmc7XG4gICAgICAgIHRvZG86IFRvZG87XG4gICAgfVxuICAgIFxufVxuXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6QXBwU3luY0V2ZW50KT0+e1xuICAgIHN3aXRjaChldmVudC5pbmZvLmZpZWxkTmFtZSkge1xuICAgICAgICBjYXNlIFwiYWRkVG9kb1wiOlxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGFkZFRvZG8oZXZlbnQuYXJndW1lbnRzLnRvZG8pO1xuXG4gICAgICAgIGNhc2UgXCJnZXRUb2RvXCI6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZ2V0VG9kb3MoKTtcblxuICAgICAgICBjYXNlIFwidXBkYXRlVG9kb1wiOlxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHVwZGF0ZVRvZG8oZXZlbnQuYXJndW1lbnRzLnRvZG8pO1xuXG4gICAgICAgIGNhc2UgXCJkZWxldGVUb2RvXCI6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZGVsZXRlVG9kbyhldmVudC5hcmd1bWVudHMudG9kb0lkKTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufTsiXX0=