// import React, { useState, useEffect } from "react";
// import "./newproductWarehouse.css";

// export default function warehouse({
//   newproductWarehouse,
//   setnewproductWarehouse,
//   editnewproductWarehouse,
//   setEditnewproductWarehouse,
//   editDropDown,
// }) {
//   const [warehouseData, setwarehouseData] = useState({
//     warehouse_name: "",
//     location: "",
//     manager_name: "",
//     contact_info: "",
//     notes: "",
//   });
//   const handleWarehouseDataChange = (e) => {
//     setwarehouseData((prev) => {
//       return { ...prev, [e.target.id]: e.target.value };
//     });
//   };

//   function handleWarehousedataSubmit(e) {
//     e.preventDefault();
//     setwarehouseData({
//       warehouse_name: "",
//       location: "",
//       manager_name: "",
//       contact_info: "",
//       notes: "",
//     });
//     console.log(warehouseData);
//     setnewproductWarehouse(false);
//     setEditnewproductWarehouse(false);
//   }
//   return (
//     <>
//       <div className="warehouse-container">
//         <div className="warehouse-head">
//           <div className="warehouse-headleft">
//             <svg
//               onClick={() => {
//                 setnewproductWarehouse(false);
//                 setEditnewproductWarehouse(false);
//               }}
//               className="left-logo-warehouse"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 320 512"
//             >
//               <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
//             </svg>
//             <p>{editnewproductWarehouse ? "Edit" : "Add New"} Warehouse</p>
//           </div>
//           <div className="warehouse-headright">
//             {editnewproductWarehouse && (
//               <div
//                 className="add-warehouse-1"
//                 onClick={() => {
//                   setnewproductWarehouse(true);
//                   setEditnewproductWarehouse(false);
//                 }}
//               >
//                 + Add New
//               </div>
//             )}
//             {newproductWarehouse && (
//               <div
//                 className="add-warehouse-2"
//                 onClick={() => {
//                   setEditnewproductWarehouse(true);
//                   setnewproductWarehouse(false);
//                 }}
//               >
//                 Edit Existing
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="warehouse-form">
//           <form onSubmit={handleWarehousedataSubmit}>
//             {newproductWarehouse ? (
//               <div className="warehouse-box">
//                 <label htmlFor="warehouse_name">Warehouse Name</label>
//                 <input
//                   type="text"
//                   value={warehouseData.warehouse_name}
//                   onChange={handleWarehouseDataChange}
//                   id="warehouse_name"
//                   placeholder="e.g., Main Warehouse"
//                   required
//                 />
//               </div>
//             ) : (
//               <div className="warehouse-box">
//                 <label htmlFor="warehouse_name">Select Warehouse</label>
//                 <select
//                   id="warehouse_name"
//                   value={warehouseData.warehouse_name}
//                   onChange={handleWarehouseDataChange}
//                   required
//                 >
//                   <option value="">Select Option</option>
//                   {editDropDown.map((ele, ind) => (
//                     <option key={ind} value={ele}>
//                       {ele}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             <div className="warehouse-box">
//               <label htmlFor="location">Location</label>
//               <input
//                 type="text"
//                 value={warehouseData.location}
//                 onChange={handleWarehouseDataChange}
//                 id="location"
//                 placeholder="e.g., ABC Industry, TN"
//                 required
//               />
//             </div>
//             <div className="warehouse-box">
//               <label htmlFor="manager_name">Manager Name{"(optional)"}</label>
//               <input
//                 type="text"
//                 value={warehouseData.manager_name}
//                 onChange={handleWarehouseDataChange}
//                 id="manager_name"
//                 placeholder="e.g., Ram"
//               />
//             </div>
//             <div className="warehouse-box">
//               <label htmlFor="contact_info">Contact Info{"(optional)"}</label>
//               <input
//                 type="text"
//                 value={warehouseData.contact_info}
//                 onChange={handleWarehouseDataChange}
//                 id="contact_info"
//                 placeholder="Phone/Email"
//               />
//             </div>
//             <div className="warehouse-box">
//               <label htmlFor="notes">Notes {"(optional)"}</label>
//               <input
//                 type="text"
//                 value={warehouseData.notes}
//                 onChange={handleWarehouseDataChange}
//                 id="notes"
//                 placeholder="Text Area"
//               />
//             </div>
//             <div className="warehouse-submit-container">
//               <nav
//                 onClick={() => {
//                   setnewproductWarehouse(false);
//                   setEditnewproductWarehouse(false);
//                 }}
//               >
//                 Canael
//               </nav>
//               <button type="submit">Create</button>
//               {editnewproductWarehouse && <div>Remove</div>}
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import "./newproductWarehouse.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function NewProductWarehouse({
  newproductWarehouse,
  setnewproductWarehouse,
  editnewproductWarehouse,
  setEditnewproductWarehouse,
  editDropDown, // Expected to be passed as [{id, name}, ...] or array of strings
}) {
  const [WarehouseData, setWarehouseData] = useState({
    warehouse_name: "",
    location: "",
    manager_name: "",
    contact_info: "",
    notes: "",
  });
  const [warehouses, setWarehouses] = useState([]); // Store fetched warehouses

  // Fetch warehouses on component mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          return;
        }
        const res = await axios.get("http://127.0.0.1:8000/api/warehouses/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setWarehouses(res.data.warehouses); // Backend returns { warehouses: [{id, name, location, manager_name, contact_info, notes}, ...], ... }
      } catch (error) {
        toast.error("Failed to fetch warehouses: " + (error.response?.data?.error || error.message));
      }
    };
    fetchWarehouses();
  }, []);

  useEffect(() => {
  if (editnewproductWarehouse && WarehouseData.warehouse_name) {
    const selected = warehouses.find(
      (w) => w.name === WarehouseData.warehouse_name
    );
    if (selected) {
      setWarehouseData({
        warehouse_name: selected.name,
        location: selected.location || "",
        manager_name: selected.manager_name || "",
        contact_info: selected.contact_info || "",
        notes: selected.notes || "",
      });
    }
  }
}, [WarehouseData.warehouse_name, editnewproductWarehouse, warehouses]);


  const handleWarehouseDataChange = (e) => {
    setWarehouseData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleWarehouseDataSubmit = async (e) => {
    e.preventDefault();

    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      if (newproductWarehouse) {
        // ADD NEW WAREHOUSE
        const res = await axios.post(
          "http://127.0.0.1:8000/api/warehouses/",
          {
            name: WarehouseData.warehouse_name,
            location: WarehouseData.location,
            manager_name: WarehouseData.manager_name || null,
            contact_info: WarehouseData.contact_info || null,
            notes: WarehouseData.notes || null,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Warehouse created successfully!");
        setWarehouses([...warehouses, res.data]); // Update local warehouses
        setTimeout(() => {
          setnewproductWarehouse(false);
          setEditnewproductWarehouse(false);
        }, 3000);
      } else {
        // EDIT EXISTING WAREHOUSE
        const selectedWarehouse = warehouses.find(
          (item) => item.name === WarehouseData.warehouse_name
        );

        if (!selectedWarehouse) {
          toast.error("Please select a valid warehouse to update.");
          return;
        }

        const res = await axios.put(
          `http://127.0.0.1:8000/api/warehouses/${selectedWarehouse.id}/`,
          {
            name: WarehouseData.warehouse_name,
            location: WarehouseData.location,
            manager_name: WarehouseData.manager_name || null,
            contact_info: WarehouseData.contact_info || null,
            notes: WarehouseData.notes || null,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Warehouse updated successfully!");
        setWarehouses(
          warehouses.map((warehouse) =>
            warehouse.id === selectedWarehouse.id ? res.data : warehouse
          )
        ); // Update local warehouses
        setTimeout(() => {
          setnewproductWarehouse(false);
          setEditnewproductWarehouse(false);
        }, 3000);
      }

      // Reset form
      setWarehouseData({
        warehouse_name: "",
        location: "",
        manager_name: "",
        contact_info: "",
        notes: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(
        newproductWarehouse
          ? "Failed to create warehouse: " + errorMsg
          : "Failed to update warehouse: " + errorMsg
      );
    }
  };

  const handleDeleteWarehouse = async () => {
    if (!editnewproductWarehouse) return;

    const selectedWarehouse = warehouses.find(
      (item) => item.name === WarehouseData.warehouse_name
    );

    if (!selectedWarehouse) {
      toast.error("Please select a valid warehouse to delete.");
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

      await axios.delete(`http://127.0.0.1:8000/api/warehouses/${selectedWarehouse.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Warehouse deleted successfully!");
      setWarehouses(warehouses.filter((warehouse) => warehouse.id !== selectedWarehouse.id));
      setWarehouseData({
        warehouse_name: "",
        location: "",
        manager_name: "",
        contact_info: "",
        notes: "",
      });
      setTimeout(() => {
        setEditnewproductWarehouse(false);
        setnewproductWarehouse(false);
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error("Failed to delete warehouse: " + errorMsg);
    }
  };

  return (
    <>
      <div className="warehouse-container">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="warehouse-head">
          <div className="warehouse-headleft">
            <svg
              onClick={() => {
                setnewproductWarehouse(false);
                setEditnewproductWarehouse(false);
                toast.dismiss(); // Clear toasts on cancel
              }}
              className="left-logo-warehouse"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
            <p>{editnewproductWarehouse ? "Edit" : "Add New"} Warehouse</p>
          </div>
          <div className="warehouse-headright">
            {editnewproductWarehouse && (
              <div
                className="add-warehouse-1"
                onClick={() => {
                  setnewproductWarehouse(true);
                  setEditnewproductWarehouse(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                + Add New
              </div>
            )}
            {newproductWarehouse && (
              <div
                className="add-warehouse-2"
                onClick={() => {
                  setEditnewproductWarehouse(true);
                  setnewproductWarehouse(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                Edit Existing
              </div>
            )}
          </div>
        </div>
        <div className="warehouse-form">
          <form onSubmit={handleWarehouseDataSubmit}>
            {newproductWarehouse ? (
              <div className="warehouse-box">
                <label htmlFor="warehouse_name">Warehouse Name</label>
                <input
                  type="text"
                  value={WarehouseData.warehouse_name}
                  onChange={handleWarehouseDataChange}
                  id="warehouse_name"
                  placeholder="e.g., Main Warehouse"
                  required
                />
              </div>
            ) : (
              <div className="warehouse-box">
                <label htmlFor="warehouse_name">Select Warehouse</label>
                <select
                  id="warehouse_name"
                  value={WarehouseData.warehouse_name}
                  onChange={handleWarehouseDataChange}
                  required
                >
                  <option value="">Select Option</option>
                  {warehouses.map((ele, ind) => (
                    <option key={ind} value={typeof ele === 'object' ? ele.name : ele}>
                      {typeof ele === 'object' ? ele.name : ele}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="warehouse-box">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                value={WarehouseData.location}
                onChange={handleWarehouseDataChange}
                id="location"
                placeholder="e.g., ABC Industry, TN"
                required
              />
            </div>
            <div className="warehouse-box">
              <label htmlFor="manager_name">Manager Name (optional)</label>
              <input
                type="text"
                value={WarehouseData.manager_name}
                onChange={handleWarehouseDataChange}
                id="manager_name"
                placeholder="e.g., Ram"
              />
            </div>
            <div className="warehouse-box">
              <label htmlFor="contact_info">Contact Info (optional)</label>
              <input
                type="text"
                value={WarehouseData.contact_info}
                onChange={handleWarehouseDataChange}
                id="contact_info"
                placeholder="Phone/Email"
              />
            </div>
            <div className="warehouse-box">
              <label htmlFor="notes">Notes (optional)</label>
              <input
                type="text"
                value={WarehouseData.notes}
                onChange={handleWarehouseDataChange}
                id="notes"
                placeholder="Text Area"
              />
            </div>
            <div className="warehouse-submit-container">
              <nav
                onClick={() => {
                  setnewproductWarehouse(false);
                  setEditnewproductWarehouse(false);
                  toast.dismiss(); // Clear toasts on cancel
                }}
              >
                Cancel
              </nav>
              <button type="submit">{editnewproductWarehouse ? "Update" : "Create"}</button>
              {editnewproductWarehouse && (
                <div className="remove-warehouse" onClick={handleDeleteWarehouse}>
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