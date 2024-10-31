import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tasklist from "./Component/Task/Tasklist";
import AddTask from "./Component/Task/AddTask";
import Header from "./Component/Common/Header";
import Footer from "./Component/Common/Foooter";

function App() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [editingTask, setEditingTask] = useState(null);

  // Function to handle adding a new task
  const handleAddTask = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
  };

  // Function to handle deleting a task
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Function to handle editing a task
  const handleEditTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setEditingTask(null); // Reset the editing state
  };

  // Effect to sync tasks with local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-4">
          <Routes>
            <Route 
              path="/" 
              element={
                <Tasklist 
                  tasks={tasks} 
                  onDeleteTask={handleDeleteTask} 
                  onEditTask={setEditingTask}                />
              } 
            />
            <Route 
              path="/add-task" 
              element={
                <AddTask 
                  onAddTask={handleAddTask} 
                  onEditTask={handleEditTask} 
                  editingTask={editingTask} 
                  setEditingTask={setEditingTask} 
                />
              } 
            />
          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
