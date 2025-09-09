import React from "react";
import "./createNewStockReturn.css";

export default function returnListItem({ buttonAcs }) {
  return (
    <tr>
      <td>1</td>
      <td>
        <input type="text" name="" id="" disabled={buttonAcs} />
      </td>
      <td>UKB-101</td>
      <td>
        <pre>PC WS</pre>
      </td>
      <td>100</td>
      <td>5</td>
      <td>
        <input type="number" disabled={buttonAcs} />
      </td>
      <td>
        <button style={{ width: "max-content" }} disabled={buttonAcs}>
          Select Serials
        </button>
      </td>
      <td>
        <input
          type="text"
          disabled={buttonAcs}
          placeholder="Enter return reason..."
        />
      </td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>

      <td>
        <svg
          className={`createNewReturn-table-delete-logo ${
            buttonAcs ? "disabled" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 14 16"
        >
          <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
        </svg>
      </td>
    </tr>
  );
}
