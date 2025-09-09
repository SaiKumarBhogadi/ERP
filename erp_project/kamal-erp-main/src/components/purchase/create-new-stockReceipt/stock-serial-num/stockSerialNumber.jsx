import React, { useState, useEffect } from "react";
import "./stockSerialNumber.css";

export default function stockSerialNumber({ setStockDim }) {
  const [importBox, setImportBox] = useState(false);

  const [serialInp, setSerialInp] = useState({
    stock_dim: "",
    serial_no: "",
    import_serial: "",
  });

  const handelSerialChange = (e) => {
    setSerialInp((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  return (
    <>
      <div className="createNewStockSerial-container">
        <h3>Generate Serial Numbers</h3>
        <div className="createNewStockSerial-input-container">
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
              value={serialInp.stock_dim}
              onChange={() => {
                handelSerialChange;
                setStockDim({
                  serialBox: false,
                  batchBox: true,
                });
              }}
            >
              <option value="Serial">Serial</option>
              <option value="Batch">Batch</option>
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
            <label htmlFor="serials_generated">Serials Generated</label>
            <input id="serials_generated" disabled />
          </div>
        </div>
        <div className="createNewStockSerial-division">
          <nav>
            <form className="createNewStockSerial-serial-inp">
              <div className="createNewStockSerial-serial-inp-box">
                <label htmlFor="serial_no">Serial No :</label>
                <input
                  value={serialInp.serial_no}
                  onChange={handelSerialChange}
                  type="text"
                  id="serial_no"
                  placeholder="Enter Serial Number"
                />
              </div>
              <button
                className={
                  serialInp.serial_no === ""
                    ? "createNewStockSerial-serial-inactive"
                    : "createNewStockSerial-serial-active"
                }
                disabled={serialInp.serial_no === ""}
              >
                Add Serial
              </button>
            </form>
            <p
              className={`createNewStockSerial-imp-serialnum ${
                importBox === false
                  ? "createNewStockSerial-imp-serialnum-blue"
                  : "createNewStockSerial-imp-serialnum-black"
              }`}
              onClick={() => setImportBox(!importBox)}
            >
              Import Serial Numbers
            </p>
            {importBox && (
              <form className="createNewStockSerial-serial-inp">
                <div className="createNewStockSerial-serial-inp-box">
                  <textarea
                    value={serialInp.import_serial}
                    onChange={handelSerialChange}
                    id="import_serial"
                    type="text"
                    placeholder="Enter Serial Numbers (eg., Item-001, Item-002, etc.)"
                  />
                </div>
                <button
                  className={
                    serialInp.import_serial === ""
                      ? "createNewStockSerial-serial-inactive"
                      : "createNewStockSerial-serial-active"
                  }
                  disabled={serialInp.import_serial === ""}
                >
                  Import
                </button>
              </form>
            )}

            <p className="createNewStockSerial-duplicate-tit">
              Duplicate Numbers
            </p>
            <textarea
              className="createNewStockSerial-duplicate-box"
              placeholder="Not found"
              disabled
            />
          </nav>
          <div className="createNewStockSerial-table">
            <table>
              <thead className="createNewStockSerial-table-head">
                <tr>
                  <th>S.No</th>
                  <th>
                    <pre>Serial No</pre>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="createNewStockSerial-table-body">
                <tr>
                  <td>1</td>
                  <td>UK-001</td>
                  <td>
                    <svg
                      style={{ cursor: "pointer" }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3.55729 16C3.0684 16 2.65003 15.8261 2.30218 15.4782C1.95433 15.1304 1.78011 14.7117 1.77951 14.2222V2.66667H0.890625V0.888889H5.33507V0H10.6684V0.888889H15.1128V2.66667H14.224V14.2222C14.224 14.7111 14.05 15.1298 13.7022 15.4782C13.3543 15.8267 12.9357 16.0006 12.4462 16H3.55729ZM5.33507 12.4444H7.11284V4.44444H5.33507V12.4444ZM8.89062 12.4444H10.6684V4.44444H8.89062V12.4444Z"
                        fill="#234E70"
                      />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>UK-001</td>
                  <td>D</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>UK-001</td>
                  <td>D</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>UK-001</td>
                  <td>D</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>UK-001</td>
                  <td>D</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="createNewStockSerial-btn-container">
          <button
            className="createNewStockSerial-cancel-btn"
            onClick={() => {
              setStockDim({ serialBox: false });
            }}
          >
            Cancel
          </button>
          <button className="createNewStockSerial-inactive-btn">Apply</button>
        </div>
      </div>
    </>
  );
}
