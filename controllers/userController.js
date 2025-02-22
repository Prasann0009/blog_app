const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { userDataValidation } = require("../utils/authUtils");

const registerController = async (req, res) => {
  console.log(req.body);

  const { name, email, username, password } = req.body;

  //data validations
  try {
    await userDataValidation({ email, username, password });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Data invalid",
      error: error,
    });
  }

  const userModelObj = new User({ name, email, username, password });

  try {
    const userDb = await userModelObj.registerUser();

    return res.send({
      status: 201,
      message: "User registered Successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }

  return res.send("register controller is working");
};

const loginController = async (req, res) => {
  console.log(req.body);

  const { loginId, password } = req.body;

  try {
    const userDb = await User.findUserWithKey({ key: loginId });

    //password compare
    const isMatched = await bcrypt.compare(password, userDb.password);

    if (!isMatched) {
      return res.send({
        status: 400,
        message: "Incorrect Password",
      });
    }

    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };
    return res.send({
      status: 200,
      message: "Login Successfully",
      data: userDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal Server error",
      error: error,
    });
  }
};

const logoutController = async (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.send({
        status: 400,
        message: "Logout Unsuccessfull",
      });
    else
      return res.send({
        status: 200,
        message: "Logout Successfull",
      });
  });
};
module.exports = { registerController, loginController, logoutController };
