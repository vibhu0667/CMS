const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/doctor", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 20000,   
      socketTimeoutMS: 45000,    
    });
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); 
  }
};

module.exports = { connectDB };