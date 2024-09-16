const {
  followUser,
  getFollowingList,
  unfollowUser,
  getFollowerList,
} = require("../models/followModel");
const User = require("../models/userModel");

const followUserController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    await User.findUserWithKey({ key: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid Follower userId",
      error: error,
    });
  }

  try {
    await User.findUserWithKey({ key: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid Following userId",
      error: error,
    });
  }

  try {
    const followDb = await followUser({ followerUserId, followingUserId });

    return res.send({
      status: 201,
      message: "Follow successful",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
  return res.send("all okk follow controller");
};

const getFollowingListController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const SKIP = Number(req.body.query) || 0;

  try {
    await User.findUserWithKey({ key: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid follower userId",
      error: error,
    });
  }

  try {
    const followingListDb = await getFollowingList({ followerUserId, SKIP });

    if (followingListDb.length === 0) {
      return res.send({
        status: 203,
        message: "No following found",
      });
    }

    return res.send({
      status: 200,
      message: "Read Success",
      data: followingListDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getFollowerListController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const followingUserId = req.session.user.userId;

  try {
    await User.findUserWithKey({ key: followingUserId });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Invalid Following UserId",
      error: error,
    });
  }
     
  try {
    const followerListDb = await getFollowerList({ followingUserId, SKIP });

    if (followerListDb.length === 0) {
      return res.send({
        status: 203,
        message: "No Followers found",
      });
    }

    return res.send({
      status: 200,
      message: "Read Success",
      data: followerListDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const unfollowUserController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    const deleteDb = await unfollowUser({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "Unfollow Successfull",
      data: deleteDb,
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
  followUserController,
  getFollowingListController,
  unfollowUserController,
  getFollowerListController,
};

// test -----> test1,test2,test3,test4
// test1,test2 -----> test
