const express = require("express");
const router = express.Router();
const {createComment,getComments} = require("../controllers/Comment.controller.js");
const authMiddleware = require("../middleware/Auth.middleware.js");

router.route("/createComment").post(authMiddleware, createComment);
router.route("/Comments/:id").get(getComments);

module.exports = router;