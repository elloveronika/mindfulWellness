const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  activityName: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
