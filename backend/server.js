require('dotenv').config();

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
    {
        username: "Rafa",
        title: "Title 1",
    },
    {
        username: "Felipe",
        title: "Title 2",
    },
];

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = {
        name: username,
    }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
        secure: true,
    });
    res.json({accessToken: accessToken});
})

app.get('/posts', authenticateToken, (req, res) => {
    console.log(req);
    res.json(posts.filter(post => post.username === req.user.name));
})

app.listen(3000)

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null)return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err)return res.sendStatus(403);
        req.user = user;
        next();
    })
}