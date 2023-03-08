import React, { useState } from 'react';
import { createTodo } from '../../firebase/index';
import { useUser } from './user-context';

const TodoForm = () => {
  const { user } = useUser();

  const [item, setItem] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const input = event.target.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    setItem(input);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    createTodo(item, user.uid).finally(() => {
      setSubmitting(false);
      setItem('');
    });
  };

  return (
    <div
      className={`${
        isSubmitting ? 'opacity-50' : ''
      } bg-white shadow rounded-lg w-11/12 sm:w-6/12 mx-auto my-4 z-10 transition-all duration-300 ease-in-out`}
    >
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Add a new to-do item
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Enter item name to add it to your to-do list</p>
        </div>
        <form
          className="mt-5 sm:flex sm:items-center"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="w-full sm:max-w-xs">
            <label htmlFor="todoInput" className="sr-only">
              To-do item
            </label>
            <input
              type="text"
              name="todoInput"
              id="todoInput"
              disabled={isSubmitting}
              value={item}
              placeholder="Go for a walk"
              onChange={(e) => handleChange(e)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
            } mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
