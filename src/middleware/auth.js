let UserModel = require("../models/user.js");
let jwt = require("jsonwebtoken");

let Authicatemiddleware = async (req, res, next) => {
  try {
    let { token } = req.cookies;

    if (!token) {
      // throw new Error("Token Invalid!!!!!!!");
    return res.status(401).send("Please Login!!!!!")
    }

    let encodedObj = await jwt.verify(token, process.env.JWT_PASS);

    let { _id } = encodedObj;

    let user = await UserModel.findById(_id);

    if (!user) {
      throw new Error("User Not Found!!!!!!!!!");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { Authicatemiddleware };
