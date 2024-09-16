const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//file-imports
const db = require("./db");
const authRouter = require("./routers/userRouter");
const blogRouter = require("./routers/blogRouter");
const followRouter = require("./routers/followRouter");
const isAuth = require("./middlewares/isAuthMiddleware");
const cleanupBin = require("./cron");

//contants
const app = express();
const PORT = process.env.PORT;
const store = new mongodbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middlewares
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/auth", authRouter);
app.use("/blog", blogRouter);
app.use("/follow", isAuth, followRouter);

app.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "Server is up and running!",
  });
});

app.listen(PORT, () => {
  console.log(
    clc.yellowBright.bold.underline(`Server is running on PORT: ${PORT}`)
  );

  cleanupBin();
});
