const express = require("express");
const router = express.Router();
const {
  post,
  getPost,
  singlePost,
  updatePost,
  deletePost,
} = require("../controllers/Post.controller.js");
const upload = require("../middleware/Multer.middleware.js");
const authMiddleware = require("../middleware/Auth.middleware.js");

router.route("/post").post(upload.single("file"), authMiddleware, post);

router.route("/getPost").get(getPost);
router.route("/singlePost/:id").get(authMiddleware,singlePost);
router.put("/post/update/:id", authMiddleware, upload.single("file"), updatePost);
router.route("/deletePost/:id").delete(authMiddleware,deletePost);
module.exports = router;
