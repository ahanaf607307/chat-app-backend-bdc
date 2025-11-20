const { User } = require("../models");

const bcryptjs = require("bcryptjs");
const seedAdmin = async () => {
  try {
    const isSupperAdminExist = await User.findOne({
      email: "admin@gmail.com",
    });
    if (isSupperAdminExist) {
      console.log(" Admin Already Exist");
      return;
    }
    console.log("Trying to create  admin");
    const hashedPassword = await bcryptjs.hash(
     "1qazxcvb",
      10
    );

    console.log(hashedPassword)

    const payload = {
      fullName: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      isEmailVerified : true,
    };
    const Admin = await User.create(payload);
    console.log("Admin Created Successfully \n");
    console.log(Admin);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
 seedAdmin
};
