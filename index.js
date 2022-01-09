const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<html>
                <head>
                    <title>JWT demo</title>
                </head>
                <body>
                    <h1>Welcome to JSON WEB TOKEN demo</h1><br />
                    <a href="http://localhost:3000/login">LOGIN</a>
                </body>
            </html>`);
});

app.get('/api', validateToken, (req, res) => {
    res.json({
        username: req.user,
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
                    <title>JWT demo : Login</title>
                </head>
                <body>
                    <form method="POST" action="/auth">
                        User: <input type="text" name="text"><br />
                        Password: <input type="password" name="password"><br />
                        <input type="submit" value="Login" />
                    </form>
                </body>
            </html>`

    )
})

app.post('/auth', (req, res) => {
    const {username, password} = req.body;

    const user = {username: username};
    const accessToken = generateAccesToken(user);
    
    res.header('authorization', accessToken).json({
        message: 'User is authenticate',
        token: accessToken
    });
});

function generateAccesToken(user) {
    return jwt.sign(user, process.env.SECRET, {expiresIn: '5m'});
}

function validateToken( req, res, next) {
    const accessToken = req.headers['authorization'] || req.query.accesstoken;
    !accessToken && res.send('Acces denied');

    jwt.verify(accessToken, process.env.SECRET, (err, user) => {
        if(err){
            res.send('Acces denied, token expired or incorrect');
        } else {
            req.user = user;
            next();
        }
    })
}
app.listen(3000, () => {
    console.log('Server is running...');
})