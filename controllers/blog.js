const createBlog = (req, res, db) => {
  const { title, body, published, publishedDate, author } = req.body;

  db('blog')
    .insert({
      title: title,
      body: body,
      published: published,
      published_date: publishedDate,
      author: author
    })
    .then(() => {
      const message = published ? 'Blog published successfully' : 'Blog draft saved successfully';
      res.json({ message });
    })
    .catch((error) => {
      console.error('Error creating blog', error);
      res.status(500).json({ error: 'Failed to create blog' });
    });
};

const getAllPublishedBlogs = (req, res, db) => {
  db.select('*')
    .from('blog')
    .where('published', true)
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((error) => {
      console.error('Error fetching published blogs', error);
      res.status(500).json({ error: 'Failed to fetch published blogs' });
    });
};

const getBlogsByAuthor = (req, res, db) => {
  const { author } = req.params;

  db.select('*')
    .from('blog')
    .where('author', '=', author)
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((error) => {
      console.error('Error fetching blogs by author', error);
      res.status(500).json({ error: 'Failed to fetch blogs by author' });
    });
};

const getPublishedBlogsByAuthor = (req, res, db) => {
  const { author } = req.query;

  db.select('*')
    .from('blog')
    .where('author', '=', author)
    .andWhere('published', '=', true)
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((error) => {
      console.error('Error fetching published blogs by author', error);
      res.status(500).json({ error: 'Failed to fetch published blogs by author' });
    });
};

module.exports = {
  createBlog,
  getBlogsByAuthor,
  getAllPublishedBlogs,
  getPublishedBlogsByAuthor,
};
