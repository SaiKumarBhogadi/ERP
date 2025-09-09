import React, { useState, useEffect } from "react";
import "./createUser.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateUser({
  showCreateUser,
  setshowCreateUser,
  editCreateUser,
  edituser,
  setedituser,
}) {
  const navigate = useNavigate();
  const [createUserForm, setcreateUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    branch: "",
    department: "",
    role: "",
    reporting_to: "",
    available_branches: "",
    employee_id: "",
  });
  const [branchList, setBranchList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (editCreateUser && edituser && Object.keys(edituser).length > 0) {
      console.log("Pre-filling form with edituser:", edituser);
      setcreateUserForm({
        first_name: edituser.first_name || "",
        last_name: edituser.last_name || "",
        email: edituser.email || "",
        contact_number: edituser.profile?.contact_number || "",
        employee_id: edituser.profile?.employee_id || "",
        branch: edituser.profile?.branch?.id || edituser.profile?.branch || "",
        department: edituser.profile?.department?.id || edituser.profile?.department || "",
        role: edituser.profile?.role.id || edituser.profile?.role || "",
        reporting_to: edituser.profile?.reporting_to || "",
        available_branches: Array.isArray(edituser.profile?.available_branches)
          ? edituser.profile.available_branches.join(", ")
          : edituser.profile?.available_branches || "",
      });
    } else {
      setcreateUserForm({
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        branch: "",
        department: "",
        role: "",
        reporting_to: "",
        available_branches: "",
        employee_id: "",
      });
    }
  }, [edituser, editCreateUser]);

  // Fetch branches, departments, roles, and users
  useEffect(() => {
  const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
  const authState = JSON.parse(persistedAuth.auth || "{}");
  const token = authState?.user?.token;
  if (!token) {
    toast.error("No authentication token found. Please log in.");
    return;
  }
  const fetchData = async () => {
    try {
      const [branchRes, deptRes, roleRes, userRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/branches/", {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/departments/", {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get(`http://127.0.0.1:8000/api/roles/${createUserForm.department ? `?department=${createUserForm.department}` : ''}`, {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/users/", {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);
      console.log("Raw Roles API Response:", roleRes.data);
      setBranchList(branchRes.data || []);
      setDepartmentList(deptRes.data.departments || []);
      setRoleList(Array.isArray(roleRes.data) ? roleRes.data : (roleRes.data.roles || []));
      // ... rest of the code
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load dropdown data");
      setUserList([]);
    }
  };
  fetchData();
}, [createUserForm.department]);

  // Filter roles based on selected department
useEffect(() => {
  if (createUserForm.department && roleList.length > 0) {
    const deptId = Number(createUserForm.department);
    console.log("Selected department ID:", deptId);
    console.log("All role department values:", roleList.map(r => r.department?.id ?? r.department ?? r.department_id));
    console.log("Role objects for debugging:", roleList);

    const rolesForDept = roleList.filter(
      (role) =>
        (typeof role.department === "object" && role.department?.id === deptId) ||
        (typeof role.department === "number" && role.department === deptId) ||
        (role.department_id === deptId) // Fallback to department_id
    );
    console.log("Filtered roles:", rolesForDept);
    setFilteredRoles(rolesForDept);
  } else {
    setFilteredRoles([]);
  }
}, [createUserForm.department, roleList]);

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setcreateUserForm((prev) => ({ ...prev, [id]: value }));

    if (id === "department") {
      setcreateUserForm((prev) => ({ ...prev, role: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const authState = JSON.parse(persistedAuth.auth || "{}");
    const token = authState?.user?.token;

    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    const formData = {
      first_name: createUserForm.first_name,
      last_name: createUserForm.last_name || "",
      profile: {
        contact_number: createUserForm.contact_number || "",
        branch: createUserForm.branch || null,
        department: createUserForm.department || null,
        role: createUserForm.role || null,
        reporting_to: createUserForm.reporting_to || null,
        available_branches: createUserForm.available_branches
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    };

    // Only include email and employee_id for create operations
    if (!editCreateUser) {
      formData.email = createUserForm.email;
      formData.profile.employee_id = createUserForm.employee_id;
    }

    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      };

      let response;
      if (editCreateUser && edituser.id) {
        response = await axios.put(
          `http://127.0.0.1:8000/api/users/${edituser.id}/`,
          formData,
          config
        );
        toast.success("User updated successfully");
      } else {
        formData.password = "defaultPassword123"; // Replace with secure password handling
        response = await axios.post("http://127.0.0.1:8000/api/users/", formData, config);
        toast.success("User created successfully");
      }

      console.log("Response:", response.data);
      setcreateUserForm({
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        branch: "",
        department: "",
        role: "",
        reporting_to: "",
        available_branches: "",
        employee_id: "",
      });
      setedituser({});
      setshowCreateUser(false);
      navigate("/?tab=manageUsers");
    } catch (error) {
      console.error("Error saving user:", error);
      const errorMessage = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;
      toast.error(`Failed to save user: ${errorMessage}`);
    }
  };

  return (
    <div className={`createuser-container ${showCreateUser ? "block" : "hidden"}`}>
      <svg
        className="x-logo-createuser"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        onClick={() => {
          setshowCreateUser(false);
          setedituser({});
        }}
      >
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
      <div className="createuser-head">
        <p>{editCreateUser ? "Edit" : "Create New"} Branch Users</p>
      </div>
      <div className="createuser-body">
        <form onSubmit={handleSubmit}>
          <div className="createuser-content">
            <div className="createuser-box">
              <label htmlFor="first_name">
                First Name<sup>*</sup>
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="First Name"
                value={createUserForm.first_name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="createuser-box">
              <label htmlFor="last_name">
                Last Name<sup>*</sup>
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Last Name"
                value={createUserForm.last_name}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          <div className="createuser-content">
            <div className="createuser-box">
              <label htmlFor="email">
                Email<sup>*</sup>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="stackly@gmail.com"
                value={createUserForm.email}
                onChange={handleFormChange}
                required
                disabled={editCreateUser}
              />
            </div>
            <div className="createuser-box">
              <label htmlFor="contact_number">Contact Number</label>
              <input
                id="contact_number"
                name="contact_number"
                type="number"
                placeholder="9134554123"
                value={createUserForm.contact_number}
                onChange={handleFormChange}
              />
            </div>
          </div>
          <div className="createuser-content">
            <div className="createuser-box">
              <label htmlFor="branch">
                Branch<sup>*</sup>
              </label>
              <select
                id="branch"
                name="branch"
                value={createUserForm.branch}
                onChange={handleFormChange}
                className="candidate-input"
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
            <div className="createuser-box">
              <label htmlFor="department">
                Department<sup>*</sup>
              </label>
              <select
                id="department"
                name="department"
                value={createUserForm.department}
                onChange={handleFormChange}
                className="candidate-input"
                required
              >
                <option value="">Select Department</option>
                {departmentList.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="createuser-content">
            <div className="createuser-box">
              <label htmlFor="role">
                Role<sup>*</sup>
              </label>
              <select
                  id="role"
                  name="desigrolenation"
                  value={createUserForm.role}
                  onChange={handleFormChange}
                  className="candidate-input"
                  required
                >
                  <option value="">Select Designation</option>
                  {filteredRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.role}
                    </option>
                  ))}
                </select>
            </div>
            <div className="createuser-box">
              <label htmlFor="reporting_to">Reporting To</label>
              <input
                id="reporting_to"
                name="reporting_to"
                type="text"
                placeholder="9134554123"
                value={createUserForm.reporting_to}
                onChange={handleFormChange}
              />
            </div>
          </div>
          
            
          <div className="createuser-content">
            <div className="createuser-box">
              <label htmlFor="available_branches">Available Branches</label>
              <input
                id="available_branches"
                name="available_branches"
                type="text"
                placeholder="e.g., 1,2"
                value={createUserForm.available_branches}
                onChange={handleFormChange}
              />
            </div>
            <div className="createuser-box">
              <label htmlFor="employee_id">Employee ID</label>
              <input
                id="employee_id"
                name="employee_id"
                type="text"
                placeholder="Enter Employee ID"
                value={createUserForm.employee_id}
                onChange={handleFormChange}
                disabled={editCreateUser}
              />
            </div>
          </div>
          <div className="createuser-submit-container">
            <nav>
              <button
                type="button"
                onClick={() => {
                  setshowCreateUser(false);
                  setedituser({});
                }}
                className="createuser-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="createuser-save">
                Save
              </button>
            </nav>
          </div>
        </form>
      </div>
    </div>
  );
}