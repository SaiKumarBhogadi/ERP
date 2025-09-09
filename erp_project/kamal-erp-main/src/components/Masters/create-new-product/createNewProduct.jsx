import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./createNewProduct.css";
import CategoryInput from "./customInput";
import CustomCheckboxInput from "./customCheckboxInput";
import NewproductCategory from "../newproductCategory/newproductCategory";
import NewproductTaxCode from "../newproduct-tax-code/newproductTaxCode";
import NewproductUOM from "../newproduct-uom/newproductUOM";
import NewproductWarehouse from "../newproductWarehouse/newproductWarehouse";
import NewproductSupplier from "../newproductSupplier/newproductSupplier";
import NewproductSize from "../newproductSize/newproductSize";
import NewproductColor from "../newproductColor/newproductColor";
import axios from "axios";

export default function createNewProduct({
  setshowNewProduct,
  editNewProduct,
  editProduct,
  setEditProduct,
}) {
  const [categoryApi, setcategoryApi] = useState([]);
  const [tax_codeApi, settax_codeApi] = useState([]);
  const [uomApi, setuomApi] = useState([]);
  const [warehouseApi, setwarehouseApi] = useState([]);
  const [sizeApi, setsizeApi] = useState([]);
  const [colorApi, setcolorApi] = useState([]);
  const [supplierApi, setsupplierApi] = useState([]);
  const [related_productsApi, setrelated_productsApi] = useState([]);

  const [newproduct_tax_code, setnewproduct_tax_code] = useState(false);
  const [newproduct_edit_tax_code, setnewproduct_edit_tax_code] = useState(false);
  const [newProductUOM, setnewProductUOM] = useState(false);
  const [editNewproductUOM, seteditNewproductUOM] = useState(false);
  const [newproductWarehouse, setnewproductWarehouse] = useState(false);
  const [editnewproductWarehouse, setEditnewproductWarehouse] = useState(false);
  const [newproductSupplier, setnewproductSupplier] = useState(false);
  const [editnewproductSupplier, setEditnewproductSupplier] = useState(false);
  const [newproductSize, setnewproductSize] = useState(false);
  const [editnewproductSize, setEditnewproductSize] = useState(false);
  const [newproductColor, setnewproductColor] = useState(false);
  const [editnewproductColor, setEditnewproductColor] = useState(false);
  const [newproductCategory, setnewproductCategory] = useState(false);
  const [editnewproductCategory, setEditnewproductCategory] = useState(false);
  const [newrelatedproduct, setnewrelatedproduct] = useState(false);
  const [editnewrelatedproduct, setEditnewrelatedproduct] = useState(false);

  const [newProductImage, setnewProductImage] = useState(true);
  const [imageURL, setImageURL] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const inputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImageURL(preview);
      setImageFile(file);
      toast.success("Product image uploaded successfully");
      setnewProductImage(false);
    }
  };

  const [newProductcustom, setnewProductCustom] = useState({
    category: "",
    tax_code: "",
    uom: "",
    warehouse: "",
    size: "",
    color: "",
    supplier: "",
    related_products: "",
  });

  const [newProductData, setnewProductData] = useState({
    id: "",
    name: "",
    product_type: "",
    description: "",
    category: "",
    tax_code: "",
    unit_price: "",
    discount: "",
    uom: "",
    quantity: "",
    stock_level: "",
    reorder_level: "",
    warehouse: "",
    size: "",
    color: "",
    weight: "",
    specifications: "",
    supplier: "",
    status: "",
    product_usage: "",
    related_products: "",
    sub_category: "",
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
        const authState = JSON.parse(persistedAuth.auth || "{}");
        const token = authState?.user?.token;

        if (!token) {
          toast.error("No token found");
          return;
        }

        const headers = { Authorization: `Token ${token}` };

        const fetchWithErrorHandling = async (url, field) => {
          try {
            const response = await axios.get(url, { headers });
            return response.data[field] || response.data || [];
          } catch (err) {
            console.error(`Error fetching ${field || url}:`, err);
            toast.error(`Error fetching ${field || url}: ${err.response?.data?.error || err.message}`);
            return [];
          }
        };

        const [
          categories,
          taxCodes,
          uoms,
          warehouses,
          sizes,
          colors,
          suppliers,
          products,
        ] = await Promise.all([
          fetchWithErrorHandling("http://127.0.0.1:8000/api/categories/", "categories"),
          fetchWithErrorHandling("http://127.0.0.1:8000/api/tax-codes/", "tax_codes"),
          fetchWithErrorHandling("http://127.0.0.1:8000/api/uoms/", "uoms"),
          fetchWithErrorHandling("http://127.0.0.1:8000/api/warehouses/", "warehouses"),
          fetchWithErrorHandling("http://127.0.0.1:8000/api/sizes/", "sizes"),
          fetchWithErrorHandling("http://127.0.0.1:8000/api/colors/", "colors"),
          fetchWithErrorHandling("http://127.0.0.1:8000/api/suppliers/", "suppliers"),
          fetchWithErrorHandling("http://127.0.0.1:8000/api/products/", "products"),
        ]);

        setcategoryApi(categories);
        settax_codeApi(taxCodes);
        setuomApi(uoms);
        setwarehouseApi(warehouses);
        setsizeApi(sizes);
        setcolorApi(colors);
        setsupplierApi(suppliers);
        setrelated_productsApi(products);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
        toast.error("Error fetching dropdowns: " + (err.response?.data?.error || err.message));
      }
    };

    fetchDropdowns();
  }, []);

  const handleCustomChange = (e) => {
    const { id, value } = e.target;
    setnewProductData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (value !== "custom") {
      setnewProductCustom((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const handleNewProjectDataChange = (e) => {
    setnewProductData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleNewProjectCustomData = (e) => {
    setnewProductCustom((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    if (editProduct && Object.keys(editProduct).length > 0) {
      setnewProductData((prev) => ({
        ...prev,
        id: editProduct.id || "",
        name: editProduct.name || "",
        product_type: editProduct.product_type || "",
        description: editProduct.description || "",
        category: editProduct.is_custom_category ? "custom" : editProduct.category || "",
        tax_code: editProduct.is_custom_tax_code ? "custom" : editProduct.tax_code || "",
        unit_price: editProduct.unit_price || "",
        discount: editProduct.discount || "",
        uom: editProduct.is_custom_uom ? "custom" : editProduct.uom || "",
        quantity: editProduct.quantity || "",
        stock_level: editProduct.stock_level || "",
        reorder_level: editProduct.reorder_level || "",
        warehouse: editProduct.is_custom_warehouse ? "custom" : editProduct.warehouse || "",
        size: editProduct.is_custom_size ? "custom" : editProduct.size || "",
        color: editProduct.is_custom_color ? "custom" : editProduct.color || "",
        weight: editProduct.weight || "",
        specifications: editProduct.specifications || "",
        supplier: editProduct.is_custom_supplier ? "custom" : editProduct.supplier || "",
        status: editProduct.status || "",
        product_usage: editProduct.product_usage || "",
        related_products: editProduct.related_products || "",
        sub_category: editProduct.sub_category || "",
      }));
      setnewProductCustom((prev) => ({
        ...prev,
        category: editProduct.custom_category || "",
        tax_code: editProduct.custom_tax_code || "",
        uom: editProduct.custom_uom || "",
        warehouse: editProduct.custom_warehouse || "",
        size: editProduct.custom_size || "",
        color: editProduct.custom_color || "",
        supplier: editProduct.custom_supplier || "",
        related_products: editProduct.custom_related_products || "",
      }));
      if (editProduct.image) {
        setImageURL(editProduct.image);
        setnewProductImage(false);
      }
    }
  }, [editProduct]);

  const handleNewProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const authState = JSON.parse(persistedAuth.auth || "{}");
      const token = authState?.user?.token;

      if (!token) {
        toast.error("No token found");
        return;
      }

      const headers = { Authorization: `Token ${token}` };
      const formData = new FormData();

      // Map newProductData to serializer fields
      formData.append("name", newProductData.name);
      formData.append("product_type", newProductData.product_type);
      formData.append("description", newProductData.description || "");
      formData.append("unit_price", newProductData.unit_price || "");
      formData.append("discount", newProductData.discount || "");
      formData.append("quantity", newProductData.quantity || "");
      formData.append("stock_level", newProductData.stock_level || "");
      formData.append("reorder_level", newProductData.reorder_level || "");
      formData.append("weight", newProductData.weight || "");
      formData.append("specifications", newProductData.specifications || "");
      formData.append("status", newProductData.status);
      formData.append("product_usage", newProductData.product_usage);
      formData.append("sub_category", newProductData.sub_category || "");

      // Handle dropdown fields with is_custom and custom_value
      const dropdownFields = ["category", "tax_code", "uom", "warehouse", "size", "color", "supplier", "related_products"];
      
      for (const field of dropdownFields) {
        if (newProductData[field] === "custom") {
          const customValue = newProductcustom[field];
          if (!customValue) {
            toast.error(`Custom value for ${field} is required`);
            return;
          }
          formData.append(field, "");
          formData.append(`is_custom_${field}`, true);
          formData.append(`custom_${field}`, customValue);
        } else {
          formData.append(field, newProductData[field] || "");
          formData.append(`is_custom_${field}`, false);
        }
      }

      // Append image if available
      if (imageFile) {
        formData.append("image", imageFile);
      }

      let response;
      if (editNewProduct && newProductData.id) {
        // Update existing product
        response = await axios.put(
          `http://127.0.0.1:8000/api/products/${newProductData.id}/`,
          formData,
          { headers }
        );
        toast.success("Product updated successfully");
      } else {
        // Create new product
        response = await axios.post("http://127.0.0.1:8000/api/products/", formData, { headers });
        toast.success("Product created successfully");
      }

      setTimeout(() => {
        setnewProductData({
          id: "",
          name: "",
          product_type: "",
          description: "",
          category: "",
          tax_code: "",
          unit_price: "",
          discount: "",
          uom: "",
          quantity: "",
          stock_level: "",
          reorder_level: "",
          warehouse: "",
          size: "",
          color: "",
          weight: "",
          specifications: "",
          supplier: "",
          status: "",
          product_usage: "",
          related_products: "",
          sub_category: "",
        });
        setnewProductCustom({
          category: "",
          tax_code: "",
          uom: "",
          warehouse: "",
          size: "",
          color: "",
          supplier: "",
          related_products: "",
        });
        setImageURL("");
        setImageFile(null);
        setnewProductImage(true);
        setshowNewProduct(false);
        setEditProduct({});
      }, 3000);
    } catch (err) {
      console.error("Error submitting product:", err);
      const errorMsg = err.response?.data
        ? Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${value.join(", ")}`)
            .join("; ")
        : err.message;
      toast.error(`Error ${editNewProduct ? "updating" : "creating"} product: ${errorMsg}`);
    }
  };

  const handleNewProductReset = (e) => {
    e.preventDefault();
    setnewProductData({
      id: "",
      name: "",
      product_type: "",
      description: "",
      category: "",
      tax_code: "",
      unit_price: "",
      discount: "",
      uom: "",
      quantity: "",
      stock_level: "",
      reorder_level: "",
      warehouse: "",
      size: "",
      color: "",
      weight: "",
      specifications: "",
      supplier: "",
      status: "",
      product_usage: "",
      related_products: "",
      sub_category: "",
    });
    setnewProductCustom({
      category: "",
      tax_code: "",
      uom: "",
      warehouse: "",
      size: "",
      color: "",
      supplier: "",
      related_products: "",
    });
    setImageURL("");
    setImageFile(null);
    setnewProductImage(true);
    setshowNewProduct(false);
    setEditProduct({});
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {newproductCategory && (
        <div className="product-bg-autoheight-btn">
          <NewproductCategory
            newproductCategory={newproductCategory}
            setnewproductCategory={setnewproductCategory}
            editnewproductCategory={editnewproductCategory}
            setEditnewproductCategory={setEditnewproductCategory}
            editDropDown={categoryApi}
          />
        </div>
      )}
      {editnewproductCategory && (
        <div className="product-bg-autoheight-btn">
          <NewproductCategory
            newproductCategory={newproductCategory}
            setnewproductCategory={setnewproductCategory}
            editnewproductCategory={editnewproductCategory}
            setEditnewproductCategory={setEditnewproductCategory}
            editDropDown={categoryApi}
          />
        </div>
      )}
      {newproduct_tax_code && (
        <div className="product-bg-btn">
          <NewproductTaxCode
            newproduct_tax_code={newproduct_tax_code}
            setnewproduct_tax_code={setnewproduct_tax_code}
            setnewproduct_edit_tax_code={setnewproduct_edit_tax_code}
            newproduct_edit_tax_code={newproduct_edit_tax_code}
            editDropDown={tax_codeApi}
          />
        </div>
      )}
      {newproduct_edit_tax_code && (
        <div className="product-bg-btn">
          <NewproductTaxCode
            newproduct_tax_code={newproduct_tax_code}
            setnewproduct_tax_code={setnewproduct_tax_code}
            setnewproduct_edit_tax_code={setnewproduct_edit_tax_code}
            newproduct_edit_tax_code={newproduct_edit_tax_code}
            editDropDown={tax_codeApi}
          />
        </div>
      )}
      {newProductUOM && (
        <div className="product-bg-btn">
          <NewproductUOM
            newProductUOM={newProductUOM}
            setnewProductUOM={setnewProductUOM}
            editNewproductUOM={editNewproductUOM}
            seteditNewproductUOM={seteditNewproductUOM}
            editDropDown={uomApi}
          />
        </div>
      )}
      {editNewproductUOM && (
        <div className="product-bg-btn">
          <NewproductUOM
            newProductUOM={newProductUOM}
            setnewProductUOM={setnewProductUOM}
            editNewproductUOM={editNewproductUOM}
            seteditNewproductUOM={seteditNewproductUOM}
            editDropDown={uomApi}
          />
        </div>
      )}
      {newproductWarehouse && (
        <div className="product-bg-btn">
          <NewproductWarehouse
            newproductWarehouse={newproductWarehouse}
            setnewproductWarehouse={setnewproductWarehouse}
            editnewproductWarehouse={editnewproductWarehouse}
            setEditnewproductWarehouse={setEditnewproductWarehouse}
            editDropDown={warehouseApi}
          />
        </div>
      )}
      {editnewproductWarehouse && (
        <div className="product-bg-btn">
          <NewproductWarehouse
            newproductWarehouse={newproductWarehouse}
            setnewproductWarehouse={setnewproductWarehouse}
            editnewproductWarehouse={editnewproductWarehouse}
            setEditnewproductWarehouse={setEditnewproductWarehouse}
            editDropDown={warehouseApi}
          />
        </div>
      )}
      {newproductSupplier && (
        <div className="product-bg-btn">
          <NewproductSupplier
            newproductSupplier={newproductSupplier}
            setnewproductSupplier={setnewproductSupplier}
            editnewproductSupplier={editnewproductSupplier}
            setEditnewproductSupplier={setEditnewproductSupplier}
            editDropDown={supplierApi}
          />
        </div>
      )}
      {editnewproductSupplier && (
        <div className="product-bg-btn">
          <NewproductSupplier
            newproductSupplier={newproductSupplier}
            setnewproductSupplier={setnewproductSupplier}
            editnewproductSupplier={editnewproductSupplier}
            setEditnewproductSupplier={setEditnewproductSupplier}
            editDropDown={supplierApi}
          />
        </div>
      )}
      {newproductSize && (
        <div className="product-bg-autoheight-btn">
          <NewproductSize
            newproductSize={newproductSize}
            setnewproductSize={setnewproductSize}
            editnewproductSize={editnewproductSize}
            setEditnewproductSize={setEditnewproductSize}
            editDropDown={sizeApi}
          />
        </div>
      )}
      {editnewproductSize && (
        <div className="product-bg-autoheight-btn">
          <NewproductSize
            newproductSize={newproductSize}
            setnewproductSize={setnewproductSize}
            editnewproductSize={editnewproductSize}
            setEditnewproductSize={setEditnewproductSize}
            editDropDown={sizeApi}
          />
        </div>
      )}
      {newproductColor && (
        <div className="product-bg-autoheight-btn">
          <NewproductColor
            newproductColor={newproductColor}
            setnewproductColor={setnewproductColor}
            editnewproductColor={editnewproductColor}
            setEditnewproductColor={setEditnewproductColor}
            editDropDown={colorApi}
          />
        </div>
      )}
      {editnewproductColor && (
        <div className="product-bg-autoheight-btn">
          <NewproductColor
            newproductColor={newproductColor}
            setnewproductColor={setnewproductColor}
            editnewproductColor={editnewproductColor}
            setEditnewproductColor={setEditnewproductColor}
            editDropDown={colorApi}
          />
        </div>
      )}
      {newrelatedproduct && (
        <div className="product-bg-autoheight-btn">
          <NewproductRelatedProducts
            newrelatedproduct={newrelatedproduct}
            setnewrelatedproduct={setnewrelatedproduct}
            editnewrelatedproduct={editnewrelatedproduct}
            setEditnewrelatedproduct={setEditnewrelatedproduct}
            editDropDown={related_productsApi}
          />
        </div>
      )}
      {editnewrelatedproduct && (
        <div className="product-bg-autoheight-btn">
          <NewproductRelatedProducts
            newrelatedproduct={newrelatedproduct}
            setnewrelatedproduct={setnewrelatedproduct}
            editnewrelatedproduct={editnewrelatedproduct}
            setEditnewrelatedproduct={setEditnewrelatedproduct}
            editDropDown={related_productsApi}
          />
        </div>
      )}

      <div
        className={`newProduct-container ${(newproduct_tax_code ||
          newproduct_edit_tax_code ||
          editNewproductUOM ||
          newProductUOM ||
          editnewproductWarehouse ||
          newproductWarehouse ||
          newproductSupplier ||
          editnewproductSupplier ||
          newproductSize ||
          editnewproductSize ||
          newproductColor ||
          editnewproductColor ||
          newproductCategory ||
          editnewproductCategory ||
          newrelatedproduct ||
          editnewrelatedproduct) &&
          "product-bg-blur"
          }`}
      >
        <form onSubmit={handleNewProductSubmit}>
          <div className="newProduct-title">
            <p>{editNewProduct ? "Edit" : "Create New"} Product</p>
            <div
              className="close-newproduct-container"
              onClick={() => {
                setshowNewProduct(false);
                setEditProduct({});
              }}
            >
              <svg
                className="circle-x-logo-newproduct"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
              <nav className="close-newproduct">Close</nav>
            </div>
          </div>
          <div className="createNewProduct-cointainer">
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              hidden
              onChange={handleImageChange}
            />
            {newProductImage ? (
              <div
                className="newProduct-photo-cointainer"
                onClick={() => {
                  inputRef.current && inputRef.current.click();
                }}
              >
                <div className="newProduct-photo-bg">
                  <nav className="newProduct-photo-bg-up">
                    <svg
                      className="newProject-camera-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z" />
                    </svg>
                    <p>Upload Photo</p>
                  </nav>
                  <nav className="newProduct-photo-bg-down">
                    <div>
                      <nav>
                        <p className="newProduct-photo-title">Allowed Format</p>
                        <p className="newProduct-photo-content">
                          JPG, JPEG, PNG
                        </p>
                      </nav>
                      <nav>
                        <p className="newProduct-photo-title">Max File Size</p>
                        <p className="newProduct-photo-content">2MB</p>
                      </nav>
                    </div>
                  </nav>
                </div>
              </div>
            ) : (
              <img
                className="newProduct-image"
                src={imageURL}
                alt="Product Preview"
                onClick={() => inputRef.current && inputRef.current.click()}
              />
            )}

            <div className="createNewProduct-right">
              <div className="createNewProduct-box">
                <label htmlFor="name">
                  Product Name<sup>*</sup>
                </label>
                <input
                  id="name"
                  type="text"
                  value={newProductData.name}
                  onChange={handleNewProjectDataChange}
                  placeholder="Headphones"
                  required
                />
              </div>
              <div className="createNewProduct-box">
                <label htmlFor="product_type">
                  Product Type<sup>*</sup>
                </label>
                <select
                  id="product_type"
                  value={newProductData.product_type}
                  onChange={handleNewProjectDataChange}
                  name="productType"
                  required
                >
                  <option value="">Select Product Type</option>
                  <option value="Goods">Goods</option>
                  <option value="Services">Services</option>
                  <option value="Combo">Combo</option>
                </select>
              </div>
              <div className="createNewProduct-box">
                <label htmlFor="Product ID">
                  Product ID {"(Auto Generate)"}
                </label>
                <input
                  id="Product ID"
                  type="text"
                  value={newProductData.id}
                  onChange={handleNewProjectDataChange}
                  placeholder="Auto Generate"
                  disabled
                />
              </div>

              <div className="createNewProduct-box">
                <label htmlFor="description">Description<sup>*</sup></label>
                <input
                  id="description"
                  value={newProductData.description}
                  onChange={handleNewProjectDataChange}
                  type="text"
                  placeholder="Text Area"
                  required
                />
              </div>
            </div>
          </div>
          <div className="newProduct-title">
            <div>Create New Product</div>
          </div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="category">
                <p>Category<sup>*</sup></p>
                <nav onClick={() => setnewproductCategory(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="category"
                customApi={categoryApi}
                required
              />
            </div>

            <div className="newProduct-box">
              <label htmlFor="sub_category">Sub Category<sup>*</sup></label>
              <input
                type="text"
                id="sub_category"
                value={newProductData.sub_category}
                onChange={handleNewProjectDataChange}
                placeholder="e.g., Laptop"
                required
              />
            </div>
          </div>
          <div className="newProduct-title">
            <div>Pricing & Tax</div>
          </div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="unit_price">Unit Price<sup>*</sup></label>
              <input
                className="increment-decrement-newProduct"
                type="number"
                id="unit_price"
                placeholder="Enter Price"
                value={newProductData.unit_price}
                onChange={handleNewProjectDataChange}
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="discount">Discount<sup>*</sup></label>
              <input
                className="increment-decrement-newProduct"
                type="number"
                id="discount"
                value={newProductData.discount}
                onChange={handleNewProjectDataChange}
                placeholder="e.g., 10%"
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="tax_code">
                <p>Tax Code<sup>*</sup></p>
                <nav onClick={() => setnewproduct_tax_code(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="tax_code"
                customApi={tax_codeApi}
                required
              />
            </div>
          </div>
          <div className="newProduct-title">
            <div>Unit & Stock</div>
          </div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="quantity">Quantity<sup>*</sup></label>
              <input
                id="quantity"
                type="number"
                className="increment-decrement-newProduct"
                value={newProductData.quantity}
                onChange={handleNewProjectDataChange}
                placeholder="e.g., 50"
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="uom">
                <p>UOM {"(Unit Of Measurement)"}<sup>*</sup></p>
                <nav onClick={() => setnewProductUOM(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="uom"
                customApi={uomApi}
                required
              />
            </div>
          </div>
          <div className="newProduct-title">
            <div>Inventory Details</div>
          </div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="stock_level">Stock Level<sup>*</sup></label>
              <input
                className="increment-decrement-newProduct"
                type="number"
                id="stock_level"
                placeholder="e.g., 120"
                value={newProductData.stock_level}
                onChange={handleNewProjectDataChange}
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="reorder_level">Reorder Level<sup>*</sup></label>
              <input
                className="increment-decrement-newProduct"
                type="number"
                id="reorder_level"
                value={newProductData.reorder_level}
                onChange={handleNewProjectDataChange}
                placeholder="e.g., 30"
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="warehouse">
                <p>Warehouse<sup>*</sup></p>
                <nav onClick={() => setnewproductWarehouse(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="warehouse"
                customApi={warehouseApi}
                required
              />
            </div>
          </div>
          <div className="newProduct-title">
            <div>Product Attributes & Specifications</div>
          </div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="size">
                <p>Size<sup>*</sup></p>
                <nav onClick={() => setnewproductSize(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="size"
                customApi={sizeApi}
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="color">
                <p>Color<sup>*</sup></p>
                <nav onClick={() => setnewproductColor(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="color"
                customApi={colorApi}
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="weight">Weight<sup>*</sup></label>
              <input
                type="text"
                id="weight"
                value={newProductData.weight}
                onChange={handleNewProjectDataChange}
                placeholder="e.g., 300g"
                required
              />
            </div>
          </div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="specifications">Specifications<sup>*</sup></label>
              <input
                type="text"
                id="specifications"
                value={newProductData.specifications}
                onChange={handleNewProjectDataChange}
                placeholder="Text area"
                required
              />
            </div>
          </div>
          <div className="newProduct-title">
            <div>Related Products & Supplier Info</div>
          </div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="related_products">
                <p>Related Products<sup>*</sup></p>
                <nav onClick={() => setnewrelatedproduct(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="related_products"
                customApi={related_productsApi}
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="supplier">
                <p>Supplier<sup>*</sup></p>
                <nav onClick={() => setnewproductSupplier(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="supplier"
                customApi={supplierApi}
                required
              />
            </div>
          </div>
          <div className="newProduct-title">
            <div>Settings</div>
          </div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="status">
                <p>Status<sup>*</sup></p>
              </label>
              <select
                id="status"
                value={newProductData.status}
                onChange={handleNewProjectDataChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
            <div className="newProduct-box">
              <label htmlFor="product_usage">
                <p>Product Usage<sup>*</sup></p>
              </label>
              <select
                id="product_usage"
                value={newProductData.product_usage}
                onChange={handleNewProjectDataChange}
                required
              >
                <option value="">Select Product Usage</option>
                <option value="Purchase">Purchase</option>
                <option value="Sale">Sale</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>
          <div className="newProduct-submit-cointainer">
            <button
              className="newProduct-reset-btn"
              type="reset"
              onClick={handleNewProductReset}
            >
              Discard
            </button>
            <button
              className="newProduct-submit-btn"
              type="submit"
            >
              {editNewProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}