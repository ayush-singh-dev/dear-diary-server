const express = require("express");
const router = express.Router();
const {register,login,logout,user} = require("../controllers/Auth.controller.js")
const authMiddleware = require("../middleware/Auth.middleware.js")

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(authMiddleware,logout)
router.route("/user").get(authMiddleware,user)


module.exports = router;