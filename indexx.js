const express = require("express");
const connectDB = require("./database");
const User = require("./users");
const validateuser = require("./utlity/utility");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
require("dotenv").config();
const authr = require("./Routes/auth");
const aut = require("./Routes/user");
app.use(express.json());
const reddisc = require("./config/reddis")
const rate = require("./middleware/rate")
// 


//midleware 
app.use(rate)
app.use("/user/auth", authr);
app.use("/users", aut);

const initialize_con = async () => {
  try {

await Promise.all([reddisc(),connectDB()])
    // Start server
    
    app.listen(process.env.PORT, () => {
      console.log(` Server listening at port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Error while initializing connections:", err.message);
    process.exit(1); // optional: exit app if startup fails
  }
};

initialize_con();
