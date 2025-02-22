const blogSchema = require("../schemas/blogSchema");
const { LIMIT } = require("../privateConstants");
const ObjectId = require("mongodb").ObjectId;

const createBlog = ({ title, textBody, userId }) => {
  return new Promise(async (resolve, reject) => {
    const blogObj = new blogSchema({
      title,
      textBody,
      userId,
      creationDateTime: Date.now(),
    });

    try {
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getBlogs = ({ followingUserIds, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    //skip, limit, sort

    try {
      const myBlogsDb = await blogSchema.aggregate([
        {
          $match: {
            userId: { $in: followingUserIds },
            isDeleted: { $ne: true },
          },
        },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      resolve(myBlogsDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getMyBlogs = ({ SKIP, userId }) => {
  return new Promise(async (resolve, reject) => {
    //match sort skip limit
    try {
      const myBlogsDb = await blogSchema.aggregate([
        { $match: { userId: userId, isDeleted: { $ne: true } } }, //isDeleted: { $eq: false }
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      resolve(myBlogsDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    if (!blogId) reject("Missing BlogId.");

    if (!ObjectId.isValid(blogId)) reject("Format of BlogId is incorrect");
    try {
      const blogDb = await blogSchema.findOne({ _id: blogId });

      if (!blogDb) reject(`Blog not found with BlogId : ${blogId}`);

      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const editBlogWithId = ({ title, textBody, blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await blogSchema.findOneAndUpdate(
        { _id: blogId },
        { title: title, textBody: textBody },
        { new: true }
      );

      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteBlog = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const deleteDb = await blogSchema.findOneAndDelete({ _id: blogId });
      const deleteDb = await blogSchema.findOneAndUpdate(
        { _id: blogId },
        { isDeleted: true, deletionDateTime: Date.now() }
      );
      resolve(deleteDb);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createBlog,
  getBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlogWithId,
  deleteBlog,
};
