const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { verify } = require("../auth");

//register
router.post("/register", userController.registerUser);
//login
router.post("/login", userController.loginUser);
//get user profile
router.get("/details", verify, userController.getProfile);

module.exports = router;
