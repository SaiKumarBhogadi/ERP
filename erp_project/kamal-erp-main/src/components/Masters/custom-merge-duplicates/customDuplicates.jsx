import React, { useEffect, useState } from "react";
import "./customDuplicates.css";
import { toast } from "react-toastify";

import axios from "axios";

export default function CustomDuplicates({ setShowCustomDuplicates, customMaster, setApiCustomMaster }) {
  const [duplicates, setDuplicates] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [reviewData, setReviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch duplicates from API
  useEffect(() => {
    const fetchDuplicates = async () => {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/customers/duplicates/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        const duplicateGroups = response.data || [];
        setDuplicates(duplicateGroups); // Expected format: [{ primary: {...}, duplicates: [{...}, ...]}, ...]
      } catch (error) {
        console.error("Error fetching duplicates:", error);
        toast.error(`Failed to load duplicates: ${error.response?.data?.error || error.message}`);
        setDuplicates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDuplicates();
  }, []);

  // Handle row selection
  const handleRowSelect = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Handle review of conflicting fields
  const handleReview = (groupIndex) => {
    setReviewData(duplicates[groupIndex]); // Store group for review
  };

  // Handle merge action
  const handleMerge = async () => {
    if (selectedRows.length === 0) {
      toast.warn("Please select at least one duplicate group to merge.");
      return;
    }

    const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const authState = JSON.parse(persistedAuth.auth || "{}");
    const token = authState?.user?.token;

    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    setIsLoading(true);
    try {
      const mergePromises = selectedRows.map(async (groupIndex) => {
        const group = duplicates[groupIndex];
        const primaryRecord = group.primary;
        const duplicateIds = group.duplicates.map((dup) => dup.id);

        const response = await axios.post(
          "http://127.0.0.1:8000/api/customers/merge/",
          {
            primary_id: primaryRecord.id,
            duplicate_ids: duplicateIds,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        return response.data.merged_record; // Expected: merged customer record
      });

      const mergedRecords = await Promise.all(mergePromises);

      // Update customMaster by removing merged duplicates and adding merged records
      setApiCustomMaster((prev) => {
        const mergedIds = selectedRows
          .flatMap((index) => duplicates[index].duplicates.map((dup) => dup.id))
          .concat(selectedRows.map((index) => duplicates[index].primary.id));
        const filteredData = prev.filter((customer) => !mergedIds.includes(customer.id));
        return [...filteredData, ...mergedRecords];
      });

      setDuplicates((prev) => prev.filter((_, index) => !selectedRows.includes(index)));
      setSelectedRows([]);
      toast.success("Duplicates merged successfully!");
      setShowCustomDuplicates(false); // Close modal after merge
    } catch (error) {
      console.error("Error merging duplicates:", error);
      toast.error(`Failed to merge duplicates: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get matching fields between primary and duplicate record
  const getMatchingFields = (record1, record2) => {
    const fields = [];
    for (const key in record1) {
      if (record1[key] === record2[key] && key !== "id") {
        fields.push(key);
      }
    }
    return fields.length > 0 ? fields.join(", ") : "None";
  };

  // Get conflicting fields between primary and duplicate record
  const getConflictingFields = (record1, record2) => {
    const fields = [];
    for (const key in record1) {
      if (record1[key] !== record2[key] && key !== "id") {
        fields.push(key);
      }
    }
    return fields.length > 0 ? fields.join(", ") : "None";
  };

  // Render review form for resolving conflicts
  const renderReviewForm = () => {
    if (!reviewData) return null;

    const { primary, duplicates } = reviewData;
    return (
      
      <div className="customDuplicate-review-modal">
        <div className="customDuplicate-review-content">
          <h3>Review and Resolve Conflicts</h3>
          {duplicates.map((record, index) => (
            <div key={index} className="customDuplicate-review-record">
              <h4>Duplicate Record {index + 1}</h4>
              {Object.keys(primary).map(
                (key) =>
                  key !== "id" && (
                    <div key={key} className="customDuplicate-review-field">
                      <label>{key}</label>
                      <select
                        onChange={(e) => {
                          // Update primary record with selected value
                          setReviewData((prev) => ({
                            ...prev,
                            primary: { ...prev.primary, [key]: e.target.value },
                          }));
                        }}
                      >
                        <option value={primary[key]}>{primary[key]}</option>
                        <option value={record[key]}>{record[key]}</option>
                      </select>
                    </div>
                  )
              )}
            </div>
          ))}
          <div className="customDuplicate-review-actions">
            <button onClick={() => setReviewData(null)}>Cancel</button>
            <button
              onClick={() => {
                // Update duplicates with resolved primary record
                setDuplicates((prev) =>
                  prev.map((group) =>
                    group.primary.id === reviewData.primary.id
                      ? { ...group, primary: reviewData.primary }
                      : group
                  )
                );
                setReviewData(null);
                toast.success("Conflicts resolved!");
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    
    <div className="customDuplicate-container">
      <div className="customDuplicate-title">
        <p>Merge Duplicates</p>
        <nav onClick={() => setShowCustomDuplicates(false)}>
          <svg
            className="customDuplicate-circle-x-logo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
          </svg>
          <p>Close</p>
        </nav>
      </div>
      <p className="customDuplicate-table-title">Potential Duplicate List</p>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="customDuplicate-list-container">
          <table>
            <thead className="customDuplicate-table-head">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setSelectedRows(
                        e.target.checked ? duplicates.map((_, index) => index) : []
                      );
                    }}
                    checked={selectedRows.length === duplicates.length && duplicates.length > 0}
                  />
                </th>
                <th id="customDuplicate-th-td-width">Primary Record</th>
                <th id="customDuplicate-th-td-width">Duplicate Record</th>
                <th id="customDuplicate-th-td-width">Matching Fields</th>
                <th id="customDuplicate-th-td-width">Conflict Fields</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="customDuplicate-table-body">
              {duplicates.length > 0 ? (
                duplicates.map((group, groupIndex) =>
                  group.duplicates.map((record, recordIndex) => (
                    <tr key={`${groupIndex}-${recordIndex}`}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(groupIndex)}
                          onChange={() => handleRowSelect(groupIndex)}
                        />
                      </td>
                      <td id="customDuplicate-th-td-width">
                        {group.primary.first_name || group.primary.company_name || "Unnamed Record"}
                      </td>
                      <td id="customDuplicate-th-td-width">
                        {record.first_name || record.company_name || "Unnamed Record"}
                      </td>
                      <td id="customDuplicate-th-td-width">
                        {getMatchingFields(group.primary, record)}
                      </td>
                      <td id="customDuplicate-th-td-width">
                        {getConflictingFields(group.primary, record)}
                      </td>
                      <td>
                        <p
                          id="customDuplicate-review"
                          onClick={() => handleReview(groupIndex)}
                        >
                          Review
                        </p>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="6">No Duplicates Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <nav className="customDuplicate-instruction">
        <svg
          className="customDuplicate-tickbox-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
        </svg>
        <p>Matching Fields → No change needed.</p>
      </nav>
      <nav className="customDuplicate-instruction">
        <svg
          className="customDuplicate-alert-red-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
        </svg>
        <p>Conflict Fields → You must manually select the correct value by clicking "Review".</p>
      </nav>
      <nav className="customDuplicate-instruction">
        <h5>Select the customers and click "Merge Now" to combine duplicates.</h5>
      </nav>
      <div className="customDuplicate-submut-container">
        <nav onClick={() => setShowCustomDuplicates(false)}>Cancel</nav>
        <button onClick={handleMerge} disabled={selectedRows.length === 0 || isLoading}>
          {isLoading ? "Merging..." : "Merge Now"}
        </button>
      </div>
      {renderReviewForm()}
       
    </div>
  );
}