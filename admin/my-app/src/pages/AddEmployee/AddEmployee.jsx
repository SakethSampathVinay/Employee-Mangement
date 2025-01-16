import React, { useState, useContext } from "react";
import { AppContext } from "../../context/context";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddEmployee.css";

const EmployeeForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");

  const { backendUrl, token } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const employeeData = {
      name,
      email,
      password,
      contactNumber, // Matches the backend expectation
      department,
      salary: Number(salary), // Convert salary to number
    };

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/employees`,
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setName("");
        setEmail("");
        setPassword("");
        setContactNumber("");
        setDepartment("");
        setSalary("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding employee:", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Failed to add employee. Please try again."
      );
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={onSubmitHandler} className="form-content">
        <p className="form-title">Add Employee</p>
        <div className="form-fields">
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter Name"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                id="contactNumber"
                type="text"
                placeholder="Enter Contact Number"
                required
                onChange={(e) => setContactNumber(e.target.value)}
                value={contactNumber}
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                type="text"
                placeholder="Enter Department"
                required
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <input
                id="salary"
                type="number"
                placeholder="Enter Salary"
                required
                onChange={(e) => setSalary(e.target.value)}
                value={salary}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="submit-button">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
