import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Todo = ({ todos, completeTodo, removeTodo, updateTodo }) => {
  // State to track the todo being edited
  const [edit, setEdit] = useState({
    id: null,
    value: ''
  });

  // Function to handle the submission of an updated todo
  const submitUpdate = value => {
    updateTodo(edit.id, value); // Call the updateTodo function from the parent component to update the todo
    setEdit({ id: null, value: '' }); // Reset the edit state after updating the todo
  };

  // If there is a todo being edited, render the TodoForm for updating the todo
  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return (
    <>
      {/* Render each todo item */}
      {todos.map((todo, index) => (
        <div
          className={todo.completed ? 'todo-row complete' : 'todo-row'}
          key={index}
        >
          <div className='todo-checkbox'>
            {/* Checkbox to mark the todo as completed */}
            <input
              type='checkbox'
              id={`todo-checkbox-${todo.id}`}
              checked={todo.completed}
              onChange={() => completeTodo(todo.id)} // Call the completeTodo function from the parent component to toggle the todo's completion status
            />
            <label htmlFor={`todo-checkbox-${todo.id}`}></label>
          </div>
          <div
            className='todo-text'
          >
            {todo.title}
          </div>
          <div className='icons'>
            {/* Edit icon: Clicking on the edit icon sets the todo to edit mode */}
            <TiEdit
              onClick={() => setEdit({ id: todo.id, value: todo.title })}
              className='edit-icon'
            />
            {/* Delete icon: Clicking on the delete icon removes the todo */}
            <RiCloseCircleLine
              onClick={() => removeTodo(todo.id)} // Call the removeTodo function from the parent component to remove the todo
              className='delete-icon'
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Todo;
