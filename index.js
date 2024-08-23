require("dotenv").config();
const express = require("express");
const app = express();
const connectDb = require("./utils/db.js");
const authRoute = require("./routers/Auth.router.js");
const createPost = require("./routers/Post.router.js");
const allPost = require("./routers/Post.router.js");
const commentRoute = require("./routers/Comment.router.js")
const likeRoute = require("./routers/Like.router.js")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = 8001;

app.get("/home", (req, res) => {
  return res.send("server stated");
});

const corsOptions = {
  origin: "https://hideardiary.netlify.app",
  methods: "GET, PUT , POST , DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//routers
app.use("/api/auth", authRoute);
app.use("/api/create", createPost);
app.use("/api", allPost);
app.use("/api",commentRoute);
app.use("/api",likeRoute);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("server started at", PORT);
  });
});
