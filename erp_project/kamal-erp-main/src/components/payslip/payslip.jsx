import React, { useState, useEffect } from "react";
import "./payslip.css";
export default function payslip() {
  const [apiPayslipData, setapiPayslipData] = useState({});
  const [payslipdata, setpayslipdata] = useState([]);
  const [yearMonth, setyearMonth] = useState("");

  const payslipFromAPI = {
    payslipdata: [
      {
        month: "January",
        year: "2025",
      },
      {
        month: "Februvary",
        year: "2025",
      },
    ],
  };

  const searchAPIData = {
    payslipdata: [
      {
        month: "Returned Month",
        year: "Year",
      },
    ],
  };

  useEffect(() => {
    setapiPayslipData(payslipFromAPI);
  }, []);

  useEffect(() => {
    if (Object.keys(apiPayslipData).length > 0) {
      setpayslipdata(apiPayslipData.payslipdata || []);
    }
  }, [apiPayslipData]);

  function searchpayslip() {
    setpayslipdata(searchAPIData.payslipdata);
  }

  return (
    <div className="payslip">
      <h2>Payslip Generator</h2>
      <div className="select-Y-M-cointainer">
        <div>Select Year & Month :</div>
        <nav className="search-Y-M">
          <input
            className="Y-M"
            type="month"
            name="year"
            min="1900-01"
            max="2100-12"
            id="Year_Month"
            onChange={(e) => {
              setyearMonth(e.target.value);
            }}
          />
          <label htmlFor="yearMonth">
            <svg
              className="search-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              onClick={searchpayslip}
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
        </nav>
      </div>

      <nav>
        <h2>Year : {new Date().getFullYear()}</h2>
        <div className="num-of-task">
          <div className="title-cointainer">
            <div className="list-title" id="count-num">
              #
            </div>
            <div className="payslip-month-title">Month</div>
            <div className="payslip-title">Actions</div>
          </div>
          <div className="light-barline"></div>

          {/* Data Starting */}

          {payslipdata.map((ele, ind) => (
            <div key={ind}>
              <div className="listcontent-cointainer">
                <nav>
                  <div className="list-content" id="count-num">
                    {ind + 1}
                  </div>
                </nav>
                <nav>
                  <div className="payslip-color">{ele.month}</div>
                </nav>
                <nav>
                  <div className="payslip-buttons">
                    <button className="view-payslip">View</button>
                    <button className="download-payslip">Download</button>
                  </div>
                </nav>
              </div>
              <div className="light-barline"></div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
