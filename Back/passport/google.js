const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user");

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CB_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      let user;
      try {
        user = await User.findOne({ googleId: profile.id });
      } catch (err) {
        return res
          .status(500)
          .json({ msg: "Something went wrong, please try again." });
      }

      if (!user) {
        const newUser = new User({
          username: profile._json.given_name,
          picture: profile._json.picture,
          orders: [],
          googleId: profile.id,
          feedback: [],
        });

        try {
          await newUser.save();
        } catch (err) {
          return res
            .status(500)
            .json({ msg: "Something went wrong, please try again." });
        }
        cb(null, newUser);
      } else {
        cb(null, user);
      }
    }
  )
);
