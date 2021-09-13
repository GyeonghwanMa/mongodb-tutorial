const { Router} = require('express');
const userRouter = Router();
const { User } = require('../models/User');
const mongoose = require('mongoose');


userRouter.get('/', async (req, res) => {
    // return res.send({users: users})
    try {
        const users = await User.find({});
        return res.send({ users });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({error: error.message});
    }
});

userRouter.get('/:userId', async(req, res) => {
    try {
        const { userId } = req.params;
        // isValidObjectId : objectId 형식인지 확인 -> true, false
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ error: "invalid userId" });
        const user = await User.findOne({ _id: userId });
        return res.send({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).send({error: error.message});
    }
});
 
userRouter.post('/', async (req, res) => {
    try {
        let { username, name } = req.body; 
        if (!username) return res.status(400).send({ error: "username is required" });
        if (!name || !name.first || !name.last) return res.status(400).send({ error: "Both first and last names are required" });
        // == let username = req.body.username;
        // == let name = req.body.name;
        const user = new User(req.body);
        await user.save();

        return res.send({ user });
    } catch (error) {
        console.log(error);
        // error
        // 200 : 성공
        // 400 : 유저 실수
        // 500 : 서버 오류
        return res.status(500).send({ error: error.message });
    }
});

userRouter.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // isValidObjectId : objectId 형식인지 확인 -> true, false
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ error: "invalid userId" });
        const user = await User.findOneAndDelete({ _id: userId }); // 객체, null 리턴, deleteOne은 리턴 없음
        return res.send({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).send({error: error.message});
    }
});

userRouter.put('/:userId', async(req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ error: "invalid userId" });
        const { age, name } = req.body;
        if (!age && !name) return res.status(400).send({error: "age or name is required"});
        // if (!age) return res.status(400).send({ err: "age is required" });
        if (typeof age !== 'number') return res.status(400).send({ error: "age must be a number" }); 
        if (name && typeof name !== 'string' && typeof name.last !== 'string') return res.send(400).send({error: "first and last name are strings"});
        // let updateBody = {};
        // if (age) updateBody.age = age;
        // if (name) updateBody.name = name; // 안해도 잘 들어감.
        // const user = await User.findByIdAndUpdate(userId, { $set: { age, name } }, { new: true }); // new 안할 시 업데이트 전 데이터가 리턴됨.
        // == const user = await User.findByIdAndUpdate(userId, { age  }, { new: true }); // new 안할 시 업데이트 전 데이터가 리턴됨.
        let user = await User.findById(userId);
        console.log({ userBeforEdit: user });
        if (age) user.age = age;
        if (name) user.name = name;
        console.log({ userAfterEdit: user });
        await user.save();
        return res.send({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).send({error: error.message});
    }
})

module.exports = {
    userRouter
}