const route = require("express").Router();

const userController = require("../Controllers/userController");

route.get("/restaurants", userController.getRestaurants);
route.get("/restaurant", userController.getRestaurant);

module.exports = route;
