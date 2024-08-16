const User = require("../model/User");
const Posts = require("../model/Posts");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password").lean().exec();
    if (!users || users.length === 0) {
      return res.status(400).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const creatNewUser = asyncHandler(async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
      return res.status(409).json({ message: "Duplicate username" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const userObject = { username, password: hashedPwd, role };
    const user = await User.create(userObject);

    if (user) {
      res.status(201).json({ message: `New user ${username} created` });
    } else {
      res
        .status(400)
        .json({ message: "There is some issue with creating new username" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { id, username, password, role, active } = req.body;

    if (!id || !username || !role || typeof active !== "boolean") {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(409).json({ message: "user not found" });
    }

    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate && duplicate._id !== id) {
      return res.status(409).json({ message: "Username is already in use" });
    }

    user.username = username;
    user.role = role;
    user.active = active;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updateUser = await user.save();

    res.json({ message: `${updateUser.username} Updated ` });
  } catch (error) {
    console.log(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(409).json({ message: "User Id is required" });
    }

    const post = await Posts.findOne({ user: id }).exec();
    if (post) {
      return res
        .status(409)
        .json({ message: "User has assigned Post to complete" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(409).json({ message: "User not found" });
    }

    const result = await user.deleteOne();

    const reply = `Username : ${user.username} with Id ${user._id} is deleted`;

    res.json(reply);

  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  getAllUsers,
  creatNewUser,
  updateUser,
  deleteUser,
};
