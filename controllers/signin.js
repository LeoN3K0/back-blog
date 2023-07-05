const handleSignin = (req, res, db, bcrypt, jwt, secretKey, emailValidation) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    console.log('Incomplete form submission');
    return res.status(400).json('Incorrect form submission');
  }

  const validEmail = emailValidation.validate(usernameOrEmail);
  const condition = validEmail ? { email: usernameOrEmail } : { username: usernameOrEmail };
  const columnToSelect = validEmail ? 'email' : 'username';

  db.select(columnToSelect, 'hash')
    .from('login')
    .where(condition)
    .then((data) => {
      if (data.length > 0) {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          const user = validEmail ? { email: data[0].email } : { username: data[0].username };
          const token = jwt.sign(user, secretKey);
          res.json({ token });
        } else {
          console.log('Wrong credentials');
          res.status(400).json('Wrong credentials');
        }
      } else {
        console.log('Wrong credentials');
        res.status(400).json('Wrong credentials');
      }
    })
    .catch((err) => {
      console.log('Error checking credentials:', err);
      res.status(400).json('Wrong credentials');
    });
};

module.exports = {
  handleSignin,
};
