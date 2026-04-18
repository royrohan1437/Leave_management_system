import dns from "node:dns";
import mongoose from "mongoose";

/**
 * Applies optional DNS servers before MongoDB SRV resolution runs.
 * This is useful on local machines where Node is pointed at a resolver that rejects SRV lookups.
 */
const configureDns = () => {
  const dnsServers = process.env.DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers?.length) {
    dns.setServers(dnsServers);
  }
};

/**
 * Connects the application to MongoDB using the configured connection string.
 * @returns {Promise<typeof mongoose>} The active mongoose connection instance.
 */
export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required to start the server.");
  }

  configureDns();

  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
};
