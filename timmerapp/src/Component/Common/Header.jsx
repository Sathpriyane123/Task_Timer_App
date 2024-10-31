import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="bg-blue-600 p-4 shadow-lg">
      <h1 className="text-2xl text-white font-semibold mb-2">
        Welcome to Task Timer Application
      </h1>
      <nav className="flex space-x-4">
        <Link to="/" className="text-white hover:text-gray-200">
          List Tasks
        </Link>
        <Link to="/add-task" className="text-white hover:text-gray-200">
          Add Task
        </Link>
      </nav>
    </div>
  );
}
