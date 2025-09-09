import React, { useState, useEffect } from "react";
import "./createNewStockReceipt.css";
import StockSearchOption from "./stockSearchOption";

export default function StockListItem({
  unique_key,
  stockData,
  stockInput,
  BtnAccess,
  setStockDim,
}) {
  const [productData, setProductData] = useState({
    product_name: "",
    product_id: "",
    umo: "", // Fixed case
    qty_ordered: "",
    qty_received: "",
    accepted_qty: "",
    rejected_qty: "",
    qty_returned: "",
    stock_dim: "",
    warehouse: [],
    selected_warehouse: "",
  });

  useEffect(() => {
    const selected = stockData.find(
      (order) => order.po_reference_id === stockInput.po_reference_id
    );

    if (selected && selected.stock_table_data?.length > unique_key) {
      const product = selected.stock_table_data[unique_key];
      setProductData({
        product_name: product.product_name || "",
        product_id: product.product_id || "",
        umo: product.umo || "", // Fixed case
        qty_ordered: product.qty_ordered || "",
        qty_received: product.qty_received || "",
        accepted_qty: product.accepted_qty || "",
        rejected_qty: product.rejected_qty || "",
        qty_returned: product.qty_returned || "",
        stock_dim: product.stock_dim,
        warehouse: product.warehouse || [],
        selected_warehouse: "",
      });
    }
  }, [stockInput.po_reference_id, unique_key, stockData]);

  const handleProductSelect = (selectedProductName) => {
    const selectedOrder = stockData.find(
      (order) => order.po_reference_id === stockInput.po_reference_id
    );

    if (selectedOrder) {
      const selectedProduct = selectedOrder.stock_table_data.find(
        (p) => p.product_name === selectedProductName
      );

      if (selectedProduct) {
        setProductData((prev) => ({
          ...prev,
          product_name: selectedProduct.product_name,
          product_id: selectedProduct.product_id,
          umo: selectedProduct.umo,
          qty_ordered: selectedProduct.qty_ordered,
          qty_received: selectedProduct.qty_received,
          accepted_qty: selectedProduct.accepted_qty,
          rejected_qty: selectedProduct.rejected_qty,
          qty_returned: selectedProduct.qty_returned,
          stock_dim: selectedProduct.stock_dim,
          warehouse: selectedProduct.warehouse || [],
          selected_warehouse: "",
        }));
      }
    }
  };

  return (
    <tr key={unique_key}>
      <td>{unique_key + 1}</td>
      <td>
        <StockSearchOption
          value={productData.product_name}
          onChange={handleProductSelect}
          productOptions={
            stockData
              .find(
                (order) => order.po_reference_id === stockInput.po_reference_id
              )
              ?.stock_table_data.map((p) => p.product_name) || []
          }
          BtnAccess={BtnAccess}
        />
      </td>
      <td>
        <p
          className={
            productData.stock_dim ? "cerateNewStock-stockDim-blue" : ""
          }
          onClick={() => {
            setStockDim({
              serialBox: productData.stock_dim === "Serial",
              batchBox: productData.stock_dim === "Batch",
              activeRow:
                productData.stock_dim === "Serial" ||
                productData.stock_dim === "Batch"
                  ? unique_key
                  : null,
              activeProduct:
                productData.stock_dim === "Serial" ||
                productData.stock_dim === "Batch"
                  ? productData
                  : null,
            });
          }}
        >
          {productData.product_id}
        </p>
      </td>
      <td>{productData.umo}</td>
      <td>{productData.qty_ordered}</td>
      <td>
        <input
          type="number"
          min="0"
          max={productData.qty_ordered}
          value={productData.qty_received}
          onChange={(e) => {
            const received = parseInt(e.target.value) || 0;
            const accepted = parseInt(productData.accepted_qty) || 0;
            setProductData((prev) => ({
              ...prev,
              qty_received: received,
              rejected_qty: Math.max(0, received - accepted),
            }));
          }}
          required
          disabled={BtnAccess}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max={productData.qty_received}
          value={productData.accepted_qty}
          onChange={(e) => {
            const accepted = parseInt(e.target.value) || 0;
            const received = parseInt(productData.qty_received) || 0;
            setProductData((prev) => ({
              ...prev,
              accepted_qty: accepted,
              rejected_qty: Math.max(0, received - accepted),
            }));
          }}
          required
          disabled={BtnAccess}
        />
      </td>
      <td>{productData.rejected_qty}</td>
      <td>{productData.qty_returned}</td>
      <td>
        <select
          id="stock_dim"
          value={productData.stock_dim}
          onChange={(e) => {
            e.preventDefault();
            setProductData((prev) => {
              return { ...prev, [e.target.id]: e.target.value };
            });
          }}
          required
          disabled={BtnAccess}
        >
          <option value="">None</option>
          <option value="Serial">Serial</option>
          <option value="Batch">Batch</option>
        </select>
      </td>
      <td>
        <select
          value={productData.selected_warehouse}
          onChange={(e) =>
            setProductData((prev) => ({
              ...prev,
              selected_warehouse: e.target.value,
            }))
          }
          required
          disabled={BtnAccess}
        >
          <option value="">None</option>
          {productData.warehouse?.map((ele, ind) => (
            <option value={ele} key={ind}>
              {ele}
            </option>
          ))}
        </select>
      </td>
      <td>
        <svg
          //   onClick={() => onDelete(unique_key)}
          className={`cerateNewStock-table-delete-logo ${
            BtnAccess ? "disabled" : ""
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
