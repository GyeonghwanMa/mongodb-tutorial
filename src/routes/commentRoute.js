const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
const { Blog, Comment, User } = require("../models");
const { isValidObjectId } = require("mongoose");

/*
    /user
    /blog
    /blog/:blogId//comment
*/

commentRouter.post("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ error: "blogId is invalid" });
    if (!isValidObjectId(userId))
      return res.status(400).send({ error: "userId is invalid" });
    if (typeof content !== "string")
      return res.status(400).send({ error: "content is required" });

    // 한번에 불러오기
    const [blog, user] = await Promise.all([
      Blog.findById(blogId),
      User.findById(userId),
    ]);
    // 한번에 불러오기
    // const blog = await Blog.findByIdAndUpdate(blogId);
    // const user = await User.findByIdAndUpdate(userId);
    if (!blog || !user)
      return res.status(400).send({ error: "blog or user does not exist" });
    if (!blog.islive)
      return res.status(400).send({ error: "blog is not available" });

    const comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      blog,
    });
    await Promise.all([
      comment.save(),
      Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
    ]);
    return res.send({ comment });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

commentRouter.get("/", async (req, res) => {
  const { blogId } = req.params;
  if (!isValidObjectId(blogId))
    return res.status(400).send({ error: "blogId is invalid" });

  const comments = await Comment.find({ blog: blogId });
  return res.send({ comments });
});

commentRouter.patch("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (typeof content !== "string")
    return res.status(400).send({ error: "content is required" });

  const [comment] = await Promise.all([
    Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
    Blog.updateOne(
      { "comments._id": commentId },
      { "comments.$.content": content }
    ),
  ]);
  return res.send({ comment });
});

module.exports = { commentRouter };
