import React, { useContext, useEffect, useRef, useState } from "react";
import "./body.css";
import Attendance from "../../attendance/attendance";
import Project from "../../projectMenu/project/project";
import ManageUsers from "../../Masters/manage-users/manageUsers";
import DepartmentRole from "../../Masters/department-role/departmentRole";
import Task from "../../taskMenu/task/task";
import Onboard from "../../onboardMenu/onboard/onboard";
import Payslip from "../../payslip/payslip";
import ApplyLeave from "../../apply-leave/applyLeave";
import UserProfile from "../userProfile/userProfile";
import { logout } from "../../../redux/authSlice";
import { useDispatch } from "react-redux";
import ProjectBugsPage from "../../projectMenu/project-bugs-page/projectBugsPage";
import Dashboard from "../../dashboard/dashboard";
import NewEnquiry from "../../CRM/new-enquiry/newEnquiry";
import EnquiryList from "../../CRM/enquiry-list/enquiryList";
import Products from "../../Masters/products/products";
import CustomMaster from "../../Masters/custom-master/customMaster";
import QuotationCRM from "../../CRM/quotation-crm/quotationCRM";
import SalesCRM from "../../CRM/sales-crm/salesCRM";
import CreateNewSales from "../../CRM/create-new-sales/createNewSales";
import EditNewSales from "../../CRM/create-new-sales/editNewSales";
import DeliveryNoteCRM from "../../CRM/deliveryNote-crm/deliveryNoteCRM";
import CreateNewDelivery from "../../CRM/create-new-delivery/createNewDelivery";
import EditDelivery from "../../CRM/create-new-delivery/editDelivery";
import InvoiceCRM from "../../CRM/invoice-crm/invoiceCRM";
import CreateNewInvoice from "../../CRM/create-new-invoice/createNewInvoice";
import EditInvoice from "../../CRM/create-new-invoice/editInvoice";
import PurchaseOrder from "../../purchase/purchasr-order/purchaseOrder";
import CreateNewPurchase from "../../purchase/create-new-purchaseOrder/createNewPurchase";
import EditPurchase from "../../purchase/create-new-purchaseOrder/editPurchase";
import StockReceipt from "../../purchase/stock-receipt/stockReceipt";
import CreateNewStockReceipt from "../../purchase/create-new-stockReceipt/createNewStockReceipt";
import EditStockReceipt from "../../purchase/create-new-stockReceipt/editStockReceipt";
import StockReturn from "../../purchase/stock-return/stockReturn";
import CreateNewStockReturn from "../../purchase/create-new-stockReturn/createNewStockReturn";

export default function body({
  expanded,
  setexpanded,
  currentPage,
  setShowSidebar,
  user,
  setCurrentPage,
}) {
  //project page
  const [projectId, setProjectId] = useState(0);

  const [showUserDetails, setShowUserDetails] = useState(false);
  const profileRef = useRef(null);

  const dispatch = useDispatch();

  function handleSignOut() {
    dispatch(logout());
  }

  //project page
  function openProjectBugsPage(proId) {
    setCurrentPage("projectBugsPage");
    setProjectId(proId);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowUserDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`body-cointainer ${expanded ? "body-long" : ""}`}>
      <div className="header">
        <div className="header-left">
          <svg
            className={
              expanded ? "right-arrow right-arrow-rot" : "right-arrow "
            }
            onClick={() => setexpanded(!expanded)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
          </svg>

          {/* toggler */}

          <svg
            className="toggler"
            onClick={() => {
              setShowSidebar(true);
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
          </svg>

          <div className="search-cointainer">
            <label htmlFor="search">
              <svg
                className="search-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </label>
            <input
              className="search"
              placeholder="Search..."
              id="search"
            ></input>
          </div>
        </div>
        <div className="header-right">
          <svg
            className="bell-logo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
          </svg>

          <div
            ref={profileRef}
            className="profile-logo"
            onClick={() => setShowUserDetails((prev) => !prev)}
          >
            {user.profilePic === true ? (
              <img src={user.profilePic} alt="user Profile" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
              </svg>
            )}

            {user && showUserDetails && (
              <div className="logo-container">
                <p>{user.name}</p>
                <p>{user.email}</p>
                <h4 onClick={() => setCurrentPage("userProfile")}>Profile</h4>
                <h4 onClick={handleSignOut}>Sign out</h4>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sub-body">
        {currentPage == "dashboard" ? (
          <Dashboard />
        ) : currentPage == "manageUsers" ? (
          <ManageUsers />
        ) : currentPage == "departmentRole" ? (
          <DepartmentRole />
        ) : currentPage == "products" ? (
          <Products />
        ) : currentPage == "customMaster" ? (
          <CustomMaster />
        ) : currentPage == "newEnquiry" ? (
          <NewEnquiry />
        ) : currentPage == "enquiryList" ? (
          <EnquiryList />
        ) : currentPage == "quotationCRM" ? (
          <QuotationCRM />
        ) : currentPage == "salesCRM" ? (
          <SalesCRM setCurrentPage={setCurrentPage} />
        ) : currentPage == "createNewSales" ? (
          <CreateNewSales setCurrentPage={setCurrentPage} />
        ) : currentPage == "editNewSales" ? (
          <EditNewSales setCurrentPage={setCurrentPage} />
        ) : currentPage == "deliveryNoteCRM" ? (
          <DeliveryNoteCRM setCurrentPage={setCurrentPage} />
        ) : currentPage == "createNewDelivery" ? (
          <CreateNewDelivery />
        ) : currentPage == "editDelivery" ? (
          <EditDelivery />
        ) : currentPage == "invoiceCRM" ? (
          <InvoiceCRM setCurrentPage={setCurrentPage} />
        ) : currentPage == "createNewInvoice" ? (
          <CreateNewInvoice />
        ) : currentPage == "editInvoice" ? (
          <EditInvoice />
        ) : currentPage == "purchaseOrder" ? (
          <PurchaseOrder setCurrentPage={setCurrentPage} />
        ) : currentPage == "createNewPurchase" ? (
          <CreateNewPurchase />
        ) : currentPage == "editPurchase" ? (
          <EditPurchase />
        ) : currentPage == "stockReceipt" ? (
          <StockReceipt setCurrentPage={setCurrentPage} />
        ) : currentPage == "createNewStockReceipt" ? (
          <CreateNewStockReceipt setCurrentPage={setCurrentPage} />
        ) : currentPage == "editStockReceipt" ? (
          <EditStockReceipt setCurrentPage={setCurrentPage} />
        ) : currentPage == "stockReturn" ? (
          <StockReturn setCurrentPage={setCurrentPage} />
        ) : currentPage == "createNewStockReturn" ? (
          <CreateNewStockReturn />
        ) : currentPage == "task" ? (
          <Task />
        ) : currentPage == "attendance" ? (
          <Attendance />
        ) : currentPage == "onboarding" ? (
          <Onboard />
        ) : currentPage == "project" ? (
          <Project openProjectBugsPage={openProjectBugsPage} />
        ) : currentPage == "payslip" ? (
          <Payslip />
        ) : currentPage === "applyLeave" ? (
          <ApplyLeave />
        ) : currentPage === "projectBugsPage" ? (
          <ProjectBugsPage projectId={projectId} />
        ) : currentPage === "userProfile" ? (
          <UserProfile />
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}
