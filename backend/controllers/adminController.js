import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import Employee from "../models/EmployeeModel.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const loginAdmin = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      console.log(token);
      return response.json({
        success: true,
        message: "Logged Successfully",
        token,
      });
    } else {
      return response.json({
        success: false,
        message: "Not Logged Successfully",
      });
    }
  } catch (error) {
    return response.json({
      success: false,
      message: "Not Logged Error",
      error,
    });
  }
};

const getAllEmployees = async (request, respones) => {
  try {
    const employees = await Employee.find(); // Fetch all employees
    respones.status(200).json({ success: true, employees });
  } catch (error) {
    respones
      .status(500)
      .json({ success: false, message: "Error fetching employees" });
  }
};

const addEmployee = async (req, res) => {
  const { name, email, password, role, contactNumber, department, salary } =
    req.body;

  try {
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ success: false, message: "Employee already exists." });
    }

    const newEmployee = new Employee({
      name,
      email,
      password, // In production, hash the password before saving.
      role,
      contactNumber,
      department,
      salary,
    });

    await newEmployee.save();
    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: newEmployee,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding employee", error });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Employee updated",
      employee: updatedEmployee,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating employee" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Employee deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting employee" });
  }
};

const markAttendance = async (req, res) => {
  const { employeeId, date, status } = req.body;

  console.log("Request body:", req.body); // Log incoming data

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      console.error("Employee not found for ID:", employeeId); // Log missing employee
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    employee.attendance.push({ date, status });
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      attendance: employee.attendance,
    });
  } catch (error) {
    console.error("Error in markAttendance:", error.message, error.stack); // Log error details
    res.status(500).json({
      success: false,
      message: "Error marking attendance",
      error: error.message,
    });
  }
};

const generatePayroll = async (req, res) => {
  const { employeeId, month, salary } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Check if payroll already exists for the given month
    const existingPayroll = employee.payroll.find(
      (record) => record.month === month
    );

    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        message: "Payroll for this month already exists.",
      });
    }

    // Add new payroll entry
    employee.payroll.push({ month, salary, status: "Unpaid" });
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Payroll generated successfully",
      payroll: employee.payroll,
    });
  } catch (error) {
    console.error("Error generating payroll:", error);
    res.status(500).json({
      success: false,
      message: "Error generating payroll",
      error,
    });
  }
};

const getAttendance = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findById(employeeId).select(
      "name attendance"
    );
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const attendanceWithName = employee.attendance.map((record) => ({
      name: employee.name,
      date: record.date,
      status: record.status,
    }));

    res.status(200).json({
      success: true,
      attendance: attendanceWithName,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch attendance" });
  }
};

const getPayroll = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findById(employeeId).select("payroll");
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      payroll: employee.payroll,
    });
  } catch (error) {
    console.error("Error fetching payroll:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payroll",
      error,
    });
  }
};

const markPayrollAsPaid = async (req, res) => {
  const { employeeId, month } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const payrollRecord = employee.payroll.find(
      (record) => record.month === month
    );

    if (!payrollRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Payroll record not found" });
    }

    payrollRecord.status = "Paid";
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Payroll marked as paid",
      payroll: employee.payroll,
    });
  } catch (error) {
    console.error("Error marking payroll as paid:", error);
    res.status(500).json({
      success: false,
      message: "Error marking payroll as paid",
      error,
    });
  }
};


const reportAllInOnePdf = async (req, res) => {
  try {
    const employees = await Employee.find({}, "-password");

    const doc = new jsPDF();

    // Employee Details Section
    doc.setFontSize(16);
    doc.text("Employee Report", 10, 10);

    const employeeTableData = employees.map((employee) => [
      employee.name,
      employee.email,
      employee.department,
      employee.salary,
    ]);

    doc.autoTable({
      head: [["Name", "Email", "Department", "Salary"]],
      body: employeeTableData,
      startY: 20,
    });

    // Attendance Section
    let yPosition = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(16);
    doc.text("Attendance Report", 10, yPosition);

    const attendanceTableData = [];
    employees.forEach((employee) => {
      employee.attendance.forEach((record) => {
        attendanceTableData.push([
          employee.name,
          new Date(record.date).toLocaleDateString(),
          record.status,
        ]);
      });
    });

    doc.autoTable({
      head: [["Name", "Date", "Status"]],
      body: attendanceTableData,
      startY: yPosition + 10,
    });

    // Payroll Section
    yPosition = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(16);
    doc.text("Payroll Report", 10, yPosition);

    const payrollTableData = [];
    employees.forEach((employee) => {
      employee.payroll.forEach((record) => {
        payrollTableData.push([
          employee.name,
          record.month,
          record.salary,
          record.status,
        ]);
      });
    });

    doc.autoTable({
      head: [["Name", "Month", "Salary", "Status"]],
      body: payrollTableData,
      startY: yPosition + 10,
    });

    // Send the PDF as a response
    const pdfBuffer = doc.output("arraybuffer");
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating combined report", error });
  }
};

export {
  loginAdmin,
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  markAttendance,
  generatePayroll,
  getAttendance,
  getPayroll,
  markPayrollAsPaid,
  reportAllInOnePdf,
};
