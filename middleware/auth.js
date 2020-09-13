const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {

  if (!config.get("requiresAuth")) return next();
  console.log(req.user);
  const token = req.header("x-auth-token");
  if (!token || token === "null") return res.status(401).send({ msg: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ msg: "Invalid token. Token was " + token });
  }
};