import express from "express";
import authAdmin from "../middleaware/adminAuth.js";
import {
  getAllEmployees,
  loginAdmin,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  generatePayroll,
  markAttendance,
  getAttendance,
  getPayroll,
  markPayrollAsPaid,
  reportAllInOnePdf,
} from "../controllers/adminController.js";

const admin = express.Router();

admin.post("/login", loginAdmin);
admin.get("/employees", authAdmin, getAllEmployees);
admin.post("/employees", authAdmin, addEmployee);
admin.put("/employees/:id", authAdmin, updateEmployee);
admin.delete("/employees/:id", authAdmin, deleteEmployee);
admin.post("/attendance", authAdmin, markAttendance);
admin.get("/attendance/:employeeId", authAdmin, getAttendance);
admin.post("/payroll", authAdmin, generatePayroll);
admin.get("/payroll/:employeeId", authAdmin, getPayroll);
admin.post("/payroll/mark-paid", authAdmin, markPayrollAsPaid);
admin.get("/reports/all-pdf", reportAllInOnePdf);

export default admin;
