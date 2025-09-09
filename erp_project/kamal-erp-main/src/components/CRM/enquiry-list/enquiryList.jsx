import React, { useState, useEffect } from "react";
import "./enquiryList.css";
import NewEnquiry from "../new-enquiry/newEnquiry";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function enquiryList() {
  const [APIenquirylist, setAPIenquirylist] = useState({});
  const [enquirylist, setenquirylist] = useState([]);

  const [currentpageEnquirylist, setcurrentpageEnquirylist] = useState(1);
  const rowsPerPageEnquirylist = 10;

  const [EditNewEnquiry, setEditNewEnquiry] = useState(false);
  const [EditNewEnquiryData, setEditNewEnquiryData] = useState({});

  const enquirylistFromAPI = {
    enquirylist: [
      {
        id: "1",
        enquiry_id: "ENQ001",
        first_name: "Ram",
        last_name: "raj",
        email: "example@gmailkamalalan.com",
        phone_number: "1234667895",
        status: "New",
      },
      {
        id: "2",
        enquiry_id: "ENQ002",
        first_name: "Vijay",
        last_name: "raj",
        email: "example@gmail.com",
        phone_number: "1234667895",
        status: "New",
      },
      {
        id: "3",
        enquiry_id: "ENQ003",
        first_name: "AK",
        last_name: "raj",
        email: "example@gmail.com",
        phone_number: "1234667895",
        status: "New",
      },
      {
        id: "4",
        enquiry_id: "ENQ004",
        first_name: "Rajani",
        last_name: "raj",
        email: "example@gmail.com",
        phone_number: "1234667895",
        status: "New",
      },
    ],
  };
  useEffect(() => {
    setAPIenquirylist(enquirylistFromAPI);
  }, []);
  useEffect(() => {
    if (Object.keys(APIenquirylist).length > 0) {
      setenquirylist(APIenquirylist.enquirylist);
    }
  }, [APIenquirylist]);
  // Calculate total pages
  const totalpages = Math.ceil(enquirylist.length / rowsPerPageEnquirylist);

  const currentData = enquirylist.slice(
    (currentpageEnquirylist - 1) * rowsPerPageEnquirylist,
    currentpageEnquirylist * rowsPerPageEnquirylist
  );

  const handleNext = () => {
    if (currentpageEnquirylist < totalpages) {
      setcurrentpageEnquirylist((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (currentpageEnquirylist > 1) {
      setcurrentpageEnquirylist((prev) => prev - 1);
    }
  };
  //delete
  function deleteEnquiryList(ind) {
    const okDel = window.confirm("Are you sure you want to delete this task?");
    if (okDel) {
      setAPIenquirylist((prev) => ({
        ...prev,
        enquirylist: prev.enquirylist.filter((_, index) => index !== ind),
      }));
      toast.success("Task deleted!");
    }
  }

  const showEditNewProjest = (id) => {
    setEditNewEnquiryData(
      currentData.find((ele) => {
        return ele.id === id;
      })
    );
    setEditNewEnquiry(true);
  };
  return (
    <>
      {EditNewEnquiry && (
        <NewEnquiry
          EditNewEnquiry={EditNewEnquiry}
          EditNewEnquiryData={EditNewEnquiryData}
          setEditNewEnquiry={setEditNewEnquiry}
          setEditNewEnquiryData={setEditNewEnquiryData}
        />
      )}
      <div className="enquiryList-cointainer">
        <p className="enquiryList-title">Enquiry List</p>
        <div className="enquiryList-header">
          <p className="enquiryList-headleft">
            Easily view, manage, and track all customer enquiries in one
            organized place.
          </p>
          <div className="enquiryList-headright">
            <div className="enquiryList-search-cointainer">
              <input id="enquiryList-focus" placeholder="Search users" />
              <label htmlFor="enquiryList-focus">
                <svg
                  className="search-logo-enquiryList"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
              </label>
            </div>
            <Link to={"?tab=newEnquiry"}>
              <button className="create-enquirylist-btn">+ Create New</button>
            </Link>
          </div>
        </div>
        <div className="enquiryList-table-container">
          <table>
            <thead className="enquirylist-thead">
              <tr>
                <th id="id-enquirylist-width">Enquiry ID</th>
                <th id="coustomer-enquirylist-width">First Name</th>
                <th id="coustomer-enquirylist-width">Last Name</th>
                <th id="email-enquirylist-width">Email</th>
                <th id="phone-enquirylist-width">Phone Number</th>
                <th>Stauts</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="enquirylist-tbody">
              {currentData.length > 0 ? (
                currentData.map((ele, ind) => (
                  <tr key={ind}>
                    <td id="id-enquirylist-width">{ele.enquiry_id}</td>
                    <td id="coustomer-enquirylist-width">{ele.first_name}</td>
                    <td id="coustomer-enquirylist-width">{ele.last_name}</td>
                    <td id="email-enquirylist-width">{ele.email}</td>
                    <td id="phone-enquirylist-width">{ele.phone_number}</td>
                    <td>{ele.status}</td>
                    <td id="enquirylist-width-action">
                      <svg
                        className="dot-logo-enquirylist"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 128 512"
                      >
                        <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                      </svg>
                      <nav className="enquirylist-dot-container">
                        <div
                          onClick={() => {
                            showEditNewProjest(ele.id);
                          }}
                        >
                          Edit
                        </div>
                        <div
                          onClick={() => {
                            deleteEnquiryList(ind);
                          }}
                        >
                          Delete
                        </div>
                      </nav>
                    </td>
                  </tr>
                ))
              ) : (
                <p>No Data Found</p>
              )}
            </tbody>
          </table>
        </div>
        <nav className="enquirylist-table-bottem">
          <p className="enquirylist-num-entries">
            Showing {currentData.length} entries
          </p>
          <div className="enquirylist-control-box">
            <button
              className="enquirylist-btn"
              onClick={handlePrev}
              disabled={currentpageEnquirylist === 1}
            >
              Prev
            </button>
            <nav className="enquirylist-num-page">
              {" "}
              Page {currentpageEnquirylist} of {totalpages}{" "}
            </nav>
            <button
              className="enquirylist-btn"
              onClick={handleNext}
              disabled={currentpageEnquirylist === totalpages}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
