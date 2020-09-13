const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const Position = require('../models/position');
const express = require("express");
const router = express.Router();

router.get('/me', [auth], async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .select('-__v');
  res.send(user);
});

router.get('/my/:id', async (req, res) => {
  Position.find({ 'author.id': req.params.id }, async (err, foundPosition) => {
    if (err || !foundPosition) {
      res.status(404).json({ msg: 'Position is not found' });
    } else {
      res.send(foundPosition);
    }
  });
});

// REGISTRATION
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ msg: 'Failed! Email is already in use!' });

  let username = await User.findOne({ username: req.body.username });
  if (username) return res.status(400).send({ msg: 'Failed! Username is already in use!' });

  user = new User(_.pick(req.body, ['email', 'username', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  console.log("new token", token);
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'username', 'email']));
});

module.exports = router;