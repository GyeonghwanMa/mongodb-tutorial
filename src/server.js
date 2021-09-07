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
        
        app.get('/user', (req, res) => {
            // return res.send({users: users})
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
        
        app.listen(3000, () => console.log('server listening on port 3000'));
    } catch (error) {
        console.log(error);
    }
}

server();

