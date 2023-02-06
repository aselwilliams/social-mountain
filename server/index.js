require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PORT } = process.env;
const { sequelize } = require("./util/database");
const { User } = require("./models/user");
const { Post } = require("./models/post");

const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts");
const { register, login } = require("./controllers/auth");
const { isAuthenticated } = require("./middleware/isAuthenticated");

const app = express();

app.use(express.json());
app.use(cors());

User.hasMany(Post);
Post.belongsTo(User);
//Auth
app.post("/register", register);
app.post("/login", login);

//GET posts - no Auth
app.get("/posts", getAllPosts);

//CRUD posts - Auth required
app.get("/userposts/:userId", getCurrentUserPosts);
app.post("/posts", isAuthenticated, addPost);
app.put("/posts/:id", isAuthenticated, editPost);
app.delete("/posts/:id", isAuthenticated, deletePost);

//the force: true is for development --it DROPS tables!!!
sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Database sync successful. Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
