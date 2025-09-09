import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createNewInvoice.css";
import InvoiceTagsSelector from "./invoiceCheckBoxInput";
import InvoiceComment from "./invoiceComment";
import InvoiceHistory from "./invoiceHistory";
import InvoiceAttachment from "./invoiceAttachment";
import { toast } from "react-toastify";

export default function createNewInvoice() {
  const prevpg = useNavigate();
  const [invoiceStatus, setInvoiceStatus] = useState("");

  const [ApiInvoice, setApiInvoice] = useState({});
  const [invoiceListData, setInvoiceListData] = useState([]);
  const [salesOederData, setSalesOederData] = useState([]);

  const invoiceFromAPI = {
    invoiceListData: [
      {
        product_name: "T-shirt",
        product_id: "CT101",
        quantity: "17",
        umo: "PCS",
        unit_price: "120.0",
        tax: "18",
        discount: "20",
        total: "10009",
      },
      {
        product_name: "T-shirt",
        product_id: "CT101",
        quantity: "17",
        umo: "PCS",
        unit_price: "120.0",
        tax: "18",
        discount: "20",
        total: "10009",
      },
      {
        product_name: "T-shirt",
        product_id: "CT101",
        quantity: "17",
        umo: "PCS",
        unit_price: "120.0",
        tax: "18",
        discount: "20",
        total: "10009",
      },
    ],
    salesOederData: [
      {
        sales_order_ref: "SO-1001",
        due_date: "2025-07-01",
        payment_terms: "Net 30",
        trems_and_conditions: "Payment within 30 days.",
        custoner_name: "Acme Corp",
        customer_id: "CUST-001",
        billing_address: "123 Market St, New York, NY 10001",
        shipping_address: "456 Industrial Rd, Brooklyn, NY 11222",
        email_id: "orders@acmecorp.com",
        phone_number: "+1-212-555-1010",
        payment_method: "Credit Card",
        currency: "IND",
      },
      {
        sales_order_ref: "SO-1002",
        due_date: "2025-07-05",
        payment_terms: "Net 15",
        trems_and_conditions: "No returns after 15 days.",
        custoner_name: "Beta Industries",
        customer_id: "CUST-002",
        billing_address: "22 Park Ave, San Francisco, CA 94110",
        shipping_address: "88 Bay St, Oakland, CA 94607",
        email_id: "sales@betaind.com",
        phone_number: "+1-415-555-2020",
        payment_method: "Credit Card",
        currency: "IND",
      },
      {
        sales_order_ref: "SO-1003",
        due_date: "2025-06-30",
        payment_terms: "Prepaid",
        trems_and_conditions: "Prepayment required before dispatch.",
        custoner_name: "Gamma Ltd",
        customer_id: "CUST-003",
        billing_address: "77 King St, Toronto, ON M5V 1M9",
        shipping_address: "12 Queen St, Toronto, ON M5H 2N2",
        email_id: "contact@gammaltd.ca",
        phone_number: "+1-647-555-3030",
        payment_method: "Credit Card",
        currency: "IND",
      },
      {
        sales_order_ref: "SO-1004",
        due_date: "2025-07-10",
        payment_terms: "Net 45",
        trems_and_conditions: "Late fee of 2% after 45 days.",
        custoner_name: "Delta Traders",
        customer_id: "CUST-004",
        billing_address: "101 Broadway, Los Angeles, CA 90012",
        shipping_address: "202 Sunset Blvd, LA, CA 90026",
        email_id: "accounts@deltatraders.com",
        phone_number: "+1-323-555-4040",
        payment_method: "Credit Card",
        currency: "IND",
      },
      {
        sales_order_ref: "SO-1005",
        due_date: "2025-07-03",
        payment_terms: "COD",
        trems_and_conditions: "Cash on Delivery only.",
        custoner_name: "Epsilon Enterprises",
        customer_id: "CUST-005",
        billing_address: "14 Main St, Austin, TX 78701",
        shipping_address: "33 Elm St, Austin, TX 78702",
        email_id: "info@epsilonent.com",
        phone_number: "+1-512-555-5050",
        payment_method: "Credit Card",
        currency: "IND",
      },
      {
        sales_order_ref: "SO-1006",
        due_date: "2025-07-15",
        payment_terms: "Net 60",
        trems_and_conditions: "No penalty until 60 days.",
        custoner_name: "Zeta Global",
        customer_id: "CUST-006",
        billing_address: "999 Broadway, Seattle, WA 98101",
        shipping_address: "1111 1st Ave, Seattle, WA 98104",
        email_id: "support@zetaglobal.com",
        phone_number: "+1-206-555-6060",
        payment_method: "Credit Card",
        currency: "IND",
      },
      {
        sales_order_ref: "SO-1007",
        due_date: "2025-07-08",
        payment_terms: "Net 20",
        trems_and_conditions: "20 days to settle payment.",
        custoner_name: "Theta Systems",
        customer_id: "CUST-007",
        billing_address: "85 Tech Rd, Denver, CO 80202",
        shipping_address: "90 Data Ln, Boulder, CO 80301",
        email_id: "billing@thetasystems.io",
        phone_number: "+1-303-555-7070",
        payment_method: "Credit Card",
        currency: "IND",
      },
      {
        sales_order_ref: "SO-1008",
        due_date: "2025-06-28",
        payment_terms: "Advance 50%",
        trems_and_conditions: "50% advance, 50% on delivery.",
        custoner_name: "Iota Innovations",
        customer_id: "CUST-008",
        billing_address: "18 Sky Dr, Miami, FL 33101",
        shipping_address: "27 Coral Blvd, Miami, FL 33132",
        email_id: "orders@iotainnov.com",
        phone_number: "+1-786-555-8080",
        payment_method: "Credit Card",
        currency: "IND",
      },
      {
        sales_order_ref: "SO-1009",
        due_date: "2025-07-12",
        payment_terms: "Net 10",
        trems_and_conditions: "Strict 10-day policy.",
        custoner_name: "Kappa Solutions",
        customer_id: "CUST-009",
        billing_address: "350 Innovation Way, Boston, MA 02115",
        shipping_address: "99 Science Park, Boston, MA 02118",
        email_id: "kappa@solutions.com",
        phone_number: "+1-617-555-9090",
        payment_method: "Credit Card",
        currency: "IND",
      },
      {
        sales_order_ref: "SO-1010",
        due_date: "2025-07-20",
        payment_terms: "Net 30",
        trems_and_conditions: "Standard 30-day billing.",
        custoner_name: "Lambda Tech",
        customer_id: "CUST-010",
        billing_address: "42 Orbit St, Chicago, IL 60601",
        shipping_address: "73 Galaxy Ave, Chicago, IL 60611",
        email_id: "contact@lambdatech.org",
        phone_number: "+1-312-555-0001",
        payment_method: "Credit Card",
        currency: "IND",
      },
    ],
  };
  const [detail, setDetail] = useState({
    comment: true,
    history: false,
    attachment: false,
  });

  const [invoiceInput, setInvoiceInput] = useState({
    invoice_id: "",
    sales_order_ref: "",
    invoice_date: "",
    due_date: "",
    invoice_status: "",
    payment_terms: "",
    customer_ref_no: "",
    invoice_tag: [],
    trems_and_conditions: "",
    custoner_name: "",
    customer_id: "",
    billing_address: "",
    shipping_address: "",
    email_id: "",
    phone_number: "",
    contact_person: "",
    payment_method: "",
    currency: "",
    payment_ref_number: "",
    transaction_date: "",
    payment_status: "",
    shipping_charges: "",
    global_discount: "",
    amount_paid: "",
  });

  const handleInvoiceInputChanges = (e) => {
    setInvoiceInput((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  useEffect(() => {
    setApiInvoice(invoiceFromAPI);
  }, []);
  useEffect(() => {
    if (Object.keys(ApiInvoice).length > 0) {
      setInvoiceListData(ApiInvoice.invoiceListData);
      setSalesOederData(ApiInvoice.salesOederData);
    }
  }, [ApiInvoice]);

  //button status
  const [InvoiceBtn, setInvoiceBtn] = useState({
    buttonAcs: true,
    invoice_return: true,
    cancel_invoice: true,
    save_draft: false,
    send_invoice: false,
    paid: true,
    pdf: true,
    mail: true,
  });
  useEffect(() => {
    const selected = invoiceInput.sales_order_ref;
    if (selected) {
      const salesRef = salesOederData.find(
        (ele) => ele.sales_order_ref === selected
      );
      if (salesRef) {
        setInvoiceInput((prev) => ({
          ...prev,
          sales_order_ref: salesRef.sales_order_ref,
          due_date: salesRef.due_date,
          payment_terms: salesRef.payment_terms,
          trems_and_conditions: salesRef.trems_and_conditions,
          custoner_name: salesRef.custoner_name,
          customer_id: salesRef.customer_id,
          billing_address: salesRef.billing_address,
          shipping_address: salesRef.shipping_address,
          email_id: salesRef.email_id,
          phone_number: salesRef.phone_number,
          payment_method: salesRef.payment_method,
          currency: salesRef.currency,
        }));
      }
    }
  }, [invoiceInput.sales_order_ref, salesOederData]);
  useEffect(() => {
    if (invoiceStatus === "") {
      setInvoiceBtn((prev) => ({
        ...prev,
        buttonAcs: false,
        cancel_invoice: true,
        save_draft: false,
        send_invoice: false,
        paid: true,
        pdf: true,
        mail: true,
      }));
      return;
    }

    switch (invoiceStatus) {
      case "Draft":
        setInvoiceBtn((prev) => ({
          ...prev,
          buttonAcs: false,
          cancel_invoice: true,
          save_draft: false,
          send_invoice: false,
          paid: true,
          pdf: false,
          mail: false,
        }));
        break;
      case "Send":
        setInvoiceBtn((prev) => ({
          ...prev,
          buttonAcs: true,
          invoice_return: false,
          cancel_invoice: false,
          save_draft: true,
          send_invoice: true,
          paid: false,
          pdf: false,
          mail: false,
        }));
        break;
      case "Paid":
        setInvoiceBtn((prev) => ({
          ...prev,
          cancel_invoice: false,
          invoice_return: false,
          save_draft: true,
          send_invoice: true,
          paid: true,
          pdf: false,
          mail: false,
        }));
        break;
      case "Cancelled":
        setInvoiceBtn((prev) => ({
          ...prev,
          invoice_return: true,
          cancel_invoice: true,
          save_draft: true,
          send_invoice: true,
          paid: true,
          pdf: false,
          mail: false,
        }));
        break;

      default:
        setInvoiceBtn((prev) => ({ ...prev, buttonAcss: true }));
    }
  }, [invoiceStatus]);

  const handleSaveDraftState = (e) => {
    e.preventDefault();
    setInvoiceStatus("Draft");
    toast.success("Invoice Item in Save Draft State");
  };
  const handleSendInvoiceState = (e) => {
    e.preventDefault();
    setInvoiceStatus("Send");
    toast.success("Invoice Item in Send State");
  };
  const handlePaidState = (e) => {
    e.preventDefault();
    setInvoiceStatus("Paid");
    toast.success("Invoice Item in Paid State");
  };
  const handleCancelledState = (e) => {
    e.preventDefault();
    setInvoiceStatus("Cancelled");
    toast.success("Invoice Item in Cancelled State");
  };
  console.log(invoiceInput);
  return (
    <>
      <div className="createNewInvoice-container">
        <form onSubmit={handleSendInvoiceState}>
          <div className="createNewInvoice-head">
            <nav>
              <p>{invoiceStatus !== "" ? "Invoice" : "New Invoice"} </p>
              {invoiceStatus !== "" && (
                <h3
                  className={
                    invoiceStatus === "Draft"
                      ? "createNewInvoice-Status-draft"
                      : invoiceStatus === "Send"
                      ? "createNewInvoice-Status-Send"
                      : invoiceStatus === "Paid"
                      ? "createNewInvoice-Status-Paid"
                      : invoiceStatus === "Cancelled"
                      ? "createNewInvoice-Status-Cancelled"
                      : "createNewInvoice-Status-empty"
                  }
                >
                  Status: {invoiceStatus}
                </h3>
              )}
            </nav>

            <div>
              <button
                className={
                  invoiceStatus === "Send" || invoiceStatus === "Paid"
                    ? "createNewInvoice-active-btn"
                    : "createNewInvoice-inactive-btn"
                }
                disabled={InvoiceBtn.invoice_return}
              >
                Invoice Return
              </button>
              <nav
                className="createNewInvoice-close"
                onClick={(e) => {
                  e.preventDefault();
                  prevpg(-1);
                }}
              >
                <svg
                  className="createNewInvoice-circle-x-logo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
                <p>Close</p>
              </nav>
            </div>
          </div>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="invoice_id">Invoice ID {`(Auto Generate)`}</label>
              <input
                id="invoice_id"
                type="text"
                placeholder="Auto Generate"
                value={invoiceInput.invoice_id}
                onChange={handleInvoiceInputChanges}
                disabled
              />
            </div>
            <div className="createNewInvoice-input-box">
              <label htmlFor="sales_order_ref">
                Sales Order Reference<sup>*</sup>
              </label>
              <select
                id="sales_order_ref"
                value={invoiceInput.sales_order_ref}
                onChange={handleInvoiceInputChanges}
                required
                disabled={InvoiceBtn.buttonAcs}
              >
                <option value="">Select Order Reference</option>
                {salesOederData.map((ele, ind) => (
                  <option key={ind} value={ele.sales_order_ref}>
                    {ele.sales_order_ref}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="invoice_date">
                Invoice Date<sup>*</sup>
              </label>
              <input
                id="invoice_date"
                type="date"
                placeholder="Select Date"
                value={invoiceInput.invoice_date}
                onChange={handleInvoiceInputChanges}
                required
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
            <div className="createNewInvoice-input-box">
              <label htmlFor="due_date">
                Due Date<sup>*</sup>
              </label>
              <input
                id="due_date"
                type="date"
                placeholder="Select Date"
                value={invoiceInput.due_date}
                onChange={handleInvoiceInputChanges}
                required
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
          </div>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="invoice_status">Invoice Status</label>
              <input
                id="invoice_status"
                type="text"
                placeholder="Invoice Status"
                value={invoiceStatus}
                onChange={handleInvoiceInputChanges}
                disabled
              />
            </div>
            <div className="createNewInvoice-input-box">
              <label htmlFor="payment_terms">
                Payment Terms<sup>*</sup>
              </label>
              <select
                id="payment_terms"
                value={invoiceInput.payment_terms}
                onChange={handleInvoiceInputChanges}
                required
                disabled={InvoiceBtn.buttonAcs}
              >
                <option value="">Select Payment</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
          </div>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="customer_ref_no">Customer Ref.No</label>
              <input
                id="customer_ref_no"
                type="text"
                placeholder="Enter customer reference number"
                value={invoiceInput.customer_ref_no}
                onChange={handleInvoiceInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
            <div className="createNewInvoice-input-box">
              <InvoiceTagsSelector
                buttonAcs={InvoiceBtn.buttonAcs}
                value={invoiceInput.invoice_tag}
                onChange={(tags) =>
                  setInvoiceInput((prev) => ({
                    ...prev,
                    invoice_tag: tags,
                  }))
                }
              />
            </div>
          </div>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="trems_and_conditions">Terms & Conditions</label>
              <input
                id="trems_and_conditions"
                type="text"
                placeholder="Enter payment terms or policies"
                value={invoiceInput.trems_and_conditions}
                onChange={handleInvoiceInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
          </div>
          <nav className="createNewInvoice-subtit">Customer Information</nav>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="custoner_name">
                Customer Name<sup>*</sup>
              </label>
              <select
                id="custoner_name"
                required
                value={invoiceInput.custoner_name}
                onChange={handleInvoiceInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              >
                <option value="">Select Customer </option>
                {salesOederData.map((ele, ind) => (
                  <option key={ind} value={ele.custoner_name}>
                    {ele.custoner_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="createNewInvoice-input-box">
              <label htmlFor="customer_id">
                Customer ID {`(Auto Generate)`}
              </label>
              <input
                id="customer_id"
                type="text"
                placeholder="Auto Generate"
                disabled
                value={invoiceInput.customer_id}
                onChange={handleInvoiceInputChanges}
              />
            </div>
          </div>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="billing_address">
                Billing Address<sup>*</sup>
              </label>
              <input
                id="billing_address"
                type="text"
                placeholder="Enter Billing Address"
                value={invoiceInput.billing_address}
                onChange={handleInvoiceInputChanges}
                required
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
            <div className="createNewInvoice-input-box">
              <label htmlFor="shipping_address">
                Shipping Address<sup>*</sup>
              </label>
              <input
                id="shipping_address"
                type="text"
                placeholder="Enter Shipping Address"
                value={invoiceInput.shipping_address}
                onChange={handleInvoiceInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
          </div>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="email_id">
                Email ID<sup>*</sup>
              </label>
              <input
                id="email_id"
                type="email"
                placeholder="Enter Email ID"
                value={invoiceInput.email_id}
                onChange={handleInvoiceInputChanges}
                required
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
            <div className="createNewInvoice-input-box">
              <label htmlFor="phone_number">
                Phone Number<sup>*</sup>
              </label>
              <input
                id="phone_number"
                type="number"
                placeholder="Enter Phone Number"
                value={invoiceInput.phone_number}
                onChange={handleInvoiceInputChanges}
                required
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
          </div>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="contact_person">Contact Person</label>
              <input
                id="contact_person"
                type="text"
                placeholder="Enter contact person name "
                value={invoiceInput.contact_person}
                onChange={handleInvoiceInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
          </div>
          <nav className="createNewInvoice-subtit">Payment Details</nav>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="payment_method">
                Payment Method<sup>*</sup>
              </label>
              <select
                id="payment_method"
                value={invoiceInput.payment_method}
                onChange={handleInvoiceInputChanges}
                required
                disabled={InvoiceBtn.buttonAcs}
              >
                <option value="">Select Payment</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="COD">COD</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            <div className="createNewInvoice-input-box">
              <label htmlFor="currency">
                Currency<sup>*</sup>
              </label>
              <select
                id="currency"
                value={invoiceInput.currency}
                onChange={handleInvoiceInputChanges}
                required
                disabled={InvoiceBtn.buttonAcs}
              >
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="IND">IND</option>
                <option value="GBP">GBP</option>
                <option value="SGD">SGD</option>
              </select>
            </div>
          </div>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="payment_ref_number">Payment Ref. Number</label>
              <input
                id="payment_ref_number"
                type="text"
                placeholder="Enter transaction/reference number"
                value={invoiceInput.payment_ref_number}
                onChange={handleInvoiceInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
            <div className="createNewInvoice-input-box">
              <label htmlFor="transaction_date">Transaction Date</label>
              <input
                id="transaction_date"
                type="date"
                placeholder="Select Date"
                value={invoiceInput.transaction_date}
                onChange={handleInvoiceInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
          </div>
          <div className="createNewInvoice-input-container">
            <div className="createNewInvoice-input-box">
              <label htmlFor="payment_status">Payment Status</label>
              <input
                id="payment_status"
                type="text"
                placeholder="Payment Status "
                value={invoiceInput.payment_status}
                onChange={handleInvoiceInputChanges}
                disabled
              />
            </div>
          </div>
          <nav className="createNewInvoice-subtit">Line Items</nav>
          <div className="createNewInvoice-table-container">
            <table>
              <thead className="createNewInvoice-table-head">
                <tr>
                  <th>#</th>
                  <th>
                    <pre>Product name</pre>
                  </th>
                  <th>
                    <pre>Product ID</pre>
                  </th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th>
                    <pre>Unit Price</pre>
                  </th>
                  <th>
                    <pre>Tax (%)</pre>
                  </th>
                  <th>
                    <pre>Discount (%)</pre>
                  </th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody className="createNewInvoice-table-body">
                {invoiceListData.length > 0 ? (
                  invoiceListData.map((ele, ind) => (
                    <tr key={ind}>
                      <td>{ind + 1}</td>
                      <td>{ele.product_name}</td>
                      <td>{ele.product_id}</td>
                      <td>{ele.quantity}</td>
                      <td>{ele.umo}</td>
                      <td>{ele.unit_price}</td>
                      <td>{ele.tax}</td>
                      <td>{ele.discount}</td>
                      <td>{ele.total}</td>
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
          <nav className="createNewInvoice-subtit">Order Summary</nav>
          <div className="createNewInvoice-totals-container">
            <nav>
              <h5>Subtotal</h5>
              <p> 1223</p>
            </nav>
            <nav>
              <h5>Global Discount {"(%)"}</h5>
              <input
                type="number"
                value={invoiceInput.global_discount}
                onChange={(e) =>
                  setInvoiceStatus((prev) => ({
                    ...prev,
                    global_discount: parseFloat(e.target.value) || 0,
                  }))
                }
                disabled={InvoiceBtn.buttonAcs}
              />
            </nav>
            <nav>
              <h5>Tax Summary</h5>
              <p> 254</p>
            </nav>
            <nav>
              <h5>
                Shipping Charges{""}
                {invoiceInput.currency === "IND" && <span>{`(₹)`}</span>}
                {invoiceInput.currency === "USD" && <span>{`($)`}</span>}
                {invoiceInput.currency === "GBP" && <span>{`(£)`}</span>}
                {invoiceInput.currency === "SGD" && <span>{`(S$)`}</span>}
                {invoiceInput.currency === "EUR" && <span>{`(€)`}</span>}
              </h5>
              <input
                type="number"
                value={invoiceInput.shipping_charges}
                onChange={(e) =>
                  setInvoiceInput((prev) => ({
                    ...prev,
                    shipping_charges: parseFloat(e.target.value) || 0,
                  }))
                }
                disabled={InvoiceBtn.buttonAcs}
              />
            </nav>
            <nav>
              <h5>Rounding Adjustment</h5>
              <p>025</p>
            </nav>
            <nav>
              <h5>
                Amount Paid{" "}
                {invoiceInput.currency === "IND" && <span>{`(₹)`}</span>}
                {invoiceInput.currency === "USD" && <span>{`($)`}</span>}
                {invoiceInput.currency === "GBP" && <span>{`(£)`}</span>}
                {invoiceInput.currency === "SGD" && <span>{`(S$)`}</span>}
                {invoiceInput.currency === "EUR" && <span>{`(€)`}</span>}
              </h5>
              <input
                type="number"
                value={invoiceInput.amount_paid}
                onChange={(e) =>
                  setInvoiceInput((prev) => ({
                    ...prev,
                    amount_paid: parseFloat(e.target.value) || 0,
                  }))
                }
                disabled={InvoiceBtn.buttonAcs}
              />
            </nav>
            <nav className="createNewInvoice-totals-container-bg">
              <h5>Grand Total</h5>
              <p>
                {invoiceInput.currency === "IND" && <span>₹</span>}
                {invoiceInput.currency === "USD" && <span>$</span>}
                {invoiceInput.currency === "GBP" && <span>£</span>}
                {invoiceInput.currency === "SGD" && <span>S$</span>}
                {invoiceInput.currency === "EUR" && <span>€</span>}
                555
              </p>
            </nav>
            <nav className="createNewInvoice-totals-container-bg">
              <h5>Balance Due</h5>
              <p>
                {invoiceInput.currency === "IND" && <span>₹</span>}
                {invoiceInput.currency === "USD" && <span>$</span>}
                {invoiceInput.currency === "GBP" && <span>£</span>}
                {invoiceInput.currency === "SGD" && <span>S$</span>}
                {invoiceInput.currency === "EUR" && <span>€</span>}
                555
              </p>
            </nav>
          </div>
          <div className="createNewInvoice-hub-container">
            <div className="createNewInvoice-hub-head">
              <p
                className={
                  detail.comment
                    ? "createNewInvoice-hub-head-bg-black"
                    : "createNewInvoice-hub-head-tit"
                }
                onClick={() => {
                  setDetail({
                    history: false,
                    attachment: false,
                    comment: true,
                  });
                }}
              >
                Comments
              </p>
              <p
                className={
                  detail.history
                    ? "createNewInvoice-hub-head-bg-black"
                    : "createNewInvoice-hub-head-tit"
                }
                onClick={() => {
                  setDetail({
                    history: true,
                    attachment: false,
                    comment: false,
                  });
                }}
              >
                History
              </p>
              <p
                className={
                  detail.attachment
                    ? "createNewInvoice-hub-head-bg-black"
                    : "createNewInvoice-hub-head-tit"
                }
                onClick={() => {
                  setDetail({
                    history: false,
                    attachment: true,
                    comment: false,
                  });
                }}
              >
                Attachments
              </p>
            </div>
            <div className="createNewInvoice-hub-body">
              {detail.comment && <InvoiceComment />}
              {detail.history && <InvoiceHistory />}
              {detail.attachment && <InvoiceAttachment />}
            </div>
          </div>
          <div className="createNewInvoice-btn-container">
            <button
              className={
                invoiceStatus === "Send" || invoiceStatus === "Paid"
                  ? "createNewInvoice-order-active-btn"
                  : "createNewInvoice-inactive-btn"
              }
              onClick={handleCancelledState}
              disabled={InvoiceBtn.cancel_invoice}
            >
              {invoiceStatus === "Cancelled" ? "Cancelled" : "Cancel Invoice"}
            </button>
            <nav>
              <button
                className="createNewInvoice-cancel-btn"
                onClick={(e) => {
                  e.preventDefault();
                  prevpg(-1);
                }}
              >
                Cancel
              </button>
              <button
                className={
                  invoiceStatus === "" || invoiceStatus === "Draft"
                    ? "createNewInvoice-active-btn"
                    : "createNewInvoice-completed-btn"
                }
                onClick={handleSaveDraftState}
                disabled={InvoiceBtn.save_draft}
              >
                Save Draft
              </button>
              <button
                className={
                  invoiceStatus === "" || invoiceStatus === "Draft"
                    ? "createNewInvoice-active-btn"
                    : "createNewInvoice-completed-btn"
                }
                disabled={InvoiceBtn.send_invoice}
              >
                {invoiceStatus === "" || invoiceStatus === "Draft"
                  ? "Send Invoice"
                  : "Send"}
              </button>
              <button
                className={
                  invoiceStatus === "Send"
                    ? "createNewInvoice-active-btn"
                    : invoiceStatus === "" || invoiceStatus === "Draft"
                    ? "createNewInvoice-inactive-btn"
                    : "createNewInvoice-completed-btn"
                }
                onClick={handlePaidState}
                disabled={InvoiceBtn.paid}
              >
                Mark as Paid
              </button>
              <svg
                className={
                  invoiceStatus !== ""
                    ? "createNewInvoice-pdf-mail-activelogo"
                    : "createNewInvoice-pdf-mail-futurelogo"
                }
                disabled={InvoiceBtn.pdf}
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
                className={
                  invoiceStatus !== ""
                    ? "createNewInvoice-pdf-mail-activelogo"
                    : "createNewInvoice-pdf-mail-futurelogo"
                }
                disabled={InvoiceBtn.mail}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 16"
                fill="none"
              >
                <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
              </svg>
            </nav>
          </div>
        </form>
      </div>
    </>
  );
}
