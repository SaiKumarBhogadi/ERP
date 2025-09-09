import React, { useState, useEffect } from "react";
import "./addItemNewEnquiry.css";

export default function addItemNewEnquiry({
  setshowAddItem,
  editAddItem,
  editItem,
  seteditItem,
}) {
  const [addItems, setaddItems] = useState({
    item_code: "",
    product_description: "",
    cost_price: "",
    salling_price: "",
    quantity: "",
    total_amount: "",
  });
  useEffect(() => {
    setaddItems((prev) => {
      return { ...prev, ...editItem };
    });
  }, [editItem]);

  const handlAddItemChanges = (e) => {
    setaddItems((perv) => {
      return { ...perv, [e.target.id]: e.target.value };
    });
  };

  console.log(addItems);

  function handleAddItemSubmit(e) {
    e.preventDefault();
    setaddItems({
      item_code: "",
      product_description: "",
      cost_price: "",
      salling_price: "",
      quantity: "",
      total_amount: "",
    });
    setshowAddItem(false);
  }

  return (
    <div className="additem-newEnquiry-container">
      <p>{editAddItem ? "Edit" : "Add New"} Product</p>
      <div className="additem-form-container">
        <form onSubmit={handleAddItemSubmit}>
          <div className="additem-box">
            <label htmlFor="item_code">
              Item Code<sup>*</sup>
            </label>
            <input
              id="item_code"
              value={addItems.item_code}
              onChange={handlAddItemChanges}
              type="text"
              placeholder="Enter Code"
              required
            />
          </div>
          <div className="additem-box">
            <label htmlFor="product_description">
              Product Description<sup>*</sup>
            </label>
            <input
              id="product_description"
              value={addItems.product_description}
              onChange={handlAddItemChanges}
              type="text"
              placeholder="Text Area"
              required
            />
          </div>
          <div className="additem-colom-box">
            <div className="additem-box2">
              <label htmlFor="cost_price">
                Cost Price<sup>*</sup>
              </label>
              <input
                id="cost_price"
                value={addItems.cost_price}
                onChange={handlAddItemChanges}
                type="number"
                placeholder="Enter Cost Price"
                required
              />
            </div>
            <div className="additem-box2">
              <label htmlFor="salling_price">
                Salling Price<sup>*</sup>
              </label>
              <input
                id="salling_price"
                value={addItems.salling_price}
                onChange={handlAddItemChanges}
                type="number"
                placeholder="Enter Salling Price"
                required
              />
            </div>
          </div>
          <div className="additem-box">
            <label htmlFor="quantity">
              Quantity<sup>*</sup>
            </label>
            <input
              id="quantity"
              value={addItems.quantity}
              onChange={handlAddItemChanges}
              type="number"
              placeholder="0"
              required
            />
          </div>
          <div className="additem-box">
            <label htmlFor="total_amount">
              Total<sup>*</sup>
            </label>
            <input
              id="total_amount"
              value={addItems.total_amount}
              onChange={handlAddItemChanges}
              type="text"
              placeholder="Total Amount"
              required
            />
          </div>
          <div className="additem-submit-container">
            <nav onClick={() => setshowAddItem(false)}>Cancel</nav>
            <button type="submit">Add Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}
