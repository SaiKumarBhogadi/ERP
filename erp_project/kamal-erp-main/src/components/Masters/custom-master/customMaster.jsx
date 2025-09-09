import React, { useState, useEffect } from "react";
import "./customMaster.css";
import { toast } from "react-toastify";
import axios from "axios";
import CreateNewCustomer from "../create-new-customer/createNewCustomer";
import CustomImport from "../custom-Import/customImport";
import CustomDuplicates from "../custom-merge-duplicates/customDuplicates";

export default function CustomMaster() {
  const [selectStatus, setSelectStatus] = useState("");
  const [selectCustomer, setSelectCustomer] = useState("");
  const [selectSales, setSelectSales] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Added for search input
  const [apiCustomMaster, setApiCustomMaster] = useState([]);
  const [searchSalesRep, setSearchSalesRep] = useState([]);
  const [customCurrentPage, setCustomCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Added for loading state
  const customRowsPerPage = 10;

  // Add/edit customer states
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [editShowAddCustom, setEditShowAddCustom] = useState(false);
  const [editAddCustomData, setEditAddCustomData] = useState({});

  // Import and merge states
  const [showCustomImport, setShowCustomImport] = useState(false);
  const [showCustomDuplicates, setShowCustomDuplicates] = useState(false);

  // Fetch customer data from API
  useEffect(() => {
    const fetchCustomers = async () => {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/customers/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            page: customCurrentPage,
            per_page: customRowsPerPage,
            status: selectStatus || undefined,
            customer_type: selectCustomer || undefined,
            assigned_sales_rep: selectSales || undefined,
            search: searchQuery || undefined,
          },
        });

        const { customers, total_pages } = response.data;
        if (!Array.isArray(customers)) {
          throw new Error("API response 'customers' field is not an array");
        }

        // Map API data to match table structure
        const formattedData = customers.map((customer) => ({
          id: customer.id,
          customer_id: customer.customer_id,
          first_name: customer.first_name,
          company_name: customer.company_name || "N/A",
          customer_type: customer.customer_type,
          email: customer.email,
          status: customer.status,
          credit_limit: customer.credit_limit.toString(),
          city: customer.city,
        }));

        setApiCustomMaster(formattedData);
        setTotalPages(total_pages || 1);
      } catch (error) {
        console.error("Error fetching customers:", error);
        const errorMessage = error.response?.data?.error || error.message;
        toast.error(`Failed to load customers: ${errorMessage}`);
        setApiCustomMaster([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [customCurrentPage, selectStatus, selectCustomer, selectSales, searchQuery]);

  // Fetch sales representatives from CustomerSummaryView
  useEffect(() => {
    const fetchSalesReps = async () => {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/customers/summary/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        const salesReps = response.data.sales_reps || [];
        setSearchSalesRep(salesReps.map((rep) => rep.name));
      } catch (error) {
        console.error("Error fetching sales reps:", error);
        toast.error("Failed to load sales representatives");
      }
    };

    fetchSalesReps();
  }, []);

  // Pagination
  const currentData = apiCustomMaster;

  const handleNext = () => {
    if (customCurrentPage < totalPages) {
      setCustomCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrev = () => {
    if (customCurrentPage > 1) {
      setCustomCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    const okDel = window.confirm("Are you sure you want to delete this customer?");
    if (!okDel) return;

    const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const authState = JSON.parse(persistedAuth.auth || "{}");
    const token = authState?.user?.token;

    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/customers/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setApiCustomMaster((prev) => prev.filter((customer) => customer.id !== id));
      toast.success("Customer deleted!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
    }
  };

  // Edit customer
  const showEditCustomer = async (id) => {
    const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const authState = JSON.parse(persistedAuth.auth || "{}");
    const token = authState?.user?.token;

    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/customers/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setEditAddCustomData(response.data);
      setEditShowAddCustom(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast.error("Failed to load customer details");
    }
  };

  // Reset search filters
  const resetSearchBox = () => {
    setSelectCustomer("");
    setSelectSales("");
    setSelectStatus("");
    setSearchQuery("");
    setCustomCurrentPage(1);
  };

  return (
    <>
      {showAddCustomer ? (
        <CreateNewCustomer
          setShowAddCustomer={setShowAddCustomer}
          editShowAddCustom={editShowAddCustom}
          editAddCustomData={editAddCustomData}
          setEditAddCustomData={setEditAddCustomData}
          setApiCustomMaster={setApiCustomMaster}
        />
      ) : editShowAddCustom ? (
        <CreateNewCustomer
          setShowAddCustomer={setEditShowAddCustom}
          editShowAddCustom={editShowAddCustom}
          editAddCustomData={editAddCustomData}
          setEditAddCustomData={setEditAddCustomData}
          setApiCustomMaster={setApiCustomMaster}
        />
      ) : showCustomImport ? (
        <CustomImport
          setShowCustomImport={setShowCustomImport}
          setApiCustomMaster={setApiCustomMaster}
        />
      ) : showCustomDuplicates ? (
        <CustomDuplicates
        setShowCustomDuplicates={setShowCustomDuplicates}
        customMaster={apiCustomMaster}
        setApiCustomMaster={setApiCustomMaster} // Added prop
      />
      ) : (
        <div className="customMaster-container">
          <div className="customMaster-header">
            <p>Customer Master</p>
            <nav>
              <button onClick={() => setShowAddCustomer(true)}>+ Add New Customer</button>
              <button onClick={() => setShowCustomImport(true)}>Import</button>
              <button onClick={() => setShowCustomDuplicates(true)}>Merge Duplicates</button>
            </nav>
          </div>
          <div className="customMaster-search-box">
            <label htmlFor="searchByID">
              <svg
                className="customMaster-search-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </label>
            <input
              id="searchByID"
              placeholder="Search by Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="customMaster-clearfilter">
            <p onClick={resetSearchBox}>Clear Filter</p>
          </div>
          <div className="customMaster-search-category">
            <div className="customMaster-input-box">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={selectStatus}
                onChange={(e) => setSelectStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="customMaster-input-box">
              <label htmlFor="customer_type">Customer Type</label>
              <select
                id="customer_type"
                value={selectCustomer}
                onChange={(e) => setSelectCustomer(e.target.value)}
              >
                <option value="">All</option>
                <option value="Business">Business</option>
                <option value="Individual">Individual</option>
                <option value="Organization">Organization</option>
              </select>
            </div>
            <div className="customMaster-input-box">
              <label htmlFor="sales_rep">Sales Rep</label>
              <select
                id="sales_rep"
                value={selectSales}
                onChange={(e) => setSelectSales(e.target.value)}
              >
                <option value="">All</option>
                {searchSalesRep.map((ele, ind) => (
                  <option key={ind} value={ele}>{ele}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="customMaster-table-cointainer">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <table>
                <thead className="customMaster-thead">
                  <tr>
                    <th id="custom_tData_width_id">Customer ID</th>
                    <th>Name</th>
                    <th>Company</th>
                    <th id="custom_tData_width_type">Customer Type</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th id="custom_tData_width_limit">Credit Limit</th>
                    <th>City</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="customMaster-tbody">
                  {currentData.length > 0 ? (
                    currentData.map((ele) => (
                      <tr key={ele.id}>
                        <td id="custom_tData_width_id">{ele.customer_id}</td>
                        <td>{ele.first_name}</td>
                        <td>{ele.company_name}</td>
                        <td id="custom_tData_width_type">{ele.customer_type}</td>
                        <td>{ele.email}</td>
                        <td>
                          <div
                            className={
                              ele.status === "Active"
                                ? "customMaster-Status-active"
                                : "customMaster-Status-inactive"
                            }
                          >
                            {ele.status}
                          </div>
                        </td>
                        <td id="custom_tData_width_limit">{ele.credit_limit}</td>
                        <td>{ele.city}</td>
                        <td className="customMaster-action-cointainer">
                          <svg
                            onClick={() => showEditCustomer(ele.id)}
                            className="edit-customMaster-logo"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                          </svg>
                          <svg
                            onClick={() => deleteCustomer(ele.id)}
                            className="delete-customMaster-logo"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                          </svg>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No Data Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <nav className="customMaster-table-bottem">
            <p className="customMaster-num-entries">Showing {currentData.length} entries</p>
            <div className="customMaster-manage-control-box">
              <button
                className="customMaster-manage-btn"
                onClick={handlePrev}
                disabled={customCurrentPage === 1 || isLoading}
              >
                Prev
              </button>
              <nav className="customMaster-num-page">
                Page {customCurrentPage} of {totalPages}
              </nav>
              <button
                className="customMaster-manage-btn"
                onClick={handleNext}
                disabled={customCurrentPage === totalPages || isLoading}
              >
                Next
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}