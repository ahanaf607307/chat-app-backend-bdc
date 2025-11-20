const mongoose = require("mongoose");
require("dotenv").config();
const { User } = require("../models");

const usersData = [
  {
    "fullName" : "Employee",
  "email": "employee@gmail.com",
  "password": "1qazxcvb",
   "isEmailVerified" : true,
},
  {
    "fullName" : "Client Mubasshir",
  "email": "client@gmail.com",
  "password": "1qazxcvb",
  "isEmailVerified" : true,
},
{
  "fullName" : "Admin",
    "email": "admin@gmail.com",
    "password": "1qazxcvb",
     "isEmailVerified" : true,
}

]


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log("Database dropped successfully!");
  } catch (err) {
    console.error("Error dropping database:", err);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(usersData);
    console.log("Users seeded successfully!");
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

const seedDatabase = async () => {
  await connectDB();
  await dropDatabase();
  await seedUsers();
  console.log("Database seeding completed!");
  mongoose.disconnect();
};

seedDatabase();