
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./addNewCandidate.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddNewCandidate() {
  const navigate = useNavigate();
  const { candidateId } = useParams();
  const [file, setFile] = useState([]);
  const [error, setError] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [branchList, setBranchList] = useState([]);

  const [formData, setFormData] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    department: "",
    branch: "",
    designation: "",
    gender: "",
    joining_date: "",
    personal_number: "",
    emergency_contact_number: "",
    email: "",
    aadhar_number: "",
    pan_number: "",
    status: "",
    current_address: "",
    highest_qualification: "",
    previous_employer: "",
    total_experience_year: "",
    total_experience_month: "",
    relevant_experience_year: "",
    relevant_experience_month: "",
    marital_status: "",
    conveyance_allowance: "",
    medical_allowance: "",
    other_allowances: "",
    bonus: "",
    taxes: "",
    pf: "",
    esi: "",
    gross_salary: "",
    net_salary: "",
    uan_number: "",
    pf_number: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    asset: "",
    asset_type: "",
    laptop_company_name: "",
    asset_id: "",
  });

  // Fetch candidate data for edit mode
  useEffect(() => {
    if (candidateId) {
      const fetchCandidate = async () => {
        try {
          const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
          const authState = JSON.parse(persistedAuth.auth || "{}");
          const token = authState?.user?.token;

          if (!token) {
            setError("No token found. Please log in.");
            return;
          }

          const response = await axios.get(
            `http://127.0.0.1:8000/api/onboarding/${candidateId}/`,
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = response.data;
          const formattedData = {
            ...data,
            basics: data.basics ? putComma(data.basics) : "",
            hra: data.hra ? putComma(data.hra) : "",
            conveyance_allowance: data.conveyance_allowance ? putComma(data.conveyance_allowance) : "",
            medical_allowance: data.medical_allowance ? putComma(data.medical_allowance) : "",
            other_allowances: data.other_allowances ? putComma(data.other_allowances) : "",
            bonus: data.bonus ? putComma(data.bonus) : "",
            taxes: data.taxes ? putComma(data.taxes) : "",
            pf: data.pf ? putComma(data.pf) : "",
            esi: data.esi ? putComma(data.esi) : "",
            gross_salary: data.gross_salary ? putComma(data.gross_salary) : "",
            net_salary: data.net_salary ? putComma(data.net_salary) : "",
          };
          delete formattedData.upload_documents;
          setFormData(formattedData);

          if (data.upload_documents) {
            setFile(
              data.upload_documents.split(",").map((path) => ({
                name: path.split("/").pop(),
                path,
              }))
            );
          }
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch candidate data");
        }
      };
      fetchCandidate();
    }
  }, [candidateId]);

  const putComma = (val) => {
    if (!val) return "";
    let value = val.toString().replace(/[^0-9.]/g, "");
    value = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
    return value;
  };

  const cleanNumericValue = (val) => {
    if (!val) return "";
    return val.replace(/,/g, "");
  };

  // Fetch departments and branches
  useEffect(() => {
    const fetchDepartmentsAndBranches = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;

        if (!token) {
          toast.error("Auth token not found");
          return;
        }

        // Fetch paginated departments
        const allDepartments = [];
        let page = 1;
        let totalPages = 1;

        do {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/departments/?page=${page}`,
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data = response.data;
          allDepartments.push(...(data.departments || []));
          totalPages = data.total_pages || 1;
          page += 1;
        } while (page <= totalPages);

        // Fetch branches
        const branchResponse = await axios.get("http://127.0.0.1:8000/api/branches/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        setDepartmentList(allDepartments);
        setBranchList(branchResponse.data || []);
      } catch (error) {
        console.error("Error fetching departments or branches:", error);
        toast.error("Failed to load departments or branches");
      }
    };

    fetchDepartmentsAndBranches();
  }, []);

  // Fetch roles when department changes
  useEffect(() => {
    const fetchRoles = async () => {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      if (!formData.department) {
        setRoleList([]);
        setFilteredRoles([]);
        return;
      }

      try {
        const roleResponse = await axios.get(
          `http://127.0.0.1:8000/api/roles/?department=${formData.department}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Raw Roles API Response:", roleResponse.data);
        const roles = Array.isArray(roleResponse.data) ? roleResponse.data : (roleResponse.data.roles || []);
        setRoleList(roles);
        setFilteredRoles(roles); // Roles are already filtered by the API
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles");
        setRoleList([]);
        setFilteredRoles([]);
      }
    };

    fetchRoles();
  }, [formData.department]);

  const handleFormChange = (e) => {
    const { id, value } = e.target;

    if (
      [
        "basics",
        "hra",
        "conveyance_allowance",
        "medical_allowance",
        "other_allowances",
        "bonus",
        "taxes",
        "pf",
        "esi",
        "gross_salary",
        "net_salary",
      ].includes(id)
    ) {
      setFormData((prev) => ({ ...prev, [id]: putComma(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    if (id === "department") {
      setFormData((prev) => ({ ...prev, designation: "" }));
    }
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    console.log("Selected files:", newFiles.map((f) => f.name));
    setFile((prevFiles) => {
      const existingNames = new Set(prevFiles.map((f) => f.name));
      const uniqueNewFiles = newFiles.filter((f) => !existingNames.has(f.name));
      return [...prevFiles, ...uniqueNewFiles];
    });
    event.target.value = null;
  };

  const removeFile = (index) => {
    setFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const authState = JSON.parse(persistedAuth.auth || "{}");
    const token = authState?.user?.token;

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          const value = [
            "basics",
            "hra",
            "conveyance_allowance",
            "medical_allowance",
            "other_allowances",
            "bonus",
            "taxes",
            "pf",
            "esi",
            "gross_salary",
            "net_salary",
          ].includes(key)
            ? cleanNumericValue(formData[key])
            : formData[key];
          formDataToSend.append(key, value);
        }
      });

      const newFiles = file.filter((f) => f instanceof File);
      console.log("Files being uploaded:", newFiles.map(f => f.name));
      if (newFiles.length > 0) {
        newFiles.forEach((f) => {
          formDataToSend.append("upload_documents", f);
        });
      }

      for (let [key, value] of formDataToSend.entries()) {
        console.log(`FormData entry: ${key}=${typeof value === "object" ? "[File]" : value}`);
      }

      const config = {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = candidateId
        ? await axios.put(
          `http://127.0.0.1:8000/api/onboarding/${candidateId}/`,
          formDataToSend,
          config
        )
        : await axios.post(
          "http://127.0.0.1:8000/api/onboarding/",
          formDataToSend,
          config
        );

      toast.success(`Candidate ${candidateId ? "updated" : "added"} successfully!`);

      setFormData({
        employee_code: "",
        first_name: "",
        last_name: "",
        department: "",
        branch: "",
        designation: "",
        gender: "",
        joining_date: "",
        personal_number: "",
        emergency_contact_number: "",
        email: "",
        aadhar_number: "",
        pan_number: "",
        status: "",
        current_address: "",
        highest_qualification: "",
        previous_employer: "",
        total_experience_year: "",
        total_experience_month: "",
        relevant_experience_year: "",
        relevant_experience_month: "",
        marital_status: "",
        conveyance_allowance: "",
        medical_allowance: "",
        other_allowances: "",
        bonus: "",
        taxes: "",
        pf: "",
        esi: "",
        gross_salary: "",
        net_salary: "",
        uan_number: "",
        pf_number: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        asset: "",
        asset_type: "",
        laptop_company_name: "",
        asset_id: "",
      });
      setFile([]);
      navigate("/?tab=onboarding");
    } catch (err) {
      console.error("Submission error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        JSON.stringify(err.response?.data, null, 2) ||
        err.message ||
        "Failed to save candidate";
      setError(errorMessage);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
      console.error("Response headers:", err.response?.headers);
    }
  };

  return (
    <div className="Add-New-Candidate">
      <div className="addcandidate-head">
        {candidateId ? <h1>Edit Candidate</h1> : <h1>Add Candidate</h1>}
        <nav>
          <svg
            onClick={() => navigate(-1)}
            className="x-mark-logo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </nav>
      </div>
      {error && <div className="error-message"><pre>{error}</pre></div>}
      <form onSubmit={handleSubmit} className="add-candidate-form">
        <div className="general-container">
          <h2>General Details</h2>
          <nav className="general">
            <div className="general-left">
              <div className="candidate-box">
                <label htmlFor="employee_code">Employee Code</label>
                <input
                  type="text"
                  id="employee_code"
                  className="candidate-input"
                  name="employee_code"
                  value={formData.employee_code}
                  onChange={handleFormChange}
                  placeholder="Auto Generate"
                  disabled
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="candidate-input"
                  value={formData.first_name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="candidate-input"
                  value={formData.last_name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="branch">Branch</label>
                <select
                  id="branch"
                  name="branch"
                  className="candidate-input"
                  onChange={handleFormChange}
                  value={formData.branch}
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
              <div className="candidate-box">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  className="candidate-input"
                  value={formData.department || ""}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a department</option>
                  {Array.isArray(departmentList) &&
                    departmentList.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.department_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="candidate-box">
                <label htmlFor="designation">Designation</label>
                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
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
              <div className="candidate-box">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="candidate-input"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="candidate-box">
                <label htmlFor="joining_date">Joining Date</label>
                <input
                  type="date"
                  id="joining_date"
                  className="candidate-input"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="general-right">
              <div className="candidate-box">
                <label htmlFor="personal_number">Personal Number</label>
                <input
                  type="number"
                  id="personal_number"
                  className="candidate-input increment-decrement"
                  name="personal_number"
                  onChange={handleFormChange}
                  value={formData.personal_number}
                  required
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="emergency_contact_number">Emergency Contact Number</label>
                <input
                  type="number"
                  id="emergency_contact_number"
                  className="candidate-input increment-decrement"
                  name="emergency_contact_number"
                  onChange={handleFormChange}
                  value={formData.emergency_contact_number}
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="email">Personal Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  name="email"
                  className="candidate-input"
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="aadhar_number">Aadhar Number</label>
                <input
                  type="number"
                  id="aadhar_number"
                  className="candidate-input increment-decrement"
                  name="aadhar_number"
                  value={formData.aadhar_number}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="pan_number">PAN Number</label>
                <input
                  type="text"
                  id="pan_number"
                  className="candidate-input"
                  name="pan_number"
                  onChange={handleFormChange}
                  value={formData.pan_number}
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="candidate-input"
                  name="status"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="candidate-box" id="text-at-start">
                <label htmlFor="current_address">Current Address</label>
                <textarea
                  name="current_address"
                  id="current_address"
                  className="candidate-input"
                  onChange={handleFormChange}
                  value={formData.current_address}
                  required
                />
              </div>
            </div>
          </nav>
        </div>
        <div className="general-container">
          <h2>Education & Experience</h2>
          <nav className="general">
            <div className="general-left">
              <div className="candidate-box">
                <label htmlFor="highest_qualification">Highest Qualification</label>
                <input
                  type="text"
                  id="highest_qualification"
                  className="candidate-input"
                  name="highest_qualification"
                  value={formData.highest_qualification}
                  onChange={handleFormChange}
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="previous_employer">Previous Employer</label>
                <input
                  type="text"
                  id="previous_employer"
                  name="previous_employer"
                  className="candidate-input"
                  value={formData.previous_employer}
                  onChange={handleFormChange}
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="total_experience_year">Total Experience</label>
                <div className="experience-dropdowns">
                  <select
                    id="total_experience_year"
                    name="total_experience_year"
                    className="candidate-input"
                    value={formData.total_experience_year}
                    onChange={handleFormChange}
                  >
                    <option value="">Years</option>
                    {[...Array(51)].map((_, i) => (
                      <option key={i} value={i}>
                        {i} {i === 1 ? "Year" : "Years"}
                      </option>
                    ))}
                  </select>
                  <select
                    id="total_experience_month"
                    name="total_experience_month"
                    className="candidate-input"
                    value={formData.total_experience_month}
                    onChange={handleFormChange}
                  >
                    <option value="">Months</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i}>
                        {i} {i === 1 ? "Month" : "Months"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="general-right">
              <div className="candidate-box">
                <label htmlFor="relevant_experience_year">Relevant Experience</label>
                <div className="experience-dropdowns">
                  <select
                    id="relevant_experience_year"
                    name="relevant_experience_year"
                    className="candidate-input"
                    value={formData.relevant_experience_year}
                    onChange={handleFormChange}
                  >
                    <option value="">Years</option>
                    {[...Array(51)].map((_, i) => (
                      <option key={i} value={i}>
                        {i} {i === 1 ? "Year" : "Years"}
                      </option>
                    ))}
                  </select>
                  <select
                    id="relevant_experience_month"
                    name="relevant_experience_month"
                    value={formData.relevant_experience_month}
                    onChange={handleFormChange}
                    className="candidate-input"
                  >
                    <option value="">Months</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i}>
                        {i} {i === 1 ? "Month" : "Months"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="marital_status">Marital Status</label>
                <select
                  id="marital_status"
                  className="candidate-input"
                  name="marital_status"
                  onChange={handleFormChange}
                  value={formData.marital_status}
                >
                  <option value="">Select Status</option>
                  <option value="Married">Married</option>
                  <option value="Unmarried">Unmarried</option>
                </select>
              </div>
            </div>
          </nav>
        </div>
        <div className="general-container">
          <h2>Salary Details</h2>
          <nav className="general">
            <div className="general-left">
              <div className="candidate-box">
                <label htmlFor="basics">Basics</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="basics"
                    className="salary-input"
                    name="basics"
                    value={formData.basics}
                    onChange={handleFormChange}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="hra">HRA</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="hra"
                    className="salary-input"
                    name="hra"
                    value={formData.hra}
                    onChange={handleFormChange}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="conveyance_allowance">Conveyance Allowance</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="conveyance_allowance"
                    className="salary-input"
                    name="conveyance_allowance"
                    value={formData.conveyance_allowance}
                    onChange={handleFormChange}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="medical_allowance">Medical Allowance</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="medical_allowance"
                    className="salary-input"
                    name="medical_allowance"
                    value={formData.medical_allowance}
                    onChange={handleFormChange}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="other_allowances">Other Allowances</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="other_allowances"
                    className="salary-input"
                    name="other_allowances"
                    value={formData.other_allowances}
                    onChange={handleFormChange}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="bonus">Bonus</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="bonus"
                    className="salary-input"
                    name="bonus"
                    onChange={handleFormChange}
                    value={formData.bonus}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="taxes">Taxes</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="taxes"
                    className="salary-input"
                    name="taxes"
                    onChange={handleFormChange}
                    value={formData.taxes}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="pf">PF</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="pf"
                    className="salary-input"
                    name="pf"
                    onChange={handleFormChange}
                    value={formData.pf}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="general-right">
              <div className="candidate-box">
                <label htmlFor="esi">ESI</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="esi"
                    className="salary-input"
                    name="esi"
                    onChange={handleFormChange}
                    value={formData.esi}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="gross_salary">Gross Salary</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="gross_salary"
                    className="salary-input"
                    name="gross_salary"
                    value={formData.gross_salary}
                    onChange={handleFormChange}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="net_salary">Net Salary</label>
                <div className="salary-container">
                  <input
                    type="text"
                    id="net_salary"
                    className="salary-input"
                    name="net_salary"
                    value={formData.net_salary}
                    onChange={handleFormChange}
                  />
                  <span className="rupee-symbol">
                    <svg
                      className="rupees-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="candidate-box">
                <label htmlFor="uan_number">UAN Number</label>
                <input
                  type="number"
                  id="uan_number"
                  className="candidate-input increment-decrement"
                  name="uan_number"
                  value={formData.uan_number}
                  onChange={handleFormChange}
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="pf_number">PF Number</label>
                <input
                  type="number"
                  id="pf_number"
                  className="candidate-input increment-decrement"
                  name="pf_number"
                  value={formData.pf_number}
                  onChange={handleFormChange}
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="bank_name">Bank Name</label>
                <input
                  type="text"
                  id="bank_name"
                  className="candidate-input"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="account_number">Account Number</label>
                <input
                  type="number"
                  id="account_number"
                  className="candidate-input increment-decrement"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleFormChange}
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="ifsc_code">IFSC Code</label>
                <input
                  type="text"
                  id="ifsc_code"
                  className="candidate-input"
                  name="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </nav>
        </div>
        <div className="general-container">
          <h2>Other Details</h2>
          <nav className="general">
            <div className="general-left">
              <div className="candidate-box">
                <label htmlFor="asset">Asset</label>
                <select
                  id="asset"
                  name="asset"
                  value={formData.asset}
                  onChange={handleFormChange}
                  className="candidate-input"
                >
                  <option value="">Select Assets</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </div>
              <div className="candidate-box">
                <label htmlFor="asset_type">Asset Type</label>
                <select
                  id="asset_type"
                  name="asset_type"
                  className="candidate-input"
                  value={formData.asset_type}
                  onChange={handleFormChange}
                >
                  <option value="">Select Type</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
              <div className="candidate-box">
                <label htmlFor="laptop_company_name">Laptop Company Name</label>
                <select
                  id="laptop_company_name"
                  name="laptop_company_name"
                  className="candidate-input"
                  onChange={handleFormChange}
                  value={formData.laptop_company_name}
                >
                  <option value="">Laptop Name</option>
                  <option value="Dell">Dell</option>
                  <option value="HP">HP</option>
                  <option value="Lenovo">Lenovo</option>
                </select>
              </div>
            </div>
            <div className="general-right">
              <div className="candidate-box">
                <label htmlFor="asset_id">Asset Id</label>
                <input
                  type="text"
                  id="asset_id"
                  className="candidate-input"
                  name="asset_id"
                  onChange={handleFormChange}
                  value={formData.asset_id}
                />
              </div>
              <div className="candidate-box">
                <label htmlFor="upload_documents">Upload Documents</label>
                <input
                  type="file"
                  id="upload_documents"
                  className="uploadfile candidate-input"
                  name="upload_documents"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
              </div>
              {file.length > 0 && (
                <div className="file-list">
                  {file.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <button
                        className="undo"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFile(index);
                        }}
                      >
                        Undo
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="candidate-submit-container">
          <button type="submit" className="candidate-submit-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
