import React, { useState, useEffect } from "react";
import "./stockReceipt.css";
import { useNavigate } from "react-router-dom";

export default function stockReceipt({ setCurrentPage }) {
  const navigate = useNavigate();
  const [stockCurrentPage, setStockCurrentPage] = useState(1);
  const stockPerPage = 10;

  const [ApiStockData, setApiStockData] = useState({});
  const [stockData, setStockData] = useState([]);
  const stockFromAip = {
    stockData: [
      {
        grn_id: "GRN-0001",
        po_ref: "PO-0001",
        receiced_date: "28-05-2025",
        supplier_name: "Supplier 1",
        total_items: "2",
        received_by: "Mandy",
        qc_done_by: "Sans",
        status: "Draft",
      },
      {
        grn_id: "GRN-0002",
        po_ref: "PO-0002",
        receiced_date: "28-05-2025",
        supplier_name: "Supplier 1",
        total_items: "2",
        received_by: "Mandy",
        qc_done_by: "Sans",
        status: "Draft",
      },
      {
        grn_id: "GRN-0003",
        po_ref: "PO-0003",
        receiced_date: "28-05-2025",
        supplier_name: "Supplier 1",
        total_items: "2",
        received_by: "Mandy",
        qc_done_by: "Sans",
        status: "Submitted",
      },
      {
        grn_id: "GRN-0004",
        po_ref: "PO-0004",
        receiced_date: "28-05-2025",
        supplier_name: "Supplier 1",
        total_items: "2",
        received_by: "Mandy",
        qc_done_by: "Sans",
        status: "Submitted",
      },
      {
        grn_id: "GRN-0005",
        po_ref: "PO-0005",
        receiced_date: "28-05-2025",
        supplier_name: "Supplier 1",
        total_items: "2",
        received_by: "Mandy",
        qc_done_by: "Sans",
        status: "Returned",
      },
      {
        grn_id: "GRN-0006",
        po_ref: "PO-0006",
        receiced_date: "28-05-2025",
        supplier_name: "Supplier 1",
        total_items: "2",
        received_by: "Mandy",
        qc_done_by: "Sans",
        status: "Returned",
      },
      {
        grn_id: "GRN-0007",
        po_ref: "PO-0007",
        receiced_date: "28-05-2025",
        supplier_name: "Supplier 1",
        total_items: "2",
        received_by: "Mandy",
        qc_done_by: "Sans",
        status: "Cancelled",
      },
    ],
  };
  const [filter, setFilter] = useState({
    status: "",
    supplier_name: "",
    stock_from_date: "",
    stock_to_date: "",
  });

  useEffect(() => {
    setApiStockData(stockFromAip);
  }, []);
  useEffect(() => {
    if (Object.keys(ApiStockData).length > 0) {
      setStockData(ApiStockData.stockData);
    }
  }, [ApiStockData]);

  //page calculation
  const totalPages = Math.ceil(stockData.length / stockPerPage);

  const currentData = stockData.slice(
    (stockCurrentPage - 1) * stockPerPage,
    stockCurrentPage * stockPerPage
  );

  const handleNext = () => {
    if (stockCurrentPage < totalPages) {
      setStockCurrentPage((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (stockCurrentPage > 1) {
      setStockCurrentPage((prev) => prev - 1);
    }
  };
  const handleClearFilter = () => {
    setFilter({
      status: "",
      supplier_name: "",
      stock_from_date: "",
      stock_to_date: "",
    });
  };

  return (
    <>
      <div className="stockReceipt-container">
        <div className="stockReceipt-header">
          <p>Stock Receipt Note</p>
          <button
            onClick={() => {
              setCurrentPage("createNewStockReceipt");
            }}
          >
            + New Stock Receipt
          </button>
        </div>
        <div className="stockReceipt-search-box">
          <label htmlFor="searchByID">
            <svg
              className="stockReceipt-search-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input
            id="searchByID"
            placeholder="Search by DN number, Customer name...."
          />
        </div>
        <div className="stockReceipt-clearfilter">
          <p onClick={handleClearFilter}>Clear Filter</p>
        </div>
        <div className="stockReceipt-search-category">
          <div className="stockReceipt-input-box">
            <label htmlFor="status">Status</label>
            <select
              value={filter.status}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  status: e.target.value,
                }));
              }}
              id="status"
            >
              <option value="">select status</option>
              <option value="All">All</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="stockReceipt-input-box">
            <label htmlFor="supplier_name">Supplier name</label>
            <select
              value={filter.supplier_name}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  supplier_name: e.target.value,
                }));
              }}
              id="supplier_name"
            >
              <option value="">Select name</option>
              <option value="All">All</option>
              <option value="Supplier 1">Supplier 1</option>
              <option value="Supplier 2">Supplier 2</option>
            </select>
          </div>
          <div className="stockReceipt-input-box">
            <label htmlFor="received_date">Received Date</label>
            <nav id="received_date">
              <div>
                <span>From </span>
                <input
                  value={filter.stock_from_date}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      stock_from_date: e.target.value,
                    }));
                  }}
                  className="stockReceipt-date"
                  type="date"
                />
              </div>
              <div>
                <span>to </span>
                <input
                  value={filter.stock_to_date}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      stock_to_date: e.target.value,
                    }));
                  }}
                  className="stockReceipt-date"
                  type="date"
                />
              </div>
            </nav>
          </div>
        </div>
        <div className="stockReceipt-table-cointainer">
          <table>
            <thead className="stockReceipt-table-head">
              <tr>
                <th></th>
                <th>
                  <pre>GRN ID</pre>
                </th>
                <th>
                  <pre>PO Ref.</pre>
                </th>
                <th>
                  <pre>Received Date</pre>
                </th>
                <th>
                  <pre>Supplier Name</pre>
                </th>
                <th>
                  <pre>Total Items</pre>
                </th>
                <th>
                  <pre>Received By</pre>
                </th>
                <th>
                  <pre>QC Done By</pre>
                </th>
                <th>
                  <pre>Status</pre>
                </th>
                <th>
                  <pre>Action</pre>
                </th>
              </tr>
            </thead>
            <tbody className="stockReceipt-table-body">
              {currentData.length > 0 ? (
                currentData.map((ele, ind) => (
                  <tr key={ind}>
                    <td>
                      <input
                        type="checkbox"
                        className="stockReceipt-table-check"
                      />
                    </td>
                    <td>
                      <pre>{ele.grn_id}</pre>
                    </td>
                    <td>
                      <pre>{ele.po_ref}</pre>
                    </td>
                    <td>{ele.receiced_date}</td>
                    <td>{ele.supplier_name}</td>
                    <td>{ele.total_items}</td>
                    <td>{ele.received_by}</td>
                    <td>{ele.qc_done_by}</td>
                    <td>
                      {" "}
                      <p
                        className={`stockReceipt-Status ${
                          ele.status === "Draft"
                            ? "stockReceipt-Status-draft"
                            : ele.status === "Submitted"
                            ? "stockReceipt-Status-Submitted"
                            : ele.status === "Cancelled"
                            ? "stockReceipt-Status-Cancelled"
                            : ele.status === "Returned"
                            ? "stockReceipt-Status-Returned"
                            : ""
                        }`}
                      >
                        {ele.status}
                      </p>
                    </td>
                    <td id="stockReceipt-table-action">
                      <nav className="stockReceipt-dot-container">
                        <button
                          onClick={() => {
                            navigate(`/?tab=editNewSales/${ele.grn_id}`);
                            setCurrentPage("editStockReceipt");
                          }}
                        >
                          {ele.status === "Draft" ? "Edit" : "View"} details
                        </button>
                        <button disabled={ele.status !== "Submitted"}>
                          Generate Stock Return
                        </button>
                      </nav>
                      <svg
                        className="stockReceipt-delete-logo"
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
                ))
              ) : (
                <tr>
                  <td></td>
                  <td>
                    <pre>No Data Found</pre>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <nav className="stockReceipt-table-bottem">
          <p className="stockReceipt-num-entries">
            Showing {currentData.length} entries
          </p>
          <div className="stockReceipt-manage-control-box">
            <button
              className="stockReceipt-manage-btn"
              onClick={handlePrev}
              disabled={stockCurrentPage === 1}
            >
              Prev
            </button>
            <nav className="stockReceipt-num-page">
              {" "}
              Page {stockCurrentPage} of {totalPages}{" "}
            </nav>
            <button
              className="stockReceipt-manage-btn"
              onClick={handleNext}
              disabled={stockCurrentPage === totalPages}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
