import React, { useState } from 'react';

export const TodoForm = ({ addTodo }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(value); // Send value to the parent
    setValue(''); // Clear the input field
  };

  return (
    <form className="TodoForm" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        value={value}
        placeholder="let's get things done!"
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="todo-btn">
        insert
      </button>
    </form>
  );
};
