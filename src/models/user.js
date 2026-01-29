// Valdation -> Validate the Schema

// require firname , emailid , unique email id
// add the photo , skils , decripation fileds  skills in []
// desciption add defLU VALUE OF ABOUT
// also deafault url in photo
// convert email id in lowercaes
// trime() -> spces as then in emailId
// minlength =4 of firsname  =>it willl min 4 max greter than or equal's to
// maxlength =10 in string   => Upto 10 equl to 10
// min: 9 , max - 10 in number as age  max -> upto 10 and min => greter than 9
// costom validation fn
// if the not gender is male , female , other then thrie error.
// we have to enble the validtion fn in patch api  , post api
// we have to know about the date timsspance in patch api
// api validaton only defied user are allowed
// the validtor extetion that cheoing for the email id , phot url , password vlaidtor

let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let mongoose = require("mongoose");
let validator = require("validator")
// let UserShcema = new mongoose.Schema({
//   firstName: {
//     type: String,

//   },
//   lastName: {
//     type: String,
//   },
//   emailId: {
//     type: String,
//   },
//   password: {
//     type: String,
//   },
//   age: {
//     type: Number,
//   },
//   gender: {
//     type: String,
//   },
// });

// Validations
// Requieres means that madortly reqiresy
// unque the files is not be unique.

let UserShcema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // Madirtloy requre the firaname and emailId
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      // unique: true,
      index:true,
      lowercase: true,
      trim: true,
      validate(vale) {
        if (!validator.isEmail(vale)) {
          throw new Error("Email is not Validate");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 4,
      unique: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("In Valid Password");
        }
      },
    },
    age: {
      type: Number,
      max: 30,
    },
    gender: {
      // In the validatetion it will run in get , fecth but not the patch we have to call the fn in runvalidators.
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender Is Not Valid");
        }
      },
    },
    // add the photo , skills , about
    // photo: {
    //   type: String,
    //   default: "https://i.postimg.cc/abcd1234/photo.jpg",
    // },
     
    photoURL: {
      type: String,
      default: "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1740779693~exp=1740783293~hmac=3ffc11733917c931bddeec957e8fa649e6a1590282b3210d816ccbf54dab2e94&w=900",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL :" + value);
        }
      },
    },
    skills: {
      type: [String],
      value: ["java", "JavaScript", "React"],
    },
    // the about is defalut value DEFALUT VALUE.
    about: {
      type: String,
      default: "These Is Your Profile",
    },
  },
  { timestamps: true },
);

UserShcema.methods.getJWT = async function () {
  let User = this; // refer the currnet user and do not use Arrow fn these will not contaion
  const token = jwt.sign({ _id: User._id }, "DEVTINDER@23304", {
    expiresIn: "1d",
  });
  return token;
};

UserShcema.methods.validatePassword = async function (inputbyuser) {
  let User = this;
  let HashPassword = User.password;

  const isPassword = await bcrypt.compare(inputbyuser, HashPassword);

  return isPassword;
};

let UserModel = mongoose.model("User", UserShcema);
module.exports = UserModel;

//module.exports=mongoose.model("User",UserShcema)

// Schema : Defination of Collection
// Model : It will create the Instances.
