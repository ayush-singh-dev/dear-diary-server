const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");

const createComment = async (req, res) => {
  try {
    const { content, user, post } = req.body;
    const userData = req.user;
    if (!content || !user || !post) {
      return res
        .status(400)
        .json({ msg: "Content, postId, and ownerId are required." });
    }
    const postFound = await Post.findById(post);
    if (!postFound) {
      return res.status(400).json({ msg: "Post not found." });
    }
    const userId = userData._id;
    if (!userId) {
      return res.status(400).json({ msg: "user not found." });
    }

    const newComment = await Comment.create({
      content,
      user: userId,
      post: postFound._id,
    });
    return res.status(201).json({ msg: newComment });
  } catch (error) {
    console.error("Server error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ post: id })
      .populate("user", ["userName"])
      .sort({ createdAt: -1 });
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};

module.exports = { createComment, getComments };
