import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
  return (
    <div className="Todo">
      <FontAwesomeIcon
        className="complete-icon"
        icon={task.completed ? faCheckSquare : faSquare}
        onClick={() => toggleComplete(task.id)} // Use task.id
      />
      <p className={`${task.completed ? "completed" : "incompleted"}`}>
        {task.task} {/* Ensure this references the correct property */}
      </p>
      <div>
        <FontAwesomeIcon className="edit-icon" icon={faPenToSquare} onClick={() => editTodo(task.id)} /> {/* Use task.id */}
        <FontAwesomeIcon className="delete-icon" icon={faTrash} onClick={() => deleteTodo(task.id)} /> {/* Use task.id */}
      </div>
    </div>
  );
};
