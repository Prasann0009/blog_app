const express = require("express");
const {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController,
} = require("../controllers/blogController");
const isAuth = require("../middlewares/isAuthMiddleware");
const blogRouter = express.Router();

blogRouter.post("/create-blog", isAuth, createBlogController);
blogRouter.get("/get-blogs", isAuth, getBlogsController);
blogRouter.get("/get-myblogs", isAuth, getMyBlogsController);
blogRouter.post("/edit-blog", isAuth, editBlogController);
blogRouter.post("/delete-blog", isAuth, deleteBlogController);

module.exports = blogRouter;
