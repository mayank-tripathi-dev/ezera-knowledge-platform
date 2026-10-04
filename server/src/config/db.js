const mongoose = require('mongoose');

let isInMemoryMode = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ezera_knowledge_db';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    isInMemoryMode = false;
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Connection Warning]: Could not connect to MongoDB at ${uri}. Operating in dynamic memory-store mode.`);
    isInMemoryMode = true;
    return null;
  }
};

const getMemoryStoreStatus = () => isInMemoryMode;

module.exports = { connectDB, getMemoryStoreStatus };
