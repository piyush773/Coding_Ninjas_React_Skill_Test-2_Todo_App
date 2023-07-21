import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoForm from './TodoForm';
import Todo from './Todo';
import Spinner from './ReactSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

function TodoList() {
  // State variables
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch todos from the API on component mounting
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch todos from the API
  const fetchTodos = () => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        return response.json();
      })
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(error => {
        alert('An error occurred: ' + error.message);
        setLoading(false);
      });
  };


  // Add a new todo to the list
  const addTodo = async todo => {
    // Validate the todo text
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }
    const newTodo = {
      title: todo.text,
      completed: false
    };

    try {
      // Send a POST request to the API to add the new todo
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      });
      const data = await response.json();

      // Update the todos state with the new todo and show a success toast
      setTodos(prevTodos => [data, ...prevTodos]);
      toast.success('Todo added successfully');
    } catch (error) {
      console.log(error);
    }
  };

  // Update an existing todo
  const updateTodo = async (todoId, newValue) => {
    // Validate the updated todo text
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }
    const updatedTodo = {
      title: newValue.text,
      completed: newValue.isComplete
    };

    try {
       // Send a PUT request to the API to update the todo
      await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
      });

      // Update the todos state with the updated todo and show an info toast
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? { ...todo, ...updatedTodo } : todo))
      );
      toast.info('Todo updated successfully');
    } catch (error) {
      console.log(error);
    }
  };

  // Remove a todo from the list
  const removeTodo = async id => {
    try {
      // Send a DELETE request to the API to remove the todo
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE'
      });
      // Update the todos state by filtering out the removed todo and show an error toast
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      toast.error('Todo removed successfully');
    } catch (error) {
      console.log(error);
    }
  };

  // Mark a todo as completed or incomplete
  const completeTodo = async id => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed
    };

    try {
       // Send a PUT request to the API to update the completion status
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
      });

       // Update the todos state with the updated completion status
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo))
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Filter the todos based on the selected filter option
  const filterTodos = () => {
    switch (filter) {
      case 'Complete':
        return todos.filter(todo => todo.completed);
      case 'Incomplete':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  };

  // Handle filter option change
  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  // Handle filter option change
  const clearAllTodos = () => {
    setTodos([]);
    toast.warning('All todos cleared');
  };

  return (
    <>
      <h1 className='h1-heading'>What's the Plan for Today?</h1>
      <ToastContainer position="top-right" />
      <TodoForm onSubmit={addTodo} />
      <div className="filter-container">
        <select id="filter" value={filter} onChange={handleFilterChange} className="filter-select">
          <option value="All">All</option>
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
        </select>
        <button onClick={clearAllTodos} className="clear-all-button">
          Clear All
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className='todoList-Container'>
        <Todo
          todos={filterTodos()}
          completeTodo={completeTodo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />
        </div>
      )}
    </>
  );
}

export default TodoList;
