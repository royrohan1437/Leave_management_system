import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { GENDERS, ROLES } from "./constants.js";

dotenv.config();

export const predefinedUsers = [
  {
    name: "Penthara Admin",
    email: "admin@penthara.ai",
    password: "Admin@123",
    role: ROLES.ADMIN,
    gender: null
  },
  {
    name: "Rohan",
    email: "rohan@penthara.ai",
    password: "Rohan@123",
    role: ROLES.EMPLOYEE,
    gender: GENDERS.MALE
  },
  {
    name: "Poulami",
    email: "poulami@penthara.ai",
    password: "Poulami@123",
    role: ROLES.EMPLOYEE,
    gender: GENDERS.FEMALE
  }
];

/**
 * Creates or updates the predefined demo users required by the system.
 * @returns {Promise<void>}
 */
export const seedUsers = async () => {
  await Promise.all(
    predefinedUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 12);

      await User.findOneAndUpdate(
        { email: user.email },
        {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          gender: user.gender
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    })
  );

  console.log("Predefined users are ready.");
};

if (process.argv[1]?.endsWith("seedUsers.js")) {
  connectDB()
    .then(seedUsers)
    .then(() => mongoose.connection.close())
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
