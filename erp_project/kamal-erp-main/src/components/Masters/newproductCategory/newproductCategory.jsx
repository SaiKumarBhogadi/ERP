// import React, { useState, useEffect } from "react";
// import "./newproductCategory.css";
// import axios from "axios";

// export default function newproductCategory({
//   newproductCategory,
//   setnewproductCategory,
//   editnewproductCategory,
//   setEditnewproductCategory,
//   editDropDown,
// }) {
//   const [CategoryData, setCategoryData] = useState({
//     category_name: "",
//     update_category_name: "",
//   });
//   const handleCategoryDataChange = (e) => {
//     setCategoryData((prev) => {
//       return { ...prev, [e.target.id]: e.target.value };
//     });
//   };

//   function handleCategorydataSubmit(e) {
//     e.preventDefault();
//     setCategoryData({
//       category_name: "",
//       update_category_name: "",
//     });
//     console.log(CategoryData);
//     setnewproductCategory(false);
//     setEditnewproductCategory(false);
//   }

//   async function handleCategorydataSubmit(e) {
//   e.preventDefault();

//   try {
//     const token = localStorage.getItem("token"); // Or however you store the token

//     if (newproductCategory) {
//       // ADD NEW CATEGORY
//       const res = await axios.post(
//         "http://127.0.0.1:8000/api/categories/",
//         { name: CategoryData.category_name },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("Added:", res.data);
//     } else {
//       // EDIT EXISTING CATEGORY
//       const selectedCategory = editDropDown.find(
//         (item) => item === CategoryData.category_name
//       );

//       if (!selectedCategory) {
//         alert("Please select a valid category to update.");
//         return;
//       }

//       // Get the category ID (assume you change dropdown to {id, name})
//       const selectedId = editDropDown.find(
//         (item) => item.name === CategoryData.category_name
//       )?.id;

//       if (!selectedId) {
//         alert("Invalid category selected.");
//         return;
//       }

//       const res = await axios.put(
//         `http://127.0.0.1:8000/api/categories/${selectedId}/`,
//         { name: CategoryData.update_category_name },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("Updated:", res.data);
//     }

//     // Reset state
//     setCategoryData({
//       category_name: "",
//       update_category_name: "",
//     });
//     setnewproductCategory(false);
//     setEditnewproductCategory(false);
//   } catch (error) {
//     console.error("Category error:", error.response?.data || error.message);
//   }
// }
//   return (
//     <>
//       <div className="productCategory-container">
//         <div className="category-head">
//           <div className="category-headleft">
//             <svg
//               onClick={() => {
//                 setnewproductCategory(false);
//                 setEditnewproductCategory(false);
//               }}
//               className="left-logo-category"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 320 512"
//             >
//               <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
//             </svg>
//             <p>{editnewproductCategory ? "Edit" : "Add New"} Category</p>
//           </div>
//           <div className="category-headright">
//             {editnewproductCategory && (
//               <div
//                 className="add-category-1"
//                 onClick={() => {
//                   setnewproductCategory(true);
//                   setEditnewproductCategory(false);
//                 }}
//               >
//                 + Add New
//               </div>
//             )}
//             {newproductCategory && (
//               <div
//                 className="add-category-2"
//                 onClick={() => {
//                   setEditnewproductCategory(true);
//                   setnewproductCategory(false);
//                 }}
//               >
//                 Edit Existing
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="category-form">
//           <form onSubmit={handleCategorydataSubmit}>
//             {newproductCategory ? (
//               <div className="category-box">
//                 <label htmlFor="category_name">Category Name</label>
//                 <input
//                   type="text"
//                   value={CategoryData.category_name}
//                   onChange={handleCategoryDataChange}
//                   id="category_name"
//                   placeholder="Electronics"
//                   required
//                 />
//               </div>
//             ) : (
//               <>
//                 <div className="category-box">
//                   <label htmlFor="category_name">Select Category</label>
//                   <select
//                     id="category_name"
//                     value={CategoryData.category_name}
//                     onChange={handleCategoryDataChange}
//                     required
//                   >
//                     <option value="">Select Option</option>
//                     {editDropDown.map((ele, ind) => (
//                       <option key={ind} value={ele}>
//                         {ele}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="category-box">
//                   <label htmlFor="update_category_name">
//                     Update Category Name
//                   </label>
//                   <input
//                     type="text"
//                     value={CategoryData.update_category_name}
//                     onChange={handleCategoryDataChange}
//                     id="update_category_name"
//                     placeholder="Fashion"
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             <div className="category-submit-container">
//               <nav
//                 onClick={() => {
//                   setnewproductCategory(false);
//                   setEditnewproductCategory(false);
//                 }}
//               >
//                 Canael
//               </nav>
//               <button type="submit">Create</button>
//               {editnewproductCategory && <div>Remove</div>}
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import "./newproductCategory.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function NewProductCategory({
  newproductCategory,
  setnewproductCategory,
  editnewproductCategory,
  setEditnewproductCategory,
  editDropDown, // Expected to be passed as [{id, name}, ...] or fetched
}) {
  const [CategoryData, setCategoryData] = useState({
    category_name: "",
    update_category_name: "",
  });
  const [categories, setCategories] = useState([]); // Store fetched categories

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          return;
        }
        const res = await axios.get("http://127.0.0.1:8000/api/categories/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setCategories(res.data.categories); // Backend returns { categories: [{id, name}, ...], ... }
      } catch (error) {
        toast.error("Failed to fetch categories: " + (error.response?.data?.error || error.message));
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryDataChange = (e) => {
    setCategoryData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleCategorydataSubmit = async (e) => {
    e.preventDefault();

    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      if (newproductCategory) {
        // ADD NEW CATEGORY
        const res = await axios.post(
          "http://127.0.0.1:8000/api/categories/",
          { name: CategoryData.category_name },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Category created successfully!");
        setCategories([...categories, res.data]); // Update local categories
        setTimeout(() => {
          setnewproductCategory(false);
          setEditnewproductCategory(false);
        }, 3000);
      } else {
        // EDIT EXISTING CATEGORY
        const selectedCategory = categories.find(
          (item) => item.name === CategoryData.category_name
        );

        if (!selectedCategory) {
          toast.error("Please select a valid category to update.");
          return;
        }

        const res = await axios.put(
          `http://127.0.0.1:8000/api/categories/${selectedCategory.id}/`,
          { name: CategoryData.update_category_name },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        toast.success("Category updated successfully!");
        setCategories(
          categories.map((cat) =>
            cat.id === selectedCategory.id ? res.data : cat
          )
        ); // Update local categories
        setTimeout(() => {
          setnewproductCategory(false);
          setEditnewproductCategory(false);
        }, 3000);
      }

      // Reset form
      setCategoryData({
        category_name: "",
        update_category_name: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(
        newproductCategory
          ? "Failed to create category: " + errorMsg
          : "Failed to update category: " + errorMsg
      );
    }
  };

  const handleDeleteCategory = async () => {
    if (!editnewproductCategory) return;

    const selectedCategory = categories.find(
      (item) => item.name === CategoryData.category_name
    );

    if (!selectedCategory) {
      toast.error("Please select a valid category to delete.");
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

      await axios.delete(`http://127.0.0.1:8000/api/categories/${selectedCategory.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Category deleted successfully!");
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
      setCategoryData({
        category_name: "",
        update_category_name: "",
      });
      setTimeout (() => {
        setEditnewproductCategory(false);
        setnewproductCategory(false);
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error("Failed to delete category: " + errorMsg);
    }
  };

  return (
    <div className="productCategory-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="category-head">
        <div className="category-headleft">
          <svg
            onClick={() => {
              setnewproductCategory(false);
              setEditnewproductCategory(false);
              toast.dismiss(); // Clear toasts on cancel
            }}
            className="left-logo-category"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
          <p>{editnewproductCategory ? "Edit" : "Add New"} Category</p>
        </div>
        <div className="category-headright">
          {editnewproductCategory && (
            <div
              className="add-category-1"
              onClick={() => {
                setnewproductCategory(true);
                setEditnewproductCategory(false);
                toast.dismiss(); // Clear toasts on mode switch
              }}
            >
              + Add New
            </div>
          )}
          {newproductCategory && (
            <div
              className="add-category-2"
              onClick={() => {
                setEditnewproductCategory(true);
                setnewproductCategory(false);
                toast.dismiss(); // Clear toasts on mode switch
              }}
            >
              Edit Existing
            </div>
          )}
        </div>
      </div>
      <div className="category-form">
        <form onSubmit={handleCategorydataSubmit}>
          {newproductCategory ? (
            <div className="category-box">
              <label htmlFor="category_name">Category Name</label>
              <input
                type="text"
                value={CategoryData.category_name}
                onChange={handleCategoryDataChange}
                id="category_name"
                placeholder="Electronics"
                required
              />
            </div>
          ) : (
            <>
              <div className="category-box">
                <label htmlFor="category_name">Select Category</label>
                <select
                  id="category_name"
                  value={CategoryData.category_name}
                  onChange={handleCategoryDataChange}
                  required
                >
                  <option value="">Select Option</option>
                  {categories.map((ele) => (
                    <option key={ele.id} value={ele.name}>
                      {ele.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="category-box">
                <label htmlFor="update_category_name">Update Category Name</label>
                <input
                  type="text"
                  value={CategoryData.update_category_name}
                  onChange={handleCategoryDataChange}
                  id="update_category_name"
                  placeholder="Fashion"
                  required
                />
              </div>
            </>
          )}
          <div className="category-submit-container">
            <nav
              onClick={() => {
                setnewproductCategory(false);
                setEditnewproductCategory(false);
                toast.dismiss(); // Clear toasts on cancel
              }}
            >
              Cancel
            </nav>
            <button type="submit">{editnewproductCategory ? "Update" : "Create"}</button>
            {editnewproductCategory && (
              <div className="remove-category" onClick={handleDeleteCategory}>
                Remove
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}