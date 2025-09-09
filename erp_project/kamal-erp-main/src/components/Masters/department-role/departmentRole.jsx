import React, { useState, useEffect } from "react";
import "./departmentRole.css";
import CreateDepartmentRole from "../create-department-role/createDepartmentRole";
import CreateNewRole from "../create-newrole/createNewRole";
import { toast } from "react-toastify";

export default function DepartmentRole() {
  const [departmentTableData, setDepartmentTableData] = useState([]);
  const [departmentCurrentPage, setDepartmentCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const departmentRowsPerPage = 5;

  const [showNewRole, setShowNewRole] = useState(false);
  const [editRoleOnly, setEditRoleOnly] = useState(false);
  const [editRole, setEditRole] = useState({});

  const [showDepartmentRole, setShowDepartmentRole] = useState(false);
  const [editDepartmentRole, setEditDepartmentRole] = useState(false);
  const [editDept, setEditDept] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async (page = 1) => {
  try {
    const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const authState = JSON.parse(persistedAuth.auth || "{}");
    const token = authState?.user?.token;

    const response = await fetch(`http://127.0.0.1:8000/api/departments/?page=${page}`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Non-OK response text:", errorText);
      throw new Error("Unauthorized or failed");
    }

    if (!contentType || !contentType.includes("application/json")) {
      const rawText = await response.text();
      console.error("Expected JSON, got:", rawText);
      throw new Error("Invalid response format");
    }

    const data = await response.json();
    console.log("Fetched department data:", data);

    if (!Array.isArray(data.departments)) {
      throw new Error("Invalid department data format");
    }

    setDepartmentTableData(data.departments);
    setTotalPages(data.total_pages);
    setDepartmentCurrentPage(data.current_page);
  } catch (error) {
    toast.error("Failed to fetch departments");
    console.error("Fetch error:", error.message);
    setLoading(false);
  }
};

// 👇 Now this works
useEffect(() => {
  fetchDepartments();
}, []);

  const currentData = departmentTableData || [];

  const handleNext = () => {
  if (departmentCurrentPage < totalPages) {
    const nextPage = departmentCurrentPage + 1;
    setDepartmentCurrentPage(nextPage);
    fetchDepartments(nextPage);
  }
};

const handlePrev = () => {
  if (departmentCurrentPage > 1) {
    const prevPage = departmentCurrentPage - 1;
    setDepartmentCurrentPage(prevPage);
    fetchDepartments(prevPage);
  }
};

  const showEditDepartmentRole = (code) => {
    const departmentToEdit = departmentTableData.find((ele) => ele.code === code);
    if (departmentToEdit) {
      setEditDept(departmentToEdit);
      setEditDepartmentRole(true);
      setShowDepartmentRole(false);
    }
  };

  const handleCloseModal = () => {
    setEditDepartmentRole(false);
    setShowDepartmentRole(false);
    setEditDept({});
  };

  const deleteTask = async (id) => {
    const okDel = window.confirm("Are you sure you want to delete this department?");
    if (!okDel) return;

    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;

      const response = await fetch(`http://127.0.0.1:8000/api/departments/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        setDepartmentTableData(prev => prev.filter(dept => dept.id !== id));
        toast.success("Department deleted successfully");
      } else {
        throw new Error("Failed to delete department");
      }
    } catch (error) {
      toast.error("Error deleting department");
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      {showNewRole ? (
        <div className="createNewRole-btn">
          <CreateNewRole
            editRoleOnly={editRoleOnly}
            setShowNewRole={setShowNewRole}
            editRole={editRole}
            setEditRole={setEditRole}
            setEditRoleOnly={setEditRoleOnly}
          />
        </div>
      ) : (
        <>
          {(showDepartmentRole || editDepartmentRole) && (
            <div className="create-department-role-btn">
              <CreateDepartmentRole
                setEditRole={setEditRole}
                setEditRoleOnly={setEditRoleOnly}
                editDept={editDept}
                editDepartmentRole={editDepartmentRole}
                setEditDept={setEditDept}
                setShowDepartmentRole={setShowDepartmentRole}
                setEditDepartmentRole={setEditDepartmentRole}
                setShowNewRole={setShowNewRole}
                setDepartmentTableData={setDepartmentTableData}
                onClose={handleCloseModal}
              />
            </div>
          )}
          <div
            className={`department-role-container ${(showDepartmentRole || editDepartmentRole) && "blur-department"
              }`}
          >
            <p>Department & Roles</p>
            <div className="department-header">
              <p className="department-headleft">
                Efficiently manage and organize Department & Roles with easy.
              </p>
              <div className="department-headright">
                <div className="department-search-cointainer">
                  <input id="department-focus" placeholder="Search users" />
                  <label htmlFor="department-focus">
                    <svg
                      className="search-logo-department"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                  </label>
                </div>
                <button onClick={() => {
                  setShowDepartmentRole(true);
                  setEditDepartmentRole(false);
                  setEditDept({});
                }}>
                  + Create New
                </button>
              </div>
            </div>
            <div className="department-table-container">
              <table>
                <thead className="department-thead">
                  <tr>
                    <th>Code</th>
                    <th>Department Name</th>
                    <th id="department-width-description">Description</th>
                    <th id="department-width-action">Action</th>
                  </tr>
                </thead>
                <tbody className="department-tbody">
                  {currentData.length > 0 ? (
                    currentData.map((ele, ind) => (
                      <tr key={ind}>
                        <td>{ele.code}</td>
                        <td>{ele.department_name}</td>
                        <td id="department-width-description">
                          {ele.description}
                        </td>
                        <td id="department-width-action">
                          <svg
                            className="dot-logo-department"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 128 512"
                          >
                            <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                          </svg>
                          <nav className="department-dot-container">
                            <div
                              onClick={() => {
                                showEditDepartmentRole(ele.code);
                              }}
                            >
                              Edit
                            </div>
                            <div
                              onClick={() => {
                                deleteTask(ele.id);
                              }}
                            >
                              Delete
                            </div>
                          </nav>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <nav className="table-bottem-department">
              <p className="num-entries-department">
                Showing {currentData.length} entries
              </p>
              <div className="department-control-box">
                <button
                  className="department-btn"
                  onClick={handlePrev}
                  disabled={departmentCurrentPage === 1}
                >
                  Prev
                </button>
                <nav className="num-page-department">
                  Page {departmentCurrentPage} of {totalPages}
                </nav>
                <button
                  className="department-btn"
                  onClick={handleNext}
                  disabled={departmentCurrentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}