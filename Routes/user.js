const express = require("express");
const connectDB = require("../database");
const User = require("../users");
const validateuser = require("../utlity/utility");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
connectDB();
const jwt = require("jsonwebtoken");
app.use(cookieParser());
const userauth = require("../middleware/user_auth");-
require('dotenv').config()
const authuser = express.Router();

authuser.get("/info", userauth, async (req, res) => {
  try {
    const user = await User.findOne(req.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send(user);
  } catch (err  ) {
    res.status(500).send({ error: err.message });
  }
});

// Update user (better use PATCH here)
authuser.patch("/:id", userauth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete user
authuser.delete("/:id", userauth, async (req, res) => {
  try {
    // authenticate if user had token or not

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});






module.exports = authuser;