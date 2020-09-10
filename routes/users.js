const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", [auth], async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .select("-__v");
  res.send(user);
});

router.post("/", async (req, res) => {
  console.log("users::post");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  let userName = await User.findOne({ userName: req.body.userName});
  if (userName) return res.status(400).send("User already registered.");
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["email", "userName", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  console.log("new token", token);
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "userName", "email"]));
});

module.exports = router;