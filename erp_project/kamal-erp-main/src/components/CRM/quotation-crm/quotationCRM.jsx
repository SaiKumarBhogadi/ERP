import React, { useState, useEffect } from "react";
import "./quotationCRM.css";
import CreateNewQuotation from "../create-new-quotation/createNewQuotation";
import CreateNewQuotationEdit from "../create-new-quotation/createNewQuotationEdit";

export default function quotation() {
  const [status, setStatus] = useState("");

  console.log(status);

  const [selectStatus, setselectStatus] = useState("");
  const [seleQuotationType, setseleQuotationType] = useState("");
  const [selectSales, setselectSales] = useState("");

  const [quotationCurrentPage, setquotationCurrentPage] = useState(1);
  const quotationRowPerPage = 10;

  const [showNewQuotation, setshowNewQuotation] = useState(false);
  const [showEditNewQuotation, setshowEditNewQuotation] = useState(false);
  const [editQuotationData, setEditQuotationData] = useState({});

  const [ApiQuotation, setApiQuotation] = useState({});
  const [quotation, setQuotation] = useState([]);
  const [searchSalseRep, setsearchSalseRep] = useState([]);
  const quotationFromAPI = {
    quotation: [
      {
        id: "1",
        quotation_id: "QUO0001",
        quotation_type: "Service",
        customer_name: "Mandy",
        sales_rep: "Sans",
        quotation_date: "2025-10-10",
        status: "Draft",
        currency: "USD",
        revise_count: 1,
        grand_total: "50000",
        product_id: "PRO0005",
        description: "M-shirt",
        uom: "Set (5)",
        unit_price: "130",
        discount: "5",
        tax: "12",
        quantity: "50",
      },

      {
        id: "2",
        quotation_id: "QUO0002",
        quotation_type: "Service",
        customer_name: "Mandy",
        sales_rep: "Sans",
        quotation_date: "2025-10-10",
        status: "Send",
        revise_count: 2,
        grand_total: "50000",
        products: [
          {
            product_id: "PRO0005",
            description: "M-shirt",
            uom: "Set (5)",
            unit_price: "5",
            discount: "5",
            tax: "18",
            quantity: "9",
          },
          {
            product_id: "PRO0005",
            description: "M-shirt",
            uom: "Set (5)",
            unit_price: "5",
            discount: "5",
            tax: "18",
            quantity: "9",
          },
        ],
      },
      {
        id: "3",
        quotation_id: "QUO0003",
        quotation_type: "Service",
        customer_name: "Sans",
        sales_rep: "Sans",
        quotation_date: "2025-10-10",
        status: "Rejected",
        grand_total: "50000",
        product_id: "PRO0005",
        description: "M-shirt",
        uom: "Set (5)",
        unit_price: "130",
        discount: "5",
        tax: "12",
        quantity: "5",
      },
      {
        id: "4",
        quotation_id: "QUO0004",
        quotation_type: "Service",
        customer_name: "Mandy",
        sales_rep: "Sans",
        quotation_date: "2025-10-10",
        status: "Approved",
        grand_total: "50000",
      },
      {
        id: "5",
        quotation_id: "QUO0005",
        quotation_type: "Service",
        customer_name: "Naveen",
        sales_rep: "Sans",
        quotation_date: "2025-10-10",
        status: "Expired",
        grand_total: "50000",
      },
      {
        id: "6",
        quotation_id: "QUO0006",
        quotation_type: "Service",
        customer_name: "rahul",
        sales_rep: "Sans",
        quotation_date: "2025-10-10",
        status: "Expired",
        grand_total: "50000",
      },
      {
        id: "7",
        quotation_id: "QUO0007",
        quotation_type: "Service",
        customer_name: "Mandy",
        sales_rep: "Sans",
        quotation_date: "2025-10-10",
        status: "Draft",
        revise_count: 5,
        grand_total: "50000",
      },
    ],
    searchSalseRep: ["Michael", "Harish", "Michael"],
  };
  useEffect(() => {
    setApiQuotation(quotationFromAPI);
  }, []);
  useEffect(() => {
    if (Object.keys(ApiQuotation).length) {
      setQuotation(ApiQuotation.quotation);
      setsearchSalseRep(ApiQuotation.searchSalseRep);
    }
  }, [ApiQuotation]);

  //page calculation
  const totalPages = Math.ceil(quotation.length / quotationRowPerPage);

  const currentData = quotation.slice(
    (quotationCurrentPage - 1) * quotationRowPerPage,
    quotationCurrentPage * quotationRowPerPage
  );

  const handleNext = () => {
    if (quotationCurrentPage < totalPages) {
      setquotationCurrentPage((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (quotationCurrentPage > 1) {
      setquotationCurrentPage((prev) => prev - 1);
    }
  };

  const showEditQuotation = (id) => {
    setEditQuotationData(
      currentData.find((ele) => {
        return ele.id === id;
      })
    );
  };
  function resetSearchBox() {
    setselectSales("");
    setseleQuotationType("");
    setselectStatus("");
    console.log(seleQuotationType, selectSales, selectStatus);
  }

  return (
    <>
      {showNewQuotation ? (
        <CreateNewQuotation
          setshowNewQuotation={setshowNewQuotation}
          showEditNewQuotation={showEditNewQuotation}
          setEditQuotationData={setEditQuotationData}
          status={status}
          setStatus={setStatus}
        />
      ) : showEditNewQuotation ? (
        <CreateNewQuotationEdit
          setshowNewQuotation={setshowEditNewQuotation}
          showEditNewQuotation={showEditNewQuotation}
          editQuotationData={editQuotationData}
          setEditQuotationData={setEditQuotationData}
          status={status}
          setStatus={setStatus}
        />
      ) : (
        <div className="quotationCRM-container">
          <div className="quotationCRM-header">
            <p>Quotation</p>
            <button onClick={() => setshowNewQuotation(true)}>
              + Add New Quotation
            </button>
          </div>
          <div className="quotationCRM-search-box">
            <label htmlFor="searchByID">
              <svg
                className="quotationCRM-search-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </label>
            <input id="searchByID" placeholder="Search by ID,Name..." />
          </div>
          <div className="quotationCRM-clearfilter">
            <p onClick={resetSearchBox}>Clear Filter</p>
          </div>
          <div className="quotationCRM-search-category">
            <div className="quotationCRM-input-box">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={selectStatus}
                onChange={(e) => setselectStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="Draft">Draft</option>
                <option value="Send">Send</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <div className="quotationCRM-input-box">
              <label htmlFor="quotation_type">Quotation Type</label>
              <select
                id="quotation_type"
                value={seleQuotationType}
                onChange={(e) => setseleQuotationType(e.target.value)}
              >
                <option value="">All</option>
                <option value="Standard">Standard</option>
                <option value="Blanket">Blanket</option>
                <option value="Service">Service</option>
              </select>
            </div>

            <div className="quotationCRM-input-box">
              <label htmlFor="sales_rep">Sales Rep</label>
              <select
                id="sales_rep"
                value={selectSales}
                onChange={(e) => setselectSales(e.target.value)}
              >
                <option value="">All</option>
                {searchSalseRep.map((ele, ind) => (
                  <option key={ind} value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="quotationCRM-table-cointainer">
            <table>
              <thead className="quotationCRM-thead">
                <tr>
                  <th id="quotationCRM-table-max-width">Quotation ID</th>
                  <th id="quotationCRM-table-max-width">Quotation Type</th>
                  <th id="quotationCRM-table-max-width">Customer Name</th>
                  <th id="quotationCRM-table-min-width">Sales Rep</th>
                  <th id="quotationCRM-table-max-width">Quotation Date</th>
                  <th>Status</th>
                  <th id="quotationCRM-table-min-width">Grand Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="quotationCRM-tbody">
                {currentData.length > 0 ? (
                  currentData.map((ele, ind) => (
                    <tr key={ind}>
                      <td id="quotationCRM-table-max-width">
                        {ele.quotation_id}
                      </td>
                      <td id="quotationCRM-table-max-width">
                        {ele.quotation_type}
                      </td>
                      <td id="quotationCRM-table-max-width">
                        {ele.customer_name}
                      </td>
                      <td id="quotationCRM-table-min-width">{ele.sales_rep}</td>
                      <td id="quotationCRM-table-max-width">
                        {ele.quotation_date}
                      </td>
                      <td>
                        <div
                          className={`quotationCRM-status ${
                            ele.status === "Draft"
                              ? "quotationCRM-status-Draft"
                              : ele.status === "Send"
                              ? "quotationCRM-status-Send"
                              : ele.status === "Approved"
                              ? "quotationCRM-status-Approved"
                              : ele.status === "Rejected"
                              ? "quotationCRM-status-Rejected"
                              : ele.status === "Expired"
                              ? "quotationCRM-status-Expired"
                              : ""
                          }`}
                        >
                          {ele.status}
                        </div>
                      </td>
                      <td id="quotationCRM-table-min-width">
                        {ele.grand_total}
                      </td>
                      <td>
                        <div
                          className="quotationCRM-table-view"
                          onClick={() => {
                            showEditQuotation(ele.id);
                            setshowEditNewQuotation(true);
                          }}
                        >
                          {ele.status === "Draft" ? "Edit" : "View"}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <nav className="quotationCRM-table-bottem">
            <p className="quotationCRM-num-entries">
              Showing {currentData.length} entries
            </p>
            <div className="quotationCRM-manage-control-box">
              <button
                className="quotationCRM-manage-btn"
                onClick={handlePrev}
                disabled={quotationCurrentPage === 1}
              >
                Prev
              </button>
              <nav className="quotationCRM-num-page">
                {" "}
                Page {quotationCurrentPage} of {totalPages}{" "}
              </nav>
              <button
                className="quotationCRM-manage-btn"
                onClick={handleNext}
                disabled={quotationCurrentPage === totalPages}
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
