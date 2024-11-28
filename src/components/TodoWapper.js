import React, {useState} from 'react'
import { TodoForm } from './TodoForm'
import {EditTodoForm} from './EditTodoForm';
import {v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
uuidv4();

export const TodoWapper = () => {

    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState("all"); // Filter state

    const addTodo = todo => {
      setTodos([...todos, {id: uuidv4(), task: todo,
         completed: false, isEditing: false}])  
       
        console.log(todos) 
    }

    const toggleComplete = id => {
        setTodos(todos.map(todo => todo.id === id ? {...
        todo, completed: !todo.completed} : todo))
    }

    //delete function - removing the todo equaly with the id we passed
    const deleteTodo = id => {
        setTodos(todos.filter(todo => todo.id !==id))
    }

    //edit function
    const editTodo = id => {
        setTodos(todos.map(todo => todo.id === id ? {... todo, isEditing: !todo.isEditing} : todo))
    }

    const editTask = (task, id) => {
        setTodos(todos.map(todo => todo.id === id ? {... todo, task, isEditing: !todo.isEditing} : todo))
    }

    // Handle filter changes
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // Filter the todos based on the selected filter
    const filteredTodos = todos.filter((todo) => {
         if (filter === "completed") return todo.completed;
         if (filter === "incomplete") return !todo.completed;
        return true; // "all"
    });

    return (
        <div className="TodoWrapper">
          <h1>let's!</h1>
          <p>helping you to achieve your goals</p>
          <TodoForm addTodo={addTodo} />

            {/* Dropdown to filter todos */}
            <select onChange={handleFilterChange} value={filter}>
                 <option value="all">All</option>
                 <option value="completed">Done</option>
                 <option value="incomplete">To do</option>
             </select>

          {/* display todos */}
          {filteredTodos.map((todo) =>
            todo.isEditing ? (
              <EditTodoForm editTodo={editTask} task={todo} />
            ) : (
              <Todo
                key={todo.id}
                task={todo}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                toggleComplete={toggleComplete}
              />
            )
          )}
        </div>
      );
};