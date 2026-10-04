const mongoose = require('mongoose');

let isInMemoryMode = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[MongoDB]: No MONGODB_URI provided. Operating in dynamic memory-store mode.');
    isInMemoryMode = true;
    return null;
  }

  try {
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', false); // Disable command buffering so queries fail-fast to memory mode
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    isInMemoryMode = false;
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Connection Warning]: Could not connect to MongoDB. Operating in memory-store mode.`);
    isInMemoryMode = true;
    return null;
  }
};

const getMemoryStoreStatus = () => {
  return isInMemoryMode || mongoose.connection.readyState !== 1;
};

module.exports = { connectDB, getMemoryStoreStatus };
