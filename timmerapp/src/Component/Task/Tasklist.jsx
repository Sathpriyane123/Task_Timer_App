import React, { useEffect, useState, useCallback } from "react";
import { Link } from 'react-router-dom';

export default function Tasklist({ tasks, onDeleteTask, onEditTask }) {
  const [remainingTimes, setRemainingTimes] = useState({});
  const [taskStatuses, setTaskStatuses] = useState({});

  // Load statuses from localStorage on component mount
  useEffect(() => {
    const storedStatuses = JSON.parse(localStorage.getItem("taskStatuses")) || {};
    setTaskStatuses(storedStatuses);
  }, []);

  // Define updateTaskStatus with useCallback
  const updateTaskStatus = useCallback((taskId, status) => {
    setTaskStatuses((prevStatuses) => {
      const updatedStatuses = { ...prevStatuses, [taskId]: status };
      localStorage.setItem("taskStatuses", JSON.stringify(updatedStatuses));
      return updatedStatuses;
    });
  }, []);

  const handleCompleteTask = useCallback((task) => {
    updateTaskStatus(task.id, "completed");
    setRemainingTimes((prev) => {
      const { [task.id]: removedTask, ...rest } = prev;
      return rest;
    });
  }, [updateTaskStatus]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedRemainingTimes = {};
      const now = new Date();

      tasks.forEach((task) => {
        const dueDate = new Date(`${now.toISOString().split('T')[0]}T${task.timeDue}:00`);
        const scheduledDate = new Date(`${now.toISOString().split('T')[0]}T${task.timeSchedule}:00`);

        if (taskStatuses[task.id] !== "completed") {
          if (now >= scheduledDate) {
            const remainingTimeInSeconds = Math.max(0, Math.floor((dueDate - now) / 1000));

            if (remainingTimeInSeconds > 0) {
              updatedRemainingTimes[task.id] = remainingTimeInSeconds;
            } else {
              updateTaskStatus(task.id, "failed");
              updatedRemainingTimes[task.id] = 0;
            }
          }
        }
      });

      setRemainingTimes((prevRemainingTimes) => {
        if (JSON.stringify(prevRemainingTimes) !== JSON.stringify(updatedRemainingTimes)) {
          return updatedRemainingTimes;
        }
        return prevRemainingTimes;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [tasks, taskStatuses, updateTaskStatus]);

  const formatRemainingTime = (seconds) => {
    if (seconds <= 0) return "Time's up!";
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Task List</h2>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <table className="min-w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Employee Name</th>
              <th className="border p-2">Task Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Scheduled Time</th>
              <th className="border p-2">Due Time</th>
              <th className="border p-2">Created Date</th>
              <th className="border p-2">Remaining Time</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const scheduledDate = new Date(`${new Date().toISOString().split('T')[0]}T${task.timeSchedule}:00`);
              const isScheduledTimeStarted = new Date() >= scheduledDate;
              const status = taskStatuses[task.id] || (isScheduledTimeStarted ? "in progress" : "to do");

              return (
                <tr key={task.id}>
                  <td className="border p-2">{task.id}</td>
                  <td className="border p-2">{task.employeeName}</td>
                  <td className="border p-2">{task.taskName}</td>
                  <td className="border p-2">{task.taskDescription}</td>
                  <td className="border p-2">{task.timeSchedule}</td>
                  <td className="border p-2">{task.timeDue}</td>
                  <td className="border p-2">{task.createdDate}</td>
                  <td className="border p-2">
                    {status === "completed" ? (
                      <span>Task Completed</span>
                    ) : isScheduledTimeStarted ? (
                      remainingTimes[task.id] !== undefined 
                        ? formatRemainingTime(remainingTimes[task.id]) 
                        : 'N/A'
                    ) : (
                      <span className="text-gray-500">To Do</span>
                    )}
                  </td>
                  <td className="border p-2">
                    {status === "completed" ? (
                      <span className="text-green-500">Completed</span>
                    ) : status === "failed" ? (
                      <span className="text-red-500">Failed</span>
                    ) : (
                      isScheduledTimeStarted && (
                        <button onClick={() => handleCompleteTask(task)} className="border p-1 text-blue-500">Complete</button>
                      )
                    )}
                  </td>
                  <td className="border p-2">
                    <Link to="/add-task">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        onClick={() => onEditTask(task)}
                      >
                        Edit
                      </button>
                    </Link>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
