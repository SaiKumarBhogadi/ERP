// import React, { useState, useEffect } from "react";
// import "./onboard.css";
// import { Link } from "react-router-dom";
// import OnboardTableRow from "../onboardTableRow/onboardTableRow";
// import { toast } from "react-toastify";

// export default function onboard() {
//   const [candidateAPIdata, setcandidateAPIdata] = useState({});
//   const [employees, setemployees] = useState([]);
//   const [keyword, setKeyword] = useState("");

//   const candidatefromAPI = {
//     employees: [
//       {
//         _id: "i43947ruw3r874734",
//         basics: "50000",
//         hra: "20000",
//         employee_code: "STA0001",
//         first_name: "John",
//         last_name: "Doe",
//         department: "Engineering",
//         designation: "Senior Executive",
//         gender: "Male",
//         joining_date: "2023-06-01",
//         personal_number: "9876543210",
//         emergency_contact_number: "9876543200",
//         email: "john.doe@gmail.com",
//         aadhar_number: "1234-5678-9012",
//         pan_number: "ABCDE1234F",
//         status: "Active",
//         current_address: "123, ABC Street, City, State - 123456",
//         highest_qualification: "M.Tech in Computer Science",
//         previous_employer: "XYZ Tech Pvt Ltd",
//         total_experience_year: "7",
//         total_experience_month: "6",
//         relevant_experience_year: "5",
//         relevant_experience_month: "3",
//         marital_status: "Married",
//         conveyance_allowance: "5000",
//         medical_allowance: "3000",
//         other_allowances: "2000",
//         bonus: "10000",
//         taxes: "5000",
//         pf: "6000",
//         esi: "2000",
//         gross_salary: "90000",
//         net_salary: "75000",
//         uan_number: "100123456789",
//         pf_number: "PF123456789",
//         bank_name: "State Bank of India",
//         account_number: "123456789012",
//         ifsc_code: "SBIN0012345",
//         asset: "Yes",
//         asset_type: "Laptop",
//         laptop_company_name: "Dell",
//         asset_id: "LAP12345",
//         upload_documents: "resume.pdf, id_proof.jpg",
//       },
//       {
//         _id: "u29384ruwhf02384",
//         basics: "45000",
//         hra: "18000",
//         employee_code: "STA0002",
//         first_name: "Emma",
//         last_name: "Watson",
//         department: "Marketing",
//         designation: "Marketing Manager",
//         gender: "Female",
//         joining_date: "2022-08-15",
//         personal_number: "9898989898",
//         emergency_contact_number: "9898989890",
//         email: "emma.watson@example.com",
//         aadhar_number: "4321-8765-9012",
//         pan_number: "XYZE9876K",
//         status: "Active",
//         current_address: "456, DEF Street, City, State - 654321",
//         highest_qualification: "MBA in Marketing",
//         previous_employer: "ABC Corp",
//         total_experience_year: "6",
//         total_experience_month: "2",
//         relevant_experience_year: "5",
//         relevant_experience_month: "8",
//         marital_status: "Single",
//         conveyance_allowance: "4000",
//         medical_allowance: "2500",
//         other_allowances: "1500",
//         bonus: "8000",
//         taxes: "4000",
//         pf: "5000",
//         esi: "1500",
//         gross_salary: "85000",
//         net_salary: "72000",
//         uan_number: "100987654321",
//         pf_number: "PF987654321",
//         bank_name: "HDFC Bank",
//         account_number: "987654321098",
//         ifsc_code: "HDFC0001234",
//         asset: "Yes",
//         asset_type: "Phone",
//         laptop_company_name: "Apple",
//         asset_id: "IPH56789",
//         upload_documents: "resume.pdf, id_proof.png",
//       },
//       {
//         _id: "h8347tye94yrh349",
//         basics: "40000",
//         hra: "15000",
//         employee_code: "STA0003",
//         first_name: "Raj",
//         last_name: "Kumar",
//         department: "Finance",
//         designation: "Finance Analyst",
//         gender: "Male",
//         joining_date: "2021-11-10",
//         personal_number: "9765432109",
//         emergency_contact_number: "9765432100",
//         email: "raj.kumar@example.com",
//         aadhar_number: "5678-1234-9012",
//         pan_number: "LMNO5678T",
//         status: "Active",
//         current_address: "789, XYZ Street, City, State - 789456",
//         highest_qualification: "M.Com in Finance",
//         previous_employer: "Finance Solutions Ltd",
//         total_experience_year: "5",
//         total_experience_month: "3",
//         relevant_experience_year: "4",
//         relevant_experience_month: "6",
//         marital_status: "Married",
//         conveyance_allowance: "3500",
//         medical_allowance: "2000",
//         other_allowances: "1200",
//         bonus: "7000",
//         taxes: "3500",
//         pf: "4500",
//         esi: "1300",
//         gross_salary: "75000",
//         net_salary: "63000",
//         uan_number: "100456789123",
//         pf_number: "PF456789123",
//         bank_name: "ICICI Bank",
//         account_number: "456789123456",
//         ifsc_code: "ICIC0005678",
//         asset: "No",
//         asset_type: "None",
//         laptop_company_name: "None",
//         asset_id: "None",
//         upload_documents: "resume.pdf, id_proof.docx",
//       },
//       {
//         _id: "t9348rhfu3r8y439",
//         basics: "60000",
//         hra: "25000",
//         employee_code: "STA0004",
//         first_name: "Sophia",
//         last_name: "Miller",
//         department: "HR",
//         designation: "HR Manager",
//         gender: "Female",
//         joining_date: "2020-05-20",
//         personal_number: "9988776655",
//         emergency_contact_number: "9988776600",
//         email: "sophia.miller@example.com",
//         aadhar_number: "6789-3456-012",
//         pan_number: "PQRS6789M",
//         status: "Active",
//         current_address: "101, GHI Street, City, State - 101112",
//         highest_qualification: "MBA in HR",
//         previous_employer: "HR Solutions Pvt Ltd",
//         total_experience_year: "8",
//         total_experience_month: "4",
//         relevant_experience_year: "7",
//         relevant_experience_month: "9",
//         marital_status: "Married",
//         conveyance_allowance: "6000",
//         medical_allowance: "3500",
//         other_allowances: "2500",
//         bonus: "12000",
//         taxes: "6000",
//         pf: "7000",
//         esi: "2500",
//         gross_salary: "100000",
//         net_salary: "85000",
//         uan_number: "100678901234",
//         pf_number: "PF678901234",
//         bank_name: "Axis Bank",
//         account_number: "678901234567",
//         ifsc_code: "AXIS0006789",
//         asset: "Yes",
//         asset_type: "Laptop",
//         laptop_company_name: "HP",
//         asset_id: "LAP67890",
//         upload_documents: "resume.pdf, id_proof.jpeg",
//       },
//     ],
//   };

//   function handleDeleteCandidate(candidateId) {
//     const okDel = window.confirm(
//       `Do You Really Want to Delete the candidate ${candidateId}`
//     );

//     if (okDel) {
//       setemployees((prev) => {
//         return prev.filter((ele) => {
//           return ele._id !== candidateId;
//         });
//       });

//       toast.success("Deleted Successfully!");
//     }
//   }

//   useEffect(() => {
//     setcandidateAPIdata(candidatefromAPI);
//   }, []);

//   useEffect(() => {
//     if (Object.keys(candidateAPIdata).length > 0) {
//       setemployees(candidateAPIdata.employees);
//     }
//   }, [candidateAPIdata]);

//   useEffect(() => {
//     if (!keyword) {
//       if (Object.keys(candidateAPIdata).length > 0) {
//         setemployees(candidateAPIdata.employees);
//       }
//       return;
//     }
//     const regex = new RegExp(`^${keyword}`, "i");
//     setemployees(
//       candidateAPIdata.employees.filter((ele) => {
//         return (
//           regex.test(ele._id) ||
//           regex.test(ele.first_name) ||
//           regex.test(ele.employee_code) ||
//           regex.test(ele.department)
//         );
//       })
//     );
//   }, [keyword]);

//   return (
//     <div className="onboard">
//       <h2>Onboarding</h2>
//       <div className="onboarding-head">
//         <h3>Candidate Details</h3>
//         <div className="onboarding-header-right">
//           <div className="onboard-search-cointainer">
//             <input
//               id="onboard-logo-focus"
//               type="text"
//               placeholder="Search..."
//               onChange={(e) => {
//                 setKeyword(e.target.value);
//               }}
//             />
//             <label htmlFor="onboard-logo-focus">
//               <svg
//                 className="search-logo-onboard"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 512 512"
//               >
//                 <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//               </svg>
//             </label>
//           </div>
//           <Link to={`/add-new-candidate`} className="add-candidate-bts">
//             <div>Add Candidate</div>
//           </Link>
//         </div>
//       </div>

//       <nav className="candidate-data">
//         <table className="candidate-table">
//           <thead>
//             <tr>
//               <th id="width-edit">
//                 <svg
//                   className="list-ul-logo"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 512 512"
//                 >
//                   <path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" />
//                 </svg>
//               </th>
//               <th id="width-num">#</th>
//               <th id="width-emp-code">Employee Code</th>
//               <th>First Name</th>
//               <th>Last Name</th>
//               <th>Department</th>
//               <th>Desigination</th>
//               <th>Gender</th>
//               <th>Joining Date</th>
//               <th id="width-con-num">Personal Number</th>
//               <th id="width-eme-num">Emergancy Contact Number</th>
//               <th id="width-personal-mail">Email</th>
//               <th id="width-aathar">Aadhar Number</th>
//               <th id="width-pan">PAN Number</th>
//               <th>Status</th>
//               <th id="width-address">Current Address</th>
//               <th id="width-qualification">Highest Qualification</th>
//               <th id="width-pre-employee">Previous Employer</th>
//               <th id="width-experience">Total Experience </th>
//               <th id="width-relative-experience">Relevant Experience</th>
//               <th>Marital Status</th>
//               <th>Basics</th>
//               <th>HRA</th>
//               <th id="conveyance">Conveyance Allowance</th>
//               <th id="medical">Medical Allowance</th>
//               <th id="medical">Other Allowance</th>
//               <th>Bonus</th>
//               <th>Taxes</th>
//               <th>PF</th>
//               <th>ESI</th>
//               <th>Gross Salary</th>
//               <th>Net Salary</th>
//               <th>UAN Number</th>
//               <th>PF Number</th>
//               <th>Bank Name</th>
//               <th>Bank A/c No</th>
//               <th>IFSC Code</th>
//               <th>Asset</th>
//               <th>Asset Type</th>
//               <th id="width-lap-cmy">Laptop Company Name</th>
//               <th>Asset Id</th>
//               <th id="width-edu-doc">Education Documents</th>
//             </tr>
//           </thead>

//           <tbody>
//             {employees.length > 0 ? (
//               employees.map((ele, ind) => (
//                 <OnboardTableRow
//                   ele={ele}
//                   ind={ind}
//                   key={ind}
//                   handleDeleteCandidate={handleDeleteCandidate}
//                 />
//               ))
//             ) : (
//               <p>No Data Found</p>
//             )}
//           </tbody>
//         </table>
//       </nav>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import "./onboard.css";
import { Link, useNavigate } from "react-router-dom";
import OnboardTableRow from "../onboardTableRow/onboardTableRow";
import { toast } from "react-toastify";
import axios from "axios";

export default function Onboard() {
  const [employees, setEmployees] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // Fetch candidates from the backend API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;

        if (!token) {
          toast.error("No token found. Please log in.");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/onboarding/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Assuming the API returns a list of candidates
        setEmployees(response.data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        toast.error(err.response?.data?.error || "Failed to fetch candidate data");
      }
    };

    fetchCandidates();
  }, [navigate]);

  // Handle candidate deletion
  function handleDeleteCandidate(candidateId) {
    const okDel = window.confirm(
      `Do you really want to delete the candidate ${candidateId}?`
    );

    if (okDel) {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;

      if (!token) {
        toast.error("No token found. Please log in.");
        navigate("/login");
        return;
      }

      axios
        .delete(`http://127.0.0.1:8000/api/onboarding/${candidateId}/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          setEmployees((prev) =>
            prev.filter((ele) => ele.id !== candidateId)
          );
          toast.success("Deleted Successfully!");
        })
        .catch((err) => {
          console.error("Error deleting candidate:", err);
          const errorMessage = err.response?.data?.error || "Failed to delete candidate";
          toast.error(errorMessage);
          if (errorMessage.includes("Only super admins can delete candidates")) {
            navigate("/login"); // Redirect to login if user lacks permission
          }
        });
    }
  }

  // Filter employees based on search keyword
  useEffect(() => {
    if (!keyword) {
      // Refetch or reset to original data if needed
      return;
    }
    const regex = new RegExp(`^${keyword}`, "i");
    setEmployees((prevEmployees) =>
      prevEmployees.filter((ele) =>
        regex.test(ele.id) ||
        regex.test(ele.first_name) ||
        regex.test(ele.employee_code) ||
        regex.test(ele.department?.department_name || "")
      )
    );
  }, [keyword]);

  return (
    <div className="onboard ">
      <h2>Onboarding</h2>
      <div className="onboarding-head">
        <h3>Candidate Details</h3>
        <div className="onboarding-header-right">
          <div className="onboard-search-cointainer">
            <input
              id="onboard-logo-focus"
              type="text"
              placeholder="Search..."
              onChange={(e) => setKeyword(e.target.value)}
            />
            <label htmlFor="onboard-logo-focus">
              <svg
                className="search-logo-onboard"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </label>
          </div>
          <Link to="/add-new-candidate" className="add-candidate-bts">
            <div>Add Candidate</div>
          </Link>
        </div>
      </div>

      <nav className="candidate-data">
        <table className="candidate-table">
          <thead>
            <tr>
              <th id="width-edit">
                <svg
                  className="list-ul-logo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" />
                </svg>
              </th>
              <th id="width-num">#</th>
              <th id="width-emp-code">Employee Code</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Joining Date</th>
              <th id="width-con-num">Personal Number</th>
              <th id="width-eme-num">Emergency Contact Number</th>
              <th id="width-personal-mail">Email</th>
              <th id="width-aathar">Aadhar Number</th>
              <th id="width-pan">PAN Number</th>
              <th>Status</th>
              <th id="width-address">Current Address</th>
              <th id="width-qualification">Highest Qualification</th>
              <th id="width-pre-employee">Previous Employer</th>
              <th id="width-experience">Total Experience</th>
              <th id="width-relative-experience">Relevant Experience</th>
              <th>Marital Status</th>
              <th>Basics</th>
              <th>HRA</th>
              <th id="conveyance">Conveyance Allowance</th>
              <th id="medical">Medical Allowance</th>
              <th id="medical">Other Allowance</th>
              <th>Bonus</th>
              <th>Taxes</th>
              <th>PF</th>
              <th>ESI</th>
              <th>Gross Salary</th>
              <th>Net Salary</th>
              <th>UAN Number</th>
              <th>PF Number</th>
              <th>Bank Name</th>
              <th>Bank A/c No</th>
              <th>IFSC Code</th>
              <th>Asset</th>
              <th>Asset Type</th>
              <th id="width-lap-cmy">Laptop Company Name</th>
              <th>Asset Id</th>
              <th id="width-edu-doc">Education Documents</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((ele, ind) => (
                <OnboardTableRow
                  ele={ele}
                  ind={ind}
                  key={ele.id}
                  handleDeleteCandidate={handleDeleteCandidate}
                />
              ))
            ) : (
              <tr>
                <td colSpan="42">No Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </nav>
    </div>
  );
}