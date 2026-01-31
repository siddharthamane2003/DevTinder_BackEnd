const connectDB = require("./config/database");
const dotenv = require("dotenv").config(); // top of app.js
const express = require("express");
const app = express(); // craete server
const cors=require("cors")
let UserModel = require("../src/models/user.js");
let { ValidatorFn } = require("../src/utils/validation.js");
let bcrypt = require("bcrypt");
let cokkiesparser = require("cookie-parser");
let jwt = require("jsonwebtoken");
//let mongoose = require("mongoose");
const { Authicatemiddleware } = require("./middleware/auth");

// Request Handler -> it will hadle the request and send the responce

// app.use("/test", (req, res) => {
//   res.send("Hello From dkvjndkvjn");
// });

// app.use("/test", (req, res) => {
//   res.send("Hello From ");
// });

// app.use("/", (req, res) => {
//   res.send("Hello From dfgrgrsg ");
// });

// app.use("/hello", (req, res) => {
//   res.send("Hello From  From");
// });

// pass the Dynmaic Data and pass into Datbase

app.use(cors({
 origin:"http://localhost:5173",
  // origin:"*", // use For Testing
  credentials:true 
}))
app.use(express.json());
app.use(cokkiesparser());

// 1. In Postaman in body in raw i n json pass craete the data

// console.log(req); it will give the whole reqsut
// console.log(req.body) // error  undiefied
// buase the in postam these is json and we have to convert into object. for the resdablity.
// sol: express json -> json to object convert in app.use middleware
// it will work all rountes and also all http methods

// expres.json() it wil acess the json and convet into the object and with help of middleware it will works for all riutes
// these will pass into the body.
// we are creating the dumaic instaces of UserModdel.

// res.body->Instances
// UserModel -> Model
// app.use => Middl Ware
// express.json() -> These libary of express to convet json to object
// Dymianc Data
//   {
//   firstName: 'Kalpesh',
//   lastName: 'Patil',
//   emailId: 'kalpeshpatil2001@gmail.com',
//   password: 'Kalpesh@2003',
//   _id: new ObjectId('696c6850d313b6d87dd8679a')
// }

// bad way of get the res body const UserObj = new UserModel(req.body);
//console.log(UserObj);

// Get the ALL Users from the Databse using feed api.
// Means After sigup i have exlpre the pages that why all usres i exoplore

// 1st Intially we can get the users by emailId
// in Schema emailid as same as the compass.
// then using find() we are getting all user thaat match with emailId.
// trycath black. if useremail is wrong then it will retrun [] that we have to handle.

// Find Only One User
// FindOne()-> findOne() returns an arbitrary matching document unless a sort() is specified; index or no index, the order is not guaranteed.

// app.post("/login", async (req, res) => {
//   try {
//     It will takes the EmailId , password
//     const { emailId, password } = req.body;
//     // We have to find the user by emailId
//     const user = await UserModel.findOne({ emailId });
//     // if their is no user that not presnt from the EmailId
//     if (!user) return res.status(404).send("Email Not Found");
//     // Then compre with plaintext and encrypted password
//     const match = await bcrypt.compare(password, user.password);
//     // if not match throw error
//     if (!match) return res.status(401).send("Invalid Password");
//     // Send login Sucesflly
//     if (match) {
//       // careate the token
//       // in that pass the hide data when we are craetinmg the token

//       const token = jwt.sign(
//       { _id: user._id },
//       "DEVTINDER@23304",
//       { expiresIn: "1d" }
//     );

//       // WE HAVE TO PASS INTO THE COKKES
//       //let cokkies = res.cookie("cokkes", "ajcvdajhyvcdaucdagbckdabckuhbkcujak");

//       let cokkies = res.cookie("token", token, {
//                     httpOnly: true,
//                     sameSite: "lax"
//                   });

//       res.send(cokkies);
//      // res.send("Login Successful!");
//     }
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// app.get("/profile", (req, res) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).send("Token missing");
//     }

//     const decoded = jwt.verify(token, "DEVTINDER@23304");

//     res.json({
//       message: "Profile Accessed",
//       userId: decoded._id
//     });
//   } catch (err) {
//     res.status(401).send("Invalid Token");
//   }
// });

// app.get("/user", async (req, res) => {
//   let UserEmailId = req.body.emailId;
//   // let Users=await UserModel.find({emailId:UserEmailId});
//   let Users = await UserModel.findOne({ emailId: UserEmailId });
//   try {
//     if (Users.length === 0) {
//       // it will retrun the arry if usrer nit prestn then [] means leght =0
//       res.status(404).send("User Not Found");
//     } else {
//       res.send(Users);
//     }
//   } catch (error) {
//     res.status(404).send("Somethig went wrong..");
//   }
// });

//Get User By id
// app.get("/username/:id", async (req, res) => {
//   const { id } = req.params; // it give the url data (id)
//   const user = await UserModel.findById(id);
//   res.send(user);
// });

// //get By Name
// app.get("/firstName", async (req, res) => {
//   let firstname = req.body.firstName;
//   let UserByName = await UserModel.findOne({ firstName: firstname });
//   res.send(UserByName);
// });

// // With No filetrt {} we have to get the all users from Database

// app.get("/feed", async (req, res) => {
//   let AllUsers = await UserModel.find({});
//   try {
//     res.send(AllUsers);
//   } catch (error) {
//     res.send(404).send("Someting went Wrong!");
//   }
// });

// Delete User By Id
// app.delete("/user", async (req, res) => {
//   let UserID = req.body.UserID;
//   try {
//     // let user=await UserModel.findByIdAndDelete(UserID)
//     let user = await UserModel.findByIdAndDelete({ _id: UserID });

//     res.send("User Deleted Sucessfly");
//   } catch (error) {
//     res.send(404).send("Someting went Wrong!");
//   }
// });

// // Update User by Patch
// // In that findByIdAndUpdate == findByOneAndUpdate
// // findByIdAndUpdate ->take the id and update another will udate other paramtes
// // if we are pass the exta but not in scheam then it will automaiyly ignores.

// app.patch("/user/:userid", async (req, res) => {
//   // Dont Update the User Id we takes the user id only using params.
//   let userid = req.params?.userid; // takes the userId
//   let data = req.body; // passing Data

//   // let user=await UserModel.findByIdAndUpdate({_id:userid},data,{returnDocument:"after"})

//   // before = old Responce
//   // after = updated Responce

//   try {
//     let ALLOWED_USER = [
//       "firstName",
//       "password",
//       "age",
//       "skills",
//       "photo",
//       "about",
//       "lastName",
//     ];
//     let isAllowed = Object.keys(data).every((k) => {
//       return ALLOWED_USER.includes(k);
//     });

//     if (data.skills.length > 10) {
//       throw new Error("Cannot Update Skills more Than 10");
//     }

//     // it Object.keys takes the postman data and then loop throw it we are only allow user that in ALLOWED_USER only.
//     // else we give the erro must be retrun the user.

//     if (!isAllowed) {
//       throw new Error("Update Cannot Allowed!");
//     }

//     let user = await UserModel.findByIdAndUpdate({ _id: userid }, data, {
//       runValidators: true,
//     });

//     res.send("Updated Suceffluuy");
//     console.log(user);
//   } catch (error) {
//     res.status(404).send(error.message);
//   }
// });

// connectDB()
//   .then(() => {
//     console.log("Database Connection Established");
//     app.listen(2010, () => {
//       console.log("Sever is Sucesfully listing on port 2010");
//     }); //listent the resqiests
//   })
//   .catch((err) => {
//     console.log(err.message);
//     console.error("DataBase cannot be connetced");
//   });

const { authRouter } = require("../src/routes/auth.js");
const { profileRounter } = require("../src/routes/proflie.js");
const { connectionRounter } = require("../src/routes/connection.js");
const { UserRounter } = require("./routes/user.js");

app.use("/", authRouter);
app.use("/", profileRounter);
app.use("/", connectionRounter);
app.use("/",UserRounter)

connectDB();
 
app.listen(process.env.PORT, () => {
  console.log("Sever is Sucesfully listing on port 2010");
}); //listent the resqiests