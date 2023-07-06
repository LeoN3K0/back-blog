const verifyToken = (db, jwt, jwtSecretKey) => (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if the authorization header exists
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header not provided' });
  }

  // Split the authorization header to get the token
  const token = authHeader.split(' ')[1];

  // Verify the token
  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      // Token is invalid or expired
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Token is valid
    const { email, username } = decoded;
    const condition = email ? { email } : { username };

    // Fetch the user data from the database
    db.select('username')
      .from('users')
      .where(condition)
      .first()
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        
        req.user = user;
        next(); 
      })
      .catch(error => {
        console.log('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
      });
  });
};

module.exports = {
  verifyToken
};
