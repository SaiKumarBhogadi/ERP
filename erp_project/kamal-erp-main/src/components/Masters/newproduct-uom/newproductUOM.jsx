import React, { useState, useEffect } from "react";
import "./newproductUOM.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function NewProductUOM({
  newProductUOM,
  setnewProductUOM,
  editNewproductUOM,
  seteditNewproductUOM,
  editDropDown, // Expected to be passed as [{id, name}, ...] or array of strings
}) {
  const [UOMData, setUOMData] = useState({
    uom_name: "",
    items: "",
    description: "",
  });
  const [uoms, setUOMs] = useState([]); // Store fetched UOMs

  // Fetch UOMs on component mount
  useEffect(() => {
    const fetchUOMs = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          return;
        }
        const res = await axios.get("http://127.0.0.1:8000/api/uoms/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setUOMs(res.data.uoms); // Backend returns { uoms: [{id, name, items, description}, ...], ... }
      } catch (error) {
        toast.error("Failed to fetch UOMs: " + (error.response?.data?.error || error.message));
      }
    };
    fetchUOMs();
  }, []);

  //prefill the edit form
  useEffect(() => {
  if (editNewproductUOM && UOMData.uom_name && uoms.length > 0) {
    const selected = uoms.find((u) => u.name === UOMData.uom_name);
    if (selected) {
      setUOMData({
        uom_name: selected.name,
        items: selected.items?.toString() || "",
        description: selected.description || "",
      });
    }
  }
}, [editNewproductUOM, UOMData.uom_name, uoms]);

  const handleUOMDataChange = (e) => {
    setUOMData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleUOMDataSubmit = async (e) => {
    e.preventDefault();

    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      if (newProductUOM) {
        // ADD NEW UOM
        const res = await axios.post(
          "http://127.0.0.1:8000/api/uoms/",
          {
            name: UOMData.uom_name,
            items: parseInt(UOMData.items),
            description: UOMData.description || null,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("UOM created successfully!");
        setUOMs([...uoms, res.data]); // Update local UOMs
        setTimeout(() => {
          setnewProductUOM(false);
          seteditNewproductUOM(false);
        }, 3000);
      } else {
        // EDIT EXISTING UOM
        const selectedUOM = uoms.find(
          (item) => item.name === UOMData.uom_name
        );

        if (!selectedUOM) {
          toast.error("Please select a valid UOM to update.");
          return;
        }

        const res = await axios.put(
          `http://127.0.0.1:8000/api/uoms/${selectedUOM.id}/`,
          {
            name: UOMData.uom_name,
            items: parseInt(UOMData.items),
            description: UOMData.description || null,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("UOM updated successfully!");
        setUOMs(
          uoms.map((uom) =>
            uom.id === selectedUOM.id ? res.data : uom
          )
        ); // Update local UOMs
        setTimeout(() => {
          setnewProductUOM(false);
          seteditNewproductUOM(false);
        }, 3000);
      }

      // Reset form
      setUOMData({
        uom_name: "",
        items: "",
        description: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(
        newProductUOM
          ? "Failed to create UOM: " + errorMsg
          : "Failed to update UOM: " + errorMsg
      );
    }
  };

  const handleDeleteUOM = async () => {
    if (!editNewproductUOM) return;

    const selectedUOM = uoms.find(
      (item) => item.name === UOMData.uom_name
    );

    if (!selectedUOM) {
      toast.error("Please select a valid UOM to delete.");
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

      await axios.delete(`http://127.0.0.1:8000/api/uoms/${selectedUOM.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("UOM deleted successfully!");
      setUOMs(uoms.filter((uom) => uom.id !== selectedUOM.id));
      setUOMData({
        uom_name: "",
        items: "",
        description: "",
      });
      setTimeout(() => {
        seteditNewproductUOM(false);
        setnewProductUOM(false);
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error("Failed to delete UOM: " + errorMsg);
    }
  };
  return (
    <>
      <div className="uom-maon-container">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="uom-head">
          <div className="uom-headleft">
            <svg
              onClick={() => {
                setnewProductUOM(false);
                seteditNewproductUOM(false);
                toast.dismiss(); // Clear toasts on cancel
              }}
              className="left-logo-uom"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
            <p>{editNewproductUOM ? "Edit" : "Add New"} UOM</p>
          </div>
          <div className="uom-headright">
            {editNewproductUOM && (
              <div
                className="add-uom-1"
                onClick={() => {
                  setnewProductUOM(true);
                  seteditNewproductUOM(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                + Add UOM
              </div>
            )}
            {newProductUOM && (
              <div
                className="add-uom-2"
                onClick={() => {
                  seteditNewproductUOM(true);
                  setnewProductUOM(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                Edit UOM
              </div>
            )}
          </div>
        </div>
        <div className="uom-form">
          <form onSubmit={handleUOMDataSubmit}>
            {newProductUOM ? (
              <div className="uom-box">
                <label htmlFor="uom_name">UOM Name</label>
                <input
                  type="text"
                  value={UOMData.uom_name}
                  onChange={handleUOMDataChange}
                  id="uom_name"
                  placeholder="e.g., Box"
                  required
                />
              </div>
            ) : (
              <div className="uom-box">
                <label htmlFor="uom_name">UON Name</label>
                <select
                  id="uom_name"
                  value={UOMData.uom_name}
                  onChange={handleUOMDataChange}
                  required
                >
                  <option value="">Select Option</option>
                  {uoms.map((ele, ind) => (
                    <option key={ind} value={typeof ele === 'object' ? ele.name : ele}>
                      {typeof ele === 'object' ? ele.name : ele}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="uom-box">
              <label htmlFor="items">No.of Items</label>
              <input
                className="increment-decrement-uom"
                type="number"
                value={UOMData.items}
                onChange={handleUOMDataChange}
                id="items"
                placeholder="e.g., 10"
                required
              />
            </div>
            <div className="uom-box">
              <label htmlFor="description">Description {"(optional)"}</label>
              <input
                type="text"
                value={UOMData.description}
                onChange={handleUOMDataChange}
                id="description"
                placeholder="Text Area"
              />
            </div>
            <div className="uom-submit-container">
             <nav
                onClick={() => {
                  setnewProductUOM(false);
                  seteditNewproductUOM(false);
                  toast.dismiss(); // Clear toasts on cancel
                }}
              >
                Cancel
              </nav>
              <button type="submit">{editNewproductUOM ? "Update" : "Create"}</button>
              {editNewproductUOM && (
                <div className="remove-uom" onClick={handleDeleteUOM}>
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
