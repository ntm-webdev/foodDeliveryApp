const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const User = require("../models/user");

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CB_URL,
      profileFields: ["id", "displayName", "photos"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      let user;
      try {
        user = await User.findOne({ facebookId: profile.id });
      } catch (err) {
        return res
          .status(500)
          .json({ msg: "Something went wrong, please try again." });
      }

      if (!user) {
        const newUser = new User({
          username: profile.displayName,
          picture: profile._json.picture.data.url,
          orders: [],
          facebookId: profile.id,
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
