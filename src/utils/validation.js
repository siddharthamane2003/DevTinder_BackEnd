let validator = require("validator");

let ValidatorFn = (req) => {
  let { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is Invalid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is Invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is Invalid");
  }
};

let validateEditDataProfile = (req, res) => {
  let AllowedUsersData = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "skills",
    "photoURL",
    "about",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    AllowedUsersData.includes(field),
  );

  return isEditAllowed;
};

module.exports = { ValidatorFn, validateEditDataProfile };
