const Post = require("../models/Post");
const { errorHandler } = require("../auth");

// Create a blog post
module.exports.createPost = (req, res) => {
  const { title, content } = req.body;

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).send({ message: "Title and Content are required" });
  }

  const newPost = new Post({
    title: title.trim(),
    content: content.trim(),
    author: req.user.id,
  });

  return newPost
    .save()
    .then((result) => {
      return res.status(201).send({
        message: "Post successfully created",
        post: result,
      });
    })
    .catch((err) => errorHandler(err, req, res));
};

// Get all blog posts
module.exports.getAllPosts = (req, res) => {
  return Post.find({})
    .populate("author", "username")
    .sort({ createdAt: -1 }) // Newest posts first
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => errorHandler(err, req, res));
};

// Get a specific blog post
module.exports.getPost = (req, res) => {
  return Post.findById(req.params.id)
    .populate("author", "username")
    .populate("comments.userId", "username")
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: "Post not found." });
      }
      return res.status(200).send(result);
    })
    .catch((err) => errorHandler(err, req, res));
};

// Update a blog post
module.exports.updatePost = (req, res) => {
  const { title, content } = req.body;

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).send({ message: "Title and Content are required" });
  }

  return Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).send({ message: "Post not found." });
      }

      if (post.author.toString() !== req.user.id) {
        return res
          .status(403)
          .send({ message: "Not allowed to update this post." });
      }

      post.title = title.trim();
      post.content = content.trim();

      return post.save().then((updatedPost) => {
        return res.status(200).send({
          message: "Post successfully updated",
          updatedPost,
        });
      });
    })
    .catch((err) => errorHandler(err, req, res));
};

// Delete a blog post
module.exports.deletePost = (req, res) => {
  return Post.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: "Post not found." });
      }

      const isOwner = result.author.toString() === req.user.id;
      const isAdmin = req.user.isAdmin;

      if (!isOwner && !isAdmin) {
        return res
          .status(403)
          .send({ message: "Not allowed to delete this post." });
      }

      return result.deleteOne().then(() => {
        return res.status(200).send({
          message: "Post successfully deleted",
        });
      });
    })
    .catch((err) => errorHandler(err, req, res));
};

//add comment to a blog
module.exports.addBlogComment = (req, res) => {
  if (!req.body.comment?.trim()) {
    return res.status(400).send({ message: "Comment is required" });
  }

  const newComment = {
    userId: req.user.id,
    comment: req.body.comment,
  };

  return Post.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { comments: newComment } },
    {
      returnDocument: "after",
    },
  )
    .then((commentedPost) => {
      if (!commentedPost) {
        return res.status(404).send({ message: "Post not found" });
      }

      return res
        .status(201)
        .send({ message: "Commented successfully.", commentedPost });
    })
    .catch((err) => errorHandler(err, req, res));
};
