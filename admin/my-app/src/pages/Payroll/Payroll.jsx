import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/context";
import { toast } from "react-toastify";
import axios from "axios";
import "./Payroll.css";

const PayrollPage = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payroll, setPayroll] = useState([]);
  const [month, setMonth] = useState("");
  const [salary, setSalary] = useState("");

  // Fetch employees
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

  // Fetch payroll for the selected employee
  const fetchPayroll = async (employeeId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/payroll/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPayroll(response.data.payroll);
    } catch (error) {
      console.error("Error fetching payroll:", error);
      toast.error("Failed to fetch payroll.");
    }
  };

  // Generate payroll
  const generatePayroll = async () => {
    if (!month || !salary || salary <= 0) {
      toast.error("Please enter valid month and salary.");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/admin/payroll`,
        {
          employeeId: selectedEmployee._id,
          month,
          salary,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Payroll generated successfully!");
      setMonth("");
      setSalary("");
      fetchPayroll(selectedEmployee._id); // Refresh payroll history
    } catch (error) {
      console.error("Error generating payroll:", error);
      toast.error("Failed to generate payroll.");
    }
  };

  // Mark payroll as paid
  const markAsPaid = async (month) => {
    try {
      await axios.post(
        `${backendUrl}/api/admin/payroll/mark-paid`,
        {
          employeeId: selectedEmployee._id,
          month,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Payroll marked as paid!");
      fetchPayroll(selectedEmployee._id); // Refresh payroll history
    } catch (error) {
      console.error("Error marking payroll as paid:", error);
      toast.error("Failed to mark payroll as paid.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="payroll-page">
      <h2>Payroll Management</h2>
      <div className="employee-selection">
        <label>Select Employee:</label>
        <select
          onChange={(e) => {
            const employee = employees.find(
              (emp) => emp._id === e.target.value
            );
            setSelectedEmployee(employee);
            if (employee) fetchPayroll(employee._id);
          }}
        >
          <option value="">-- Select --</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      {selectedEmployee && (
        <div className="generate-payroll">
          <h3>Generate Payroll for {selectedEmployee.name}</h3>
          <input
            type="text"
            placeholder="Month (e.g., January 2025)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <input
            type="number"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <button onClick={generatePayroll}>Generate Payroll</button>
        </div>
      )}
      {payroll.length > 0 && (
        <div className="payroll-history">
          <h3>Payroll History</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((record, index) => (
                <tr key={index}>
                  <td>{record.month}</td>
                  <td>${record.salary}</td>
                  <td>{record.status}</td>
                  <td>
                    {record.status === "Unpaid" && (
                      <button onClick={() => markAsPaid(record.month)}>
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;
