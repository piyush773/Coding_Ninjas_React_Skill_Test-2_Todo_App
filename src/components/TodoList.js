import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoForm from './TodoForm';
import Todo from './Todo';
import Spinner from './ReactSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchTodos();
  }, []);

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


  const addTodo = async todo => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }
    const newTodo = {
      title: todo.text,
      completed: false
    };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      });
      const data = await response.json();

      setTodos(prevTodos => [data, ...prevTodos]);
      toast.success('Todo added successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const updateTodo = async (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }
    const updatedTodo = {
      title: newValue.text,
      completed: newValue.isComplete
    };

    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
      });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? { ...todo, ...updatedTodo } : todo))
      );
      toast.info('Todo updated successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const removeTodo = async id => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE'
      });

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      toast.error('Todo removed successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const completeTodo = async id => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed
    };

    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
      });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo))
      );
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

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
