const mongoose = require("mongoose");
require("dotenv").config();
const { User } = require("../models");

const password = "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO"; //password: 1qazxsw2

const usersData = [
  {
    fullName: "Testing Admin",
    userName: "admin",
    email: "admin@gmail.com",

    password,
    role: "admin",
    isEmailVerified: true,
  },


  // New users
  {
    fullName: "user1 Matrix",
    userName: "user1",
    email: "user1@gmail.com",
    password,
    role: "user",
    isEmailVerified: true,
  },
  {
    fullName: "user2 Knight",
    userName: "user2",
    email: "user2@gmail.com",
    password,
    role: "user",
    isEmailVerified: true,
  },
  {
    fullName: "user3 Yeager",
    userName: "user3",
    email: "user3@gmail.com",
    password,
    role: "user",
    isEmailVerified: true,
  },
  {
    fullName: "user3 Nova",
    userName: "user3",
    email: "user3@gmail.com",
    password,
    role: "user",
    isEmailVerified: false,
  },
 
];

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
