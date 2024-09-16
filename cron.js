const cron = require("node-cron");
const blogSchema = require("./schemas/blogSchema");

const cleanupBin = () => {
  cron.schedule("* * 0 * * *", async () => {
    try {
        //find the blogs which has been marked deleted
      const markedDeletedBlogs = await blogSchema.find({ isDeleted: true });
      
      if (markedDeletedBlogs.length !== 0) {
        const deletedBlogsIds = [];

        //find out the blogs > 30 days deleted
        markedDeletedBlogs.map((blog) => {
          const diff = (Date.now() - blog.deletionDateTime) / (1000 * 60 * 60 * 24);

          if (diff > 20) {
            deletedBlogsIds.push(blog._id);
          }
        });

        if (deletedBlogsIds.length !== 0) {
          const deleteDb = await blogSchema.findOneAndDelete({
            _id: { $in: deletedBlogsIds },
          });

          console.log(`Blog has been deleted successfully : ${deleteDb._id}`);
        }

        console.log(deletedBlogsIds);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = cleanupBin;
