import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { EditTodoForm } from './EditTodoForm';
import { Todo } from './Todo';
import { v4 as uuidv4 } from 'uuid';
uuidv4();

export const TodoWapper = () => {
  const [todos, setTodos] = useState(() => {
    // Get the saved todos from local storage if they exist
    const savedTodos = localStorage.getItem('todos');
    console.log('Loaded todos from local storage:', savedTodos); // Debug log
    try {
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error("Error parsing saved todos:", error);
      return [];
    }
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Save todos to local storage whenever they change
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log('Saved todos to local storage:', todos); // Debug log
  }, [todos]);

  const addTodo = (todo) => {
    const newTodos = [...todos, {
      id: uuidv4(),
      task: todo,
      completed: false,
      isEditing: false,
    }];
    setTodos(newTodos);
    console.log('Added new todo:', newTodos); // Debug log
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo));
  };

  const editTask = (task, id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo));
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Ensure todos is an array before filtering
  const filteredTodos = Array.isArray(todos) ? todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    return true; // "all"
  }) : [];

  console.log('Filtered todos:', filteredTodos); // Debug log

  return (
    <div className="TodoWrapper">
      <h1>let's!</h1>
      <p>helping you to achieve your goals</p>
      <TodoForm addTodo={addTodo} />

      <select onChange={handleFilterChange} value={filter}>
        <option value="all">All</option>
        <option value="completed">Done</option>
        <option value="incomplete">To do</option>
      </select>

      {filteredTodos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm
            key={todo.id}
            editTodo={(newTask) => editTask(newTask, todo.id)}
            task={todo}
          />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={() => deleteTodo(todo.id)}
            editTodo={() => editTodo(todo.id)}
            toggleComplete={() => toggleComplete(todo.id)}
          />
        )
      )}
    </div>
  );
};
