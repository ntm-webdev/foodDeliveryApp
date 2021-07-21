const route = require("express").Router();
const { body } = require("express-validator");

const {
  multer,
  storage,
  fileFilter,
  limits,
} = require("../middlewares/fileUpload");
const admController = require("../Controllers/admController");

route.get("/orders", admController.getOrders);
route.post("/order", multer({ storage }).fields([]), admController.postOrder);
route.get("/add-menu-item", admController.getMenuItem);
route.delete("/feedback", admController.postFeedback);
route.post(
  "/feedback",
  multer({ storage }).fields([]),
  admController.postFeedback
);
route.post(
  "/menu",
  multer({ storage, fileFilter, limits }).single("image"),
  [
    body("name").not().isEmpty().withMessage("Required"),
    body("description").not().isEmpty().withMessage("Required"),
    body("price").not().isEmpty().withMessage("Required"),
    body("restaurant").not().isEmpty().withMessage("Required"),
  ],
  admController.postMenuItem
);
route.post(
  "/restaurant",
  multer({ storage, fileFilter, limits }).fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "logo",
      maxCount: 1,
    },
  ]),
  [
    body("name").not().isEmpty().withMessage("Required"),
    body("category").not().isEmpty().withMessage("Required"),
  ],
  admController.postRestaurant
);

module.exports = route;
