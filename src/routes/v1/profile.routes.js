const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const {userController} = require("../../controllers");


const router = express.Router();

router.route("/all").get(auth("common"), userController.getUsers);  

module.exports = router;
