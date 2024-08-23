const Post = require("../models/Post.model");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const mongoose = require("mongoose");
const Like = require("../models/Like.model.js")
const post = async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const userData = req.user;
    const fileLocalPath = req.file?.path;
    if (!fileLocalPath) {
      return res.status(400).json({ msg: "file is required" });
    }
    const file = await uploadOnCloudinary(fileLocalPath);
    if (!file) {
      return res.status(400).json({ msg: "file is required" });
    }
    const postDocs = await Post.create({
      title,
      content,
      file: file.url,
      author: userData._id,
      likesCount: 0
    });
    ("postDATA:::::", postDocs);

    return res.status(200).json(postDocs);
  } catch (error) {
    ("post_error::", error);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.find()
      .populate("author", ["userName"])
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPost:", error);
    return res.status(400).json({ msg: "error in getPost" });
  }
};

const singlePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid post ID" });
    }
    const postDocs = await Post.findById(id).populate("author", "userName");
    
    if (!postDocs) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const isLiked = userId ? await Like.exists({ post: id, likedBy: userId }) : false;
    const response = {
      ...postDocs.toObject(),
      isLiked,
    };
    return res.status(200).json(response);

  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    // const userData = req.user;

    let fileUrl;

    if (req.file) {
      const fileLocalPath = req.file.path;
      ("fileLocalPath::::", fileLocalPath);
      const file = await uploadOnCloudinary(fileLocalPath);
      ("cloudinary_file:::", file);
      if (!file) {
        return res.status(400).json({ msg: "File upload failed" });
      }
      fileUrl = file.secure_url;
    }

    const updateData = {
      title,
      content,
    };
    if (fileUrl) {
      updateData.file = fileUrl;
    }
    const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ msg: "Post not found" });
    }
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("update_post_error::", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    const userId =  req.user._id 
    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }
    if(Post.author.toString() !== userId){
      return res.status(403).json({ msg: 'You are not authorized to delete this post' }); //check
    }
    res.status(200).json({ msg: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { post, getPost, singlePost, updatePost, deletePost };
