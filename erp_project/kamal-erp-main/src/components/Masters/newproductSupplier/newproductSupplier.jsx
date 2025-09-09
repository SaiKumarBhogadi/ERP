// import React, { useState, useEffect } from "react";
// import "./newproductSupplier.css";

// export default function newproductSupplier({
//   newproductSupplier,
//   setnewproductSupplier,
//   editnewproductSupplier,
//   setEditnewproductSupplier,
//   editDropDown,
// }) {
//   const [supplierData, setsupplierData] = useState({
//     supplier_name: "",
//     contact_person: "",
//     phone_number: "",
//     email_adderss: "",
//     address: "",
//   });
//   const handleSupplierDataChange = (e) => {
//     setsupplierData((prev) => {
//       return { ...prev, [e.target.id]: e.target.value };
//     });
//   };

//   function handleSupplierdataSubmit(e) {
//     e.preventDefault();
//     setsupplierData({
//       supplier_name: "",
//       contact_person: "",
//       phone_number: "",
//       email_adderss: "",
//       address: "",
//     });
//     console.log(supplierData);
//     setnewproductSupplier(false);
//     setEditnewproductSupplier(false);
//   }
//   return (
//     <>
//       <div className="suppliers-container">
//         <div className="supplier-head">
//           <div className="supplier-headleft">
//             <svg
//               onClick={() => {
//                 setnewproductSupplier(false);
//                 setEditnewproductSupplier(false);
//               }}
//               className="left-logo-supplier"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 320 512"
//             >
//               <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
//             </svg>
//             <p>{editnewproductSupplier ? "Edit" : "Add New"} Supplier</p>
//           </div>
//           <div className="supplier-headright">
//             {editnewproductSupplier && (
//               <div
//                 className="add-supplier-1"
//                 onClick={() => {
//                   setnewproductSupplier(true);
//                   setEditnewproductSupplier(false);
//                 }}
//               >
//                 + Add New
//               </div>
//             )}
//             {newproductSupplier && (
//               <div
//                 className="add-supplier-2"
//                 onClick={() => {
//                   setEditnewproductSupplier(true);
//                   setnewproductSupplier(false);
//                 }}
//               >
//                 Edit Existing
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="supplier-form">
//           <form onSubmit={handleSupplierdataSubmit}>
//             {newproductSupplier ? (
//               <div className="supplier-box">
//                 <label htmlFor="supplier_name">Supplier Name</label>
//                 <input
//                   type="text"
//                   value={supplierData.supplier_name}
//                   onChange={handleSupplierDataChange}
//                   id="supplier_name"
//                   placeholder="Acme Audio Supplies Ltd."
//                   required
//                 />
//               </div>
//             ) : (
//               <div className="supplier-box">
//                 <label htmlFor="supplier_name">Select Supplier</label>
//                 <select
//                   id="supplier_name"
//                   value={supplierData.supplier_name}
//                   onChange={handleSupplierDataChange}
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

//             <div className="supplier-box">
//               <label htmlFor="contact_person">Contact Person</label>
//               <input
//                 type="text"
//                 value={supplierData.contact_person}
//                 onChange={handleSupplierDataChange}
//                 id="contact_person"
//                 placeholder="Rahul"
//                 required
//               />
//             </div>
//             <div className="supplier-box">
//               <label htmlFor="phone_number">Phone Number</label>
//               <input
//                 className="increment-decrement-supplier"
//                 type="number"
//                 value={supplierData.phone_number}
//                 onChange={handleSupplierDataChange}
//                 id="phone_number"
//                 placeholder="+91 96555 55555"
//                 required
//               />
//             </div>
//             <div className="supplier-box">
//               <label htmlFor="email_adderss">Email Adderss</label>
//               <input
//                 type="email"
//                 value={supplierData.email_adderss}
//                 onChange={handleSupplierDataChange}
//                 id="email_adderss"
//                 placeholder="rahul@gmail.com"
//                 required
//               />
//             </div>
//             <div className="supplier-box">
//               <label htmlFor="address">Adderss</label>
//               <input
//                 type="text"
//                 value={supplierData.address}
//                 onChange={handleSupplierDataChange}
//                 id="address"
//                 placeholder=" 123 Electronics Street, Mumbai"
//                 required
//               />
//             </div>
//             <div className="supplier-submit-container">
//               <nav
//                 onClick={() => {
//                   setnewproductSupplier(false);
//                   setEditnewproductSupplier(false);
//                 }}
//               >
//                 Canael
//               </nav>
//               <button type="submit">Create</button>
//               {editnewproductSupplier && <div>Remove</div>}
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import "./newproductSupplier.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function NewProductSupplier({
  newproductSupplier,
  setnewproductSupplier,
  editnewproductSupplier,
  setEditnewproductSupplier,
  editDropDown, // Expected to be passed as [{id, name}, ...] or array of strings
}) {
  const [SupplierData, setSupplierData] = useState({
    supplier_name: "",
    contact_person: "",
    phone_number: "",
    email: "",
    address: "",
  });
  const [suppliers, setSuppliers] = useState([]); // Store fetched suppliers

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          return;
        }
        const res = await axios.get("http://127.0.0.1:8000/api/suppliers/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setSuppliers(res.data.suppliers); // Backend returns { suppliers: [{id, name, contact_person, phone_number, email_address, address}, ...], ... }
      } catch (error) {
        toast.error("Failed to fetch suppliers: " + (error.response?.data?.error || error.message));
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
  if (
    editnewproductSupplier &&
    SupplierData.supplier_name &&
    suppliers.length > 0
  ) {
    const selected = suppliers.find(
      (s) => s.name === SupplierData.supplier_name
    );
    if (selected) {
      setSupplierData({
        supplier_name: selected.name,
        contact_person: selected.contact_person || "",
        phone_number: selected.phone_number || "",
        email: selected.email || selected.email_address || "",
        address: selected.address || "",
      });
    }
  }
}, [editnewproductSupplier, SupplierData.supplier_name, suppliers]);

  const handleSupplierDataChange = (e) => {
    setSupplierData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSupplierDataSubmit = async (e) => {
    e.preventDefault();

    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      if (newproductSupplier) {
        // ADD NEW SUPPLIER
        const res = await axios.post(
          "http://127.0.0.1:8000/api/suppliers/",
          {
            name: SupplierData.supplier_name,
            contact_person: SupplierData.contact_person,
            phone_number: SupplierData.phone_number,
            email: SupplierData.email,
            address: SupplierData.address,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Supplier created successfully!");
        setSuppliers([...suppliers, res.data]); // Update local suppliers
        setTimeout(() => {
          setnewproductSupplier(false);
          setEditnewproductSupplier(false);
        }, 3000);
      } else {
        // EDIT EXISTING SUPPLIER
        const selectedSupplier = suppliers.find(
          (item) => item.name === SupplierData.supplier_name
        );

        if (!selectedSupplier) {
          toast.error("Please select a valid supplier to update.");
          return;
        }

        const res = await axios.put(
          `http://127.0.0.1:8000/api/suppliers/${selectedSupplier.id}/`,
          {
            name: SupplierData.supplier_name,
            contact_person: SupplierData.contact_person,
            phone_number: SupplierData.phone_number,
            email: SupplierData.email,
            address: SupplierData.address,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Supplier updated successfully!");
        setSuppliers(
          suppliers.map((supplier) =>
            supplier.id === selectedSupplier.id ? res.data : supplier
          )
        ); // Update local suppliers
        setTimeout(() => {
          setnewproductSupplier(false);
          setEditnewproductSupplier(false);
        }, 3000);
      }

      // Reset form
      setSupplierData({
        supplier_name: "",
        contact_person: "",
        phone_number: "",
        email_address: "",
        address: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(
        newproductSupplier
          ? "Failed to create supplier: " + errorMsg
          : "Failed to update supplier: " + errorMsg
      );
    }
  };

  const handleDeleteSupplier = async () => {
    if (!editnewproductSupplier) return;

    const selectedSupplier = suppliers.find(
      (item) => item.name === SupplierData.supplier_name
    );

    if (!selectedSupplier) {
      toast.error("Please select a valid supplier to delete.");
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

      await axios.delete(`http://127.0.0.1:8000/api/suppliers/${selectedSupplier.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Supplier deleted successfully!");
      setSuppliers(suppliers.filter((supplier) => supplier.id !== selectedSupplier.id));
      setSupplierData({
        supplier_name: "",
        contact_person: "",
        phone_number: "",
        email_address: "",
        address: "",
      });
      setTimeout(() => {
        setEditnewproductSupplier(false);
        setnewproductSupplier(false);
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error("Failed to delete supplier: " + errorMsg);
    }
  };

  return (
    <>
      <div className="suppliers-container">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="supplier-head">
          <div className="supplier-headleft">
            <svg
              onClick={() => {
                setnewproductSupplier(false);
                setEditnewproductSupplier(false);
                toast.dismiss(); // Clear toasts on cancel
              }}
              className="left-logo-supplier"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
            <p>{editnewproductSupplier ? "Edit" : "Add New"} Supplier</p>
          </div>
          <div className="supplier-headright">
            {editnewproductSupplier && (
              <div
                className="add-supplier-1"
                onClick={() => {
                  setnewproductSupplier(true);
                  setEditnewproductSupplier(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                + Add New
              </div>
            )}
            {newproductSupplier && (
              <div
                className="add-supplier-2"
                onClick={() => {
                  setEditnewproductSupplier(true);
                  setnewproductSupplier(false);
                  toast.dismiss(); // Clear toasts on mode switch
                }}
              >
                Edit Existing
              </div>
            )}
          </div>
        </div>
        <div className="supplier-form">
          <form onSubmit={handleSupplierDataSubmit}>
            {newproductSupplier ? (
              <div className="supplier-box">
                <label htmlFor="supplier_name">Supplier Name</label>
                <input
                  type="text"
                  value={SupplierData.supplier_name}
                  onChange={handleSupplierDataChange}
                  id="supplier_name"
                  placeholder="Acme Audio Supplies Ltd."
                  required
                />
              </div>
            ) : (
              <div className="supplier-box">
                <label htmlFor="supplier_name">Select Supplier</label>
                <select
                  id="supplier_name"
                  value={SupplierData.supplier_name}
                  onChange={handleSupplierDataChange}
                  required
                >
                  <option value="">Select Option</option>
                  {suppliers.map((ele, ind) => (
                    <option key={ind} value={typeof ele === 'object' ? ele.name : ele}>
                      {typeof ele === 'object' ? ele.name : ele}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="supplier-box">
              <label htmlFor="contact_person">Contact Person</label>
              <input
                type="text"
                value={SupplierData.contact_person}
                onChange={handleSupplierDataChange}
                id="contact_person"
                placeholder="Rahul"
                required
              />
            </div>
            <div className="supplier-box">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                className="increment-decrement-supplier"
                type="number"
                value={SupplierData.phone_number}
                onChange={handleSupplierDataChange}
                id="phone_number"
                placeholder="+91 96555 55555"
                required
              />
            </div>
            <div className="supplier-box">
              <label htmlFor="email_address">Email Address</label>
              <input
                type="email"
                value={SupplierData.email}
                onChange={handleSupplierDataChange}
                id="email"
                placeholder="rahul@gmail.com"
                required
              />
            </div>
            <div className="supplier-box">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                value={SupplierData.address}
                onChange={handleSupplierDataChange}
                id="address"
                placeholder="123 Electronics Street, Mumbai"
                required
              />
            </div>
            <div className="supplier-submit-container">
              <nav
                onClick={() => {
                  setnewproductSupplier(false);
                  setEditnewproductSupplier(false);
                  toast.dismiss(); // Clear toasts on cancel
                }}
              >
                Cancel
              </nav>
              <button type="submit">{editnewproductSupplier ? "Update" : "Create"}</button>
              {editnewproductSupplier && (
                <div className="remove-supplier" onClick={handleDeleteSupplier}>
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