import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./createNewSales.css";
import SalesListItems from "./salesListItems";
import CreatNewSalesStockAlert from "./creatNewSalesStockAlert";
import CreateNewSalesHistory from "./createNewSalesHistory";
import CreateNewSalesComment from "./createNewSalesComment";
import { toast } from "react-toastify";
export default function createNewSales({ setCurrentPage }) {
  // state vales
  const [salesStatus, setSalesStatus] = useState("");

  //chat,history
  const [feacher, setFeacher] = useState({
    showChat: true,
    showHistory: false,
  });

  const prevPage = useNavigate();
  const [ApiSales, setApiSales] = useState({});
  const [prevsalesData, setprevsalesData] = useState([]);
  const [sales_table_data, setSales_table_data] = useState([]);
  const [sales_rep, setSales_rep] = useState([]);
  const [purchase_order, setPurchase_order] = useState([]);

  //stockalert
  const [stockAlert, setStockAlert] = useState(false);

  const salesFromApi = {
    prevsalesData: [
      {
        customer_name: "Sans",
        customer_id: "ABC001",
        billing_address: "123, A colony,Chennai",
        shipping_address: "123, B colony,Chennai",
        email_id: "ASD@gmail.com",
        phone_number: "1234567890",
      },
      {
        customer_name: "Mandy",
        customer_id: "ABC002",
        billing_address: "123, A colony,madurai",
        shipping_address: "123, B colony,AP",
        email_id: "Mandy@gmail.com",
        phone_number: "8838511968",
      },
      {
        customer_name: "Rose",
        customer_id: "ABC003",
        billing_address: "123, A colony,Coimbatore",
        shipping_address: "123, B colony,salem",
        email_id: "rose@gmail.com",
        phone_number: "8888867890",
      },
    ],
    sales_table_data: [
      {
        product_id: "PRO001",
        product_name: "E-shirt",
        stock_level: "50",
        uom: ["Set (5)", "Box (5)"],
        unit_price: "120",
        discount: "5",
        tax: ["18", "12"],
      },
      {
        product_id: "PRO002",
        product_name: "M-shirt",
        stock_level: "40",
        uom: ["Set (5)", "Box (5)"],
        unit_price: "130",
        discount: "5",
        tax: ["18", "12"],
      },
      {
        product_id: "PRO003",
        product_name: "T-shirt",
        stock_level: "0",
        uom: ["Set (5)", "Box (5)"],
        unit_price: "150",
        discount: "5",
        tax: ["18", "12"],
      },
    ],
    sales_rep: ["Sans", "rose", "Mandy"],
    purchase_order: "",
  };

  const [salesData, setSalesData] = useState({
    sales_order_id: "",
    order_date: "",
    sales_rep: "",
    order_type: "",
    customer_name: "",
    customer_id: "",
    billing_address: "",
    shipping_address: "",
    email_id: "",
    phone_number: "",
    payment_method: "",
    currency: "",
    due_date: "",
    terms_conditions: "",
    shipping_method: "",
    expected_delivery: "",
    tracking_number: "",
    internal_notes: "",
    customer_notes: "",
    global_discount: 0,
    shipping_charges: 0,
  });
  const [salesBtn, setSalesBtn] = useState({
    BtnAccess: false,
    cancel: false,
    cancel_order: true,
    save_draft: false,
    submit: false,
    Generate_po: false,
    pdf: true,
    email: true,
    generate_delivery_note: true,
    generate_invoice: true,
  });

  //sales product data

  const [numOfSalesList, setnumOfSalesList] = useState(1);
  const [SalesList_data, setSalesList_data] = useState([{ unique_key: 0 }]);
  useEffect(() => {
    setApiSales(salesFromApi);
  }, []);
  useEffect(() => {
    if (Object.keys(ApiSales).length > 0) {
      setprevsalesData(ApiSales.prevsalesData);
      setSales_table_data(ApiSales.sales_table_data);
      setSales_rep(ApiSales.sales_rep);
      setPurchase_order(ApiSales.purchase_order);
    }
  }, [ApiSales]);

  const handleSalesDataChange = (e) => {
    setSalesData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  useEffect(() => {
    const selected = salesData.customer_name;

    if (!selected) {
      setSalesData({
        customer_name: "",
        customer_id: "",
        billing_address: "",
        shipping_address: "",
        email_id: "",
        phone_number: "",
      });
      return;
    }

    const customer = prevsalesData.find(
      (ele) => ele.customer_name === selected
    );

    if (customer) {
      setSalesData((prev) => ({
        ...prev,
        customer_id: customer.customer_id,
        billing_address: customer.billing_address,
        shipping_address: customer.shipping_address,
        email_id: customer.email_id,
        phone_number: customer.phone_number,
      }));
    }
  }, [salesData.customer_name, prevsalesData]);

  //button state
  useEffect(() => {
    if (salesStatus === "") {
      setSalesBtn((prev) => ({ ...prev, BtnAccess: false }));
      return;
    }

    switch (salesStatus) {
      case "Draft":
        setSalesBtn((prev) => ({
          ...prev,
          BtnAccess: false,
          cancel: false,
          cancel_order: true,
          save_draft: false,
          submit: false,
          Generate_po: purchase_order === "Purchase Ordered",
          pdf: false,
          email: false,
          generate_delivery_note: true,
          generate_invoice: true,
        }));
        break;

      case "Submitted(PD)":
        setSalesBtn((prev) => ({
          ...prev,
          cancel: false,
          cancel_order: false,
          save_draft: true,
          submit: false,
          Generate_po: purchase_order === "Purchase Ordered",
          pdf: false,
          email: false,
          generate_delivery_note: false,
          generate_invoice: true,
        }));
        break;

      case "Submitted":
        setSalesBtn((prev) => ({
          ...prev,
          cancel: false,
          cancel_order: false,
          save_draft: true,
          submit: true,
          Generate_po: false,
          pdf: false,
          email: false,
          generate_delivery_note: false,
          generate_invoice: false,
          BtnAccess: true,
        }));
        break;

      case "Cancelled":
        setSalesBtn((prev) => ({
          ...prev,
          cancel: false,
          cancel_order: true,
          save_draft: true,
          submit: true,
          Generate_po: true,
          pdf: false,
          email: false,
          generate_delivery_note: true,
          generate_invoice: true,
        }));
        break;

      default:
        setSalesBtn((prev) => ({ ...prev, BtnAccess: false }));
    }
  }, [salesStatus, purchase_order]);

  const handleSaveDraftState = (e) => {
    e.preventDefault();
    setSalesStatus("Draft");
    toast.success("Sales Item in Save Draft State");
  };

  //stock Level
  const handleSubmitState = (e) => {
    e.preventDefault();

    if (SalesList_data.length === 0) {
      toast.error("Add at least one product before submitting");
      return;
    }
    const isStockOK = SalesList_data.every(
      ({ quantity = 0, stock_level = 0 }) =>
        Number(stock_level) > 0 && Number(stock_level) >= Number(quantity)
    );
    if (isStockOK) {
      setSalesStatus("Submitted");
      toast.success("Sales order has been submitted");
    } else {
      setStockAlert(true);
    }
  };

  // const handleGenerateState = (e) => {
  //   e.preventDefault();
  //   setSalesStatus("Generate(PO)");
  //   toast.success("Sales Item in Generate(PO) State");
  // };
  const handleCancelOrderState = (e) => {
    e.preventDefault();
    const okCancel = window.confirm("Are you sure you want to Cancer Order ?");
    if (okCancel) {
      setSalesStatus("Cancelled");
      toast.success("Sales Item in Cancelled State");
    }
  };

  function productTotal(ind) {
    const data = SalesList_data[ind];
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
    const total = SalesList_data.reduce((acc, data) => {
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
    const taxTotal = SalesList_data.reduce((acc, data) => {
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
    const discount =
      (subtotal * (parseFloat(salesData.global_discount) || 0)) / 100;
    const shipping = parseFloat(salesData.shipping_charges) || 0;

    const grandTotal = subtotal - discount + shipping;

    return grandTotal.toFixed(2); // or `return Number(grandTotal.toFixed(2))` if you want a number
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

  //delete salese product
  function deleteSalesProduct(ind) {
    const okDel = window.confirm(
      "Are you sure you want to delete this Product?"
    );
    if (okDel) {
      setSalesList_data((prev) => prev.filter((_, index) => index !== ind));
      setnumOfSalesList((prev) => prev - 1);
      toast.success("Product Item deleted!");
    }
  }

  console.log(salesBtn.BtnAccess);
  console.log(salesStatus);

  return (
    <>
      {stockAlert && (
        <div className="createNewSales-btn">
          <CreatNewSalesStockAlert
            setStockAlert={setStockAlert}
            setSalesStatus={setSalesStatus}
            purchase_order={purchase_order}
            //stock level
            SalesList_data={SalesList_data}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
      <div
        className={`createNewSales-container ${
          stockAlert && "createNewSales-blur"
        }`}
      >
        <form onSubmit={handleSubmitState}>
          <div className="createNewSales-head">
            <nav>
              {salesStatus !== "" && (
                <svg
                  className={
                    purchase_order === ""
                      ? "createNewSales-purchase-tag"
                      : purchase_order === "Purchase Ordered"
                      ? "createNewSales-purchase-order-tag"
                      : purchase_order === "Purchase Ordered(PP)"
                      ? "createNewSales-purchase-orderPP-tag"
                      : purchase_order === "Ready to Submit"
                      ? "createNewSales-readyTOsubmit-tag"
                      : "createNewSales-purchase-tag"
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.123245 10.8159C0.410245 11.8189 1.18325 12.5909 2.72825 14.1359L4.55825 15.9659C7.24825 18.6569 8.59225 19.9999 10.2622 19.9999C11.9332 19.9999 13.2772 18.6559 15.9662 15.9669C18.6562 13.2769 20.0002 11.9329 20.0002 10.2619C20.0002 8.59187 18.6562 7.24687 15.9672 4.55787L14.1372 2.72787C12.5912 1.18287 11.8192 0.409866 10.8162 0.122866C9.81324 -0.165134 8.74825 0.0808662 6.61925 0.572866L5.39125 0.855866C3.59925 1.26887 2.70325 1.47587 2.08925 2.08887C1.47525 2.70187 1.27025 3.59987 0.856245 5.39087L0.572245 6.61887C0.0812454 8.74887 -0.163755 9.81287 0.123245 10.8159ZM8.12224 5.27087C8.31512 5.45687 8.469 5.67944 8.5749 5.92558C8.6808 6.17172 8.73659 6.4365 8.73902 6.70444C8.74145 6.97238 8.69046 7.23812 8.58904 7.48614C8.48763 7.73416 8.33781 7.95948 8.14833 8.14896C7.95886 8.33843 7.73354 8.48825 7.48552 8.58967C7.2375 8.69108 6.97176 8.74207 6.70382 8.73964C6.43588 8.73721 6.1711 8.68142 5.92496 8.57552C5.67882 8.46962 5.45625 8.31574 5.27025 8.12287C4.9033 7.74237 4.70039 7.23303 4.70518 6.70444C4.70998 6.17585 4.92208 5.67027 5.29587 5.29649C5.66965 4.9227 6.17523 4.7106 6.70382 4.7058C7.23241 4.70101 7.74175 4.90392 8.12224 5.27087ZM17.0502 10.0509L10.0712 17.0309C9.92973 17.1674 9.74024 17.2429 9.54359 17.2411C9.34695 17.2393 9.15887 17.1604 9.01988 17.0212C8.88089 16.8821 8.8021 16.694 8.80049 16.4973C8.79887 16.3007 8.87456 16.1113 9.01124 15.9699L15.9892 8.98987C16.1299 8.84917 16.3208 8.77013 16.5197 8.77013C16.7187 8.77013 16.9095 8.84917 17.0502 8.98987C17.1909 9.13056 17.27 9.32139 17.27 9.52037C17.27 9.71934 17.1909 9.91017 17.0502 10.0509Z"
                  />
                </svg>
              )}

              <p>New Sales Order</p>
              {salesStatus && (
                <h3
                  className={
                    salesStatus === "Draft"
                      ? "createNewSales-Status-draft"
                      : salesStatus === "Submitted"
                      ? "createNewSales-Status-submitted"
                      : salesStatus === "Submitted(PD)"
                      ? "createNewSales-Status-SubmittedPD"
                      : salesStatus === "Delivered"
                      ? "createNewSales-Status-Delivered"
                      : salesStatus === "Cancelled"
                      ? "createNewSales-Status-Cancelled"
                      : salesStatus === "Partially Delivered"
                      ? "createNewSales-Status-partiallyDelivered"
                      : ""
                  }
                >
                  Status:{salesStatus}
                </h3>
              )}
            </nav>
            <div>
              <button
                className={
                  salesStatus === "Submitted" || salesStatus === "Submitted(PD)"
                    ? "createNewSales-active-btn"
                    : "createNewSales-inactive-btn"
                }
                disabled={salesBtn.generate_delivery_note}
                onClick={() => setCurrentPage("createNewDelivery")}
              >
                Generate Delivery Note
              </button>
              <button
                className={
                  salesStatus === "Submitted"
                    ? "createNewSales-active-btn"
                    : "createNewSales-inactive-btn"
                }
                disabled={salesBtn.generate_invoice}
                onClick={() => setCurrentPage("createNewInvoice")}
              >
                Generate Invoice
              </button>
              <div
                className="createNewSales-close"
                onClick={() => prevPage(-1)}
              >
                <svg
                  className="createNewSales-circle-x-logo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
                <p>Close</p>
              </div>
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="sales_order_id">
                Sales Order ID {`(Auto Generate)`}
              </label>
              <input
                id="sales_order_id"
                type="text"
                value={salesData.sales_order_id}
                onChange={handleSalesDataChange}
                placeholder="Auto Generate"
                disabled
              />
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="order_date">
                Order Date<sup>*</sup>
              </label>
              <input
                id="order_date"
                value={salesData.order_date}
                onChange={handleSalesDataChange}
                type="date"
                required
                disabled={salesBtn.BtnAccess}
              />
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="sales_rep">
                Sales Rep<sup>*</sup>
              </label>
              <select
                id="sales_rep"
                value={salesData.sales_rep}
                onChange={handleSalesDataChange}
                required
                disabled={salesBtn.BtnAccess}
              >
                <option value="">Select Sales Rep</option>
                {sales_rep.map((ele, ind) => (
                  <option key={ind} value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="order_type">
                Order Type<sup>*</sup>
              </label>
              <select
                id="order_type"
                value={salesData.order_type}
                onChange={handleSalesDataChange}
                required
                disabled={salesBtn.BtnAccess}
              >
                <option value="">Select Order</option>
                <option value="Standard">Standard</option>
                <option value="Rush">Rush</option>
                <option value="Backorder">Backorder</option>
              </select>
            </div>
          </div>
          <nav className="createNewSales-subtit">Customer Information</nav>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="customer_name">
                Customer Name<sup>*</sup>
              </label>
              <select
                id="customer_name"
                value={salesData.customer_name}
                onChange={handleSalesDataChange}
                disabled={salesBtn.BtnAccess}
              >
                <option value="">Select Customer</option>
                {prevsalesData.map((ele, ind) => (
                  <option key={ind} value={ele.customer_name}>
                    {ele.customer_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="customer_id">
                Customer ID {`(Auto Generate)`}
              </label>

              <input
                id="customer_id"
                value={salesData.customer_id}
                onChange={handleSalesDataChange}
                type="text"
                placeholder="Auto Generate"
                disabled
              />
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="billing_address">
                Billing Address<sup>*</sup>
              </label>
              <input
                id="billing_address"
                value={salesData.billing_address}
                onChange={handleSalesDataChange}
                type="text"
                placeholder="Enter Address"
                required
                disabled={salesBtn.BtnAccess}
              />
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="shipping_address">
                Shipping Address<sup>*</sup>
              </label>
              <input
                id="shipping_address"
                type="text"
                value={salesData.shipping_address}
                onChange={handleSalesDataChange}
                placeholder="Enter Address"
                required
                disabled={salesBtn.BtnAccess}
              />
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="email_id">
                Email ID<sup>*</sup>
              </label>
              <input
                id="email_id"
                value={salesData.email_id}
                onChange={handleSalesDataChange}
                type="email"
                placeholder="Enter Email"
                required
                disabled={salesBtn.BtnAccess}
              />
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="phone_number">
                Phone Number<sup>*</sup>
              </label>
              <input
                id="phone_number"
                value={salesData.phone_number}
                onChange={handleSalesDataChange}
                className="increment-decrement-createNewSales"
                type="number"
                placeholder="Enter Address"
                required
                disabled={salesBtn.BtnAccess}
              />
            </div>
          </div>
          <nav className="createNewSales-subtit">Payment Details</nav>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="payment_method">Payment Method</label>
              <select
                id="payment_method"
                value={salesData.payment_method}
                onChange={handleSalesDataChange}
                disabled={salesBtn.BtnAccess}
              >
                <option value="">Select Payment</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="COD">COD</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="currency">
                Currency<sup>*</sup>
              </label>
              <select
                id="currency"
                value={salesData.currency}
                onChange={handleSalesDataChange}
                required
                disabled={salesBtn.BtnAccess}
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
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="due_date">Due Date</label>
              <input
                id="due_date"
                value={salesData.due_date}
                onChange={handleSalesDataChange}
                type="date"
                disabled={salesBtn.BtnAccess}
              />
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="terms_conditions">Terms & Conditions</label>
              <input
                id="terms_conditions"
                value={salesData.terms_conditions}
                onChange={handleSalesDataChange}
                type="text"
                placeholder="Enter Terms & Conditions"
                disabled={salesBtn.BtnAccess}
              />
            </div>
          </div>
          <nav className="createNewSales-subtit">Logistics & Notes</nav>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="shipping_method">Shipping Method</label>
              <select
                id="shipping_method"
                value={salesData.shipping_method}
                onChange={handleSalesDataChange}
                disabled={salesBtn.BtnAccess}
              >
                <option value="">Select Payment</option>
                <option value="DHL">DHL</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="Local Courier">Local Courier</option>
              </select>
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="expected_delivery">Expected Delivery</label>
              <input
                id="expected_delivery"
                value={salesData.expected_delivery}
                onChange={handleSalesDataChange}
                disabled={salesBtn.BtnAccess}
                type="date"
              />
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="tracking_number">Tracking Number</label>
              <input
                id="tracking_number"
                type="text"
                value={salesData.tracking_number}
                onChange={handleSalesDataChange}
                disabled={salesBtn.BtnAccess}
                placeholder="Enter tracking number"
              />
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="internal_notes">Internal Notes</label>
              <input
                id="internal_notes"
                type="text"
                value={salesData.internal_notes}
                onChange={handleSalesDataChange}
                placeholder="Enter Internal Notes"
                disabled={salesBtn.BtnAccess}
              />
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="customer_notes">Customer Notes</label>
              <input
                id="customer_notes"
                type="text"
                value={salesData.customer_notes}
                onChange={handleSalesDataChange}
                placeholder="Enter Customer Notes"
                disabled={salesBtn.BtnAccess}
              />
            </div>
          </div>
          <nav className="createNewSales-subtit">
            Order Line Items<sup>*</sup>
          </nav>
          <div className="createNewSales-table-container">
            <table>
              <thead className="createNewSales-table-head">
                <tr>
                  <th id="createNewSales-table-smallwidth">#</th>
                  <th>Product Name</th>
                  <th id="createNewSales-table-minwidth">Product ID</th>
                  <th id="createNewSales-table-minwidth">In Stock</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th>Unit Price</th>
                  <th>Tax {"(%)"}</th>
                  <th>Discount {"(%)"}</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="createNewSales-table-body">
                {[...Array(numOfSalesList)].map((ele, ind) => (
                  <SalesListItems
                    key={ind}
                    unique_key={ind}
                    sales_table_data={sales_table_data}
                    setSales_table_data={setSales_table_data}
                    setSalesList_data={setSalesList_data}
                    //function
                    productTotal={productTotal}
                    deleteSalesProduct={deleteSalesProduct}
                    //currency
                    salesData={salesData}
                    //btnaccess
                    btnAccess={salesBtn.BtnAccess}
                  />
                ))}

                <tr>
                  <td></td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSalesList_data((prev) => {
                          return [...prev, { unique_key: numOfSalesList }];
                        });
                        setnumOfSalesList((prev) => ++prev);
                      }}
                      disabled={salesBtn.BtnAccess}
                    >
                      + Add Item
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <nav className="createNewSales-subtit">Order Summary</nav>
          <div className="createNewSales-totals-container">
            <nav>
              <h5>Subtotal</h5>
              <p> {calculateSubtotal()}</p>
            </nav>
            <nav>
              <h5>Global Discount {"(%)"}</h5>
              <input
                type="number"
                value={salesData.global_discount}
                onChange={(e) =>
                  setSalesData((prev) => ({
                    ...prev,
                    global_discount: parseFloat(e.target.value) || 0,
                  }))
                }
                disabled={salesBtn.BtnAccess}
              />
            </nav>
            <nav>
              <h5>Tax Summary</h5>
              <p> {calculateTaxSummery()}</p>
            </nav>
            <nav>
              <h5>
                Shipping Charges{""}
                {salesData.currency === "IND" && <span>{`(₹)`}</span>}
                {salesData.currency === "USD" && <span>{`($)`}</span>}
                {salesData.currency === "GBP" && <span>{`(£)`}</span>}
                {salesData.currency === "SGD" && <span>{`(S$)`}</span>}
                {salesData.currency === "EUR" && <span>{`(€)`}</span>}
              </h5>
              <input
                type="number"
                value={salesData.shipping_charges}
                onChange={(e) =>
                  setSalesData((prev) => ({
                    ...prev,
                    shipping_charges: parseFloat(e.target.value) || 0,
                  }))
                }
                disabled={salesBtn.BtnAccess}
              />
            </nav>
            <nav>
              <h5>Rounding Adjustment</h5>
              <p>{roundedvalue()}</p>
            </nav>
            <nav className="createNewSales-totals-container-bg">
              <h5>Grand Total</h5>
              <p>
                {salesData.currency === "IND" && <span>₹</span>}
                {salesData.currency === "USD" && <span>$</span>}
                {salesData.currency === "GBP" && <span>£</span>}
                {salesData.currency === "SGD" && <span>S$</span>}
                {salesData.currency === "EUR" && <span>€</span>}

                {roundedGrandTotal()}
              </p>
            </nav>
          </div>
          <div className="createNewSales-hub-container">
            <div className="createNewSales-hub-head">
              <p
                className={
                  feacher.showChat
                    ? "createNewSales-hub-head-bg-black"
                    : "createNewSales-hub-head-tit"
                }
                onClick={() => {
                  setFeacher({
                    showChat: true,
                    showHistory: false,
                  });
                }}
              >
                Comments
              </p>
              <p
                className={
                  feacher.showHistory
                    ? "createNewSales-hub-head-bg-black"
                    : "createNewSales-hub-head-tit"
                }
                onClick={() => {
                  setFeacher({
                    showChat: false,
                    showHistory: true,
                  });
                }}
              >
                History
              </p>
            </div>
            <div className="createNewSales-hub-body">
              {feacher.showChat && <CreateNewSalesComment />}
              {feacher.showHistory && <CreateNewSalesHistory />}
            </div>
          </div>
          <div className="createNewSales-btn-container">
            <button
              style={{ width: "max-content" }}
              className={
                salesStatus === "Submitted" ||
                salesStatus === "Submitted(PD)" ||
                salesStatus === "Cancelled"
                  ? "createNewSales-order-active-btn"
                  : "createNewSales-inactive-btn"
              }
              onClick={handleCancelOrderState}
              disabled={salesBtn.cancel_order}
            >
              {salesStatus === "Cancelled" ? "Cancelled" : "Cancel Order"}
            </button>
            <nav>
              <button
                className="createNewSales-cancel-btn"
                onClick={(e) => {
                  e.preventDefault();
                  prevPage(-1);
                }}
                disabled={salesBtn.cancel}
              >
                Cancel
              </button>
              <button
                className={
                  salesStatus === "Draft" || salesStatus === ""
                    ? "createNewSales-active-btn"
                    : "createNewSales-completed-btn"
                }
                onClick={handleSaveDraftState}
                disabled={salesBtn.save_draft}
              >
                Save Draft
              </button>
              <button
                className={
                  salesStatus === "Draft" ||
                  salesStatus === "Submitted(PD)" ||
                  salesStatus === ""
                    ? "createNewSales-active-btn"
                    : "createNewSales-completed-btn"
                }
                disabled={salesBtn.submit}
              >
                Submit
              </button>
              <button
                className={
                  salesStatus === "" ||
                  salesStatus === "Submitted" ||
                  (salesStatus === "Submitted(PD)" &&
                    purchase_order !== "Purchase Ordered") ||
                  (salesStatus === "Draft" &&
                    purchase_order !== "Purchase Ordered")
                    ? "createNewSales-active-btn"
                    : "createNewSales-completed-btn"
                }
                disabled={salesBtn.Generate_po}
                onClick={() => {
                  setCurrentPage("createNewPurchase");
                }}
              >
                Generate (PO)
              </button>

              <svg
                className={
                  salesStatus !== ""
                    ? "createNewSales-pdf-mail-activelogo"
                    : "createNewSales-pdf-mail-futurelogo"
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22 24"
                fill="none"
                display={salesBtn.pdf}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"
                />
              </svg>
              <svg
                className={
                  salesStatus !== ""
                    ? "createNewSales-pdf-mail-activelogo"
                    : "createNewSales-pdf-mail-futurelogo"
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 16"
                fill="none"
                disabled={salesBtn.email}
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
