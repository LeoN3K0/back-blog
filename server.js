const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const knex = require('knex');
var validator = require('email-validator');
const fileUpload = require('express-fileupload');
const path = require('path');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const { verifyToken } = require('./controllers/verifyToken');
const { logout } = require('./controllers/logout');
const profile = require('./controllers/profile');
const imageController = require('./controllers/image');
const blog = require('./controllers/blog');



const generateRandomSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const secretKey = generateRandomSecretKey();

const db = knex({
  client: 'pg',
      connection: process.env.DB_CONNECTION,
      pool: {
          min: 0
      }
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
app.use('/images', express.static(path.join(__dirname, './image-storage')));

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

app.get('/profile', verifyToken(db, jwt, app.get('jwtSecretKey')), (req, res) => {
  profile.getProfile(req, res, db);
});

app.post('/logout', logout);

app.post('/upload-image', (req, res) => {
  imageController.uploadImage(req, res, db);
});

app.delete('/delete-image/:imageName', (req, res) => {
  imageController.deleteImage(req, res, db);
});

app.post('/create-blog', verifyToken(db, jwt, app.get('jwtSecretKey')), (req, res) => {
  blog.createBlog(req, res, db);
});

app.get('/blogs', (req, res) => {
  const { author, id } = req.query;

  if (author) {
    // Filter by author and show only published blogs
    blog.getPublishedBlogsByAuthor(req, res, db);
  } else if (id) {
    blog.getPublishedBlogsByID(req, res, db)
  } else {
    // Read all published blogs
    blog.getAllPublishedBlogs(req, res, db);
  }
});

app.get('/blogs/:author', verifyToken(db, jwt, app.get('jwtSecretKey')), (req, res) => {
  blog.getBlogsByAuthor(req, res, db);
});

app.delete('/blogs/:id', verifyToken(db, jwt, app.get('jwtSecretKey')), (req, res) => {
  const { id } = req.params;

  blog.deleteBlog(req, res, db, id);
});

app.put('/blogs/:id', verifyToken(db, jwt, app.get('jwtSecretKey')), (req, res) => {
  const { id } = req.params;

  blog.updateBlog(req, res, db, id);
});
  

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
