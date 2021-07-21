const Restaurant = require("../models/restaurant");

module.exports.getRestaurants = async (req, res) => {
  let restaurants;
  try {
    if (Object.keys(req.query).length !== 0) {
      restaurants = await Restaurant.find({ category: req.query.category });
    } else {
      restaurants = await Restaurant.find({});
    }
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(200).json({ restaurants });
};

module.exports.getRestaurant = async (req, res) => {
  let restaurant;
  try {
    restaurant = await Restaurant.findById(req.query.id).populate({
      path: "feedback",
      populate: {
        path: "userid",
        model: "User",
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(200).json({ restaurant });
};
