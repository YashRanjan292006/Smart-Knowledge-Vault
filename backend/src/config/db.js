const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error (Local Bypass Active): ${error.message}`);
    global.dbOffline = true; // Use offline fallback for beautiful presentation
  }
};

module.exports = connectDB;
