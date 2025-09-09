import { createContext, useState } from "react";
import UserDashboard from "./pages/userDashboard/userDashboard";
import Signin from "./pages/signin/signin";
import Signup from "./pages/signUp/signup";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BugDetailPage from "./components/projectMenu/bug-detail-page/bugDetailPage";
import AddNewCandidate from "./components/onboardMenu/add-new-candidate/addNewCandidate";
import CreateNewSales from "./components/CRM/create-new-sales/createNewSales";
import EditNewSales from "./components/CRM/create-new-sales/editNewSales";
import CreateNewDelivery from "./components/CRM/create-new-delivery/createNewDelivery";
import EditDelivery from "./components//CRM/create-new-delivery/editDelivery";
import CreateNewInvoice from "./components/CRM/create-new-invoice/createNewInvoice";
import EditInvoice from "./components/CRM/create-new-invoice/editInvoice";
import CreateNewPurchase from "./components/purchase/create-new-purchaseOrder/createNewPurchase";
import EditPurchase from "./components/purchase/create-new-purchaseOrder/editPurchase";
import CreateNewStockReceipt from "./components/purchase/create-new-stockReceipt/createNewStockReceipt";
import EditStockReceipt from "./components/purchase/create-new-stockReceipt/editStockReceipt";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/" element={<UserDashboard />} />
        <Route path="/bug-detalis/:errorId" element={<BugDetailPage />} />
        <Route path="/add-new-candidate" element={<AddNewCandidate />} />
        <Route
          path="/edit-candidate/:candidateId"
          element={<AddNewCandidate />}
        />
        <Route path="/new-sales" element={<CreateNewSales />} />
        <Route path="/edit-sales" element={<EditNewSales />} />
        <Route path="/new-delivery-note" element={<CreateNewDelivery />} />
        <Route path="/eddit-delivery" element={<EditDelivery />} />
        <Route path="/new-invoice" element={<CreateNewInvoice />} />
        <Route path="/edit-invoice" element={<EditInvoice />} />
        <Route path="/new-purchase" element={<CreateNewPurchase />} />
        <Route path="/edit-purchase" element={<EditPurchase />} />
        <Route path="/new-stock-receipt" element={<CreateNewStockReceipt />} />
        <Route path="/edit-stock-receipt" element={<EditStockReceipt />} />
      </Routes>
    </BrowserRouter>
  );
}
