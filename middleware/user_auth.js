// const jwt = require('jsonwebtoken')
// const User = require("../indexx");
// const { model, modelNames } = require('mongoose');

// const userauth = async (req,res,next)=>{

// try {
// // thohda accha version//
// const {token } = req.cookies;
// if(!token){
//   throw new Error("token donesn't exist")
// };
// // phele validation toh karo sahi user ha ya na//hi

// const paylod = jwt.verify(token,"p")

// const {_id} = paylod;

// if(!_id)  throw new Error("id is missing");

// console.log(paylod);
//     const users = await User.findById(_id);
//     req.users = users;
//     if(!users){
//         throw new Error("usree is not find")
//     }
//     console.log("user")
// next();
// }

// catch(err)
// {
//     res.send("not succefull")
// }

// }

// module.exports = userauth;
const jwt = require("jsonwebtoken");
const User = require("../users");
const { model, modelNames } = require("mongoose");
const reddisc = require("../config/reddis")
// authincated user hai ya nahi //



const userauth = async (req, res, next) => {
  try {
    // thohda accha version//
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token doesn't exist");
    }
    // phele validation toh karo sahi user ha ya na//hi

    const payload = jwt.verify(token, "p");

    const { _id } = payload;
    if (!_id) throw new Error("id is missing");
    console.log(payload);
    const users = await User.findById(_id);
    req.users = users;
    if (!users) {
      throw new Error("user is not find");
    }
    // token bloacked list me toh nahi hai kya//
// kya meri key isme exitst toh nahi karti/
const tokenKey = `token:${token}`;
const value = await reddisc.client.get(tokenKey);

if(value) throw new Error("user is bloacked")


    console.log("user");
    next();
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};
module.exports = userauth;
