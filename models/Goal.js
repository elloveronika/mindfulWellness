const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
    goalName: {
      type: String,
      required: true,
    },
    time: {
      type: Number,
      require: true,
    },
  });
  
  module.exports = mongoose.model("Goal", GoalSchema);