const Posts = require("../model/Posts");
const asyncHandler = require("express-async-handler");


const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Posts.find().lean().exec();
    if (posts?.length === 0) {
      return res.status(409).json({ message: "No posts found" });
    }
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

const getPostsByUserId = asyncHandler(async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const posts = await Posts.find({ userId }).lean().exec();
  
      if (posts.length === 0) {
        return res.status(404).json({ message: "No posts found for this user" });
      }
  
      res.json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  const getPostById = asyncHandler(async (req, res) => {
    try {
      const { postId } = req.params;
  
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }
  
      const post = await Posts.findById(postId).lean().exec();
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  });

const createPost = asyncHandler(async (req, res) => {
  try {
    const { userId, title, content, author } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ message: "User ID and title are required" });
    }

    const duplicate = await Posts.findOne({ title }).lean().exec();

    if (duplicate) {
      return res.status(409).json({ message: "Post with this title already exists" });
    }

    const postObject = { userId, title, content, author };

    const post = await Posts.create(postObject);

    if (post) {
      return res.status(201).json({ message: "New Post Created", post });
    } else {
      res.status(400).json({ message: "Invalid post data received" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

const updatePost = asyncHandler(async (req, res) => {
  try {
    const { id, userId, title, content, author } = req.body;

    if (!id || !userId || !title) {
      return res.status(400).json({ message: "ID, User ID, and title are required" });
    }

    const post = await Posts.findById(id).exec();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const duplicate = await Posts.findOne({ title }).lean().exec();

    if (duplicate && duplicate._id.toString() !== id) {
      return res.status(409).json({ message: "Post title is already taken" });
    }

    post.userId = userId;
    post.title = title;
    post.content = content;
    post.author = author;

    const updatedPost = await post.save();
    res.json({ message: `Post titled "${updatedPost.title}" is updated`, updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const post = await Posts.findById(id).exec();

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const result = await Posts.deleteOne({ _id: id });
  res.json({ message: `Post titled "${post.title}" has been deleted` });
});

module.exports = {
  getAllPosts,
  getPostsByUserId,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
