const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { User } = require('./models/User');

const MONGO_URI = 'mongodb+srv://admin:NhQ4SAxtpVC3x9vV@mongodbtutorial.rmzkk.mongodb.net/BlogService?retryWrites=true&w=majority';

const server = async() => {
    try {
        await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
        // let result = mongoose.connect(MONGO_URI)
        
        // json을 자바스크립트로 변경
        app.use(express.json());
        
        app.get('/user', async (req, res) => {
            // return res.send({users: users})
            try {
                const users = await User.find({});
                return res.send({ users });
                
            } catch (error) {
                console.log(error);
                return res.status(500).send({error: error.message});
            }
        });

        app.get('/user/:userId', async(req, res) => {
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
         
        app.post('/user', async (req, res) => {
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

        app.delete('/user/:userId', async (req, res) => {
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

        app.put('/user/:userId', async(req, res) => {
            try {
                const { userId } = req.params;
                if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ error: "invalid userId" });
                const { age } = req.body;
                if (!age) return res.status(400).send({ err: "age is required" });
                if (typeof age !== 'number') return res.status(400).send({ error: "age must be a number" }); 
                const user = await User.findByIdAndUpdate(userId, { $set: { age } }, { new: true });
                return res.send({ user });
            } catch (error) {
                console.log(error);
                return res.status(500).send({error: error.message});
            }
        })
        
        app.listen(3000, () => console.log('server listening on port 3000'));
    } catch (error) {
        console.log(error);
    }
}

server();

