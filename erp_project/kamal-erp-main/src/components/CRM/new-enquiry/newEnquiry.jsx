import React, { useState, useEffect } from "react";
import AddItemNewEnquiry from "../add-item-newEnqiury/addItemNewEnquiry";
import "./newEnquiry.css";
import { toast } from "react-toastify";

export default function newEnquiry({
  EditNewEnquiry,
  EditNewEnquiryData,
  setEditNewEnquiry,
  setEditNewEnquiryData,
}) {
  const [showAddItem, setshowAddItem] = useState(false);
  const [editAddItem, seteditAddItem] = useState(false);
  const [editItem, seteditItem] = useState({});

  const [apienquiryData, setapiEnquiryData] = useState({});
  const [enquiryData, setenquiryData] = useState([]);
  const [enquiryGeandedTotal, setenquiryGeandedTotal] = useState([]);

  const enquiryFromAPI = {
    enquiryData: [
      {
        id: "1",
        item_code: "PRO001",
        product_description: "Wireless Mouse",
        cost_price: "300",
        salling_price: "500",
        quantity: "5",
        total_amount: "2500",
      },
      {
        id: "2",
        item_code: "PRO002",
        product_description: "Mouse",
        cost_price: "250",
        salling_price: "300",
        quantity: "5",
        total_amount: "2200",
      },
      {
        id: "3",
        item_code: "PRO003",
        product_description: "Wireless Mouse",
        cost_price: "300",
        salling_price: "500",
        quantity: "5",
        total_amount: "2500",
      },
    ],
    enquiryGeandedTotal: {
      geanded_total: "12000",
    },
  };
  useEffect(() => {
    setapiEnquiryData(enquiryFromAPI);
  }, []);
  useEffect(() => {
    if (Object.keys(apienquiryData).length > 0) {
      setenquiryData(apienquiryData.enquiryData);
      setenquiryGeandedTotal(apienquiryData.enquiryGeandedTotal);
    }
  }, [apienquiryData]);

  const [newEnquiry, setnewEnquiry] = useState({
    enquiry_id: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    email: "",
    street_address: "",
    apartment: "",
    city: "",
    state: "",
    postal: "",
    counrty: "",
    enquiry_type: "",
    enquiry_description: "",
    enquiry_channels: "",
    source: "",
    how_heard_this: "",
    urgency_level: "",
    enquiry_status: "",
    priority: "",
  });
  console.log(newEnquiry);

  const handleNewEnquiryChange = (e) => {
    setnewEnquiry((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  useEffect(() => {
    setnewEnquiry((prev) => {
      return { ...prev, ...EditNewEnquiryData };
    });
  }, [EditNewEnquiryData]);

  function handleNewEnquerySubmit(e) {
    e.preventDefault();
    setnewEnquiry({
      enquiry_id: "",
      phone_number: "",
      first_name: "",
      last_name: "",
      email: "",
      street_address: "",
      apartment: "",
      city: "",
      state: "",
      postal: "",
      counrty: "",
      enquiry_type: "",
      enquiry_description: "",
      enquiry_channels: "",
      source: "",
      how_heard_this: "",
      urgency_level: "",
      enquiry_status: "",
      priority: "",
    });
    setEditNewEnquiry(false);
  }

  //delete
  function deleteItem(ind) {
    const okDel = window.confirm("Are you sure you want to delete this task?");
    if (okDel) {
      setapiEnquiryData((prev) => ({
        ...prev,
        enquiryData: prev.enquiryData.filter((_, index) => index !== ind),
      }));
      toast.success("Task deleted!");
    }
  }

  const showEditItem = (id) => {
    seteditItem(
      enquiryData.find((ele) => {
        return ele.id === id;
      })
    );
    seteditAddItem(true);
  };

  return (
    <>
      {showAddItem && (
        <div className="additem-newEnquiry-btn">
          <AddItemNewEnquiry
            setshowAddItem={setshowAddItem}
            editAddItem={editAddItem}
            editItem={editItem}
            seteditItem={seteditItem}
          />
        </div>
      )}
      {editAddItem && (
        <div className="additem-newEnquiry-btn">
          <AddItemNewEnquiry
            setshowAddItem={seteditAddItem}
            editAddItem={editAddItem}
            editItem={editItem}
            seteditItem={seteditItem}
          />
        </div>
      )}
      <div
        className={`newEnquiry-container ${
          (showAddItem || editAddItem) && "blur-newEnquiry"
        }`}
      >
        <form onSubmit={handleNewEnquerySubmit} className="newEnquiry-form">
          <p className="newEnquiry-title">
            {EditNewEnquiry ? "Edit" : "Create New"} Enquiry
          </p>
          <div className="newEnquiry-form-container">
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="enquiry_id">
                  Enquiry Id {"(Auto Generate)"}
                </label>
                <input
                  id="enquiry_id"
                  type="text"
                  placeholder="Auto Generate"
                  value={newEnquiry.enquiry_id}
                  onChange={handleNewEnquiryChange}
                  disabled
                />
              </div>

              <div className="newEnquiry-box">
                <label htmlFor="phone_number">
                  Phone Number<sup>*</sup>
                </label>
                <input
                  id="phone_number"
                  className="increment-decrement-newEnquiry"
                  type="number"
                  placeholder="Enter Phone Number"
                  value={newEnquiry.phone_number}
                  onChange={handleNewEnquiryChange}
                  required
                />
              </div>
            </div>
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="first_name">
                  Customer First Name<sup>*</sup>
                </label>
                <input
                  id="first_name"
                  type="text"
                  placeholder="First Name"
                  value={newEnquiry.first_name}
                  onChange={handleNewEnquiryChange}
                  required
                />
              </div>
              <div className="newEnquiry-box">
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  value={newEnquiry.last_name}
                  onChange={handleNewEnquiryChange}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="email">
                  Email<sup>*</sup>
                </label>
                <input
                  className="newEnquiry-input-width-adj"
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={newEnquiry.email}
                  onChange={handleNewEnquiryChange}
                  required
                />
              </div>
            </div>
          </div>
          <p className="newEnquiry-title newEnquiryPadding">
            Location Information
          </p>
          <div className="newEnquiry-form-container">
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="street_address">
                  Street Address<sup>*</sup>
                </label>
                <input
                  id="street_address"
                  type="text"
                  placeholder="Enter Street Address"
                  value={newEnquiry.street_address}
                  onChange={handleNewEnquiryChange}
                  required
                />
              </div>

              <div className="newEnquiry-box">
                <label htmlFor="apartment">Apartment / Suite / Unit</label>
                <input
                  id="apartment"
                  type="text"
                  value={newEnquiry.apartment}
                  onChange={handleNewEnquiryChange}
                  placeholder="Eg Flat 4B,Building A."
                />
              </div>
            </div>
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="city">
                  City<sup>*</sup>
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Enter City Name"
                  value={newEnquiry.city}
                  onChange={handleNewEnquiryChange}
                  required
                />
              </div>
              <div className="newEnquiry-box">
                <label htmlFor="state">
                  State / Province / Region<sup>*</sup>
                </label>
                <input
                  id="state"
                  type="text"
                  placeholder="Enter State Name"
                  value={newEnquiry.state}
                  onChange={handleNewEnquiryChange}
                  required
                />
              </div>
            </div>
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="postal">
                  Postal / ZIP Code<sup>*</sup>
                </label>
                <input
                  id="postal"
                  className="increment-decrement-newEnquiry"
                  type="number"
                  placeholder="Enter POstal / ZIP Code"
                  value={newEnquiry.postal}
                  onChange={handleNewEnquiryChange}
                  required
                />
              </div>
              <div className="newEnquiry-box">
                <label htmlFor="counrty">
                  Country<sup>*</sup>
                </label>
                <input
                  id="counrty"
                  type="text"
                  placeholder="Enter Country"
                  value={newEnquiry.counrty}
                  onChange={handleNewEnquiryChange}
                  required
                />
              </div>
            </div>
          </div>
          <p className="newEnquiry-title newEnquiryPadding">Enquiry Detailes</p>
          <div className="newEnquiry-form-container">
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="enquiry_type">
                  Enquiry Type<sup>*</sup>
                </label>
                <select
                  id="enquiry_type"
                  value={newEnquiry.enquiry_type}
                  onChange={handleNewEnquiryChange}
                  required
                >
                  <option value="" selected>
                    Select Enquiry Type
                  </option>
                  <option value="Product">Product</option>
                  <option value="Service">Service</option>
                </select>
              </div>

              <div className="newEnquiry-box">
                <label htmlFor="enquiry_description">Enquiry Description</label>
                <input
                  id="enquiry_description"
                  type="text"
                  value={newEnquiry.enquiry_description}
                  onChange={handleNewEnquiryChange}
                  placeholder="Enter Description"
                />
              </div>
            </div>
          </div>
          <p className="newEnquiry-title newEnquiryPadding">
            Source of Enquiry
          </p>
          <div className="newEnquiry-form-container">
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="enquiry_channels">Enquiry Channels</label>
                <select
                  id="enquiry_channels"
                  value={newEnquiry.enquiry_channels}
                  onChange={handleNewEnquiryChange}
                >
                  <option value="" selected>
                    Select Enquiry Channel
                  </option>
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="Web Form">Web Form</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
              <div className="newEnquiry-box">
                <label htmlFor="source">
                  Source<sup>*</sup>
                </label>
                <select
                  id="source"
                  value={newEnquiry.source}
                  onChange={handleNewEnquiryChange}
                  required
                >
                  <option value="" selected>
                    Select Source
                  </option>
                  <option value="WebSite">WebSite</option>
                  <option value="Referral">Referral</option>
                  <option value="Online Advertising">Online Advertising</option>
                  <option value="Offline Advertising">
                    Offline Advertising
                  </option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
            </div>
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="how_heard_this">
                  How Did You Heard About This?
                </label>
                <select
                  className="newEnquiry-input-width-adj"
                  id="how_heard_this"
                  value={newEnquiry.how_heard_this}
                  onChange={handleNewEnquiryChange}
                >
                  <option value="" selected>
                    Pick an Option
                  </option>
                  <option value="WebSite">WebSite</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Event">Event</option>
                  <option value="Search Engine">Search Engine</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <p className="newEnquiry-title newEnquiryPadding">
            Timeline & Follow-Up
          </p>
          <div className="newEnquiry-form-container">
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="urgency_level">Urgency / Timeline</label>
                <select
                  id="urgency_level"
                  value={newEnquiry.urgency_level}
                  onChange={handleNewEnquiryChange}
                >
                  <option value="" selected>
                    Select Urgency Level
                  </option>
                  <option value="Immediately">Immediately</option>
                  <option value="Within 1-3 Months">Within 1-3 Months</option>
                  <option value="Within 6 Months">Within 6 Months</option>
                  <option value="Just Researching">Just Researching</option>
                </select>
              </div>
              <div className="newEnquiry-box">
                <label htmlFor="enquiry_status">
                  Enquery Status<sup>*</sup>
                </label>
                <select
                  id="enquiry_status"
                  value={newEnquiry.enquiry_status}
                  onChange={handleNewEnquiryChange}
                  required
                >
                  <option value="" selected>
                    Choose Enquery Status
                  </option>
                  <option value="New">New</option>
                  <option value="In Process">In Process</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="newEnquiry-colom-box">
              <div className="newEnquiry-box">
                <label htmlFor="priority">Priority</label>
                <select
                  className="newEnquiry-input-width-adj"
                  id="priority"
                  value={newEnquiry.priority}
                  onChange={handleNewEnquiryChange}
                >
                  <option value="" selected>
                    Select Priority
                  </option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
          <nav className="newEnquiry-title newEnquiryPadding product-list-items">
            <p>
              Product List Items<sup>*</sup>
            </p>
            <nav
              className="newEnquiry-additem"
              onClick={() => setshowAddItem(true)}
            >
              + Add Item
            </nav>
          </nav>
          <div className="product-table-container">
            <table>
              <thead className="newEnquiry-head">
                <tr>
                  <td>S.No</td>
                  <td>Item Code</td>
                  <td>Product Description</td>
                  <td>Cost Price</td>
                  <td>Selling Price</td>
                  <td>Quantity</td>
                  <td>Total</td>
                  <td>Actoin</td>
                </tr>
              </thead>
              <tbody className="newEnquiry-body">
                {enquiryData.length > 0 ? (
                  enquiryData.map((ele, ind) => (
                    <tr key={ind}>
                      <td>{ind + 1}</td>
                      <td>{ele.item_code}</td>
                      <td>{ele.product_description}</td>
                      <td>
                        <div className="newEnquiry-tbodycontent-center">
                          <svg
                            className="rupees-newEnquiry-logo"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                          >
                            <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                          </svg>
                          <p>{ele.cost_price}</p>
                        </div>
                      </td>
                      <td>
                        <div className="newEnquiry-tbodycontent-center">
                          <svg
                            className="rupees-newEnquiry-logo"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                          >
                            <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                          </svg>
                          <p>{ele.salling_price}</p>
                        </div>
                      </td>
                      <td>{ele.quantity}</td>
                      <td>
                        <div className="newEnquiry-tbodycontent-center">
                          <svg
                            className="rupees-newEnquiry-logo"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                          >
                            <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                          </svg>
                          <p>{ele.total_amount}</p>
                        </div>
                      </td>
                      <td className="newEnquiry-action-cointainer">
                        <svg
                          onClick={() => {
                            showEditItem(ele.id);
                          }}
                          className="edit-newEnquiry-logo"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                        </svg>
                        <svg
                          onClick={() => {
                            deleteItem(ind);
                          }}
                          className="delete-newEnquiry-logo"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                        </svg>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p>No Data Found</p>
                )}

                <tr id="last-colom-newEnquiry">
                  <td></td>
                  <td></td>
                  <td>Granded Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <div className="newEnquiry-tbodycontent-center">
                      <svg
                        className="rupees-newEnquiry-logo"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                      >
                        <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                      </svg>
                      <p>
                        {enquiryData.length > 0 ? (
                          enquiryGeandedTotal.geanded_total
                        ) : (
                          <p>0</p>
                        )}
                      </p>
                    </div>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="newEnquiry-submut-container">
            <input className="newEnquiry-reset" type="reset" />

            <button className="newEnquiry-submit" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
