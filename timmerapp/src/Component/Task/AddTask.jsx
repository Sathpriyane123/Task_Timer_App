import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

export default function AddTask({
  onAddTask,
  onEditTask,
  editingTask,
  setEditingTask,
}) {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      employeeName: "",
      taskName: "",
      taskDescription: "",
      timeSchedule: "",
      timeDue: "",
    },
    onSubmit: (values) => {
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
        today.getMonth() + 1
      ).padStart(2, "0")}/${today.getFullYear()}`;

      // Determine the status based on the scheduled time
      const scheduledDate = new Date(
        `${today.toISOString().split("T")[0]}T${values.timeSchedule}:00`
      );
      const dueDate = new Date(
        `${today.toISOString().split("T")[0]}T${values.timeDue}:00`
      );
      let status = "To Do"; // Default status

      const now = new Date();
      if (now >= scheduledDate) {
        status = "In Progress"; // Task is in progress
      }

      const taskData = {
        ...values,
        createdDate: formattedDate,
        status,
      };

      if (editingTask) {
        // If editing a task, update it
        const updatedTask = {
          ...editingTask,
          ...taskData,
        };
        console.log("Edited Task Data:", updatedTask); // Log edited task data
        window.alert("Task has been updated successfully!");
        onEditTask(updatedTask);
      } else {
        // If adding a new task
        let taskIdCounter =
          parseInt(localStorage.getItem("taskIdCounter")) || 1;
        const newTask = {
          id: taskIdCounter,
          ...taskData,
        };
        console.log("Added Task Data:", newTask); // Log added task data
        window.alert("Task has been added successfully!");
        localStorage.setItem("taskIdCounter", taskIdCounter + 1);
        onAddTask(newTask);
      }

      formik.resetForm();
      setEditingTask(null); // Reset the editing state
      navigate(-1); // Go back to the previous page
    },
  });

  useEffect(() => {
    // Set form values only if editingTask is defined and has valid data
    if (editingTask && Object.keys(editingTask).length > 0) {
      formik.setValues({
        employeeName: editingTask.employeeName,
        taskName: editingTask.taskName,
        taskDescription: editingTask.taskDescription,
        timeSchedule: editingTask.timeSchedule,
        timeDue: editingTask.timeDue,
      });
    } else {
      // Reset the form when not editing
      formik.resetForm();
    }
  }, [editingTask]); // Only run when editingTask changes

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {editingTask ? "Edit Task" : "Add Task"}
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="employeeName"
            className="block text-sm font-medium text-gray-700"
          >
            Employee Name
          </label>
          <input
            id="employeeName"
            type="text"
            name="employeeName"
            onChange={formik.handleChange}
            value={formik.values.employeeName}
            className={`mt-1 block w-full border rounded-md p-2 ${
              formik.touched.employeeName && formik.errors.employeeName
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter employee name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="taskName"
            className="block text-sm font-medium text-gray-700"
          >
            Task Name
          </label>
          <input
            id="taskName"
            type="text"
            name="taskName"
            onChange={formik.handleChange}
            value={formik.values.taskName}
            className={`mt-1 block w-full border rounded-md p-2 ${
              formik.touched.taskName && formik.errors.taskName
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter task name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="taskDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Task Description
          </label>
          <textarea
            id="taskDescription"
            name="taskDescription"
            onChange={formik.handleChange}
            value={formik.values.taskDescription}
            className={`mt-1 block w-full border rounded-md p-2 ${
              formik.touched.taskDescription && formik.errors.taskDescription
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter task description"
            required
          />
        </div>
        <div>
          <label
            htmlFor="timeSchedule"
            className="block text-sm font-medium text-gray-700"
          >
            Scheduled Time
          </label>
          <input
            id="timeSchedule"
            type="time"
            name="timeSchedule"
            onChange={formik.handleChange}
            value={formik.values.timeSchedule}
            className={`mt-1 block w-full border rounded-md p-2 ${
              formik.touched.timeSchedule && formik.errors.timeSchedule
                ? "border-red-500"
                : "border-gray-300"
            }`}
            required
          />
        </div>
        <div>
          <label
            htmlFor="timeDue"
            className="block text-sm font-medium text-gray-700"
          >
            Due Time
          </label>
          <input
            id="timeDue"
            type="time"
            name="timeDue"
            onChange={formik.handleChange}
            value={formik.values.timeDue}
            className={`mt-1 block w-full border rounded-md p-2 ${
              formik.touched.timeDue && formik.errors.timeDue
                ? "border-red-500"
                : "border-gray-300"
            }`}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
}
