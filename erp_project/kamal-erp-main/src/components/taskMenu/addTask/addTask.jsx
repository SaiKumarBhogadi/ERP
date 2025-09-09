import React, { useEffect, useState } from "react";
import "./addTask.css";
import { toast } from "react-toastify";

export default function addTask({
  setShowForm,
  formCall,
  AddNewTask,
  taskCurrentState,
  handleEditSubmit,
}) {
  const [currentForm, setCurrentForm] = useState({
    name: "",
    status: "",
    start_date: "",
    due_date: "",
    assigned_to: "",
    priority: "",
  });

  useEffect(() => {
    if (formCall === "edit" && Object.keys(taskCurrentState).length > 0) {
      console.log("here");
      setCurrentForm(taskCurrentState);
    }
  }, [taskCurrentState, formCall]);

  function handleValueChange(e) {
    setCurrentForm((prev) => {
      return {
        ...prev,
        [e.target.id]: e.target.value,
      };
    });
  }

  function handleDateChange(e) {
    setCurrentForm((prev) => {
      return {
        ...prev,
        [e.target.id]: new Date(e.target.value).toString(),
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      currentForm.name === "" ||
      currentForm.assigned_to === "" ||
      currentForm.priority === "" ||
      currentForm.status === ""
    ) {
      return toast.warn("Please Fillout All The Fields");
    }

    if (formCall === "add") {
      AddNewTask(currentForm);
    } else {
      handleEditSubmit(currentForm);
    }

    setCurrentForm({
      name: "",
      status: "",
      start_date: "",
      due_date: "",
      assigned_to: "",
      priority: "",
    });

    setShowForm(false);
  }

  return (
    <div className="addTask-container">
      <div className="addtask-layout">
        <svg
          onClick={() => {
            setCurrentForm({
              name: "",
              status: "",
              start_date: "",
              due_date: "",
              assigned_to: "",
              priority: "",
            });
            setShowForm(false);
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>

        <form className="addtask-form">
          <div>
            <nav>Name</nav>
            <input
              type="text"
              id="name"
              required
              onChange={handleValueChange}
              value={currentForm.name}
            />
          </div>
          <div>
            <nav>Status</nav>
            <select
              id="status"
              required
              onChange={handleValueChange}
              value={currentForm.status}
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Awaiting Feedback">Awaiting Feedback</option>
            </select>
          </div>

          <div>
            <nav>Start Data</nav>
            <input
              type="date"
              id="start_date"
              required
              onChange={handleDateChange}
              defaultValue={
                currentForm.start_date && currentForm.start_date !== ""
                  ? new Date(currentForm.start_date).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>
          <div>
            <nav>Due Date</nav>
            <input
              type="date"
              id="due_date"
              required
              onChange={handleDateChange}
              defaultValue={
                currentForm.due_date && currentForm.due_date !== ""
                  ? new Date(currentForm.due_date).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>
          <div>
            <nav>Assigned to</nav>
            <input
              type="text"
              id="assigned_to"
              required
              onChange={handleValueChange}
              value={currentForm.assigned_to}
            />
          </div>

          <div>
            <nav>Priority</nav>
            <select
              id="priority"
              required
              onChange={handleValueChange}
              value={currentForm.priority}
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </form>
        <div>
          <button onClick={handleSubmit} type="submit">
            {formCall === "add" ? "Submit" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}
