import React, { useState, useEffect } from "react";
import "./createNewQuotation.css";

export default function createNewQuptationRevisionHistory({ setshowHistory }) {
  const [ApiHistory, setApiHistory] = useState({});
  const [historyData, setHistoryData] = useState([]);

  const historyFromApi = {
    historyData: [
      {
        revision_number: "3",
        date: "21-05-2025",
        created_by: "Director",
        status: "Draft",
        comment: "Discount valDiscount added before approvalDiscount added ",
      },
      {
        revision_number: "2",
        date: "18-05-2025",
        created_by: "Director",
        status: "Send",
        comment: "Discount added before approval",
        revise_history: {
          id: "1",
          quotation_id: "QUO0001",
          quotation_type: "Service",
          customer_name: "Mandy",
          sales_rep: "Sans",
          quotation_date: "2025-10-10",
          status: "Draft",
          revise_count: 1,
          grand_total: "50000",
          product_id: "PRO0005",
          description: "M-shirt",
          uom: "Set (5)",
          unit_price: "5",
          discount: "5",
          tax: "18",
          quantity: "9",
        },
      },
      {
        revision_number: "1",
        date: "15-05-2025",
        created_by: "Director",
        status: "Send",
        comment: "",
      },
      {
        revision_number: "2",
        date: "18-05-2025",
        created_by: "Director",
        status: "Send",
        comment: "Discount added before approval",
      },
      {
        revision_number: "1",
        date: "15-05-2025",
        created_by: "Director",
        status: "Send",
        comment: "",
      },
      {
        revision_number: "1",
        date: "15-05-2025",
        created_by: "Director",
        status: "Send",
        comment: "",
      },
      {
        revision_number: "1",
        date: "15-05-2025",
        created_by: "Director",
        status: "Send",
        comment: "",
      },
      {
        revision_number: "1",
        date: "15-05-2025",
        created_by: "Director",
        status: "Send",
        comment: "",
      },
      {
        revision_number: "1",
        date: "15-05-2025",
        created_by: "Director",
        status: "Send",
        comment: "",
      },
    ],
  };
  useEffect(() => {
    setApiHistory(historyFromApi);
  }, []);
  useEffect(() => {
    if (Object.keys(ApiHistory).length > 0) {
      setHistoryData(ApiHistory.historyData);
    }
  }, [ApiHistory]);

  const handleAction = (e) => {
    if (e.status === "Draft") {
      setshowHistory(false);
    } else {
    }
  };

  return (
    <>
      <div className="newQuotation-revHistory-container">
        <table>
          <thead className="newQuotation-revHistory-tableHead">
            <tr>
              <th id="newQuotation-history-tablemin-width">Revision No</th>
              <th>Date</th>
              <th id="newQuotation-history-tablemin-width">Created By</th>
              <th>Status</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="newQuotation-revHistory-tableBody">
            {historyData.length > 0
              ? historyData.map((ele, ind) => (
                  <tr key={ind}>
                    <td>{ele.revision_number}</td>
                    <td id="newQuotation-history-tablesmall-width">
                      {ele.date}
                    </td>
                    <td>{ele.created_by}</td>
                    <td>{ele.status}</td>
                    <td id="newQuotation-history-tablemax-width">
                      {ele.comment === "" ? "Initial version" : ele.comment}
                    </td>
                    <td>
                      <button
                        className={`newQuotation-history-table-body-btn ${
                          ele.status === "Draft"
                            ? "newQuotation-history-table-bodyDraft-btn"
                            : "newQuotation-history-table-bodyNotDraft-btn"
                        }`}
                        onClick={() => handleAction(ele)}
                      >
                        {ele.status === "Draft" ? "Edit" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </div>
    </>
  );
}
