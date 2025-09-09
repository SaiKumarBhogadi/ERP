import React, { useState, useEffect } from "react";
import "./createNewQuotation.css";
import { useSelector } from "react-redux";

export default function createNewQuotationRevision({
  showRevise,
  setshowRevise,
  reviseCount,
  setreviseCount,
  status,
  setStatus,
}) {
  const { user } = useSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
    setCurrentDate(formattedDate);
  }, []);

  const handleXLogo = (e) => {
    e.preventDefault();
    setshowRevise(false);
    setreviseCount((prevCount) => prevCount - 1);
  };
  const handleCancelBtn = (e) => {
    e.preventDefault();
    setshowRevise(false);
    setreviseCount((prevCount) => prevCount - 1);
  };
  const handleSubmitBtn = (e) => {
    e.preventDefault();
    setStatus("Draft");
    setshowRevise(false);
  };
  return (
    <>
      <div className="newQuotation-revision-container">
        <svg
          className="newQuotation-x-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          onClick={handleXLogo}
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
        <form onSubmit={handleSubmitBtn}>
          <div className="newQuotation-revision-head">
            <p>Revision {reviseCount}</p>
          </div>
          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="revision_number">Revision Number</label>
              <input
                id="revision_number"
                type="number"
                value={reviseCount}
                placeholder="Revision Number"
                disabled
              />
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                value={currentDate}
                type="date"
                placeholder="Date"
                disabled
              />
            </div>
          </div>
          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="created_by">Created by</label>
              <input
                id="created_by"
                value={user.name}
                type="text"
                placeholder="Created by"
                disabled
              />
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="status">Status{`(Default)`} </label>
              <input
                id="status"
                type="text"
                value={"Draft"}
                placeholder="Draft"
                disabled
              />
            </div>
          </div>
          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="comment">
                Comment<sup>*</sup>
              </label>
              <input
                id="comment"
                type="text"
                placeholder="Enter Comment"
                required
              />
            </div>
          </div>
          <div className="newQuotation-revision-btn-container">
            <button
              onClick={handleCancelBtn}
              className="newQuotation-cancel-btn"
            >
              Cancel
            </button>
            <button className="newQuotation-active-btn">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}
