const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  orders: {
    type: Array,
    required: false
  },
  googleId: {
    type: String,
    required: false
  },
  facebookId: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  feedback: [
    {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
