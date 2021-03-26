require('dotenv').config();

const express = require('express')
const session = require('express-session')
const massive = require('massive')
const userCtrl = require('./controllers/user')
const postCtrl = require('./controllers/posts')

const PORT = process.env.SERVER_PORT;
const {SESSION_SECRET, CONNECTION_STRING} = process.env;

const app = express();

app.use(express.json());


app.use(
    session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 
        }
    })
)


//Auth Endpoints
app.post('/api/auth/register', userCtrl.register);
app.post('/api/auth/login', userCtrl.login);
app.get('/api/auth/me', userCtrl.getUser);
app.post('/api/auth/logout', userCtrl.logout);

//Post Endpoints
app.get('/api/posts', postCtrl.readPosts);
app.post('/api/post', postCtrl.createPost);
app.get('/api/post/:id', postCtrl.readPost);
app.delete('/api/post/:id', postCtrl.deletePost)


massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}) 
.then(db => {
    app.set("db", db);
    app.listen(PORT, () => console.log(`Db Connected, Listing with all my heart on port: ${PORT}!`));
})
.catch(err => console.log(err));