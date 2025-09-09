import React, { useState, useEffect } from "react";
import "./deliveryNoteCRM.css";

export default function deliveryNoteCRM({ setCurrentPage }) {
  const [deliveryCurrentPage, setDeliveryCurrentPage] = useState(1);
  const deliveryPerPage = 10;
  const [ApiDelivery, setApiDelivery] = useState({});
  const [deliveryData, setDeliveryData] = useState([]);

  const deliveryFromApi = {
    deliveryData: [
      {
        dn_id: "DN-0001",
        sales_order_ref: "SO-0001",
        customer_name: "Mandy",
        delivery_type: "Regular", 
        delivery_date: "28-05-2025",
        status: "Draft",
      },
      {
        dn_id: "DN-0002",
        sales_order_ref: "SO-0002",
        customer_name: "Sans",
        delivery_type: "Regular",
        delivery_date: "28-05-2025",
        status: "Partially Delivered",
      },
      {
        dn_id: "DN-0003",
        sales_order_ref: "SO-0002",
        customer_name: "Jon",
        delivery_type: "Regular",
        delivery_date: "28-05-2025",
        status: "Delivered",
      },
      {
        dn_id: "DN-0004",
        sales_order_ref: "SO-0002",
        customer_name: "Wick",
        delivery_type: "Regular",
        delivery_date: "28-05-2025",
        status: "Partially Delivered",
      },
      {
        dn_id: "DN-0005",
        sales_order_ref: "SO-0005",
        customer_name: "Mandy",
        delivery_type: "Regular",
        delivery_date: "28-05-2025",
        status: "Delivered",
      },
      {
        dn_id: "DN-0006",
        sales_order_ref: "SO-0006",
        customer_name: "Kamal",
        delivery_type: "Regular",
        delivery_date: "28-05-2025",
        status: "Draft",
      },
      {
        dn_id: "DN-0007",
        sales_order_ref: "SO-0007",
        customer_name: "Rahul",
        delivery_type: "Regular",
        delivery_date: "28-05-2025",
        status: "Returned",
      },
      {
        dn_id: "DN-0008",
        sales_order_ref: "SO-0008",
        customer_name: "Dhoni",
        delivery_type: "Regular",
        delivery_date: "28-05-2025",
        status: "Cancelled",
      },
    ],
  };

  const [filter, setFilter] = useState({
    delivery_status: "",
    delivery_type: "",
    delivery_from_date: "",
    delivery_to_date: "",
  });

  const [buttonAct, setButtonAct] = useState({
    checkbox: {},
    delivery_return: true,
    invoice: true,
  });

  useEffect(() => {
    setApiDelivery(deliveryFromApi);
  }, []);
  useEffect(() => {
    if (Object.keys(ApiDelivery).length > 0) {
      setDeliveryData(ApiDelivery.deliveryData);
    }
  }, [ApiDelivery]);

  useEffect(() => {
    const selectedOrders = deliveryData.filter(
      (order) => buttonAct.checkbox[order.dn_id]
    );
    const hasMultiple = selectedOrders.length > 1;
    //valid DN_ID
    const firstDN_ID = selectedOrders[0]?.sales_order_ref;
    const sameDN_ID =
      hasMultiple &&
      selectedOrders.every((order) => order.sales_order_ref === firstDN_ID);

    //delivery return and invoice valid states
    const validStatus =
      hasMultiple &&
      selectedOrders.every(
        (order) =>
          order.status === "Partially Delivered" ||
          order.status === "Delivered" ||
          order.status === "Returned"
      );
    setButtonAct((prev) => ({
      ...prev,
      delivery_return: selectedOrders.length > 0 && validStatus && sameDN_ID,
      invoice: selectedOrders.length > 0 && validStatus && sameDN_ID,
    }));
  }, [buttonAct.checkbox, deliveryData]);

  // checkbox
  const handlecheckbox = (e, ele) => {
    const { id, checked } = e.target;
    setButtonAct((prev) => ({
      checkbox: {
        ...prev.checkbox,
        [ele.dn_id]: checked,
      },
    }));
  };
  //page calculation
  const totalPages = Math.ceil(deliveryData.length / deliveryPerPage);

  const currentData = deliveryData.slice(
    (deliveryCurrentPage - 1) * deliveryPerPage,
    deliveryCurrentPage * deliveryPerPage
  );

  const handleNext = () => {
    if (deliveryCurrentPage < totalPages) {
      setDeliveryCurrentPage((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (deliveryCurrentPage > 1) {
      setDeliveryCurrentPage((prev) => prev - 1);
    }
  };
  const handleClearFilter = () => {
    setFilter({
      delivery_status: "",
      delivery_type: "",
      delivery_from_date: "",
      delivery_to_date: "",
    });
  };
  console.log(buttonAct.checkbox);

  return (
    <>
      <div className="deliveryCRM-container">
        <div className="deliveryCRM-header">
          <p>Delivery Notes</p>
          <button
            onClick={() => {
              setCurrentPage("createNewDelivery");
            }}
          >
            + New Delivery Note
          </button>
        </div>
        <div className="deliveryCRM-search-box">
          <label htmlFor="searchByID">
            <svg
              className="deliveryCRM-search-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input
            id="searchByID"
            placeholder="Search by DN number, Customer name...."
          />
        </div>
        <div className="deliveryCRM-clearfilter">
          <p onClick={handleClearFilter}>Clear Filter</p>
        </div>
        <div className="deliveryCRM-search-category">
          <div className="deliveryCRM-input-box">
            <label htmlFor="delivery_status">Delivery Status</label>
            <select
              value={filter.delivery_status}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  delivery_status: e.target.value,
                }));
              }}
              id="delivery_status"
            >
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Partially Delivered">Partially Delivered</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="deliveryCRM-input-box">
            <label htmlFor="delivery_type">Delivery Type</label>
            <select
              value={filter.delivery_type}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  delivery_type: e.target.value,
                }));
              }}
              id="delivery_type"
            >
              <option value="">All Types</option>
              <option value="Regular">Regular</option>
              <option value="Urgent">Urgent</option>
              <option value="Return">Return</option>
            </select>
          </div>
          <div className="deliveryCRM-input-box">
            <label htmlFor="delivery_date">Delivery Date</label>
            <nav id="deldvery_date">
              <div>
                <span>From </span>
                <input
                  value={filter.delivery_from_date}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      delivery_from_date: e.target.value,
                    }));
                  }}
                  className="deliveryCRM-date"
                  type="date"
                />
              </div>
              <div>
                <span>to </span>
                <input
                  value={filter.delivery_to_date}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      delivery_to_date: e.target.value,
                    }));
                  }}
                  className="deliveryCRM-date"
                  type="date"
                />
              </div>
            </nav>
          </div>
        </div>
        <div className="deliveryCRM-table-title">
          <nav>
            <button
              className={
                buttonAct.delivery_return === true
                  ? "deliveryCRM-active-btn"
                  : "deliveryCRM-inactive-btn "
              }
              disabled={buttonAct.delivery_return}
            >
              Generate Delivery Return
            </button>
            <button
              className={
                buttonAct.invoice === true
                  ? "deliveryCRM-active-btn"
                  : "deliveryCRM-inactive-btn "
              }
              disabled={buttonAct.invoice}
            >
              Generate Invoice
            </button>
          </nav>
        </div>
        <div className="deliveryCRM-table-cointainer">
          <table>
            <thead className="deliveryCRM-table-head">
              <tr>
                <th></th>
                <th>DN ID</th>
                <th className="deliveryCRM-maxhead-width">Sales Order Ref.</th>
                <th className="deliveryCRM-maxhead-width">Customer Name</th>
                <th className="deliveryCRM-minhead-width">Delivery Type</th>
                <th className="deliveryCRM-minhead-width">Delivery Date</th>
                <th>
                  <div className="deliveryCRM-status-filter">
                    Status
                    <nav className="deliveryCRM-filter-box">
                      <p>Newest First</p>
                      <p>Oldest First</p>
                      <p>Progressing {`(Draft → Cancelled)`}</p>
                      <p>Reverse Progressing{`(Cancelled → Draft)`} </p>
                    </nav>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="18"
                      viewBox="0 0 14 18"
                      fill="none"
                    >
                      <path
                        d="M3.66683 12.3346H0.333496L5.3335 17.3346V0.667969H3.66683V12.3346ZM8.66683 3.16797V17.3346H10.3335V5.66797H13.6668L8.66683 0.667969V3.16797Z"
                        fill="#234E70"
                      />
                    </svg>
                  </div>
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="deliveryCRM-table-body">
              {currentData.length > 0 ? (
                currentData.map((ele, ind) => (
                  <tr key={ind}>
                    <td>
                      <input
                        className="deliveryCRM-table-check"
                        type="checkbox"
                        onChange={(e) => handlecheckbox(e, ele)}
                        checked={!!buttonAct.checkbox[ele.dn_id]}
                      />
                    </td>
                    <td className="deliveryCRM-minbody-width">{ele.dn_id}</td>
                    <td>{ele.sales_order_ref}</td>
                    <td>{ele.customer_name}</td>
                    <td>{ele.delivery_type}</td>
                    <td>{ele.delivery_date}</td>
                    <td>
                      <p
                        className={`deliveryCRM-Status ${
                          ele.status === "Draft"
                            ? "deliveryCRM-Status-draft"
                            : ele.status === "Delivered"
                            ? "deliveryCRM-Status-Delivered"
                            : ele.status === "Cancelled"
                            ? "deliveryCRM-Status-Cancelled"
                            : ele.status === "Partially Delivered"
                            ? "deliveryCRM-Status-partiallyDelivered"
                            : ele.status === "Returned"
                            ? "deliveryCRM-Status-Returned"
                            : ""
                        }`}
                      >
                        {ele.status}
                      </p>
                    </td>
                    <td id="deliveryCRM-table-action">
                      <nav className="deliveryCRM-dot-container">
                        <button
                          disabled={ele.status !== "" ? false : true}
                          onClick={() => {
                            setCurrentPage("editDelivery");
                          }}
                        >
                          {ele.status === "Draft" ? "Edit" : "View"} details
                        </button>
                        <button
                          disabled={
                            ele.status === "Partially Delivered" ||
                            ele.status === "Delivered" ||
                            ele.status === "Returned"
                              ? false
                              : true
                          }
                        >
                          Generate Delivery Return
                        </button>
                        <button
                          disabled={
                            ele.status === "Partially Delivered" ||
                            ele.status === "Delivered" ||
                            ele.status === "Returned"
                              ? false
                              : true
                          }
                        >
                          Generate Invoice
                        </button>
                      </nav>
                      <svg
                        className="deliveryCRM-delete-logo"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
                          fill="#2A2A2A"
                        />
                      </svg>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <nav className="deliveryCRM-table-bottem">
          <p className="deliveryCRM-num-entries">
            Showing {currentData.length} entries
          </p>
          <div className="deliveryCRM-manage-control-box">
            <button
              className="deliveryCRM-manage-btn"
              onClick={handlePrev}
              disabled={deliveryCurrentPage === 1}
            >
              Prev
            </button>
            <nav className="deliveryCRM-num-page">
              {" "}
              Page {deliveryCurrentPage} of {totalPages}{" "}
            </nav>
            <button
              className="deliveryCRM-manage-btn"
              onClick={handleNext}
              disabled={deliveryCurrentPage === totalPages}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
