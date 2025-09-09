import React, { useState, useEffect } from "react";
import "./createNewSales.css";
import { toast } from "react-toastify";

export default function creatNewSalesStockAlert({
  setStockAlert,
  setSalesStatus,
  purchase_order,
  SalesList_data,
  setCurrentPage,
}) {
  const hasZeroStock = SalesList_data.some(
    ({ stock_level = 0 }) => Number(stock_level) === 0
  );

  return (
    <>
      <div className="createNewSales-stock-container">
        <h3>
          <span>Stock Alert </span>– Insufficient Stock
        </h3>
        <p>
          {hasZeroStock
            ? "Some products in your sales order still have insufficient stock. A purchase order has already been generated. "
            : " Some products in your sales order still have insufficient stock. A partially purchase order has already been generated. You can proceed with partial delivery for available items."}
        </p>
        <nav>
          <button
            className="createNewSales-cancel-btn"
            onClick={(e) => {
              e.preventDefault;
              setStockAlert(false);
            }}
          >
            Cancel
          </button>
          <button
            className={
              purchase_order === "Purchase Ordered"
                ? "createNewSales-completed-btn"
                : "createNewSales-active-btn "
            }
            disabled={purchase_order === "Purchase Ordered" ? true : false}
            onClick={() => {
              setCurrentPage("createNewPurchase");
            }}
          >
            Generate Purchase Order
          </button>
          <button
            className={
              hasZeroStock
                ? "createNewSales-inactive-btn"
                : "createNewSales-active-btn"
            }
            onClick={(e) => {
              e.preventDefault;
              setSalesStatus("Submitted(PD)");
              toast.success("Sales order has been submitted(PD)");
              setStockAlert(false);
            }}
            disabled={hasZeroStock ? true : false}
          >
            Proceed with Partial Delivery
          </button>
        </nav>
      </div>
    </>
  );
}
