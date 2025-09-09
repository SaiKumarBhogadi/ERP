import React, { useState, useEffect } from "react";
import "./createNewDelivery.css";
import { toast } from "react-toastify"; // optional: for notifications

export default function CreateNewDeliverySerialNum({ setShowSerial }) {
  const [apiSerial, setApiSerial] = useState({});
  const [serialData, setSerialData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const serialFromApi = {
    serialData: [
      "TS-001",
      "TS-002",
      "TS-003",
      "TS-004",
      "TS-005",
      "TS-006",
      "TS-007",
      "TS-008",
      "TS-009",
      "TS-010",
      "TS-011",
    ],
    selected: [{ required: "5", total: "11" }],
  };

  useEffect(() => {
    setApiSerial(serialFromApi);
  }, []);

  useEffect(() => {
    if (Object.keys(apiSerial).length > 0) {
      setSerialData(apiSerial.serialData);
      setSelected(apiSerial.selected);
    }
  }, [apiSerial]);

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const requiredLimit = Number(selected[0]?.required || 0);

  const handleCheckboxChange = (index) => {
    const isChecked = checkedItems[index];

    if (isChecked) {
      // Allow unchecking
      setCheckedItems((prev) => ({ ...prev, [index]: false }));
    } else if (totalChecked < requiredLimit) {
      // Allow checking if within limit
      setCheckedItems((prev) => ({ ...prev, [index]: true }));
    } else {
      toast.warning("You cannot select more than required serial numbers.");
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newCheckedItems = {};

    if (checked) {
      let count = 0;
      for (let i = 0; i < serialData.length && count < requiredLimit; i++) {
        newCheckedItems[i] = true;
        count++;
      }
    } else {
      serialData.forEach((_, i) => {
        newCheckedItems[i] = false;
      });
    }

    setCheckedItems(newCheckedItems);
  };
  console.log(checkedItems);

  return (
    <div className="createNewDelivery-serial-conratner">
      <div className="createNewDelivery-serial-head">
        <p>Select Serial Numbers</p>
        <nav className="createNewDelivery-serial-search-box">
          <label htmlFor="createNewDelivery-focus">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5927 21.2545L10.5817 21.2565L10.5107 21.2915L10.4907 21.2955L10.4767 21.2915L10.4057 21.2565C10.395 21.2532 10.387 21.2549 10.3817 21.2615L10.3777 21.2715L10.3607 21.6995L10.3657 21.7195L10.3757 21.7325L10.4797 21.8065L10.4947 21.8105L10.5067 21.8065L10.6107 21.7325L10.6227 21.7165L10.6267 21.6995L10.6097 21.2725C10.607 21.2619 10.6014 21.2559 10.5927 21.2545ZM10.8577 21.1415L10.8447 21.1435L10.6597 21.2365L10.6497 21.2465L10.6467 21.2575L10.6647 21.6875L10.6697 21.6995L10.6777 21.7065L10.8787 21.7995C10.8913 21.8029 10.901 21.8002 10.9077 21.7915L10.9117 21.7775L10.8777 21.1635C10.8744 21.1515 10.8677 21.1442 10.8577 21.1415ZM10.1427 21.1435C10.1383 21.1408 10.133 21.14 10.128 21.1411C10.1229 21.1422 10.1185 21.1452 10.1157 21.1495L10.1097 21.1635L10.0757 21.7775C10.0764 21.7895 10.082 21.7975 10.0927 21.8015L10.1077 21.7995L10.3087 21.7065L10.3187 21.6985L10.3227 21.6875L10.3397 21.2575L10.3367 21.2455L10.3267 21.2355L10.1427 21.1435Z"
                fill="#2A2A2A"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.49977 1.91687e-08C7.14436 0.000115492 5.80863 0.324364 4.60402 0.945694C3.39941 1.56702 2.36086 2.46742 1.575 3.57175C0.789144 4.67609 0.278775 5.95235 0.0864735 7.29404C-0.105828 8.63574 0.0255146 10.004 0.469544 11.2846C0.913572 12.5652 1.65741 13.7211 2.639 14.6557C3.62059 15.5904 4.81147 16.2768 6.11228 16.6576C7.41309 17.0384 8.78611 17.1026 10.1168 16.8449C11.4475 16.5872 12.6972 16.015 13.7618 15.176L17.4138 18.828C17.6024 19.0102 17.855 19.111 18.1172 19.1087C18.3794 19.1064 18.6302 19.0012 18.8156 18.8158C19.001 18.6304 19.1062 18.3796 19.1084 18.1174C19.1107 17.8552 19.0099 17.6026 18.8278 17.414L15.1758 13.762C16.1638 12.5086 16.7789 11.0024 16.9509 9.41573C17.1228 7.82905 16.8446 6.22602 16.148 4.79009C15.4514 3.35417 14.3646 2.14336 13.0121 1.29623C11.6595 0.449106 10.0957 -0.000107143 8.49977 1.91687e-08ZM1.99977 8.5C1.99977 6.77609 2.68458 5.12279 3.90357 3.90381C5.12256 2.68482 6.77586 2 8.49977 2C10.2237 2 11.877 2.68482 13.096 3.90381C14.3149 5.12279 14.9998 6.77609 14.9998 8.5C14.9998 10.2239 14.3149 11.8772 13.096 13.0962C11.877 14.3152 10.2237 15 8.49977 15C6.77586 15 5.12256 14.3152 3.90357 13.0962C2.68458 11.8772 1.99977 10.2239 1.99977 8.5Z"
                fill="#C0C0C0"
              />
            </svg>
          </label>
          <input
            type="text"
            id="createNewDelivery-focus"
            placeholder="Search by Serial number"
          />
        </nav>
      </div>

      <div className="createNewDelivery-serial-table">
        <table>
          <thead className="createNewDelivery-serial-thead">
            <tr>
              <th>S.No</th>
              <th className="createNewDelivery-max-width ">Serial Numbers</th>
              <th>
                <div>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={totalChecked === requiredLimit}
                    disabled={serialData.length === 0}
                  />
                  <p>Select All</p>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="createNewDelivery-serial-tbody">
            {serialData.length > 0 ? (
              serialData.map((ele, ind) => (
                <tr key={ind}>
                  <td>{ind + 1}</td>
                  <td>{ele}</td>
                  <td>
                    <div>
                      <input
                        type="checkbox"
                        checked={checkedItems[ind] || false}
                        disabled={
                          !checkedItems[ind] && totalChecked >= requiredLimit
                        }
                        onChange={() => handleCheckboxChange(ind)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">
                  No serial numbers available for this product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="createNewDelivery-serial-btn-container">
        <p>
          Selected:
          <span
            className={
              totalChecked !== requiredLimit
                ? "createNewDelivery-serial-red"
                : "createNewDelivery-serial-green"
            }
          >
            {" "}
            {totalChecked}
          </span>{" "}
          / {requiredLimit} | Total Available: {selected[0]?.total}
        </p>
        <nav>
          <button
            className="createNewDelivery-cancel-btn"
            onClick={() => {
              setCheckedItems({});
              setShowSerial(false);
            }}
          >
            Cancel
          </button>
          <button
            className={
              totalChecked !== requiredLimit
                ? "createNewDelivery-inactive-btn"
                : "createNewDelivery-active-btn"
            }
            onClick={() => {
              toast.success("Serial numbers confirmed successfully!");
              setShowSerial(false);
            }}
            disabled={totalChecked !== requiredLimit}
          >
            Confirm
          </button>
        </nav>
      </div>
    </div>
  );
}
