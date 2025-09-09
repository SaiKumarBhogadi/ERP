import React, { useState, useEffect } from "react";
import "./createDepartmentrole.css";
import { toast } from "react-toastify";
import axios from "axios";

export default function createDepartmentRole({
  setShowDepartmentRole,
  setShowNewRole,
  setEditDepartmentRole,
  editDepartmentRole,
  editDept,
  setEditRoleOnly,
  setEditDept,
  setEditRole,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const persistedAuth = JSON.parse(localStorage.getItem("persist:root"));
  const authState = JSON.parse(persistedAuth.auth || "{}");
  const token = authState?.user?.token;

  const [createDepartmentForm, setcreateDepartmentForm] = useState({
    department_name: "",
    code: "",
    branch: "",
    description: "",
  });

  const [roles, setRoles] = useState([]);
  const [branchList, setBranchList] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/branches/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        setBranchList(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
        toast.error("Failed to load branches");
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    setcreateDepartmentForm(editDept);
  }, [editDept]);

  useEffect(() => {
  if (editDept) {
    // 1. Set the department form
    setcreateDepartmentForm({
      department_name: editDept.department_name || "",
      code: editDept.code || "",
      branch: typeof editDept.branch === "object" ? editDept.branch.id : editDept.branch || "",
      description: editDept.description || "",
    });

    // 2. Fetch roles for edit mode
    if (editDept.id) {
      fetchRoles(editDept.id);
    }
  } else {
    // No editDept → fetch example roles for create mode
    fetchExampleRoles();
  }
}, [editDept]);


  const fetchRoles = async (departmentId) => {
    setRolesLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/roles/?department=${departmentId}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchExampleRoles = async () => {
    setRolesLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/roles/?page=1&per_page=3", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setRoles(response.data.roles); // or response.data if not wrapped
    } catch (error) {
      console.error("Error fetching example roles:", error);
      toast.error("Failed to load example roles");
    } finally {
      setRolesLoading(false);
    }
  };

  const handleCreateDepartmentChange = (e) => {
    const { id, value } = e.target;

    setcreateDepartmentForm((prev) => ({
      ...prev,
      [id]: id === "branch" ? parseInt(value) : value,
    }));
  };

  const deleteRole = async (roleId) => {
    const okDel = window.confirm("Are you sure you want to delete this role?");

    if (okDel) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/roles/${roleId}/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Refresh roles list
        if (editDept?.id) {
          fetchRoles(editDept.id);
        }
        toast.success("Role deleted successfully!");
      } catch (error) {
        console.error("Error deleting role:", error);
        toast.error("Failed to delete role");
      }
    }
  };

  async function handleNewDepartmentSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const config = {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      };

      const url = "http://127.0.0.1:8000/api/departments/";
      const data = createDepartmentForm;

      // Check if we're editing or creating
      const method = editDepartmentRole ? "put" : "post";

      // If editing, we might need to include the ID in the URL
      const finalUrl = editDepartmentRole && editDept.id
        ? `${url}${editDept.id}/`
        : url;

      const res = await axios[method](finalUrl, data, config);

      toast.success(
        editDepartmentRole
          ? "Department updated successfully!"
          : "Department created successfully!"
      );

      // Reset form and close modal
      setcreateDepartmentForm({
        department_name: "",
        code: "",
        branch: "",
        description: "",
      });

      setShowDepartmentRole(false);
      setEditDept({});

    } catch (err) {
      console.error("Department operation failed", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message ||
        (editDepartmentRole
          ? "Failed to update department."
          : "Failed to create department.")
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="create-department-role-container">
        <svg
          className="x-logo-create-department"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          onClick={(e) => {
            e.preventDefault();
            setEditDepartmentRole(false);
            setShowDepartmentRole(false);
            setEditDept({});
          }}
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
        <div className="create-department-head">
          <p>{editDepartmentRole ? "Edit" : "Create New"} Department & roles</p>
        </div>
        <div className="create-department-body">
          <form onSubmit={handleNewDepartmentSubmit}>
            <div className="create-department-content">
              <div className="create-department-box">
                <label htmlFor="department_name">
                  Department Name<sup>*</sup>
                </label>
                <input
                  id="department_name"
                  name="department_name"
                  type="text"
                  placeholder="Sales"
                  value={createDepartmentForm.department_name}
                  onChange={handleCreateDepartmentChange}
                  required
                />
              </div>
              <div className="create-department-box">
                <label htmlFor="code">
                  Code<sup>*</sup>
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  placeholder="Enter Code"
                  value={createDepartmentForm.code}
                  onChange={handleCreateDepartmentChange}
                  required
                />
              </div>
            </div>
            <div className="create-department-content">
              <div className="create-department-box" id="create-department-box-fullwidth">
                <label htmlFor="branch">
                  Branch<sup>*</sup>
                </label>
                <select
                  id="branch"
                  name="branch"
                  onChange={handleCreateDepartmentChange}
                  value={createDepartmentForm.branch}
                  required
                >
                  <option value="">Select a branch</option>
                  {branchList.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="create-department-content">
              <div
                className="create-department-box"
                id="create-department-box-fullwidth"
              >
                <label htmlFor="description">Description</label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Text content"
                  value={createDepartmentForm.description}
                  onChange={handleCreateDepartmentChange}
                />
              </div>
            </div>
            <div className="create-department-content">
              <div className="display-role-cointainer-title">
                <nav>
                  <p>Roles</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowNewRole(true);
                    }}
                  >
                    + Add New
                  </button>
                </nav>
              </div>
            </div>
            <div className="create-department-content">
              <div className="display-role-cointainer">
                <table>
                  <thead className="display-role-tablehead">
                    <tr>
                      <th id="display-rolename-width">Role Name</th>
                      <th id="display-description-width">Description</th>
                      <th id="display-action-width">Action</th>
                    </tr>
                  </thead>
                  <tbody className="display-role-tablebody">
                    {rolesLoading ? (
                      <tr>
                        <td colSpan="3">Loading roles...</td>
                      </tr>
                    ) : roles.length > 0 ? (
                      roles.map((role) => (
                        <tr key={role.id}>
                          <td id="display-rolename-width">{role.role}</td>
                          <td id="display-description-width">
                            {role.description || "No description"}
                          </td>
                          <td id="display-action-width">
                            <svg
                              className="dot-logo-department"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 128 512"
                            >
                              <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                            </svg>
                            <nav className="departmentrole-dot-container">
                              <div
                                onClick={() => {
                                  setEditRole(role);
                                  setEditRoleOnly(true);
                                  setShowNewRole(true);
                                }}
                              >
                                Edit
                              </div>
                              <div
                                onClick={() => {
                                  deleteRole(role.id);
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
                        <td colSpan="3">
                          {editDepartmentRole ? "No roles found for this department" : "Save department to add roles"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="create-department-submit-container">
              <nav>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditDepartmentRole(false);
                    setShowDepartmentRole(false);
                  }}
                  className="create-department-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="create-department-save">
                  Save
                </button>
              </nav>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}