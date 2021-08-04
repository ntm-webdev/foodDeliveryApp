require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoDBStore = require("connect-mongodb-session")(session);

require('./passport/local');
require('./passport/google');
require('./passport/facebook');

const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: 'sessions'
});

const app = express();
app.use(cors({ credentials: true, origin: process.env.FRONTEND_APP_URL }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week duration
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/images", express.static(path.join(__dirname, "/images")));
app.use("/api", require("./routes/user"));
app.use("/api/adm", require("./routes/adm"));
app.use("/api/auth", require("./routes/auth"));

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
