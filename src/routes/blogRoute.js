const {Router} = require('express');
const blogRouter = Router();
const {Blog} = require('../models/Blog');
const {User} = require('../models/User');
const {isValidObjectId} = require('mongoose');

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
        
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

blogRouter.get('/:blogId', async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

// 전체 수정
blogRouter.put('/:blogId', async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

// 특정 부분수정
blogRouter.patch('/:blogId/live', async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});

module.exports = {blogRouter};
