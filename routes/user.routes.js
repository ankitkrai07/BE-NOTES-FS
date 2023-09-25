const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { username, email, pass } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      const user = new UserModel({ username, email, pass: hash });
      await user.save();
      res.status(200).json({ msg: "A new user has been registered" });
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  const user = await UserModel.findOne({ email });
  try {
    bcrypt.compare(pass, user.pass, async (err, result) => {
      if (result) {
        const token = jwt.sign(
          { userID: user._id, username: user.username },
          "masai"
        );
        res.status(200).json({ msg: "Login Successfull!", token });
      } else {
        res.status(200).json({ msg: "Wrong Credentials" });
      }
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = {
  userRouter,
};
