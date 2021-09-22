const express = require('express');
const app = express();
const { userRouter, blogRouter } = require('./routes');
const mongoose = require('mongoose');
const {generateFakeData} = require('../faker');

const MONGO_URI = 'mongodb+srv://admin:NhQ4SAxtpVC3x9vV@mongodbtutorial.rmzkk.mongodb.net/BlogService?retryWrites=true&w=majority';

const server = async() => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        
        // mongoose.set('debug', true)
        // let result = mongoose.connect(MONGO_URI)
        
        // await generateFakeData(100, 10, 300);

        // json을 자바스크립트로 변경
        app.use(express.json());
        
        // url이 user로 시작할 경우 
        app.use('/user', userRouter);
        app.use('/blog', blogRouter);
        
        app.listen(3000, () => console.log('server listening on port 3000'));
    } catch (error) {
        console.log(error);
    }
}

server();

