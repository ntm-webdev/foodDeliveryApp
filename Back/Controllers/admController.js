const { validationResult } = require("express-validator");

const Restaurant = require("../models/restaurant");
const User = require("../models/user");
const { calculateFeedback } = require("../utils/helpers");

module.exports.postRestaurant = async (req, res) => {
  const errors = validationResult(req);
  let errorsArray = [{}, {}, {}, {}];

  if (!errors.isEmpty()) {
    const response_errors = errors.array();
    errorsArray = response_errors.map((err) => ({ msg: err.msg }));
    return res.status(422).json({ errors: errorsArray });
  }

  if (req.fileValidationError) {
    errorsArray[2] = { msg: "Invalid image." };
    errorsArray[3] = { msg: "Invalid image." };
    return res.status(422).json({ errors: errorsArray });
  }

  newRestaurant = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    image: req.files["image"][0].originalname,
    logo: req.files["logo"][0].originalname,
    rating: -1,
    menu: [],
    feedback: [],
  });

  try {
    await newRestaurant.save();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(201).json({ msg: "The restaurant was added." });
};

module.exports.postOrder = async (req, res) => {
  let user;
  try {
    user = await User.findById(req.body.userId);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  try {
    user.orders.push({
      items: req.body.order,
      totalprice: req.body.totalPrice,
      address: {
        zipcode: req.body.zipcode,
        address: req.body.address,
      },
    });
    await user.save();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(201).json({ msg: "The order was executted." });
};

module.exports.getOrders = async (req, res) => {
  let user;
  try {
    user = await User.findById(req.query.id);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(201).json({ fetchedData: user.orders });
};

module.exports.postFeedback = async (req, res) => {
  try {
    existingUser = await User.findById(req.body.userId);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  let existingRestaurant;
  try {
    existingRestaurant = await Restaurant.findById(req.body.restaurantId);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  try {
    if (req.method === "POST") {
      if (req.body.feedbackId && req.body.feedbackId !== "") {
        const selectedFeedback = existingRestaurant.feedback.find(
          (el) => el._id == req.body.feedbackId
        );
        selectedFeedback.comment = req.body.comment;
        selectedFeedback.rating = req.body.rating;
      } else {
        existingRestaurant.feedback.push({
          userid: req.body.userId,
          comment: req.body.comment,
          rating: req.body.rating,
        });
      }
      existingUser.feedback.push(existingRestaurant._id);
      await existingUser.save();
    } else {
      existingUser.feedback.pull(req.body.restaurantId);
      await existingUser.save();
      existingRestaurant.feedback.pull(req.body.feedbackId);
    }
    const rating = calculateFeedback(existingRestaurant);
    existingRestaurant.rating = rating;
    await existingRestaurant.save();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res
    .status(201)
    .json({ msg: "Your feedback was provided successfully" });
};

module.exports.getMenuItem = async (req, res) => {
  let restaurants;
  try {
    restaurants = await Restaurant.find({});
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(200).json({ restaurants });
};

module.exports.postMenuItem = async (req, res) => {
  const errors = validationResult(req);
  let errorsArray = [{}, {}, {}, {}, {}];

  if (!errors.isEmpty()) {
    const response_errors = errors.array();
    errorsArray = response_errors.map((err) => ({ msg: err.msg }));
    return res.status(422).json({ errors: errorsArray });
  }

  if (!req.file || req.fileValidationError) {
    errorsArray[4] = { msg: "Invalid image." };
    return res.status(422).json({ errors: errorsArray });
  }

  let existingRestaurant;
  try {
    existingRestaurant = await Restaurant.findOne({
      name: req.body.restaurant,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  existingRestaurant.menu.push({
    name: req.body.name,
    description: req.body.description,
    image: req.file.originalname,
    price: parseFloat(req.body.price),
    restaurant: req.body.restaurant,
  });

  try {
    await existingRestaurant.save();
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong, please try again." });
  }

  return res.status(201).json({ msg: "Menu item added" });
};
