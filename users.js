const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLenght: 10,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      min: 20,
      max: 30,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      // validate(value){
      //   if(!["male","Female"].includes(value))
      //     throw  new Error

      // }
    },
    emailId: { type: String, required: true, unique: true },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJwt = function () {
  const ans = jwt.sign(
    { _id: this._id, emailId: this.emailId, password: this.password },
    process.env.key,
    { expiresIn: "1hr" },{token : null}
  );

  return ans;
};

userSchema.methods.verifypas = async function (upassword) {
  return await bcrypt.compare(upassword, this.password);
};
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
