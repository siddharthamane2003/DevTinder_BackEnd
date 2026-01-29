const { Authicatemiddleware } = require("../middleware/auth");
const express = require("express");
const profileRounter = express.Router();
let { validateEditDataProfile } = require("../utils/validation");
let validtor = require("validator");
let bcrypt = require("bcrypt");

profileRounter.get("/profile/view", Authicatemiddleware, async (req, res) => {
  try {
    // // 1️⃣ Read
    // // token from cookie
    // const token = req.cookies.token;

    // if (!token) {
    //   return res.status(401).send("Token Missing");
    // }

    // // 2️⃣ Verify token
    // const decoded = jwt.verify(token, "DEVTINDER@23304");
    // const user = await UserModel.findById(decoded._id);

    let user = req.user;
    await user.save()


    
    res.send(user);


    // 3️⃣ Send response
    // res.status(200).json({
    //   message: "Profile Accessed",
    //   userId: decoded._id,
    //   user,
    // });
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
});

// profile view

profileRounter.patch("/profile/edit", Authicatemiddleware, async (req, res) => {
  try {
  
    let loggedUser = req.user;
  
    if (!validateEditDataProfile(req)) {
      throw new Error("Profile is Invalid");
    }

    Object.keys(req.body).forEach((key) => {
      loggedUser[key] = req.body[key];
    });
    await loggedUser.save();
    res.send(loggedUser);

  } catch (error) {
    
    res.status(400).send({message:"Server Error"});
  }
});

profileRounter.patch(
  "/profile/editpassword",
  Authicatemiddleware,
  async (req, res) => {
    try {
      let user = req.user;
      let { password } = req.body;
      console.log(password);
      if (!validtor.isStrongPassword(password)) {
        throw new Error("Password is not strong try any other password!!!");
      }
      let HashPassword = await bcrypt.hash(password, 10);

      user.password = HashPassword; 
      await user.save()

      res.send({ message: "succesfully changed password" });
      

    } catch (error) {
      res.status(400).send(error.message);
    }
  },
);

module.exports = { profileRounter };
