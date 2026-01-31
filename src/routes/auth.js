const express = require("express");
let bcrypt = require("bcrypt");
let UserModel = require("../models/user.js");
let { ValidatorFn } = require("../utils/validation.js");
let authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Vlaidate The req
    ValidatorFn(req);

    // Extrating the body
    let { firstName, lastName, password, emailId, age, gender, photoURL } = req.body;

    // install the bcrypt pack eof the incrept the password
    let HashPassword = await bcrypt.hash(password, 10);

    //console.log(HashPassword);
    const UserObj = new UserModel({
      firstName,
      lastName,
      password: HashPassword,
      emailId,
      age,
      gender,
      photoURL
    });

    let savedUser = await UserObj.save(); // UserObject will save to Databse
    let token = await savedUser.getJWT();

    // 4️⃣ Store JWT in cookie (STRING only)
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

    res.json({ message: "User Added Sucsflluy!", data: savedUser });

  } catch (error) {
    res.status(400).send({ Error: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // 1️⃣ Find user
    const user = await UserModel.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Email Not Found");
    }

    // 2️⃣ Compare password
    // const isMatch = await bcrypt.compare(password, user.password);

    let isMatch = await user.validatePassword(password);

    if (!isMatch) {
      return res.status(401).send("Invalid Password");
    }

    // 3️⃣ Create JWT
    // const token = jwt.sign({ _id: user._id }, "DEVTINDER@23304" , {expiresIn:"1d"});

    let token = await user.getJWT();

    // 4️⃣ Store JWT in cookie (STRING only)
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

    // 5️⃣ Send response (DO NOT send res.cookie return)
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// logout
authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout Sucssfully!!!!!!!");
});

// Hard Coded
// 2nd way
// const UserObj = new UserModel({
//   firstName: "Akshay",
//   lastName: "Saini",
//   emailId: "akshay@gmail.com",
//   password: "askay@2003",
// });

// // craeting the new instance from the UserModle
// let user=new UserModel(UserObj); one way
// try {
//   await UserObj.save(); // UserObject will save to Databse
//   res.send("User Added Sucsflluy!");
// } catch (error) {
//   res.status(400).send("User Not Created DatBase");
// }

module.exports = { authRouter }