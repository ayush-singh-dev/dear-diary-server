const User = require("../models/User.model.js");

//register

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ msg: "fill your entity properly" });
    }
    const emailExisted = await User.findOne({ email });
    if (emailExisted) {
      return res.status(400).json({ msg: "email already existed" });
    }
    const userCreated = await User.create({
      userName,
      email,
      password,
    });
    return res.status(200).json({
      msg: "registration sucessfull",
      user: userCreated,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    return res.status(500).send({ msg: "server Error" });
  }
};

// login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "fill your entity properly" });
    }
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return res.status(401).json({ msg: "email not found" });
    }
    const isPasswordCorrect = await existedUser.isPasswordCorrect(password);
    if (isPasswordCorrect) {
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };
      return res
        .status(200)
        .cookie("token", existedUser.generateToken(), options)
        .json({
          msg: "login sucessfull",
          token: existedUser.generateToken(),
          userId: existedUser._id.toString(),
        });
    } else {
      return res.status(401).send({ msg: "invalid credentials" });
    }
  } catch (error) {
    return res.status(500).send({ msg: "server Error" });
  }
};

// logout

const logout = (req, res) => {
  return res.cookie("token", "").json({ msg: "logout user succesfully" });
};

// to send user data

const user = async (req, res) => {
  try {
    const userData = req.user;
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    };
    res.cookie("userData", userData, options);

    // Send user data in JSON response
    return res.status(200).json({msg:"succes to grtting user data ", userData });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  user,
};
