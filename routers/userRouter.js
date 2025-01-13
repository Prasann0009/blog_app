const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controllers/userController");
const isAuth = require("../middlewares/isAuthMiddleware");

const userRouter = express.Router();

authRouter
  .post("/register", registerController)
  .post("/login", loginController)
  .post("/logout", isAuth, logoutController);

module.exports = userRouter;
