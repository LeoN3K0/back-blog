const getProfile = (req, res, db) => {
    const { username } = req.user;
  
    db.select('*')
      .from('users')
      .where('username', username)
      .then((user) => {
        if (user.length) {
          res.json(user[0]);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Internal server error' });
      });
  };
  
  module.exports = {
    getProfile,
  };