const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const knex = require('knex');
var validator = require('email-validator');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const { verifyToken } = require('./controllers/verifyToken');


const generateRandomSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const secretKey = generateRandomSecretKey();

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'left4dead2',
    database: 'Blog',
  },
  pool: {
    min: 0,
  },
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set('jwtSecretKey', secretKey);

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt, validator);
});

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt, jwt, app.get('jwtSecretKey'), validator);
});

app.post('/verifyToken', verifyToken(db, jwt, app.get('jwtSecretKey')), (req, res) => {
    const user = req.user;
  
    res.json(user);
});
  

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
