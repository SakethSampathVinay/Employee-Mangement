import mongoose from "mongoose";

const EmployeeModelSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String, default: "employee" },
  contactNumber: { type: String },
  department: { type: String },
  salary: { type: Number },
  attendance: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ["Present", "Absent"] },
    },
  ],
  payroll: [
    {
      month: { type: String, required: true },
      salary: { type: Number, required: true },
      status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    },
  ],
});

const Employee = mongoose.model("Employee", EmployeeModelSchema);
export default Employee;
