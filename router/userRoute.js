const express = require("express");
const route = express.Router();
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

route.post("/signup", authController.signup);
route.post("/login", authController.login);
route.post("/forgotPassword", authController.forgotPassword);
route.patch("/resetPassword/:token", authController.resetPassword);

route.use(authController.protect);

route.get("/me", userController.getMe, userController.getUser);
route.patch("/updatePassword", authController.updatePassword);
route.patch("/updateMe", userController.updateMe);
route.delete("/deleteMe", userController.deleteMe);

route.use(authController.restrictTo('admin'))

route
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createNewUser);
route
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = route;
