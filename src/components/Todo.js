import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Todo = ({ todos, completeTodo, removeTodo, updateTodo }) => {
  const [edit, setEdit] = useState({
    id: null,
    value: ''
  });

  const submitUpdate = value => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: ''
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return (
    <>
      {todos.map((todo, index) => (
        <div
          className={todo.completed ? 'todo-row complete' : 'todo-row'}
          key={index}
        >
          <div className='todo-checkbox'>
            <input
              type='checkbox'
              id={`todo-checkbox-${todo.id}`}
              checked={todo.completed}
              onChange={() => completeTodo(todo.id)}
            />
            <label htmlFor={`todo-checkbox-${todo.id}`}></label>
          </div>
          <div
            className='todo-text'
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}
          >
            {todo.title}
          </div>
          <div className='icons'>
            <TiEdit
              onClick={() => setEdit({ id: todo.id, value: todo.title })}
              className='edit-icon'
            />
            <RiCloseCircleLine
              onClick={() => removeTodo(todo.id)}
              className='delete-icon'
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Todo;