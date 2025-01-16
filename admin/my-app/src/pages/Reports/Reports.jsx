import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/context";
import "./Reports.css"; // Import the CSS file

const ReportComponent = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!token) {
      alert("You are not authorized. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/reports/all-pdf`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employee-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("Report downloaded successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <h2>Generate Reports</h2>
      <p>Click the button below to download the Employees Report.</p>
      <button
        onClick={generateReport}
        className="report-button"
        disabled={loading}
      >
        {loading ? "Generating..." : "Download Report"}
      </button>
    </div>
  );
};

export default ReportComponent;
