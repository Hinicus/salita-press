const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostController");
const { verify } = require("../auth");

//create a post
router.post("/post", verify, postController.createPost);

//get all blogs
router.get("/", postController.getAllPosts);

//get specific blog post
router.get("/:id", postController.getPost);

//update post
router.patch("/update/:id", verify, postController.updatePost);

//delete post
//this route can be access by both admin and regular users
router.delete("/delete/:id", verify, postController.deletePost);

//add comment
router.patch("/:id/comment", verify, postController.addBlogComment);

module.exports = router;
