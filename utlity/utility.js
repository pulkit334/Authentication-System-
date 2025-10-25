const validator = require("validator");



// function  validateuser(data)
// {
// const mandatoryField = [
//       "firstName",
//       "lastName",
//       "age",
//       "gender",
//       "emailId",
//       "password"
//     ];
//     // not for larger /
//     // const isAllowed = Object.keys(req.body).every((key) =>
//     //   mandatoryField.includes(key)
//     // );
//     const isAllowed = mandatoryField.every((k) =>
//       Object.keys(data).includes(k)
//     );

//     if (!isAllowed) {
//      throw new Error("field is not present")
//     }

//   if (!validator.isEmail(data.emailId)) {
//     throw new Error("Invalid email address");
// }
//     if(!validator.isStrongPassword(data.password))
//       throw new Error("re check thew passswrd")

// if (!(data.firstName.length >= 3 && data.firstName.length <= 20)) {
//   throw new Error("Name should be at least 3 characters and at most 20 characters");
// }

// }
// module.exports = validateuser;const validator = require("validator");

function validateUser(data) {
  const mandatoryField = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "emailId",
    "password"
  ];

  // Check all mandatory fields exist
  const isAllowed = mandatoryField.every((k) =>
    Object.keys(data).includes(k)
  );

  if (!isAllowed) {
    throw new Error("Missing required fields");
  }

  // Email validation
  if (!validator.isEmail(data.emailId)) {
    throw new Error("Invalid email address");
  }

  // Password strength validation
  if (!validator.isStrongPassword(data.password)) {
    throw new Error("Password must be strong (min 8 chars, 1 uppercase, 1 number, 1 symbol)");
  }

  // First name length validation
  if (!(data.firstName.length >= 3 && data.firstName.length <= 20)) {
    throw new Error("First name should be at least 3 and at most 20 characters long");
  }

  return true; //  If everything passes
}
module.exports = validateUser;
