const express = require("express");
const router = express.Router();
const {likePost,unlikePost} = require("../controllers/like.controller")
const authMiddleware = require("../middleware/Auth.middleware")


router.route("/likePost/:id").put(authMiddleware,likePost);
router.route("/unlikePost/:id").put(authMiddleware,unlikePost);
module.exports = router;