const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    const doesPostExist = Boolean(
      await Post.findOne({
        activityName: req.body.activityName,
      })
    );
    const time = +req.body.time;
    console.log("this is timelog: ", time, typeof time);
    if (doesPostExist) {
      try {
        await Post.findOneAndUpdate(
          { activityName: req.body.activityName },
          {
            $inc: { time: time },
          }
        );
        console.log("Likes +1");
        res.redirect(`/feed`);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await Post.create({
          activityName: req.body.activityName,
          time: Number(req.body.time),
          user: req.user.id,
        });
        console.log("Post has been added!");
        res.redirect("/feed");
      } catch (err) {
        console.log(err);
      }
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
