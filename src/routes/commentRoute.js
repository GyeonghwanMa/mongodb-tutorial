const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
const { Blog, Comment, User } = require("../models");
const { isValidObjectId, startSession } = require("mongoose");

/*
    /user
    /blog
    /blog/:blogId//comment
*/

commentRouter.post("/", async (req, res) => {
  // const session = await startSession();
  let comment;
  try {
    // await session.withTransaction(async () => {
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
      Blog.findById(blogId, {}, {}),
      User.findById(userId, {}, {}),
    ]);
    // 한번에 불러오기
    // const blog = await Blog.findByIdAndUpdate(blogId);
    // const user = await User.findByIdAndUpdate(userId);
    if (!blog || !user)
      return res.status(400).send({ error: "blog or user does not exist" });
    if (!blog.islive)
      return res.status(400).send({ error: "blog is not available" });

    comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      blog: blogId,
    });
    // await session.abortTransaction();
    // await Promise.all([
    //   comment.save(),
    //   Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
    // ]);

    // blog.commentsCount++;
    // blog.comments.push(comment);

    // if (blog.commentsCount > 3) blog.comments.shift();

    // await Promise.all([
    //   comment.save({}),
    //   blog.save(), // session 없어도됨. session통해서 불러왔기 때문.
    //   // Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } }),
    // ]);
    // });

    await Promise.all([
      comment.save(),
      Blog.updateOne(
        { _id: blogId },
        {
          $inc: { commentCount: 1 },
          $push: { comments: { $each: [comment], $slice: -3 } }, // 같은 컬럼?을 다른 오퍼레이터로 동시에 작업 X
        }
      ),
    ]);

    return res.send({ comment });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  } finally {
    // await session.endSession();
  }
});

commentRouter.get("/", async (req, res) => {
  let { page = 0 } = req.query;
  page = parseInt(page);
  const { blogId } = req.params;
  if (!isValidObjectId(blogId))
    return res.status(400).send({ error: "blogId is invalid" });
  const comments = await Comment.find({ blog: blogId })
    .sort({ createAt: -1 })
    .skip(page * 3)
    .limit(3);
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

commentRouter.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findOneAndDelete({ _id: commentId });
  await Blog.updateOne(
    { "comments._id": commentId },
    { $pull: { comments: { _id: commentId } } }
  );
  return res.send({ comment });
});

module.exports = { commentRouter };
