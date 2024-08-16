const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "Posts",
  }
);

module.exports = mongoose.model("Posts", postsSchema);
