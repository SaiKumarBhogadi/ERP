import React, { useEffect, useState } from "react";
import "./task.css";
import AddTask from "../addTask/addTask";
import { toast } from "react-toastify";

export default function task() {
  const [apiData, setApiData] = useState({});
  const [taskData, setTaskData] = useState([]);
  const [taskSummary, setTaskSummary] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formCall, setFormCall] = useState("");
  const [editTaskIndex, setEditTaskIndex] = useState(null);

  const dataFromAPI = {
    taskData: [
      {
        taskId: 0,
        name: "ERC",
        status: "In Progress",
        start_date: "Sat Feb 01 2025 09:00:00 GMT+0530 (India Standard Time)",
        due_date: "Sat Feb 01 2025 09:00:00 GMT+0530 (India Standard Time)",
        assigned_to: "kamal",
        priority: "high",
      },
      {
        taskId: 1,
        name: "ESC",
        status: "In Progress",
        start_date: "Sat Feb 01 2025 09:00:00 GMT+0530 (India Standard Time)",
        due_date: "Sat Feb 01 2025 09:00:00 GMT+0530 (India Standard Time)",
        assigned_to: "kamal",
        priority: "high",
      },
    ],
    taskSummary: {
      not_started: 2,
      in_progress: 2,
      completed: 1,
      awaiting_feedback: 3,
    },
  };

  useEffect(() => {
    setApiData(dataFromAPI);
  }, []);

  useEffect(() => {
    if (Object.keys(apiData).length > 0) {
      setTaskData(apiData.taskData);
      setTaskSummary(apiData.taskSummary);
    }
  }, [apiData]);

  function AddNewTask(data) {
    apiData.taskData.push(data);
    setFormCall("");
    toast.success("Task added!");
  }

  function handleEditSubmit(data) {
    setApiData((prev) => {
      return {
        ...prev,
        taskData: prev.taskData.map((ele, ind) => {
          if (ind === editTaskIndex) {
            return { ...data };
          }

          return ele;
        }),
      };
    });

    setFormCall("");
    setEditTaskIndex(null);
  }

  function deleteTask(ind) {
    const okDel = window.confirm("Are you sure you want to delete this task?");

    if (okDel) {
      setApiData((prev) => ({
        ...prev,
        taskData: prev.taskData.filter((_, index) => index !== ind),
      }));
      toast.success("Task deleted!");
    }
  }

  return (
    <div className="taskpage">
      {showForm && (
        <AddTask
          setShowForm={setShowForm}
          formCall={formCall}
          AddNewTask={AddNewTask}
          taskCurrentState={apiData.taskData[editTaskIndex]}
          handleEditSubmit={handleEditSubmit}
        />
      )}

      <div className="task-cointainer">
        <button
          className="newtask"
          onClick={() => {
            setShowForm(true);
            setFormCall("add");
          }}
        >
          New Task
        </button>
        <div className="taskright-cointainer">
          <div className="filter-cont">
            <svg
              onClick={() => setShowFilter((prev) => !prev)}
              className="filter-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
            </svg>

            {showFilter && (
              <div className="filter-contents">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <h4>Status</h4>
                  <select id="status" name="status">
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="awaiting_feedback">Awaiting Feedback</option>
                  </select>

                  <button type="submit">Apply Filters</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bar-line"></div>
      <h2 className="task-title">Task Summary</h2>
      <div className="taskfullbox">
        <div className="task-box">
          <div className="count">{taskSummary.not_started}</div>
          <div className="box-title" id="not-started">
            Not Started
          </div>
          <div className="task-assigned">Tasks assigned to me: 0</div>
        </div>
        <div className="task-box">
          <div className="count">{taskSummary.in_progress}</div>
          <div className="box-title" id="In-Progress">
            In Progress
          </div>
          <div className="task-assigned">Tasks assigned to me: 0</div>
        </div>
        <div className="task-box">
          <div className="count">{taskSummary.completed}</div>
          <div className="box-title" id="testing">
            Completed
          </div>
          <div className="task-assigned">Tasks assigned to me: 0</div>
        </div>
        <div className="task-box">
          <div className="count">{taskSummary.awaiting_feedback}</div>
          <div className="box-title" id="Awaiting-Feedback">
            Awaiting Feedback
          </div>
          <div className="task-assigned">Tasks assigned to me: 0</div>
        </div>
      </div>
      <div className="bar-line"></div>
      <div className="list-cointainer">
        <div className="search-list-cointainer">
          <input
            className="search-listitem"
            id="list-item"
            placeholder="Search by name..."
          ></input>
          <label htmlFor="list-item">
            <svg
              className="search-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
        </div>
        <div className="num-of-task">
          <div className="title-cointainer">
            <div className="list-title" id="count-num">
              #
            </div>
            <div className="list-title" id="list-name">
              Name
            </div>
            <div className="list-title">Status</div>
            <div className="list-title">Start Date</div>
            <div className="list-title">Due Date</div>
            <div className="list-title">Assigned to</div>
            <div className="list-title">Priority</div>
          </div>
          <div className="light-barline"></div>

          {/* Data Starting */}

          {taskData.length > 0 ? (
            taskData.map((ele, ind) => (
              <div key={ind}>
                <div className="listcontent-cointainer">
                  <nav>
                    <div className="list-content" id="count-num">
                      {ind + 1}
                    </div>
                  </nav>
                  <nav>
                    <div className="list-content" id="list-name">
                      {ele.name}
                    </div>
                    <nav className="edit-cointainer">
                      <div
                        className="edit"
                        onClick={() => {
                          setFormCall("edit");
                          setEditTaskIndex(ind);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </div>
                      <div
                        className="delete"
                        onClick={() => {
                          deleteTask(ind);
                        }}
                      >
                        Delete
                      </div>
                    </nav>
                  </nav>
                  <nav>
                    <div className="list-content">{ele.status}</div>
                  </nav>
                  <nav>
                    <div className="list-content">
                      {ele.start_date !== ""
                        ? new Date(ele.start_date).toLocaleDateString()
                        : "-"}
                    </div>
                  </nav>
                  <nav>
                    <div className="list-content">
                      {ele.start_date !== ""
                        ? new Date(ele.due_date).toLocaleDateString()
                        : "-"}
                    </div>
                  </nav>
                  <nav>
                    <div className="list-content">{ele.assigned_to}</div>
                  </nav>
                  <nav>
                    <div className="list-content">{ele.priority}</div>
                  </nav>
                </div>
                <div className="light-barline"></div>
              </div>
            ))
          ) : (
            <p>No Tasks</p>
          )}
        </div>
      </div>
    </div>
  );
}
