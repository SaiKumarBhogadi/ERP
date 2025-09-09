import React, { useState, useEffect } from "react";
import "./createNewPurchase.css";
import PurchaseSearchOption from "./purchaseSearchOption";
export default function purchaseListItem({
  unique_key,
  purchaseInput,
  purchaseItem,
  buttonAcs,
}) {
  const [uomOptions, setuomOptions] = useState([]);
  const [productData, setProductData] = useState({
    product_name: "",
    product_id: "--",
    uom: "--",
    in_stock: "--",
    qty_ordered: "",
    insufficient_stock: "--",
    unit_price: "",
    tax: "",
    discount: "",
    total: "--",
  });
  const handleItemDataChanges = (e) => {
    setProductData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  useEffect(() => {
    const selected = productData.product_name;
    if (!selected) {
      setProductData((prev) => ({
        ...prev,
        product_name: "",
        product_id: "--",
        uom: "--",
        in_stock: "--",
        qty_ordered: "",
        insufficient_stock: "--",
        unit_price: "",
        tax: "",
        discount: "",
        total: "--",
      }));
      setuomOptions([]);
      return;
    }
    const product = purchaseItem.find((ele) => ele.product_name === selected);
    if (product) {
      setProductData((prev) => ({
        ...prev,
        product_name: product.product_name,
        product_id: product.product_id,
        uom: product.uom,
        in_stock: product.in_stock,
        qty_ordered: product.qty_ordered,
        insufficient_stock: product.insufficient_stock,
        unit_price: product.unit_price,
        tax: product.tax,
        discount: product.discount,
        total: product.total,
      }));
      setuomOptions(product.uom || []);
    } else {
      setuomOptions([]);
    }
  }, [productData.product_name, purchaseItem]);
  return (
    <tr>
      <td>{unique_key + 1}</td>
      <td>
        <PurchaseSearchOption
          value={productData.product_name}
          onChange={(value) =>
            setProductData((prev) => ({
              ...prev,
              product_name: value,
            }))
          }
          productOptions={purchaseItem.map((p) => p.product_name)}
          buttonAcs={buttonAcs}
        />
      </td>
      <td>{productData.product_id}</td>
      <td>
        <select
          id="uom"
          value={productData.uom}
          onChange={handleItemDataChanges}
          disabled={buttonAcs}
        >
          <option value="">Select UOM</option>
          {uomOptions.map((ele, ind) => (
            <option value={ele} key={ind}>
              {ele}
            </option>
          ))}
        </select>
      </td>
      <td>{productData.in_stock}</td>
      <td>
        <input
          id="qty_ordered"
          type="number"
          value={productData.qty_ordered}
          onChange={handleItemDataChanges}
          disabled={buttonAcs}
        />
      </td>
      <td style={{ color: "red" }}>{productData.insufficient_stock}</td>
      <td>
        <input
          type="number"
          id="unit_price"
          value={productData.unit_price}
          onChange={handleItemDataChanges}
          disabled={buttonAcs}
        />
      </td>
      <td>
        <input
          type="number"
          id="tax"
          value={productData.tax}
          onChange={handleItemDataChanges}
          disabled={buttonAcs}
        />
      </td>
      <td>
        <input
          id="discount"
          type="number"
          value={productData.discount}
          onChange={handleItemDataChanges}
          disabled={buttonAcs}
        />
      </td>
      <td>
        {purchaseInput.currency === "IND" && <span>₹</span>}
        {purchaseInput.currency === "USD" && <span>$</span>}
        {purchaseInput.currency === "GBP" && <span>£</span>}
        {purchaseInput.currency === "SGD" && <span>S$</span>}
        {purchaseInput.currency === "EUR" && <span>€</span>}
        {productData.total}
      </td>
      <td>
        {" "}
        <svg
          className={`createNewPurchase-table-delete-logo ${
            buttonAcs ? "disabled" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 14 16"
        >
          <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
        </svg>
      </td>
    </tr>
  );
}
