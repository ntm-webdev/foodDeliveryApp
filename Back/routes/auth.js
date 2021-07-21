const route = require("express").Router();
const passport = require("passport");
const { body } = require("express-validator");

const authController = require("../Controllers/authController");
const {
  multer,
  storage,
  fileFilter,
  limits,
} = require("../middlewares/fileUpload");

route.get("/facebook", passport.authenticate("facebook"));
route.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  authController.redirectHome
);

route.get("/google", passport.authenticate("google", { scope: ["profile"] }));
route.get(
  "/google/callback",
  passport.authenticate("google"),
  authController.redirectHome
);

route.post("/login", multer({ storage }).fields([]), (req, res) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Something went wrong, please try again later." });
    }
    if (!user) {
      return res
        .status(500)
        .json({ msg: "Invalid Credentials, please try again later." });
    }
    req.login(user, function (err) {
      if (err) {
        return res
          .status(500)
          .json({ msg: "Something went wrong, please try again later." });
      } else {
        res.end();
      }
    });
  })(req, res);
});

route.post(
  "/signup",
  multer({ storage, fileFilter, limits }).single("image"),
  [
    body("username").not().isEmpty().withMessage("Required"),
    body("email").not().isEmpty().withMessage("Required"),
    body("password").not().isEmpty().withMessage("Required"),
  ],
  authController.signup
);

route.get("/get-credential", authController.getCredential);

route.get("/logout", authController.logout);

module.exports = route;
