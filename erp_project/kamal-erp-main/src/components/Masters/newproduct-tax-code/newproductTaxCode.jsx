import React, { useState, useEffect } from "react";
import "./newproductTaxCode.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function NewProductTaxCode({
  newproduct_tax_code,
  setnewproduct_tax_code,
  newproduct_edit_tax_code,
  setnewproduct_edit_tax_code,
  editDropDown, // Expected to be passed as [{id, name}, ...] or array of strings
}) {
  const [TaxCodeData, setTaxCodeData] = useState({
    tax_name: "",
    tax_percentage: "",
    description: "",
  });
  const [taxCodes, setTaxCodes] = useState([]); // Store fetched tax codes

  // Fetch tax codes on component mount
  useEffect(() => {
    const fetchTaxCodes = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          return;
        }
        const res = await axios.get("http://127.0.0.1:8000/api/tax-codes/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setTaxCodes(res.data.tax_codes); // Backend returns { tax_codes: [{id, name, percentage, description}, ...], ... }
      } catch (error) {
        toast.error("Failed to fetch tax codes: " + (error.response?.data?.error || error.message));
      }
    };
    fetchTaxCodes();
  }, []);

  //prefill the edit form
  useEffect(() => {
  if (newproduct_edit_tax_code && TaxCodeData.tax_name && taxCodes.length > 0) {
    const selected = taxCodes.find((tax) => tax.name === TaxCodeData.tax_name);
    if (selected) {
      setTaxCodeData({
        tax_name: selected.name,
        tax_percentage: selected.percentage?.toString() || "",
        description: selected.description || "",
      });
    }
  }
}, [newproduct_edit_tax_code, TaxCodeData.tax_name, taxCodes]);

  const handleTaxDataChange = (e) => {
    setTaxCodeData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleTaxDataSubmit = async (e) => {
    e.preventDefault();

    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      if (newproduct_tax_code) {
        // ADD NEW TAX CODE
        const res = await axios.post(
          "http://127.0.0.1:8000/api/tax-codes/",
          {
            name: TaxCodeData.tax_name,
            percentage: parseFloat(TaxCodeData.tax_percentage),
            description: TaxCodeData.description || null,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Tax code created successfully!");
        setTaxCodes([...taxCodes, res.data]); // Update local tax codes
        setTimeout(() => {
          setnewproduct_tax_code(false);
          setnewproduct_edit_tax_code(false);
        }, 3000);
      } else {
        // EDIT EXISTING TAX CODE
        const selectedTaxCode = taxCodes.find(
          (item) => item.name === TaxCodeData.tax_name
        );

        if (!selectedTaxCode) {
          toast.error("Please select a valid tax code to update.");
          return;
        }

        const res = await axios.put(
          `http://127.0.0.1:8000/api/tax-codes/${selectedTaxCode.id}/`,
          {
            name: TaxCodeData.tax_name,
            percentage: parseFloat(TaxCodeData.tax_percentage),
            description: TaxCodeData.description || null,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Tax code updated successfully!");
        setTaxCodes(
          taxCodes.map((tax) =>
            tax.id === selectedTaxCode.id ? res.data : tax
          )
        ); // Update local tax codes
        setTimeout(() => {
          setnewproduct_tax_code(false);
          setnewproduct_edit_tax_code(false);
        }, 3000);
      }

      // Reset form
      setTaxCodeData({
        tax_name: "",
        tax_percentage: "",
        description: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(
        newproduct_tax_code
          ? "Failed to create tax code: " + errorMsg
          : "Failed to update tax code: " + errorMsg
      );
    }
  };

  const handleDeleteTaxCode = async () => {
    if (!newproduct_edit_tax_code) return;

    const selectedTaxCode = taxCodes.find(
      (item) => item.name === TaxCodeData.tax_name
    );

    if (!selectedTaxCode) {
      toast.error("Please select a valid tax code to delete.");
      return;
    }

    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/tax-codes/${selectedTaxCode.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Tax code deleted successfully!");
      setTaxCodes(taxCodes.filter((tax) => tax.id !== selectedTaxCode.id));
      setTaxCodeData({
        tax_name: "",
        tax_percentage: "",
        description: "",
      });
      setTimeout(() => {
        setnewproduct_edit_tax_code(false);
        setnewproduct_tax_code(false);
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error("Failed to delete tax code: " + errorMsg);
    }
  };

  return (
    <>
      <div className="tax-code-cointainer">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="tax-code-head">
          <div className="tax-code-headleft">
            <svg
              onClick={() => {
                setnewproduct_tax_code(false);
                setnewproduct_edit_tax_code(false);
                toast.dismiss(); // Clear toasts on cancel
              }}
              className="left-logo-tax-code"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
            <p>{newproduct_edit_tax_code ? "Edit" : "Add New"}Tax Code</p>
          </div>
          <div className="tax-code-headright">
            {newproduct_edit_tax_code && (
              <div
                className="add-tax-code-1"
                onClick={() => {
                  setnewproduct_tax_code(true);
                  setnewproduct_edit_tax_code(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                + Add Tax Code
              </div>
            )}
            {newproduct_tax_code && (
              <div
                className="add-tax-code-2"
                onClick={() => {
                  setnewproduct_edit_tax_code(true);
                  setnewproduct_tax_code(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                Edit Tax Code
              </div>
            )}
          </div>
        </div>
        <div className="tax-code-form">
          <form onSubmit={handleTaxDataSubmit}>
            {newproduct_tax_code ? (
              <div className="tax-code-box">
                <label htmlFor="tax_name">Tax Name</label>
                <input
                  type="text"
                  value={TaxCodeData.tax_name}
                  onChange={handleTaxDataChange}
                  id="tax_name"
                  placeholder="e.g., GST"
                  required
                />
              </div>
            ) : (
              <div className="tax-code-box">
                <label htmlFor="tax_name">Tax Name</label>
                <select
                  id="tax_name"
                  value={TaxCodeData.tax_name}
                  onChange={handleTaxDataChange}
                  required
                >
                  <option value="">Select Option</option>
                  {taxCodes.map((ele, ind) => (
                    <option key={ind} value={typeof ele === 'object' ? ele.name : ele}>
                      {typeof ele === 'object' ? ele.name : ele}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="tax-code-box">
              <label htmlFor="tax_percentage">Tax Percentage {"(%)"}</label>
              <input
                className="increment-decrement-tax-code"
                type="number"
                value={TaxCodeData.tax_percentage}
                onChange={handleTaxDataChange}
                id="tax_percentage"
                placeholder="e.g., 18"
                required
              />
            </div>
            <div className="tax-code-box">
              <label htmlFor="description">Description {"(optional)"}</label>
              <input
                type="text"
                value={TaxCodeData.description}
                onChange={handleTaxDataChange}
                id="description"
                placeholder="Text Area"
              />
            </div>
            <div className="tax-code-submit-container">
              <nav
                onClick={() => {
                  setnewproduct_tax_code(false);
                  setnewproduct_edit_tax_code(false);
                  toast.dismiss(); // Clear toasts on cancel
                }}
              >
                Canael
              </nav>
              <button type="submit">{newproduct_edit_tax_code ? "Update" : "Create"}</button>
              {newproduct_edit_tax_code && (
                <div className="remove-tax-code" onClick={handleDeleteTaxCode}>
                  Remove
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
