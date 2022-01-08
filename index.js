const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola, ho flipo bastant :)');
});

app.get('/api', (req, res) => {
    res.json({
        tuits:[
            {
                id: 0,
                text: 'Lorem',
                username: 'Dan'
            },
            {
                id: 0,
                text: 'Ipsum',
                username: 'Steve'
            },
        ]
    });
});

app.get('/login', (req, res) => {
    res.send(`<html>
                <head>
                    <title>Login</title>
                </head>
                <body>
                    <form method="POST" action="/auth">
                        User: <input type="text" name="text"><br>
                        Password: <input type="password" name="password"><br>
                        <input type="submit" value="Login" />
                    </form>
                </body>
            </html>`

    )
})

app.post('/auth', (req, res) => {
    const {userName, password} = req.body;

    const user = {userName: userName};
    const accessToken = generateAccesToken(user);
    
    res.header('authorization', accessToken).json({
        message: 'User is authenticate',
        token: accessToken
    });
});

function generateAccesToken(user) {
    return jwt.sign(user, process.env.SECRET, {expiresIn: '5m'});
}

app.listen(3000, () => {
    console.log('Server is running...');
})