import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/context";
import { toast } from "react-toastify";
import axios from "axios";
import "./AttendancePage.css";

const AttendancePage = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [status, setStatus] = useState("Present");

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

  // Fetch attendance for a specific employee
  const fetchAttendance = async (employeeId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/attendance/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendance(response.data.attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance.");
    }
  };

  // Mark attendance
  const markAttendance = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/admin/attendance`,
        {
          employeeId: selectedEmployee._id,
          date: new Date().toISOString().split("T")[0],
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Attendance marked successfully!");
      fetchAttendance(selectedEmployee._id); // Refresh attendance history
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="attendance-page-container">
      <h1 className="form-title">Attendance Management</h1>
      <div className="attendance-section">
        <label>Select Employee:</label>
        <select
          onChange={(e) => {
            const employee = employees.find(
              (emp) => emp._id === e.target.value
            );
            setSelectedEmployee(employee);
            fetchAttendance(employee._id);
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
        <div>
          <h3>
            Mark Attendance for:{" "}
            <span className="selected-title">{selectedEmployee.name}</span>
          </h3>
          <select
            onChange={(e) => setStatus(e.target.value)}
            value={status}
            className="select-container"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <button onClick={markAttendance} className="mark-attendance-button">
            Mark Attendance
          </button>
        </div>
      )}
      {attendance.length > 0 && (
        <div className="attendance-history">
          <h3>Attendance History</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index}>
                  <td>{record.name}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
