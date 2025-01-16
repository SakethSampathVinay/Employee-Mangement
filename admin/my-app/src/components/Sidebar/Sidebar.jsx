import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../context/context.jsx";
import "./Sidebar.css";

const Sidebar = () => {
  const { token } = useContext(AppContext);

  return (
    <div className="sidebar-container">
      {token && (
        <ul className="sidebar-list">
          <NavLink
            to={"/employee-form"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active-item" : ""}`
            }
          >
            <p>Add Employee Form</p>
          </NavLink>
          <NavLink
            to={"/employees-list"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active-item" : ""}`
            }
          >
            <p>Employees List</p>
          </NavLink>
          <NavLink
            to={"/employees-attendance"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active-item" : ""}`
            }
          >
            <p>Employees Attendance</p>
          </NavLink>
          <NavLink
            to={"/employees-payroll"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active-item" : ""}`
            }
          >
            <p>Employees Payroll</p>
          </NavLink>
          <NavLink
            to={"/employees/reports"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active-item" : ""}`
            }
          >
            <p>Employees Report</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
