const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports.redirectHome = (req, res) => {
  req.session.save(() => {
    res.redirect(process.env.FRONTEND_APP_URL);
  })
};

module.exports.getCredential = (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send(null);
  }
};

module.exports.logout = async (req, res) => {
  await req.logout();
  req.user = null;
  req.session.destroy(() => {
    res.clearCookie("connect.sid", { path: "/", httpOnly: true });
    res.end();
  });
};

module.exports.signup = async (req, res) => {
  const errors = validationResult(req);
  let errorsArray = [{}, {}, {}, {}];

  if (!errors.isEmpty()) {
    const response_errors = errors.array();
    errorsArray = response_errors.map((err) => ({ msg: err.msg }));
    return res.status(422).json({ errors: errorsArray });
  }

  if (!req.file || req.fileValidationError) {
    errorsArray[3] = { msg: "Invalid image." };
    return res.status(422).json({ errors: errorsArray });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: req.body.email });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }

  if (existingUser) {
    return res.status(500).json({
      msg: "This email is already in use, please use a different one.",
    });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 12);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    picture: req.file.originalname,
    orders: [],
    feedback: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again later." });
  }

  req.login(newUser, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Something went wrong, please try again later." });
    } else {
      res.end();
    }
  });
};
