const express = require("express");
const connectDB = require("../database");
const User = require("../users");
const validateuser = require("../utlity/utility");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
const bcrypt = require("bcrypt");
connectDB();
const jwt = require("jsonwebtoken");
app.use(cookieParser());
const userauth = require("../middleware/user_auth");
require('dotenv').config()
const authr = express.Router();
const reddisc = require("../config/reddis")
// Create user
authr.post("/",  async (req, res) => {
  try {
    // api level validation //
    validateuser(req.body);

    req.body.password = await bcrypt.hash(req.body.password, 10);

    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//login user
authr.post("/login",async (req, res) => {
  try {
    // code likina padge correct person  mang raha hai ya nahi//

    const { emailId, password } = req.body;
    // validate karo email ko //
    // Correct: must match DB field exactly
    console.log("Request emailId:", emailId);
    const user = await User.findOne({ emailId: emailId });

    if (!user) throw new Error("email is not valid");

    // checking email is valid or not//
    // (yeh check already ho gaya upar, fir bhi agar chhodna hai to correct likho)
    if (!(emailId == user.emailId)) throw new Error("email is not valid");

    // matchign the password//
   const Is = await user.verifypas(req.body.password);
    if (!Is) throw new Error("password is not valid");

    //jwt token
    const token = user.getJwt();
    res.cookie("token", token);

    res.send("seccufully login");
  } catch (err) {
    res.status(500).send("Can't login, internal error: " + err.message);
  }
});
// Read all users
authr.get("/info", userauth, async (req, res) => {
  try {
    res.send(req.users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Read single user
//reddis ke daatabase me hamko jo bhi mere bloack token honge //
//token 
// farji token//
authr.post("/logout",userauth, async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(400).send("No token provided");

    console.log("Logging out token:", token);
const payload = jwt.decode(token);
console.log(payload.exp)
await reddisc.client.set(`token:${token}`, 'blocked');
await reddisc.client.expireAt(`token:${token}`,payload.exp)
    // Block token in Redis for 30 minutes (1800 seconds)
    // await et(`token:${`, "blocked");
    // awaitexpire(`token:${}`, 1800);
    // Clear the cookie
    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });

    res.send("Logout successful ");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = authr;