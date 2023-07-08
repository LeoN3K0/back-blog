const createBlog = (req, res, db) => {
    const { title, content, isPublished } = req.body;
  
    // Perform the necessary operations to insert the blog into the database
    // You can customize this code to match your database schema and table structure
  
    db.insert({
      title: title,
      content: content,
      is_published: isPublished,
    })
      .into('blog_table')
      .then(() => {
        const message = isPublished ? 'Blog published successfully' : 'Blog draft saved successfully';
        res.json({ message });
      })
      .catch((error) => {
        console.error('Error creating blog', error);
        res.status(500).json({ error: 'Failed to create blog' });
      });
  };
  
  module.exports = {
    createBlog,
  };