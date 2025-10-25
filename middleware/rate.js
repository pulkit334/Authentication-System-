// module.exports = userauth;
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const jwt = require("jsonwebtoken");
const User = require("../users");
const reddisc = require("../config/reddis");
// authincated user hai ya nahi //
// const ratelimiter = require("express-rate-limit")
// app.set("trust proxy", true);
const windwosize = 3600;
const maxreq = 60;


const ratelimiter = async (req, res, next) => {
  try {
    // const ipad =
    const key =  `IP:${req.ip}`
    const currentime = Date.now()/1000;
const window_time = currentime -windwosize;
//8
await reddisc.client.zRemRangeByScore(key,0,window_time);
// kitni no of req bachi hai //

const count = await reddisc.client.zCard(key);
//total no of values kitni hai ander padhi hui 
if(count>=maxreq){
  throw new Error("No of req eceeded");
}
// if we acan inculde thwen add in it // qwe can use crypto library here
await reddisc.client.zAdd(key,[{score:currentime, value : `${currentime}:${Math.random()}`}])
// req is added

// key  ka ttl increase karna
await reddisc.client.expire(key,windwosize)
next()
  } catch (err) {
    res.send("erro while making the ip ");
  }
};
module.exports = ratelimiter;
