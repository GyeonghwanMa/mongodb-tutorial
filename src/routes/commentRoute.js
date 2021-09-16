const {Router} = require('express');
const commentRouter = Router({mergeParams: true});
const {Comment} = require('../models/Comment');
const {Blog} = require('../models/Blog');
const {User} = require('../models/User');
const {isValidObjectId} = require('mongoose');

/*
    /user
    /blog
    /blog/:blogId//comment
*/

commentRouter.post('/', async (req, res) => {
    try {
        const {blogId} = req.params;
        const {content, userId} = req.body;
        if(!isValidObjectId(blogId)) return res.status(400).send({error: "blogId is invalid"}); 
        if (!isValidObjectId(userId)) return res.status(400).send({error: "userId is invalid"}); 
        if (typeof content !== 'string') return res.status(400).send({error: 'content is required'});

        const blog = await Blog.findByIdAndUpdate(blogId);
        const user = await User.findByIdAndUpdate(userId);
        if(!blog || !user) return res.status(400).send({error: "blog pr user does not exist"});
        if(!blog.islive) return res.status(400).send({error: "blog is not available"});

        const comment = new Comment({comment, user, blog});
        return res.send({comment});
    
    } catch (error) {
        return res.status(400).send({error: error.message});
    }
});

commentRouter.get('/');



module.exports = {commentRouter};