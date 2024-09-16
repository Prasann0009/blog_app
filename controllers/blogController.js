const {
  createBlog,
  getBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlogWithId,
  deleteBlog,
} = require("../models/blogModel");
const { getFollowingList } = require("../models/followModel");
const blogSchema = require("../schemas/blogSchema");
const blogDataValidate = require("../utils/blogUtils");

const createBlogController = async (req, res) => {
  console.log(req.body);
  console.log(req.session);

  const { title, textBody } = req.body;
  const userId = req.session.user.userId;

  //data validation

  try {
    await blogDataValidate({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: error,
    });
  }

  //store the data in db

  try {
    const blogDb = await createBlog({ title, textBody, userId });

    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const followerUserId = req.session.user.userId;

  try {
    const followingUserList = await getFollowingList({ followerUserId, SKIP });

    const followingUserIds = followingUserList.map((item) => item._id);

    const blogsDb = await getBlogs({ followingUserIds, SKIP });

    if (blogsDb.length === 0) {
      return res.send({
        status: 203,
        message: "No blog found",
      });
    }
      
    return res.send({
      status: 200,
      message: "Read success",
      data: blogsDb,
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

const getMyBlogsController = async (req, res) => {
  const userId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    const myBlogsDb = await getMyBlogs({ SKIP, userId });

    if (myBlogsDb.length === 0)
      return res.send({
        status: 204,
        message: "No Blog found",
      });

    return res.send({
      status: 200,
      message: "Read Success",
      data: myBlogsDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const editBlogController = async (req, res) => {
  let { title, textBody, blogId } = req.body;
  const userId = req.session.user.userId;

  //data validation
  // try {
  //   await blogDataValidate({ title, textBody });
  // } catch (error) {
  //   return res.send({
  //     status: 400,
  //     message: error,
  //   });
  // }

  try {
    const blogDb = await getBlogWithId({ blogId });

    //If any field missing
    if (!title) title = blogDb.title;

    if (!textBody) textBody = blogDb.textBody;

    //ownership check
    //id1.toString() === id2.toString()
    //id1.equals(id2)
    console.log(userId.equals(blogDb.userId));
    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 403,
        message: "Not allowed to edit the blog",
      });
    }

    //check if 30 min or not
    console.log((Date.now() - blogDb.creationDateTime) / (1000 * 60));

    const diff = (Date.now() - blogDb.creationDateTime) / (1000 * 60);

    if (diff > 30) {
      return res.send({
        status: 400,
        message: "Not allowed to edit the blog after 30 mins of creation",
      });
    }

    const editBlogDb = await editBlogWithId({ title, textBody, blogId });

    return res.send({
      status: 200,
      message: "Blog Edited Successfully",
      data: editBlogDb,
    });
    return res.send("all okk");
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const deleteBlogController = async (req, res) => {
  const { blogId } = req.body; //OR const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    const blogDb = await getBlogWithId({ blogId });

    //Ownership check
    //id1.toString() === id2.toString()
    //id1.equals(id2)
    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 403,
        message: "Not allowed to delete the blog",
      });
    }

    const Blogdeleted = await deleteBlog({ blogId });

    return res.send({
      status: 200,
      message: "Blog deleted successfully",
      data: Blogdeleted,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};
module.exports = {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController,
};
