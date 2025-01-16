import express, { json } from "express";
import cors from "cors";
import connecToDB from "./config/database.js";
import admin from "./routes/adminRoute.js";

const port = 4000;

const app = express();

app.use(cors());
app.use(json());

connecToDB();

app.use("/api/admin", admin);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

app.get("/", (request, response) => {
  response.json({ message: "Hello, World!" });
});
