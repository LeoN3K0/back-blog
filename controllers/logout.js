const logout = (req, res) => {
    // Perform any logout logic here
    // For example, you can clear any user session or token
    
    res.json({ message: 'Logout successful' });
  };
  
  module.exports = {
    logout
  };
  