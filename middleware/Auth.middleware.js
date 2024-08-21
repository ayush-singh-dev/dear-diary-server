const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ msg: "Unauthorized http, token not provided " });
    }
    const isVerified = jwt.verify(token, process.env.JWT_SECRETKEY);
    const userData = await User.findOne({ email: isVerified.email }).select({
      password: 0,
    });
    req.token = token;
    req.user = userData;
    req.userID = userData._id;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = authMiddleware;
