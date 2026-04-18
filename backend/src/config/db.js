import mongoose from "mongoose";

/**
 * Connects the application to MongoDB using the configured connection string.
 * @returns {Promise<typeof mongoose>} The active mongoose connection instance.
 */
export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required to start the server.");
  }

  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
};
