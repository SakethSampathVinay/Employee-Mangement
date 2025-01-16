import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/context";
import { toast } from "react-toastify";
import axios from "axios";
import "./EmployeeList.css";

const EmployeeManagement = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle Add or Update Employee
  const handleSubmit = async (event) => {
    event.preventDefault();
    const employeeData = {
      name,
      email,
      contactNumber,
      department,
      salary: Number(salary),
    };

    try {
      if (editingEmployee) {
        await axios.put(
          `${backendUrl}/api/admin/employees/${editingEmployee._id}`,
          employeeData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Employee updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/admin/employees`, employeeData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Employee added successfully!");
      }
      resetForm();
      fetchEmployees(); // Refresh employee list
    } catch (error) {
      console.error("Error adding/updating employee:", error);
      toast.error("Failed to save employee.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await axios.delete(`${backendUrl}/api/admin/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Employee deleted successfully!");
      fetchEmployees(); // Refresh employee list
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee.");
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setContactNumber("");
    setDepartment("");
    setSalary("");
    setEditingEmployee(null);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setName(employee.name);
    setEmail(employee.email);
    setContactNumber(employee.contactNumber);
    setDepartment(employee.department);
    setSalary(employee.salary);
  };

  return (
    <div className="employee-management-container">
      <div className="employee-form-container">
        <form onSubmit={handleSubmit}>
          <h3>{editingEmployee ? "Edit Employee" : "Add Employee"}</h3>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!editingEmployee && (
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label>Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Salary</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div>
          <button type="submit">
            {editingEmployee ? "Update Employee" : "Add Employee"}
          </button>
          {editingEmployee && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </div>
      <div className="employee-list-container">
        <h2>Employee List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.role}</td>
                <td>${employee.salary}</td>
                <td>
                  <button onClick={() => handleEdit(employee)}>Edit</button>
                  <button onClick={() => handleDelete(employee._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManagement;
