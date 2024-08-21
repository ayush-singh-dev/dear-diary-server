const Like = require("../models/Like.model");
const Post = require("../models/Post.model")
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    if (!id || !userId) {
      return res.status(400).json({ msg: "postid and userId are required" });
    }

    const existedLike = await Like.findOne({ post: id, likedBy: userId });
    if (existedLike) {
      return res.status(400).json({ msg: "already liked " });
    }
    const like = new Like({  post: id, likedBy: userId });
    await like.save();
    const post = await Post.findByIdAndUpdate(id, { $inc: { likesCount: 1 } }, { new: true });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(201).json({ message: "Liked successfully", like,post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    if (!id || !userId) {
      return res.status(400).json({ msg: "postid and userId are required" });
    }
    const like = await Like.findOneAndDelete({ post: id, likedBy: userId });
    if (!like) {
      return res.status(404).json({ msg: "Like not found" });
    }
    const post = await Post.findByIdAndUpdate(id, { $inc: { likesCount: -1 } }, { new: true });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(200).json({ msg: "Post unliked successfully",post });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
module.exports = { likePost, unlikePost };
