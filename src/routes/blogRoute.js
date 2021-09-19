const {Router} = require('express');
const blogRouter = Router();
const {Blog, User} = require('../models');
const {isValidObjectId} = require('mongoose');
const {commentRouter} = require('./commentRoute');

blogRouter.use('/:blogId/comment', commentRouter);


blogRouter.post('/', async (req, res) => {
    try {
        const {title, content, islive, userId} = req.body;
        if (typeof title !== 'string') res.status(400).send({error: 'title is required.'});
        if (typeof content !== 'string') res.status(400).send({error: 'content is required.'});
        if (islive && typeof islive !== 'boolean') res.status(400).send({error: 'islive must be a boolean.'});
        if (!isValidObjectId(userId)) res.status(400).send({error: 'userId is invalid.'});
        let user = await User.findById(userId);
        if (!user) res.status(400).send({error: "user does not exist"});

        let blog = new Blog({...req.body, user}); // user -> userId도 가능(user로 해도 알아서 userId를 빼옴-> 블로그 스키마에 셋팅)
        await blog.save();
        return res.send({blog});
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

blogRouter.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({}).limit(10);
        return res.send({blogs});
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

blogRouter.get('/:blogId', async (req, res) => {
    try {
        const {blogId} = req.params;
        if (!isValidObjectId(blogId)) res.status(400).send({error: 'blogId is invalid.'});
        const blog = await Blog.findOne({_id: blogId});
        return res.send({blog});
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

// 전체 수정
blogRouter.put('/:blogId', async (req, res) => {
    try {
        const {blogId} = req.params;
        if (!isValidObjectId(blogId)) res.status(400).send({error: 'blogId is invalid.'});
       
        const {title, content} = req.body;
        if (typeof title !== 'string') res.status(400).send({error: 'title is required.'});
        if (typeof content !== 'string') res.status(400).send({error: 'content is required.'});

        const blog = await Blog.findOneAndUpdate({_id:blogId}, {title, content}, {new: true});
        return res.send({blog});

    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

// 특정 부분수정
blogRouter.patch('/:blogId/live', async (req, res) => {
    try {
        const {blogId} = req.params;
        if (!isValidObjectId(blogId)) res.status(400).send({error: 'blogId is invalid.'});
       const {islive} = req.body;
       if (typeof islive !== 'boolean') res.status(400).send({error: 'boolean islive is required'});

       const blog = await Blog.findByIdAndUpdate(blogId, {islive}, {new:true});
       return res.send({blog});
     } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

module.exports = {blogRouter};
