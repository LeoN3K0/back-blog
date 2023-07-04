const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');
var validator = require("email-validator");

const register = require('./controllers/register');

const db = knex({
  client: 'pg',
  connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'left4dead2',
      database: 'Blog'
  },
  pool: {
      min: 0
  }
});

const app = express();

app.use(express.json());
app.use(cors());

app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt, validator); // Pass the 'db' object to handleRegister
});

app.listen(3000, () => {
    console.log('server is running on port 3000');
});
