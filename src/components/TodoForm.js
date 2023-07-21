import React, { useState, useEffect, useRef } from 'react';

function TodoForm(props) {
  // State variable to store the input value
  const [input, setInput] = useState(props.edit ? props.edit.value : '');

  // Create a reference to the input element
  const inputRef = useRef(null);

  // Focus on the input element when the component mounts or updates
  useEffect(() => {
    inputRef.current.focus();
  });

  // Handle changes in the input field
  const handleChange = event => {
    setInput(event.target.value);
  };

  // Handle changes on submit
  const handleSubmit = event => {
    event.preventDefault();

    props.onSubmit({
      text: input
    });
    setInput('');
  };


  return (
    <form onSubmit={handleSubmit} className='todo-form'>
      {props.edit ? (
        <>
          <input
            placeholder='Update your item'
            value={input}
            onChange={handleChange}
            name='text'
            ref={inputRef}
            className='todo-input edit'
          />
          <button onClick={handleSubmit} className='todo-button edit'>
            Update
          </button>
        </>
      ) : (
        <>
          <input
            placeholder='Add a todo'
            value={input}
            onChange={handleChange}
            name='text'
            className='todo-input'
            ref={inputRef}
          />
          <button onClick={handleSubmit} className='todo-button'>
            Add todo
          </button>
        </>
      )}
    </form>
  );
}

export default TodoForm;
