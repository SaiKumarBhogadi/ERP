import React, { useState, useEffect } from "react";
import "./createNewStockReturn.css";
import { useNavigate } from "react-router-dom";
import ReturnListItem from "./returnListItem";
import ReturnComment from "./returnComment";
import ReturnHistory from "./returnHistory";
import ReturnAttachment from "./returnAttachment";
import { toast } from "react-toastify";

export default function createNewStockReturn() {
  const [ReturnStatus, setReturnStatus] = useState("");
  const prevpg = useNavigate();

  const [detail, setDetail] = useState({
    comment: true,
    history: false,
    attachment: false,
  });

  const [numOfReturnList, setnumOfReturnList] = useState(1);
  const [returnListData, setReturnListData] = useState([{ unique_key: 0 }]);

  // status
  const [returnBtn, setReturnBtn] = useState({
    buttonAcs: true,
    cancel_order: true,
    draft: false,
    submit: false,
    pdf: true,
    mail: true,
  });

  useEffect(() => {
    if (ReturnStatus === "") {
      setReturnBtn((prev) => ({
        ...prev,
        buttonAcs: false,
        cancel_order: true,
        draft: false,
        submit: false,
        pdf: true,
        mail: true,
      }));
    }
    switch (ReturnStatus) {
      case "Draft":
        setReturnBtn((prev) => ({
          ...prev,
          buttonAcs: false,
          cancel_order: true,
          draft: false,
          submit: false,
          pdf: false,
          mail: false,
        }));
        break;
      case "Submitted":
        setReturnBtn((prev) => ({
          ...prev,
          buttonAcs: true,
          cancel_order: false,
          draft: true,
          submit: true,
          pdf: false,
          mail: false,
        }));
        break;
      case "Submitted(PR)":
        setReturnBtn((prev) => ({
          ...prev,
          buttonAcs: true,
          cancel_order: false,
          draft: true,
          submit: true,
          pdf: false,
          mail: false,
        }));
        break;
      case "Cancelled":
        setReturnBtn((prev) => ({
          ...prev,
          buttonAcs: true,
          cancel_order: true,
          draft: true,
          submit: true,
          pdf: false,
          mail: false,
        }));
        break;
      default:
        setReturnBtn((prev) => ({
          ...prev,
          BtnAccess: false,
        }));
    }
  }, [ReturnStatus]);

  const handleSaveDraftState = (e) => {
    e.preventDefault();
    setReturnStatus("Draft");
    toast.success("Stock Return Item in Save Draft State");
  };
  const handleSubmittedState = (e) => {
    e.preventDefault();
    setReturnStatus("Submitted");
    toast.success("Stock Return Item in Send State");
  };
  const handleCancelledState = (e) => {
    e.preventDefault();
    setReturnStatus("Cancelled");
    toast.success("Stock Return Item in Cancelled State");
  };
  return (
    <>
      <div className="createNewReturn-container">
        <form onSubmit={handleSubmittedState}>
          <div className="createNewReturn-head">
            <nav>
              <p>{ReturnStatus === "" ? "New Stock Return" : "Stock Return"}</p>
              {ReturnStatus !== "" && (
                <h3
                  className={
                    ReturnStatus === "Draft"
                      ? "createNewReturn-Status-draft"
                      : ReturnStatus === "Submitted"
                      ? "createNewReturn-Status-Submitted"
                      : ReturnStatus === "Cancelled"
                      ? "createNewReturn-Status-Cancelled"
                      : ReturnStatus === "Submitted(PR)"
                      ? "createNewReturn-Status-SubmittedPR"
                      : "createNewReturn-Status-template"
                  }
                >
                  Status: {ReturnStatus}
                </h3>
              )}
            </nav>
            <div>
              <nav
                className="createNewReturn-close"
                onClick={(e) => {
                  e.preventDefault();
                  prevpg(-1);
                }}
              >
                <svg
                  className="createNewReturn-circle-x-logo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
                <p>Close</p>
              </nav>
            </div>
          </div>
          <div className="createNewReturn-input-container">
            <div className="createNewReturn-input-box">
              <label htmlFor="srn_id">SRN ID {`(Auto Generate)`}</label>
              <input
                id="srn_id"
                type="text"
                placeholder="Auto Generate"
                disabled
              />
            </div>
            <div className="createNewReturn-input-box">
              <label htmlFor="grn_referance_id">
                GRN Reference ID<sup>*</sup>
              </label>
              <select
                name=""
                id="grn_referance_id"
                required
                disabled={returnBtn.buttonAcs}
              >
                <option value="">Select Purchase Order Ref</option>
                <option value="PO-0001">PO-0001</option>
                <option value="PO-0002">PO-0002</option>
              </select>
            </div>
          </div>
          <div className="createNewReturn-input-container">
            <div className="createNewReturn-input-box">
              <label htmlFor="po_referance_id">
                PO Reference ID<sup>*</sup>
              </label>
              <select
                name=""
                id="po_referance_id"
                required
                disabled={returnBtn.buttonAcs}
              >
                <option value="">Select PO Ref ID</option>
                <option value="PO-0001">PO-0001</option>
                <option value="PO-0002">PO-0002</option>
              </select>
            </div>
            <div className="createNewReturn-input-box">
              <label htmlFor="received_date">Received Date</label>
              <input
                id="received_date"
                type="date"
                disabled={returnBtn.buttonAcs}
              />
            </div>
          </div>
          <div className="createNewReturn-input-container">
            <div className="createNewReturn-input-box">
              <label htmlFor="return_date">
                Return Date<sup>*</sup>
              </label>
              <input
                id="return_date"
                type="date"
                required
                disabled={returnBtn.buttonAcs}
              />
            </div>
            <div className="createNewReturn-input-box">
              <label htmlFor="return_initiated_by">Return Initiated By</label>
              <select
                name=""
                id="return_initiated_by"
                disabled={returnBtn.buttonAcs}
              >
                <option value="">Select PO Ref ID</option>
                <option value="PO-0001">PO-0001</option>
                <option value="PO-0002">PO-0002</option>
              </select>
            </div>
          </div>
          <div className="createNewReturn-input-container">
            <div className="createNewReturn-input-box">
              <label htmlFor="supplier_name">
                Supplier Name<sup>*</sup>
              </label>
              <select
                name=""
                id="supplier_name"
                required
                disabled={returnBtn.buttonAcs}
              >
                <option value="">Select Supplier Name</option>
                <option value="Mandy">Mandy</option>
                <option value="Sans">Sans</option>
              </select>
            </div>
          </div>
          <nav className="createNewReturn-subtit">
            Line Items<sup>*</sup>
          </nav>
          <div className="createNewReturn-table-container">
            <table>
              <thead className="createNewReturn-table-head">
                <tr>
                  <th>#</th>
                  <th>
                    <pre>Product Name</pre>
                  </th>
                  <th>
                    <pre>Product ID</pre>
                  </th>
                  <th>UOM</th>
                  <th>
                    <pre>Qty Ordered</pre>
                  </th>
                  <th>
                    <pre>Rejected Qty</pre>
                  </th>
                  <th>
                    <pre>Return Qty</pre>
                  </th>
                  <th>
                    <pre>Serial No(s)</pre>
                  </th>
                  <th>
                    <pre>Return Reason</pre>
                  </th>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="createNewReturn-table-body">
                {[...Array(numOfReturnList)].map((ele, ind) => (
                  <ReturnListItem key={ind} buttonAcs={returnBtn.buttonAcs} />
                ))}
                <tr>
                  <td></td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setReturnListData((prev) => {
                          return [...prev, { unique_key: numOfReturnList }];
                        });
                        setnumOfReturnList((prev) => ++prev);
                      }}
                    >
                      + Add Item
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="createNewReturn-totals-container">
            <nav>
              <h5>Original Purchased Total</h5>
              <p> 418</p>
            </nav>
            <nav>
              <h5>Global Discount {"(%)"}</h5>
              <p>5%</p>
            </nav>
            <nav>
              <h5>Tax Summary</h5>
              <p> 254</p>
            </nav>
            <nav>
              <h5>
                Returned Subtotal
                {/* {purchaseInput.currency === "IND" && <span>{`(₹)`}</span>}
              {purchaseInput.currency === "USD" && <span>{`($)`}</span>}
              {purchaseInput.currency === "GBP" && <span>{`(£)`}</span>}
              {purchaseInput.currency === "SGD" && <span>{`(S$)`}</span>}
              {purchaseInput.currency === "EUR" && <span>{`(€)`}</span>} */}
              </h5>
              <p>557</p>
            </nav>
            <nav>
              <h5>Global Discount Amount</h5>
              <p>025</p>
            </nav>
            <nav>
              <h5>Rounding Adjustment</h5>
              <p>456</p>
            </nav>
            <nav className="createNewReturn-totals-container-bg">
              <h5>Amount to Recover</h5>
              <p>
                {/* {purchaseInput.currency === "IND" && <span>₹</span>}
              {purchaseInput.currency === "USD" && <span>$</span>}
              {purchaseInput.currency === "GBP" && <span>£</span>}
              {purchaseInput.currency === "SGD" && <span>S$</span>}
              {purchaseInput.currency === "EUR" && <span>€</span>} */}
                555
              </p>
            </nav>
          </div>
          <div className="createNewReturn-hub-container">
            <div className="createNewReturn-hub-head">
              <p
                className={
                  detail.comment
                    ? "createNewReturn-hub-head-bg-black"
                    : "createNewReturn-hub-head-tit"
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
                    ? "createNewReturn-hub-head-bg-black"
                    : "createNewReturn-hub-head-tit"
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
                    ? "createNewReturn-hub-head-bg-black"
                    : "createNewReturn-hub-head-tit"
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
            <div className="createNewReturn-hub-body">
              {detail.comment && <ReturnComment />}
              {detail.history && <ReturnHistory />}
              {detail.attachment && (
                <ReturnAttachment inputDisable={returnBtn.buttonAcs} />
              )}
            </div>
          </div>
          <div className="createNewReturn-btn-container">
            <button
              className={
                ReturnStatus === "Submitted" ||
                ReturnStatus === "Submitted(PR)" ||
                ReturnStatus === "Cancelled"
                  ? "createNewReturn-order-active-btn"
                  : "createNewReturn-inactive-btn"
              }
              onClick={handleCancelledState}
              disabled={returnBtn.cancel_order}
            >
              {ReturnStatus === "Cancelled" ? "Cancel Return" : "Cancelled"}
            </button>
            <nav>
              <button
                className="createNewReturn-cancel-btn"
                onClick={(e) => {
                  e.preventDefault();
                  prevpg(-1);
                }}
              >
                Cancel
              </button>
              <button
                className={
                  ReturnStatus === "" || ReturnStatus === "Draft"
                    ? "createNewReturn-active-btn"
                    : "createNewReturn-completed-btn"
                }
                onClick={handleSaveDraftState}
                disabled={returnBtn.draft}
              >
                Save Draft
              </button>
              <button
                className={
                  ReturnStatus === "" || ReturnStatus === "Draft"
                    ? "createNewReturn-active-btn"
                    : "createNewReturn-completed-btn"
                }
                disabled={returnBtn.submit}
              >
                {ReturnStatus === "Submitted" ? "Submitted" : "Submit"}
              </button>
              <svg
                className={
                  ReturnStatus !== ""
                    ? "createNewReturn-pdf-mail-activelogo"
                    : "createNewReturn-pdf-mail-futurelogo"
                }
                disabled={returnBtn.pdf}
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
                  ReturnStatus !== ""
                    ? "createNewReturn-pdf-mail-activelogo"
                    : "createNewReturn-pdf-mail-futurelogo"
                }
                disabled={returnBtn.mail}
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
