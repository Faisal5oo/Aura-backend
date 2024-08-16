const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsControllers');
// const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route("/")
  .get(postsController.getAllPosts)
  .post(postsController.createPost)
  .patch(postsController.updatePost)
  .delete(postsController.deletePost)

router.route("/:userId")
  .get(postsController.getPostsByUserId)
router.route("/post/:postId")
  .get(postsController.getPostById)

module.exports = router;
