import React, {useState} from 'react'

export const EditTodoForm = ({ editTodo, task }) => { 
  const [value, setValue] = useState(task.title); // Use task.title to match backend 

  const handleSubmit = (e) => { 
    e.preventDefault();
    editTodo(value); // Pass task._id instead of task.id
 };

  return (
    <form onSubmit={handleSubmit} className="TodoForm">
    <input type="text" 
    value={value} 
    onChange={(e) => setValue(e.target.value)} 
    className="todo-input" 
    placeholder="Update task"
     />
    <button type="submit" 
    className='todo-btn'>Update Task</button>
  </form>  

  );
};