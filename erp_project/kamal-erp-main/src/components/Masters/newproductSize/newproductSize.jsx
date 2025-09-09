import React, { useState, useEffect } from "react";
import "./newproductSize.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function NewProductSize({
  newproductSize,
  setnewproductSize,
  editnewproductSize,
  setEditnewproductSize,
  editDropDown, // Expected to be passed as [{id, name}, ...] or array of strings
}) {
  const [SizeData, setSizeData] = useState({
    size_name: "",
    update_size_name: "",
  });
  const [sizes, setSizes] = useState([]); // Store fetched sizes

  // Fetch sizes on component mount
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          return;
        }
        const res = await axios.get("http://127.0.0.1:8000/api/sizes/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setSizes(res.data.sizes); // Backend returns { sizes: [{id, name}, ...], ... }
      } catch (error) {
        toast.error("Failed to fetch sizes: " + (error.response?.data?.error || error.message));
      }
    };
    fetchSizes();
  }, []);

  const handleSizeDataChange = (e) => {
    setSizeData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSizeDataSubmit = async (e) => {
    e.preventDefault();

    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      if (newproductSize) {
        // ADD NEW SIZE
        const res = await axios.post(
          "http://127.0.0.1:8000/api/sizes/",
          { name: SizeData.size_name },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Size created successfully!");
        setSizes([...sizes, res.data]); // Update local sizes
        setTimeout(() => {
          setnewproductSize(false);
          setEditnewproductSize(false);
        }, 3000);
      } else {
        // EDIT EXISTING SIZE
        const selectedSize = sizes.find(
          (item) => item.name === SizeData.size_name
        );

        if (!selectedSize) {
          toast.error("Please select a valid size to update.");
          return;
        }

        const res = await axios.put(
          `http://127.0.0.1:8000/api/sizes/${selectedSize.id}/`,
          { name: SizeData.update_size_name },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Size updated successfully!");
        setSizes(
          sizes.map((size) =>
            size.id === selectedSize.id ? res.data : size
          )
        ); // Update local sizes
        setTimeout(() => {
          setnewproductSize(false);
          setEditnewproductSize(false);
        }, 3000);
      }

      // Reset form
      setSizeData({
        size_name: "",
        update_size_name: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(
        newproductSize
          ? "Failed to create size: " + errorMsg
          : "Failed to update size: " + errorMsg
      );
    }
  };

  const handleDeleteSize = async () => {
    if (!editnewproductSize) return;

    const selectedSize = sizes.find(
      (item) => item.name === SizeData.size_name
    );

    if (!selectedSize) {
      toast.error("Please select a valid size to delete.");
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

      await axios.delete(`http://127.0.0.1:8000/api/sizes/${selectedSize.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Size deleted successfully!");
      setSizes(sizes.filter((size) => size.id !== selectedSize.id));
      setSizeData({
        size_name: "",
        update_size_name: "",
      });
      setTimeout(() => {
        setEditnewproductSize(false);
        setnewproductSize(false);
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error("Failed to delete size: " + errorMsg);
    }
  };

  return (
    <>
      <div className="size-container">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="size-head">
          <div className="size-headleft">
            <svg
              onClick={() => {
                setnewproductSize(false);
                setEditnewproductSize(false);
                toast.dismiss(); // Clear toasts on cancel
              }}
              className="left-logo-size"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
            <p>{editnewproductSize ? "Edit" : "Add New"} Size</p>
          </div>
          <div className="size-headright">
            {editnewproductSize && (
              <div
                className="add-size-1"
                onClick={() => {
                  setnewproductSize(true);
                  setEditnewproductSize(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                + Add New
              </div>
            )}
            {newproductSize && (
              <div
                className="add-size-2"
                onClick={() => {
                  setEditnewproductSize(true);
                  setnewproductSize(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                Edit Existing
              </div>
            )}
          </div>
        </div>
        <div className="size-form">
          <form onSubmit={handleSizeDataSubmit}>
            {newproductSize ? (
              <div className="size-box">
                <label htmlFor="size_name">Size Name</label>
                <input
                  type="text"
                  value={SizeData.size_name}
                  onChange={handleSizeDataChange}
                  id="size_name"
                  placeholder="Small"
                  required
                />
              </div>
            ) : (
              <>
                <div className="size-box">
                  <label htmlFor="size_name">Select Size</label>
                  <select
                    id="size_name"
                    value={SizeData.size_name}
                    onChange={handleSizeDataChange}
                    required
                  >
                    <option value="">Select Option</option>
                    {sizes.map((ele, ind) => (
                      <option key={ind} value={typeof ele === 'object' ? ele.name : ele}>
                        {typeof ele === 'object' ? ele.name : ele}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="size-box">
                  <label htmlFor="update_size_name">Update Size Name</label>
                  <input
                    type="text"
                    value={SizeData.update_size_name}
                    onChange={handleSizeDataChange}
                    id="update_size_name"
                    placeholder="Medium"
                    required
                  />
                </div>
              </>
            )}
            <div className="size-submit-container">
              <nav
                onClick={() => {
                  setnewproductSize(false);
                  setEditnewproductSize(false);
                  toast.dismiss(); // Clear toasts on cancel
                }}
              >
                Cancel
              </nav>
              <button type="submit">{editnewproductSize ? "Update" : "Create"}</button>
              {editnewproductSize && (
                <div className="remove-size" onClick={handleDeleteSize}>
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