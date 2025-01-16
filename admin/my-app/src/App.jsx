import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import EmployeeForm from "./pages/AddEmployee/AddEmployee";
import EmployeeList from "./pages/EmployeeList/EmployeeList";
import AttendancePage from "./pages/AttendanePage/AttendancePage";
import PayrollPage from "./pages/Payroll/Payroll";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { AppContext } from "./context/context";
import "./App.css";
import ReportComponent from "./pages/Reports/Reports";

function App() {
  const { token } = useContext(AppContext);
  const location = useLocation();

  // Check if the current route is `/login`
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app-container">
      <ToastContainer />
      {!isLoginPage && token && <Navbar />}{" "}
      {/* Show Navbar only if not on login */}
      {!isLoginPage && token && <Sidebar />}{" "}
      {/* Show Sidebar only if not on login */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/employee-form" element={<EmployeeForm />} />
        <Route path="/employees-list" element={<EmployeeList />} />
        <Route path="/employees-attendance" element={<AttendancePage />} />
        <Route path="/employees-payroll" element={<PayrollPage />} />
        <Route path = "/employees/reports" element = {<ReportComponent />} />
      </Routes>
    </div>
  );
}

export default App;
