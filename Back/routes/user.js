const route = require("express").Router();

const userController = require("../Controllers/userController");

route.get("/restaurant", userController.getRestaurant);
route.get("/restaurants", userController.getRestaurants);

module.exports = route;
