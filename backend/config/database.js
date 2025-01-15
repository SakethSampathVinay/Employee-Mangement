import mongoose from "mongoose";

const connecToDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://sakethsampath2006:FD3a1B6YL7T1MR51@cluster0.gadcp.mongodb.net/"
    );
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connecToDB;
