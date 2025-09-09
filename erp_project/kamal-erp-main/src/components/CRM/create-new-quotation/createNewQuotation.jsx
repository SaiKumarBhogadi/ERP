import React, { useEffect, useState } from "react";
import "./createNewQuotation.css";
import QuotationList from "./QuotationList";
import CreateNewQuotationComments from "./createNewQuotationComments";
import CreateNewQuotationHistory from "./createNewQuotationHistory";
import CreateNewQuotationAttachment from "./createNewQuotationAttachment";
import CreateNewQuotationRevision from "./createNewQuotationRevision";
import CreateNewQuptationRevisionHistory from "./createNewQuptationRevisionHistory";
import { toast } from "react-toastify";

export default function createNewQuotation({
  setshowNewQuotation,
  status,
  setStatus,
}) {
  const [comment, setComment] = useState(true);
  const [history, sethistory] = useState(false);
  const [attachment, setattachment] = useState(false);
  //new quotationdata
  const [newQuotationData, setNewQuotationData] = useState({
    quotation_id: "",
    quotation_type: "",
    quotation_date: "",
    expiry_date: "",
    customer_name: "",
    customer_po_referance: "",
    sales_rep: "",
    currency: "",
    payment_terms: "",
    expected_delivery: "",
  });

  const [ApiNewQuotation, setApiNewQuotation] = useState({});
  const [customer_name, setcustomer_name] = useState([]);
  const [sales_rep, setsales_rep] = useState([]);
  const [currency, setcurrency] = useState([]);
  const [quotation_table_data, setquotation_table_data] = useState([]);
  const [descriptions, setdescriptions] = useState([]);
  //total summery
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [shippingCharges, setShippingCharges] = useState(0);
  //button
  const [buttonState, setButtonState] = useState({
    saveDraft: false,
    submit: false,
    approve: true,
    reject: true,
    salesOrder: true,
    pdf: true,
    email: true,
    historyBtn: true,
    reviseBtn: true,
  });

  const [inputDisable, setinputDisable] = useState(false);

  const [showHistory, setshowHistory] = useState(false);
  const [showRevise, setshowRevise] = useState(false);

  const [reviseCount, setreviseCount] = useState(1);

  // QuotationList Data
  const [numberOfQuotationList, setnumberOfQuotationList] = useState(1);
  const [QuotationList_data, setQuotationList_data] = useState([
    { unique_key: 0 },
  ]);

  const newQuotationFromApi = {
    customer_name: [
      "Mandy",
      "Rose",
      "Sans",
      "Mandy",
      "Rose",
      "Sans",
      "Mandy",
      "Rose",
      "Sans",
      "Mandy",
      "Rose",
      "Sans",
      "Mandy",
      "Rose",
      "Sans",
      "Mandy",
      "Rose",
      "Sans",
      "Mandy",
      "Rose",
      "Sans",
      "Mandy",
      "Rose",
      "Sans",
    ],
    sales_rep: ["Sans", "rose", "Mandy"],
    currency: ["USD", "IND", "ERU", "GBP", "SGD"],

    descriptions: [
      "E-shirt",
      "M-shirt",
      "T-shirt",
      "AlphaWear",
      "MetroStyle",
      "TrendTee",
      "EcoFit",
      "UrbanMode",
      "ClassicEdge",
      "BoldThread",
      "FlexLine",
      "NeoFabric",
      "ZenAttire",
      "PulseWear",
      "VibeCloth",
    ],
    quotation_table_data: [
      {
        product_id: "PRO001",
        description: "E-shirt",
        uom: ["Set (5)", "Box (5)"],
        unit_price: "120",
        discount: "5",
        tax: ["18", "12"],
      },
      {
        product_id: "PRO002",
        description: "M-shirt",
        uom: ["Set (5)", "Box (5)"],
        unit_price: "130",
        discount: "5",
        tax: ["18", "12"],
      },
      {
        product_id: "PRO003",
        description: "T-shirt",
        uom: ["Set (5)", "Box (5)"],
        unit_price: "150",
        discount: "5",
        tax: ["18", "12"],
      },
    ],
  };
  const handleNewQuotationDataChange = (e) => {
    setNewQuotationData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };
  //only for currency Symbol change
  const handleNewQuotationCurrencyChange = (e) => {
    const selected = e.target.value;
    setNewQuotationData((prev) => ({
      ...prev,
      currency: selected,
    }));
  };

  useEffect(() => {
    setApiNewQuotation(newQuotationFromApi);
  }, []);
  useEffect(() => {
    if (Object.keys(ApiNewQuotation).length > 0) {
      setcustomer_name(ApiNewQuotation.customer_name);
      setsales_rep(ApiNewQuotation.sales_rep);
      setcurrency(ApiNewQuotation.currency);
      setdescriptions(ApiNewQuotation.descriptions);
      setquotation_table_data(ApiNewQuotation.quotation_table_data);
    }
  }, [ApiNewQuotation]);

  useEffect(() => {
    const defaultState = {
      saveDraft: true,
      submit: true,
      approve: true,
      reject: true,
      salesOrder: true,
      pdf: false,
      email: false,
      historyBtn: true,
      reviseBtn: false,
    };

    switch (status) {
      case "Draft":
        setButtonState({
          saveDraft: false,
          submit: false,
          approve: true,
          reject: true,
          salesOrder: true,
          pdf: false,
          email: false,
          historyBtn: reviseCount > 1 ? false : true,
          reviseBtn: true,
        });
        break;

      case "Send":
        setButtonState({
          ...defaultState,
          approve: false,
          reject: false,
        });
        break;

      case "Approved":
        setButtonState({
          ...defaultState,
          salesOrder: false,
        });
        break;

      case "Rejected":
      case "Converted (SO)":
      case "Expired":
        setButtonState(defaultState);
        break;

      default:
        break;
    }
  }, [status, reviseCount]);
  useEffect(() => {
    if (
      status === "Send" ||
      status === "Approved" ||
      status === "Rejected" ||
      status === "Converted (SO)" ||
      status === "Expired"
    ) {
      setinputDisable(true);
    } else {
      setinputDisable(false);
    }
  }, [status]);

  // button submit functionality
  const handleSaveDraftState = (e) => {
    e.preventDefault();
    setStatus("Draft");
    toast.success("Quotation Item in Save Draft State");
  };
  const handleSubmitState = (e) => {
    e.preventDefault();
    setStatus("Send");
    toast.success("Quotation Item in send State");
  };
  const handleApprovedState = (e) => {
    e.preventDefault();
    setStatus("Approved");
    toast.success("Quotation Item in Apporved State");
    return "Approved";
  };
  const handleRejectedState = (e) => {
    e.preventDefault();
    setStatus("Rejected");
    toast.success("Quotation Item in Rejected State");
  };
  const handleSalseState = (e) => {
    e.preventDefault();
    setStatus("Converted (SO)");
    toast.success("Quotation Item in Converted (SO) State");
  };
  const handleHistory = (e) => {
    e.preventDefault();
    setshowHistory(true);
  };
  const handleRevise = (e) => {
    e.preventDefault();
    setshowRevise(true);
    setreviseCount((prevCount) => prevCount + 1);
  };

  const handleCancelNewQuotation = (e) => {
    e.preventDefault();
    const okDel = window.confirm(
      "Are you sure you want to Cancel New Quotation?"
    );
    if (okDel) {
      setshowNewQuotation(false);
      setNewQuotationData({
        quotation_id: "",
        quotation_type: "",
        quotation_date: "",
        expiry_date: "",
        customer_name: "",
        customer_po_referance: "",
        sales_rep: "",
        currency: "",
        payment_terms: "",
        expected_delivery: "",
      });
      toast.success("Product Item deleted!");
    }
  };
  function productTotal(ind) {
    const data = QuotationList_data[ind];
    const quantity = parseFloat(data.quantity) || 0;
    const unitPrice = parseFloat(data.unit_price) || 0;
    const discount = parseFloat(data.discount) || 0;
    const tax = parseFloat(data.tax) || 0;

    const subtotal = quantity * unitPrice;
    const taxAmount = (subtotal * tax) / 100;
    const taxedAmount = subtotal + taxAmount;

    const discountAmount = (taxedAmount * discount) / 100;
    const total = taxedAmount - discountAmount;

    return total.toFixed(2); // Total after tax, then discount
  }

  function calculateSubtotal() {
    const total = QuotationList_data.reduce((acc, data) => {
      const quantity = parseFloat(data.quantity) || 0;
      const unitPrice = parseFloat(data.unit_price) || 0;
      const discount = parseFloat(data.discount) || 0;
      const tax = parseFloat(data.tax) || 0;

      const subtotal = quantity * unitPrice;
      const taxAmount = (subtotal * tax) / 100;
      const taxedAmount = subtotal + taxAmount;
      const discountAmount = (taxedAmount * discount) / 100;
      const total = taxedAmount - discountAmount;

      return acc + total;
    }, 0);

    return total.toFixed(2);
  }

  function calculateTaxSummery() {
    const taxTotal = QuotationList_data.reduce((acc, data) => {
      const quantity = parseFloat(data.quantity) || 0;
      const unitPrice = parseFloat(data.unit_price) || 0;
      const tax = parseFloat(data.tax) || 0;

      const subtotal = quantity * unitPrice;
      const taxAmount = (subtotal * tax) / 100;

      return acc + taxAmount;
    }, 0);

    return taxTotal.toFixed(2);
  }

  function calculateGrandTotal() {
    const subtotal = parseFloat(calculateSubtotal()) || 0;
    const discountAmount = (subtotal * globalDiscount) / 100;
    const grandTotal = subtotal - discountAmount + shippingCharges;

    return grandTotal.toFixed(2);
  }

  function roundedGrandTotal() {
    const total = calculateGrandTotal();
    const roundedtotal = total % 1 > 0.5 ? Math.ceil(total) : Math.floor(total);
    return roundedtotal;
  }
  function roundedvalue() {
    const rounded_total = roundedGrandTotal();
    const unrounded_total = parseFloat(calculateGrandTotal()) || 0;
    return (rounded_total - unrounded_total).toFixed(2);
  }

  // deleteQuotationProduct
  function deleteQuotationProduct(ind) {
    const okDel = window.confirm(
      "Are you sure you want to delete this Product?"
    );
    if (okDel) {
      setQuotationList_data((prev) => prev.filter((_, index) => index !== ind));
      setnumberOfQuotationList((prev) => prev - 1);

      toast.success("Product Item deleted!");
    }
  }
  console.log(newQuotationData);

  return (
    <>
      {showRevise && (
        <div className="newQuotation-revisionBtn">
          <CreateNewQuotationRevision
            showRevise={showRevise}
            setshowRevise={setshowRevise}
            reviseCount={reviseCount}
            setreviseCount={setreviseCount}
            status={status}
            setStatus={setStatus}
          />
        </div>
      )}
      {showHistory && (
        <div className="newQuotation-historyBtn">
          <CreateNewQuptationRevisionHistory setshowHistory={setshowHistory} />
        </div>
      )}
      <div
        className={`newQuotation-container ${
          (showRevise || showHistory) && "newQuotation-blur"
        }`}
      >
        <form onSubmit={handleSubmitState}>
          <div className="newQuotation-tit">
            <nav>
              <p>Create New Quotation</p>
              {status !== "" && (
                <h3
                  className={
                    (status === "Draft" && "newQuotation-status-bg-draft") ||
                    (status === "Send" && "newQuotation-status-bg-send") ||
                    (status === "Approved" &&
                      "newQuotation-status-bg-approved") ||
                    (status === "Rejected" &&
                      "newQuotation-status-bg-rejected") ||
                    (status === "Converted (SO)" &&
                      "newQuotation-status-bg-converted") ||
                    (status === "Expired" && "newQuotation-status-bg-expired")
                  }
                >
                  Rev:
                  {`${
                    status === "Draft" || status === "Send" ? reviseCount : ""
                  } (${status})`}
                </h3>
              )}
            </nav>
            <div>
              {(status === "Draft" || status === "Send") && (
                <>
                  <button
                    className={
                      status === "Draft" && reviseCount > 1
                        ? "newQuotation-active-btn"
                        : "newQuotation-line-btn"
                    }
                    onClick={handleHistory}
                    disabled={buttonState.historyBtn}
                  >
                    Revision History
                  </button>
                  <button
                    className={
                      status === "Send"
                        ? "newQuotation-active-btn"
                        : "newQuotation-line-btn"
                    }
                    onClick={handleRevise}
                    disabled={buttonState.reviseBtn}
                  >
                    Revise
                  </button>
                </>
              )}

              <div
                onClick={() => {
                  setshowNewQuotation(false);
                  setStatus("");
                }}
                className="close-newQuotation-container"
              >
                <svg
                  className="circle-x-logo-newQuotation"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
                <nav>Close</nav>
              </div>
            </div>
          </div>
          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="quotation_id">
                Quotation ID {"(Auto Generate)"}
              </label>
              <input
                id="quotation_id"
                type="text"
                placeholder="Quotation ID"
                value={newQuotationData.quotation_id}
                disabled
              />
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="quotation_type">
                Quotation Type<sup>*</sup>
              </label>
              <select
                id="quotation_type"
                value={newQuotationData.quotation_type}
                onChange={handleNewQuotationDataChange}
                disabled={inputDisable}
                required
              >
                <option value="">Select Quotation Type</option>
                <option value="Standard">Standard</option>
                <option value="Blanket">Blanket</option>
                <option value="Service">Service</option>
              </select>
            </div>
          </div>
          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="quotation_date">
                Quotation Date<sup>*</sup>
              </label>
              <input
                id="quotation_date"
                value={newQuotationData.quotation_date}
                onChange={handleNewQuotationDataChange}
                type="date"
                placeholder="Select Date"
                required
                disabled={inputDisable}
              />
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="expiry_date">
                Expiry Date<sup>*</sup>
              </label>
              <input
                id="expiry_date"
                value={newQuotationData.expiry_date}
                onChange={handleNewQuotationDataChange}
                type="date"
                placeholder="Select Date"
                required
                disabled={inputDisable}
              />
            </div>
          </div>
          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="customer_name">
                Customer Name<sup>*</sup>
              </label>
              <select
                id="customer_name"
                value={newQuotationData.customer_name}
                onChange={handleNewQuotationDataChange}
                required
                disabled={inputDisable}
              >
                <option value="">Select Customer</option>
                {customer_name.map((ele, ind) => (
                  <option key={ind} value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="customer_po_referance">
                Customer PO Reference
              </label>
              <input
                id="customer_po_referance"
                value={newQuotationData.customer_po_referance}
                onChange={handleNewQuotationDataChange}
                type="text"
                placeholder="PO-45678"
                disabled={inputDisable}
              />
            </div>
          </div>
          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="sales_rep">
                Sales Rep<sup>*</sup>
              </label>
              <select
                id="sales_rep"
                value={newQuotationData.sales_rep}
                onChange={handleNewQuotationDataChange}
                required
                disabled={inputDisable}
              >
                <option value="">Select Salesperson</option>
                {sales_rep.map((ele, ind) => (
                  <option key={ind} value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="currency">
                Currency<sup>*</sup>
              </label>
              <select
                id="currency"
                value={newQuotationData.currency}
                onChange={handleNewQuotationCurrencyChange}
                required
                disabled={inputDisable}
              >
                <option value="">Select Currency</option>
                {currency.map((ele, ind) => (
                  <option key={ind} value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="payment_terms">Payment Terms</label>
              <select
                id="payment_terms"
                value={newQuotationData.payment_terms}
                onChange={handleNewQuotationDataChange}
                disabled={inputDisable}
              >
                <option value="">Select Terms</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Advance">Advance</option>
                <option value="COD">COD</option>
              </select>
            </div>

            <div className="newQuotation-input-box">
              <label htmlFor="expected_delivery">
                Expected Delivery<sup>*</sup>
              </label>
              <input
                id="expected_delivery"
                value={newQuotationData.expected_delivery}
                onChange={handleNewQuotationDataChange}
                type="date"
                placeholder="Select Expected Delivery"
                required
                disabled={inputDisable}
              />
            </div>
          </div>
          <nav className="newQuotation-subtit">
            Quotation Items<sup>*</sup>
          </nav>
          <div className="newQuotation-table-container">
            <table>
              <thead className="newQuotation-table-head">
                <tr>
                  <th id="newQuotation-table-smallwidth">#</th>
                  <th>Product Name</th>
                  <th id="newQuotation-table-minwidth">Product ID</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th>Unit Price</th>
                  <th>Tax {"(%)"}</th>
                  <th>Discount {"(%)"}</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="newQuotation-table-body">
                {[...Array(numberOfQuotationList)].map((ele, ind) => (
                  <QuotationList
                    key={ind}
                    unique_key={ind}
                    descriptions={descriptions}
                    quotation_table_data={quotation_table_data}
                    setQuotationList_data={setQuotationList_data}
                    inputDisable={inputDisable}
                    // functions
                    productTotal={productTotal}
                    deleteQuotationProduct={deleteQuotationProduct}
                    //currency
                    newQuotationData={newQuotationData}
                  />
                ))}
                <tr>
                  <td></td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setQuotationList_data((prev) => {
                          return [
                            ...prev,
                            { unique_key: numberOfQuotationList },
                          ];
                        });
                        setnumberOfQuotationList((prev) => ++prev);
                      }}
                      disabled={inputDisable}
                    >
                      + Add Item
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <nav className="newQuotation-subtit">Tax & Totals</nav>
          <div className="newQuotation-totals-container">
            <nav>
              <h5>Subtotal</h5>
              <p> {calculateSubtotal()}</p>
            </nav>
            <nav>
              <h5>Global Discount {"(%)"}</h5>
              <input
                type="number"
                value={globalDiscount}
                onChange={(e) =>
                  setGlobalDiscount(parseFloat(e.target.value) || 0)
                }
                disabled={inputDisable}
              />
            </nav>
            <nav>
              <h5>Tax Summary</h5>
              <p> {calculateTaxSummery()}</p>
            </nav>
            <nav>
              <h5>
                Shipping Charges{" "}
                {newQuotationData.currency === "IND" && <span>{`(₹)`}</span>}
                {newQuotationData.currency === "USD" && <span>{`($)`}</span>}
                {newQuotationData.currency === "GBP" && <span>{`(£)`}</span>}
                {newQuotationData.currency === "SGD" && <span>{`(S$)`}</span>}
                {newQuotationData.currency === "ERU" && <span>{`(€)`}</span>}
              </h5>
              <input
                type="number"
                value={shippingCharges}
                onChange={(e) =>
                  setShippingCharges(parseFloat(e.target.value) || 0)
                }
                disabled={inputDisable}
              />
            </nav>
            <nav>
              <h5>Rounding Adjustment</h5>
              <p>{roundedvalue()}</p>
            </nav>
            <nav className="newQuotation-totals-container-bg">
              <h5>Grand Total</h5>
              <p>
                {newQuotationData.currency === "IND" && <span>₹</span>}
                {newQuotationData.currency === "USD" && <span>$</span>}
                {newQuotationData.currency === "GBP" && <span>£</span>}
                {newQuotationData.currency === "SGD" && <span>S$</span>}
                {newQuotationData.currency === "ERU" && <span>€</span>}
                {roundedGrandTotal()}
              </p>
            </nav>
          </div>
          <div className="newQuotation-hub-container">
            <div className="newQuotation-hub-head">
              <p
                className={
                  comment
                    ? "newQuotation-hub-head-bg-black"
                    : "newQuotation-hub-head-tit"
                }
                onClick={() => {
                  setComment(true);
                  setattachment(false);
                  sethistory(false);
                }}
              >
                Comments
              </p>
              <p
                className={
                  history
                    ? "newQuotation-hub-head-bg-black"
                    : "newQuotation-hub-head-tit"
                }
                onClick={() => {
                  setComment(false);
                  setattachment(false);
                  sethistory(true);
                }}
              >
                History
              </p>
              <p
                className={
                  attachment
                    ? "newQuotation-hub-head-bg-black"
                    : "newQuotation-hub-head-tit"
                }
                onClick={() => {
                  setComment(false);
                  setattachment(true);
                  sethistory(false);
                }}
              >
                Attachments
              </p>
            </div>
            <div className="newQuotation-hub-body">
              {comment && <CreateNewQuotationComments />}
              {history && <CreateNewQuotationHistory />}
              {attachment && (
                <CreateNewQuotationAttachment inputDisable={inputDisable} />
              )}
            </div>
          </div>
          <div className="newQuotation-btn-container">
            <button
              className="newQuotation-cancel-btn"
              onClick={handleCancelNewQuotation}
            >
              Cancel
            </button>
            <button
              className={`newQuotation-active-btn ${
                buttonState.saveDraft && "newQuotation-passed-btn"
              }`}
              onClick={handleSaveDraftState}
              disabled={buttonState.saveDraft}
            >
              Save Draft
            </button>
            <button
              className={`newQuotation-active-btn ${
                buttonState.submit && "newQuotation-passed-btn"
              }`}
              disabled={buttonState.submit}
            >
              {buttonState.submit ? "Submitted" : "Submit"}
            </button>
            <button
              className={`newQuotation-active-btn ${
                buttonState.saveDraft &&
                buttonState.submit &&
                buttonState.approve &&
                buttonState.reject
                  ? "newQuotation-passed-btn"
                  : buttonState.approve
                  ? "newQuotation-line-btn"
                  : "newQuotation-active-btn"
              }`}
              onClick={handleApprovedState}
              disabled={buttonState.approve}
            >
              {status === "Approved" || status === "Converted (SO)"
                ? "Approved"
                : "Approve"}
            </button>
            <button
              className={`newQuotation-active-btn ${
                buttonState.saveDraft &&
                buttonState.submit &&
                buttonState.approve &&
                buttonState.reject
                  ? "newQuotation-passed-btn"
                  : buttonState.reject
                  ? "newQuotation-line-btn"
                  : "newQuotation-active-btn"
              }`}
              onClick={handleRejectedState}
              disabled={buttonState.reject}
            >
              {status === "Rejected" ? "Rejected" : "Reject"}
            </button>
            <button
              className={` ${
                buttonState.saveDraft &&
                buttonState.submit &&
                buttonState.approve &&
                buttonState.salesOrder &&
                status !== "Rejected"
                  ? "newQuotation-passed-btn"
                  : buttonState.salesOrder
                  ? "newQuotation-line-btn"
                  : "newQuotation-active-btn"
              }`}
              onClick={handleSalseState}
              disabled={buttonState.salesOrder}
            >
              {status === "Converted (SO)"
                ? "Converted (SO)"
                : "Convert to (SO)"}
            </button>
            <svg
              disabled={buttonState.pdf}
              className={`newQuotation-pdf-mail-activelogo ${
                buttonState.pdf && "newQuotation-pdf-mail-futurelogo"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 22 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"
              />
            </svg>
            <svg
              disabled={buttonState.email}
              className={`newQuotation-pdf-mail-activelogo ${
                buttonState.email && "newQuotation-pdf-mail-futurelogo"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 16"
              fill="none"
            >
              <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
            </svg>
          </div>
        </form>
      </div>
    </>
  );
}
