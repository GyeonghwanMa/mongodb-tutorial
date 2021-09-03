const express = require('express');

const app = express();

const users = [];

// json을 자바스크립트로 변경
app.use(express.json());

app.get('/user', function(req, res) {
    return res.send({users: users})
});

app.post('/user', function(req, res) {
    users.push({ name: req.body.name, age: req.body.age });
    return res.send({ success: true});
});

app.listen(3000, function() {
    console.log('server listening on port 3000');
});