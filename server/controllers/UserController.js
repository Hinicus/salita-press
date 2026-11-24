const User = require("../models/User");
const bcrypt = require("bcrypt");
const { errorHandler, createAccessToken } = require("../auth");

//user registration
module.exports.registerUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send(false);
  } else if (req.body.password.length < 8) {
    return res.status(400).send(false);
  } else {
    let newUser = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      username: req.body.username,
    });

    return newUser
      .save()
      .then((result) =>
        res.status(201).send({
          message: "Registered Successfully",
        }),
      )
      .catch((error) => errorHandler(error, req, res));
  }
};

//user login
module.exports.loginUser = (req, res) => {
  //validation
  if (!req.body.email.includes("@") || !req.body.email.includes(".com")) {
    return res.status(400).send(false);
  }

  return User.findOne({ email: req.body.email })
    .then((result) => {
      if (result === null) {
        return res.status(404).send(false);
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password,
        );

        if (isPasswordCorrect) {
          return res.status(200).send({
            access: createAccessToken(result),
          });
        } else {
          return res.status(401).send(false);
        }
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//get user profile
module.exports.getProfile = (req, res) => {
  return User.findById(req.user.id)
    .select("-password")
    .then((user) => {
      return res.status(200).send({
        user,
      });
    })
    .catch((error) => errorHandler(error, req, res));
};
