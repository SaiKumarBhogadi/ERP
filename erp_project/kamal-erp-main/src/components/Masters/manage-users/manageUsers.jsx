import React, { useState, useEffect } from "react";
import "./manageUsers.css";
import CreateUser from "../create-user-manageuser/createUser";
import { toast } from "react-toastify";
import axios from "axios";

export default function manageUsers() {
  const [manageAPIdata, setmanageAPIdata] = useState({});
  const [tableData, settableDate] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [showCreateUser, setshowCreateUser] = useState(false);
  const [editCreateUser, seteditCreateUser] = useState(false);
  const [edituser, setedituser] = useState({});

  // Fetch data from API
  useEffect(() => {
    const fetchUsers = async () => {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;
      console.log("Token:", token); // Log token for debugging

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("API Response:", response.data); // Log response to inspect structure

        // Handle different response structures
        let users = response.data;
        if (!Array.isArray(users)) {
          if (response.data.results && Array.isArray(response.data.results)) {
            users = response.data.results;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            users = response.data.data;
          } else if (response.data.users && Array.isArray(response.data.users)) {
            users = response.data.users;
          } else {
            throw new Error(
              `API response is not an array or does not contain results, data, or users: ${JSON.stringify(response.data)}`
            );
          }
        }

        // Map API data to match table structure
        const formattedData = users.map((user) => ({
          id: user.id || user.code,
          code: user.code || user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name || "",
          role: user?.profile?.role?.role || "N/A",
          profile: {
            branch: user.profile?.branch?.id || user.profile?.branch || "",
            department: user.profile?.department?.id || user.profile?.department || "",
            role: user.profile?.role?.id || user.profile?.role || "",
            reporting_to: user.profile?.reporting_to?.id || user.profile?.reporting_to || "",
            contact_number: user.profile?.contact_number || "",
            employee_id: user.profile?.employee_id || "",
            available_branches: Array.isArray(user.profile?.available_branches)
              ? user.profile.available_branches
              : user.profile?.available_branches
                ? user.profile.available_branches.split(",").map((item) => item.trim())
                : [],
          },
        }));
        setmanageAPIdata({ tableData: formattedData });
      } catch (error) {
        console.error("Error fetching users:", error);
        const errorMessage = error.response?.data?.detail || error.message;
        toast.error(`Failed to load users: ${errorMessage}`);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (Object.keys(manageAPIdata).length > 0) {
      settableDate(manageAPIdata.tableData || []);
    }
  }, [manageAPIdata]);

  // Calculate total pages
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  console.log(totalPages);

  // Get data for current page
  const currentData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Handle previous page
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Delete user
  const deleteTask = async (ind) => {
    const okDel = window.confirm("Are you sure you want to delete this task?");
    if (okDel) {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      try {
        const userId = currentData[ind].id;
        await axios.delete(`http://127.0.0.1:8000/api/users/${userId}/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        setmanageAPIdata((prev) => ({
          ...prev,
          tableData: prev.tableData.filter((_, index) => index !== ind),
        }));
        toast.success("User deleted!");
      } catch (error) {
        console.error("Error deleting user:", error);
        const errorMessage = error.response?.data?.detail || error.message;
        toast.error(`Failed to delete user: ${errorMessage}`);
      }
    }
  };

  const showEditUser = (code) => {
    const user = currentData.find((ele) => ele.code === code);
    if (user) {
      console.log("Edit User:", user); // Log for debugging
      setedituser(user);
      seteditCreateUser(true);
    } else {
      toast.error("User not found for editing");
    }
  };

  return (
    <>
      {showCreateUser && (
        <div className="createuser-btn">
          <CreateUser
            showCreateUser={showCreateUser}
            setshowCreateUser={setshowCreateUser}
            editCreateUser={editCreateUser}
            edituser={edituser}
            setedituser={setedituser}
          />
        </div>
      )}
      {editCreateUser && (
        <div className="createuser-btn">
          <CreateUser
            showCreateUser={editCreateUser}
            setshowCreateUser={seteditCreateUser}
            editCreateUser={editCreateUser}
            edituser={edituser}
            setedituser={setedituser}
          />
        </div>
      )}
      <div
        className={`manageusers-container ${(showCreateUser || editCreateUser) && "blur"
          }`}
      >
        <p>Manage Users</p>
        <div className="manage-header">
          <p className="manage-headleft">
            Efficiently manage and organize user account with ease.
          </p>
          <div className="manage-headright">
            <div className="manage-search-cointainer">
              <input id="manage-focus" placeholder="Search users" />
              <label htmlFor="manage-focus">
                <svg
                  className="search-logo-manageuser"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
              </label>
            </div>
            <button onClick={() => setshowCreateUser(true)}>
              + Create New
            </button>
          </div>
        </div>
        <div className="manage-table-container">
          <table>
            <thead className="manage-thead">
              <tr>
                <th>email</th>
                <th id="managa-width-firstname">First Name</th>
                <th id="managa-width-lastname">Last Name</th>
                <th id="managa-width-role">Role</th>
                <th id="manage-width-action">Action</th>
              </tr>
            </thead>
            <tbody className="manage-tbody">
              {currentData.length > 0 ? (
                currentData.map((ele, ind) => (
                  <tr key={ind}>
                    <td>
                      <abbr title={ele.email}>
                        {ele.email.length < 18
                          ? ele.email
                          : ele.email.slice(0, 30)}
                      </abbr>
                    </td>
                    <td id="managa-width-firstname">
                      <abbr title={ele.first_name}>
                        {ele.first_name.length < 16
                          ? ele.first_name
                          : ele.first_name.slice(0, 16) + "..."}
                      </abbr>
                    </td>
                    <td id="managa-width-lastname">
                      <abbr title={ele.last_name}>
                        {ele.last_name.length < 16
                          ? ele.last_name
                          : ele.last_name.slice(0, 16) + "..."}
                      </abbr>
                    </td>
                    <td id="managa-width-role">
                      <abbr title={String(ele.role)}>
                        {typeof ele.role === "string" && ele.role.length < 20
                          ? ele.role
                          : String(ele.role).slice(0, 16) + "..."}
                      </abbr>
                    </td>
                    <td id="manage-width-action">
                      <svg
                        className="dot-logo-manage"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 128 512"
                      >
                        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                      </svg>
                      <nav className="manageuser-dot-container">
                        <div
                          onClick={() => {
                            showEditUser(ele.code);
                          }}
                        >
                          Edit
                        </div>
                        <div
                          onClick={() => {
                            deleteTask(ind);
                          }}
                        >
                          Delete
                        </div>
                      </nav>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>No Data Found</tr>
              )}
            </tbody>
          </table>
        </div>
        <nav className="table-bottem">
          <p className="num-entries">Showing {currentData.length} entries</p>
          <div className="manage-control-box">
            <button
              className="manage-btn"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <nav className="num-page">
              {" "}
              Page {currentPage} of {totalPages}{" "}
            </nav>
            <button
              className="manage-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}