import React, { useState, useEffect, useCallback } from 'react';
import { TodoForm } from './TodoForm';
import { EditTodoForm } from './EditTodoForm';
import { Todo } from './Todo';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

console.log('API URL:', process.env.REACT_APP_API_URL);
console.log('API URL:', API_URL);

export const TodoWapper = () => {

  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  

  // Fetch todos from the API
  const fetchTodos = useCallback(async () => { 
    try { 
      const response = await axios.get(`${API_URL}/tasks`);
      setTodos(response.data);
     } catch (error) { 
      console.error("Error fetching todos:", error);
     } 
  }, [API_URL]);
  

  const addTodo = async (title) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, { title, completed: false });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };
  

  // Toggle completion of a todo via API
  const toggleComplete = async (id) => {
    try {
      const todo = todos.find((todo) => todo._id === id);
      const updatedTodo = { ...todo, completed: !todo.completed };
      await axios.put(`${API_URL}/tasks/${id}`, updatedTodo);
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

   // Delete a todo via API
   const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Edit a todo's task via API
  const editTodo = async (id, newTask) => { 
    try {
       const updatedTodo = { title: newTask, completed: false }; 
       await axios.put(`${API_URL}/tasks/${id}`, updatedTodo); 
      setTodos(todos.map((todo) => (todo._id === id ? { ...todo, title: newTask, isEditing: false } : todo)));
     } catch (error) {
       console.error("Error editing todo:", error);
      } 
  };

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

  // Fetch todos on initial render
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

    return (
        <div className="TodoWrapper">
        <h1>let's!</h1>
        <p><i>✦ your to-do list buddy. helping you to get on track ✦</i></p>
        <TodoForm addTodo={addTodo} />

        {/* Dropdown to filter todos */}
        <select onChange={handleFilterChange} value={filter}>
            <option value="all">view all</option>
            <option value="completed">complete</option>
            <option value="incomplete">pending</option>
        </select>

        {/* Display todos */}
        {filteredTodos.map((todo) =>
            todo.isEditing ? (
            <EditTodoForm
                key={todo._id}
                editTodo={(newTask) => editTodo(todo._id, newTask)}
                task={todo}
            />
            ) : (
            <Todo
                key={todo._id}
                task={todo}
                deleteTodo={() => deleteTodo(todo._id)}
                editTodo={() => setTodos(todos.map(t => t._id === todo._id ? { ...t, isEditing: true } :t))}
                toggleComplete={() => toggleComplete(todo._id)}
            />
            )
        )}
        </div>
        );
};

