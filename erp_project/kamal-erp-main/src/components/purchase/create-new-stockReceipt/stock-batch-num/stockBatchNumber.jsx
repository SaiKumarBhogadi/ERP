import React, { useState, useEffect } from "react";
import "./stockBatchNumber.css";

export default function stockBatchNumber({ setStockDim }) {
  const [batchInp, setbatchInp] = useState({
    stock_dim: "",
    batch_no: "",
    batch_qty: "",
    mfg_date: "",
    expiry_date: "",
  });

  const handelBatchChange = (e) => {
    setbatchInp((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  return (
    <>
      <div className="createNewStockBatch-container">
        <h3>Generate Batch Numbers</h3>
        <div className="createNewStockBatch-input-container">
          <div>
            <label htmlFor="product_name">Product Name</label>
            <input id="product_name" disabled />
          </div>
          <div>
            <label htmlFor="product_id">Product ID</label>
            <input id="product_id" disabled />
          </div>
          <div>
            <label htmlFor="uom">UOM</label>
            <input id="uom" disabled />
          </div>
          <div>
            <label htmlFor="stock_dim">Stock Dim.</label>
            <select
              id="stock_dim"
              value={batchInp.stock_dim}
              onChange={() => {
                handelBatchChange;
                setStockDim({
                  serialBox: true,
                  batchBox: false,
                });
              }}
            >
              <option value="Batch">Batch</option>
              <option value="Serial">Serial</option>
            </select>
          </div>
          <div>
            <label htmlFor="qty_received">Qty Received</label>
            <input id="qty_received" disabled />
          </div>
          <div>
            <label htmlFor="accepted_qty">Accepted Qty</label>
            <input id="accepted_qty" disabled />
          </div>
          <div>
            <label htmlFor="batch_qty">Batched Qty</label>
            <input id="batch_qty" disabled />
          </div>
        </div>
        <div className="createNewStockBatch-division">
          <nav>
            <form className="createNewStockBatch-serial-inp">
              <div className="createNewStockBatch-serial-inp-box">
                <label htmlFor="batch_no">
                  Batch No<sup style={{ color: "red" }}>*</sup> :
                </label>
                <input
                  value={batchInp.batch_no}
                  onChange={handelBatchChange}
                  type="text"
                  id="batch_no"
                  placeholder="Enter Batch Number"
                />
              </div>
              <div className="createNewStockBatch-serial-inp-box">
                <label htmlFor="batch_qty">
                  Batch Qty<sup style={{ color: "red" }}>*</sup> :
                </label>
                <input
                  value={batchInp.batch_qty}
                  onChange={handelBatchChange}
                  type="number"
                  id="batch_qty"
                  placeholder="Enter quantity for this batch"
                />
              </div>
              <div className="createNewStockBatch-serial-inp-box">
                <label htmlFor="mfg_date">Mfg. Date :</label>
                <input
                  value={batchInp.mfg_date}
                  onChange={handelBatchChange}
                  type="date"
                  id="mfg_date"
                />
              </div>
              <div className="createNewStockBatch-serial-inp-box">
                <label htmlFor="expiry_date">Expiry Date :</label>
                <input
                  value={batchInp.expiry_date}
                  onChange={handelBatchChange}
                  type="date"
                  id="expiry_date"
                />
              </div>
              <button
                className={
                  batchInp.batch_no === "" || batchInp.batch_qty === ""
                    ? "createNewStockBatch-serial-inactive"
                    : "createNewStockBatch-serial-active"
                }
                disabled={batchInp.batch_no === "" || batchInp.batch_qty === ""}
              >
                Add Batch
              </button>
            </form>
            <p className="createNewStockBatch-duplicate-tit">
              Duplicate Numbers
            </p>
            <textarea
              className="createNewStockBatch-duplicate-box"
              placeholder="Not found"
              disabled
            />
          </nav>
          <div className="createNewStockBatch-table">
            <table>
              <thead className="createNewStockBatch-table-head">
                <tr>
                  <th>S.No</th>
                  <th>
                    <pre>Serial No</pre>
                  </th>
                  <th>
                    <pre>Expiry Date</pre>
                  </th>
                  <th>B.Qty</th>
                  <th>S.Qty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="createNewStockBatch-table-body">
                <tr>
                  <td>1</td>
                  <td>UK-001</td>
                  <td>
                    <pre>20-06-2025</pre>
                  </td>
                  <td>25</td>
                  <td>2</td>
                  <td id="createNewStockBatch-table-action">
                    <nav className="createNewStockBatch-dot-container">
                      <button
                      // onClick={() => {
                      //   navigate(`/?tab=editNewSales/${ele.po_id}`);
                      //   setCurrentPage("editPurchase");
                      // }}
                      >
                        View Serial. No
                      </button>
                      <button
                        onClick={() => {
                          setStockDim({ batchSerialNO: true });
                        }}
                      >
                        Generate Serial. No
                      </button>
                      <button>Remove</button>
                    </nav>
                    <svg
                      className="createNewStockBatch-delete-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
                        fill="#2A2A2A"
                      />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="createNewStockBatch-btn-container">
          <button
            className="createNewStockBatch-cancel-btn"
            onClick={() => {
              setStockDim({ batchBox: false });
            }}
          >
            Cancel
          </button>
          <button className="createNewStockBatch-inactive-btn ">Apply</button>
        </div>
      </div>
    </>
  );
}
