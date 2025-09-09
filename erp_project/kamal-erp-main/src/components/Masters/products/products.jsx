// import React, { useState, useEffect } from "react";
// import "./products.css";
// import { toast } from "react-toastify";
// import CreateNewProduct from "../create-new-product/createNewProduct";
// import ProductImport from "../productImport/productImport";

// export default function products() {
//   const [ApiProduct, setApiProduct] = useState({});
//   const [product, setproduct] = useState([]);

//   const [searchCategory, setsearchCategory] = useState([]);
//   const [searchBrand, setsearchBrand] = useState([]);

//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [selectedProductType, setSelectedProductType] = useState("");

//   const [productCurrentPage, setproductCurrentPage] = useState(1);
//   const productRowsPerPage = 10;

//   const [showNewProduct, setshowNewProduct] = useState(false);
//   const [editNewProduct, setEditNewProduct] = useState(false);
//   const [editProduct, setEditProduct] = useState({});

//   const [showProductImport, setshowProductImport] = useState(false);

//   const productFromAPI = {
//     product: [
//       {
//         id: "1",
//         product_id: "CVB001",
//         product_name: "T-Shirt",
//         product_type: "Goods",
//         category: "Fashon",
//         status: "Active",
//         stock_level: "120",
//         price: "400",
//       },
//       {
//         id: "2",
//         product_id: "CVB002",
//         product_name: "T-Shirt",
//         product_type: "Goods",
//         category: "Apparel",
//         status: "Active",
//         stock_level: "120",
//         price: "400",
//       },
//       {
//         id: "3",
//         product_id: "CVB003",
//         product_name: "T-Shirt",
//         product_type: "Goods",
//         category: "Apparel",
//         status: "Inactive",
//         stock_level: "120",
//         price: "400",
//       },
//       {
//         id: "4",
//         product_id: "CVB004",
//         product_name: "T-Shirt",
//         product_type: "Goods",
//         category: "Apparel",
//         status: "Inactive",
//         stock_level: "120",
//         price: "400",
//       },
//       {
//         id: "5",
//         product_id: "CVB005",
//         product_name: "T-Shirt",
//         product_type: "Goods",
//         category: "Apparel",
//         status: "Inactive",
//         stock_level: "120",
//         price: "400",
//       },
//     ],
//     searchCategory: ["Electronis", "Apparel"],
//     searchBrand: ["Apple", "Samsumg"],
//   };
//   useEffect(() => {
//     setApiProduct(productFromAPI);
//   }, []);
//   useEffect(() => {
//     if (Object.keys(ApiProduct).length > 0) {
//       setproduct(ApiProduct.product);
//       setsearchCategory(ApiProduct.searchCategory);
//       setsearchBrand(ApiProduct.searchBrand);
//     }
//   }, [ApiProduct]);

//   //   page calculation
//   const totalPages = Math.ceil(product.length / productRowsPerPage);
//   console.log(totalPages);

//   const currentData = product.slice(
//     (productCurrentPage - 1) * productRowsPerPage,
//     productCurrentPage * productRowsPerPage
//   );

//   // Handle next page
//   const handleNext = () => {
//     if (productCurrentPage < totalPages) {
//       setproductCurrentPage((prevPage) => prevPage + 1);
//     }
//   };
//   // Handle previous page
//   const handlePrev = () => {
//     if (productCurrentPage > 1) {
//       setproductCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   // delete list

//   function deleteProduct(ind) {
//     const okDel = window.confirm("Are you sure you want to delete this task?");
//     if (okDel) {
//       setApiProduct((prev) => ({
//         ...prev,
//         product: prev.product.filter((_, index) => index !== ind),
//       }));
//       toast.success("Task deleted!");
//     }
//   }
//   const showEditProduct = (id) => {
//     setEditProduct(
//       currentData.find((ele) => {
//         return ele.id === id;
//       })
//     );
//   };

//   function resetSearchBox() {
//     setSelectedCategory("");
//     setSelectedBrand("");
//     setSelectedStatus("");
//     setSelectedProductType("");
//   }

//   return (
//     <>
//       {showNewProduct ? (
//         <div className="createNewProduct-btn">
//           <CreateNewProduct
//             setshowNewProduct={setshowNewProduct}
//             editNewProduct={editNewProduct}
//             editProduct={editProduct}
//             setEditProduct={setEditProduct}
//           />
//         </div>
//       ) : editNewProduct ? (
//         <div className="createNewProduct-btn">
//           <CreateNewProduct
//             setshowNewProduct={setEditNewProduct}
//             editNewProduct={editNewProduct}
//             editProduct={editProduct}
//             setEditProduct={setEditProduct}
//           />
//         </div>
//       ) : showProductImport ? (
//         <div className="createNewProduct-btn">
//           <ProductImport
//             setshowProductImport={setshowProductImport}
//             setproduct={setproduct}
//           />
//         </div>
//       ) : (
//         <div className="product-container">
//           <div className="product-header">
//             <p>Product Master</p>{" "}
//             <nav>
//               <button onClick={() => setshowNewProduct(true)}>
//                 + Add New Product
//               </button>
//               <button onClick={() => setshowProductImport(true)}>Import</button>
//             </nav>
//           </div>
//           <div className="product-search-box">
//             <label htmlFor="searchByID">
//               <svg
//                 className="product-search-logo"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 512 512"
//               >
//                 <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//               </svg>
//             </label>

//             <input id="searchByID" placeholder="Search by ID number..." />
//           </div>
//           <div className="product-clearfilter">
//             <p onClick={resetSearchBox}> Clear Filter</p>
//           </div>
//           <div className="product-search-category">
//             <div className="product-input-box">
//               <label htmlForcateogry>Category</label>
//               <select
//                 id="category"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//               >
//                 <option value="">All</option>
//                 {searchCategory.map((ele, ind) => (
//                   <option key={ind} value={ele}>
//                     {ele}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="product-input-box">
//               <label htmlFor="brand">Brand</label>
//               <select
//                 id="brand"
//                 value={selectedBrand}
//                 onChange={(e) => setSelectedBrand(e.target.value)}
//               >
//                 <option value="">All</option>
//                 {searchBrand.map((ele, ind) => (
//                   <option key={ind} value={ele}>
//                     {ele}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="product-input-box">
//               <label htmlFor="status">Status</label>
//               <select
//                 id="status"
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//               >
//                 <option value="">All</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//                 <option value="Discontinued">Discontinued</option>
//               </select>
//             </div>

//             <div className="product-input-box">
//               <label htmlFor="product_type">Product Type</label>
//               <select
//                 id="product_type"
//                 value={selectedProductType}
//                 onChange={(e) => setSelectedProductType(e.target.value)}
//               >
//                 <option value="">All</option>
//                 <option value="Goods">Goods</option>
//                 <option value="Services">Services</option>
//                 <option value="Combo">Combo</option>
//               </select>
//             </div>
//           </div>
//           <div className="product-table-cointainer">
//             <table>
//               <thead className="product-thead">
//                 <tr>
//                   <th>Product ID</th>
//                   <th>Product Name</th>
//                   <th>Type</th>
//                   <th>Category</th>
//                   <th>Status</th>
//                   <th>Stock Level</th>
//                   <th>Price</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="product-tbody">
//                 {currentData.length > 0 ? (
//                   currentData.map((ele, ind) => (
//                     <tr key={ind}>
//                       <td>{ele.product_id}</td>
//                       <td>{ele.product_name}</td>
//                       <td>{ele.product_type}</td>
//                       <td>{ele.category}</td>
//                       <td>
//                         <div
//                           className={
//                             ele.status === "Active"
//                               ? "productStatus-active"
//                               : "productStatus-inactive"
//                           }
//                         >
//                           {ele.status}
//                         </div>
//                       </td>
//                       <td>{ele.stock_level}</td>
//                       <td>{ele.price}</td>
//                       <td className="product-action-cointainer">
//                         <svg
//                           onClick={() => {
//                             showEditProduct(ele.id);
//                             setEditNewProduct(true);
//                           }}
//                           className="edit-product-logo"
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 512 512"
//                         >
//                           <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
//                         </svg>
//                         <svg
//                           onClick={() => {
//                             deleteProduct(ind);
//                           }}
//                           className="delete-product-logo"
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 448 512"
//                         >
//                           <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
//                         </svg>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <p>No Data Found</p>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <nav className="productImport-table-bottem">
//             <p className="productImport-num-entries">
//               Showing {currentData.length} entries
//             </p>
//             <div className="productImport-manage-control-box">
//               <button
//                 className="productImport-manage-btn"
//                 onClick={handlePrev}
//                 disabled={productCurrentPage === 1}
//               >
//                 Prev
//               </button>
//               <nav className="productImport-num-page">
//                 {" "}
//                 Page {productCurrentPage} of {totalPages}{" "}
//               </nav>
//               <button
//                 className="productImport-manage-btn"
//                 onClick={handleNext}
//                 disabled={productCurrentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           </nav>
//         </div>
//       )}
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import "./products.css";
import { ToastContainer,  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CreateNewProduct from "../create-new-product/createNewProduct";
import ProductImport from "../productImport/productImport";

export default function products() {
  const [ApiProduct, setApiProduct] = useState({ product: [], searchCategory: [], searchBrand: [] });
  const [product, setproduct] = useState([]);
  const [searchID, setSearchID] = useState("");

  const [searchCategory, setsearchCategory] = useState([]);
  const [searchBrand, setsearchBrand] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");

  const [productCurrentPage, setproductCurrentPage] = useState(1);
  const productRowsPerPage = 10;

  const [showNewProduct, setshowNewProduct] = useState(false);
  const [editNewProduct, setEditNewProduct] = useState(false);
  const [editProduct, setEditProduct] = useState({});

  const [showProductImport, setshowProductImport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;

        if (!token) {
          toast.error("No token found");
          return;
        }

        const headers = { Authorization: `Token ${token}` };

        const [productsResponse, categoriesResponse, suppliersResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/products/", { headers }),
          axios.get("http://127.0.0.1:8000/api/categories/", { headers }),
          axios.get("http://127.0.0.1:8000/api/suppliers/", { headers }),
        ]);

        const categories = categoriesResponse.data.categories || categoriesResponse.data || [];
        const suppliers = suppliersResponse.data.suppliers || suppliersResponse.data || [];

        setApiProduct({
          product: productsResponse.data.products || productsResponse.data || [],
          searchCategory: categories,
          searchBrand: suppliers,
        });
        setsearchCategory(categories);
        setsearchBrand(suppliers);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error(`Error fetching data: ${err.response?.data?.error || err.message}`);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredProducts = ApiProduct.product;

    if (searchID) {
      filteredProducts = filteredProducts.filter((p) =>
        p.product_id.toLowerCase().includes(searchID.toLowerCase())
      );
    }
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category && (typeof p.category === "object" ? p.category.name === selectedCategory : p.category === selectedCategory)
      );
    }
    if (selectedBrand) {
      filteredProducts = filteredProducts.filter(
        (p) => p.supplier && (typeof p.supplier === "object" ? p.supplier.name === selectedBrand : p.supplier === selectedBrand)
      );
    }
    if (selectedStatus) {
      filteredProducts = filteredProducts.filter((p) => p.status === selectedStatus);
    }
    if (selectedProductType) {
      filteredProducts = filteredProducts.filter((p) => p.product_type === selectedProductType);
    }

    setproduct(filteredProducts);
  }, [ApiProduct, searchID, selectedCategory, selectedBrand, selectedStatus, selectedProductType]);

  // Page calculation
  const totalPages = Math.ceil(product.length / productRowsPerPage);

  const currentData = product.slice(
    (productCurrentPage - 1) * productRowsPerPage,
    productCurrentPage * productRowsPerPage
  );

  // Handle next page
  const handleNext = () => {
    if (productCurrentPage < totalPages) {
      setproductCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Handle previous page
  const handlePrev = () => {
    if (productCurrentPage > 1) {
      setproductCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    const okDel = window.confirm("Are you sure you want to delete this product?");
    if (okDel) {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;

        if (!token) {
          toast.error("No token found");
          return;
        }

        await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });

        setApiProduct((prev) => ({
          ...prev,
          product: prev.product.filter((p) => p.id !== id),
        }));
        toast.success("Product deleted!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error(`Error deleting product: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const showEditProduct = async (id) => {
    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;

      if (!token) {
        toast.error("No token found");
        return;
      }

      const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      const productData = response.data;
      setEditProduct({
        id: productData.id,
        product_id: productData.product_id,
        name: productData.name,
        product_type: productData.product_type,
        description: productData.description || "",
        category: productData.category ? (typeof productData.category === "object" ? productData.category.id : productData.category) : "",
        tax_code: productData.tax_code ? (typeof productData.tax_code === "object" ? productData.tax_code.id : productData.tax_code) : "",
        unit_price: productData.unit_price || "",
        discount: productData.discount || "",
        uom: productData.uom ? (typeof productData.uom === "object" ? productData.uom.id : productData.uom) : "",
        quantity: productData.quantity || "",
        stock_level: productData.stock_level || "",
        reorder_level: productData.reorder_level || "",
        warehouse: productData.warehouse ? (typeof productData.warehouse === "object" ? productData.warehouse.id : productData.warehouse) : "",
        size: productData.size ? (typeof productData.size === "object" ? productData.size.id : productData.size) : "",
        color: productData.color ? (typeof productData.color === "object" ? productData.color.id : productData.color) : "",
        weight: productData.weight || "",
        specifications: productData.specifications || "",
        supplier: productData.supplier ? (typeof productData.supplier === "object" ? productData.supplier.id : productData.supplier) : "",
        status: productData.status || "",
        product_usage: productData.product_usage || "",
        related_products: productData.related_products || [],
        // image: productData.image || "",
        image: productData.image ? `http://127.0.0.1:8000/${productData.image}` : "",
        sub_category: productData.sub_category || "",
        custom_category: productData.is_custom_category ? productData.custom_category : "",
        custom_tax_code: productData.is_custom_tax_code ? productData.custom_tax_code : "",
        custom_uom: productData.is_custom_uom ? productData.custom_uom : "",
        custom_warehouse: productData.is_custom_warehouse ? productData.custom_warehouse : "",
        custom_size: productData.is_custom_size ? productData.custom_size : "",
        custom_color: productData.is_custom_color ? productData.custom_color : "",
        custom_supplier: productData.is_custom_supplier ? productData.custom_supplier : "",
      });
      setEditNewProduct(true);
    } catch (err) {
      console.error("Error fetching product for edit:", err);
      toast.error(`Error fetching product: ${err.response?.data?.error || err.message}`);
    }
  };

  function resetSearchBox() {
    setSearchID("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedStatus("");
    setSelectedProductType("");
  }
  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {showNewProduct ? (
        <div className="createNewProduct-btn">
          <CreateNewProduct
            setshowNewProduct={setshowNewProduct}
            editNewProduct={editNewProduct}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
          />
        </div>
      ) : editNewProduct ? (
        <div className="createNewProduct-btn">
          <CreateNewProduct
            setshowNewProduct={setEditNewProduct}
            editNewProduct={editNewProduct}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
          />
        </div>
      ) : showProductImport ? (
        <div className="createNewProduct-btn">
          <ProductImport
            setshowProductImport={setshowProductImport}
            setproduct={setproduct}
          />
        </div>
      ) : (
        <div className="product-container">
          <div className="product-header">
            <p>Product Master</p>{" "}
            <nav>
              <button onClick={() => setshowNewProduct(true)}>
                + Add New Product
              </button>
              <button onClick={() => setshowProductImport(true)}>Import</button>
            </nav>
          </div>
          <div className="product-search-box">
            <label htmlFor="searchByID">
              <svg
                className="product-search-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </label>
            <input
              id="searchByID"
              placeholder="Search by ID number..."
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
            />
          </div>
          <div className="product-clearfilter">
            <p onClick={resetSearchBox}> Clear Filter</p>
          </div>
          <div className="product-search-category">
            <div className="product-input-box">
              <label htmlForcateogry>Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All</option>
                {searchCategory.map((ele, ind) => (
                  <option key={ind} value={typeof ele === "object" ? ele.name : ele}>
                    {typeof ele === "object" ? ele.name : ele}
                  </option>
                ))}
              </select>
            </div>
            <div className="product-input-box">
              <label htmlFor="brand">Brand</label>
              <select
                id="brand"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All</option>
                {searchBrand.map((ele, ind) => (
                  <option key={ind} value={typeof ele === "object" ? ele.name : ele}>
                    {typeof ele === "object" ? ele.name : ele}
                  </option>
                ))}
              </select>
            </div>
            <div className="product-input-box">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
            <div className="product-input-box">
              <label htmlFor="product_type">Product Type</label>
              <select
                id="product_type"
                value={selectedProductType}
                onChange={(e) => setSelectedProductType(e.target.value)}
              >
                <option value="">All</option>
                <option value="Goods">Goods</option>
                <option value="Services">Services</option>
                <option value="Combo">Combo</option>
              </select>
            </div>
          </div>
          <div className="product-table-cointainer">
            <table>
              <thead className="product-thead">
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Stock Level</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="product-tbody">
                {currentData.length > 0 ? (
                  currentData.map((ele, ind) => (
                    <tr key={ind}>
                      <td>{ele.product_id}</td>
                      <td>{ele.name}</td>
                      <td>{ele.product_type}</td>
                      <td>
                        {typeof ele.category === "object"
                          ? ele.category?.name
                          : searchCategory.find((c) => c.id === ele.category)?.name || ele.category}
                      </td>
                      <td>
                        <div
                          className={
                            ele.status === "Active"
                              ? "productStatus-active"
                              : "productStatus-inactive"
                          }
                        >
                          {ele.status}
                        </div>
                      </td>
                      <td>{ele.stock_level}</td>
                      <td>{ele.unit_price}</td>
                      <td className="product-action-cointainer">
                        <svg
                          onClick={() => {
                            showEditProduct(ele.id);
                          }}
                          className="edit-product-logo"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                        </svg>
                        <svg
                          onClick={() => {
                            deleteProduct(ele.id);
                          }}
                          className="delete-product-logo"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                        </svg>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p>No Data Found</p>
                )}
              </tbody>
            </table>
          </div>
          <nav className="productImport-table-bottem">
            <p className="productImport-num-entries">
              Showing {currentData.length} entries
            </p>
            <div className="productImport-manage-control-box">
              <button
                className="productImport-manage-btn"
                onClick={handlePrev}
                disabled={productCurrentPage === 1}
              >
                Prev
              </button>
              <nav className="productImport-num-page">
                Page {productCurrentPage} of {totalPages}
              </nav>
              <button
                className="productImport-manage-btn"
                onClick={handleNext}
                disabled={productCurrentPage === totalPages}
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