const fs = require('fs');
const path = require('path');

const createBlog = (req, res, db) => {
  const { title, body, published, publishedDate, author, image } = req.body;

  db('blog')
    .insert({
      title: title,
      body: body,
      published: published,
      published_date: publishedDate,
      author: author,
      image: image
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

const deleteBlog = (req, res, db, id) => {
  fetchAssociatedImages(db, id)
    .then((imageLinks) => {
      db('blog')
        .where('id', id)
        .del()
        .then(() => {
          deleteImages(imageLinks)
            .then(() => {
              res.json({ message: 'Blog deleted successfully' });
            })
            .catch((error) => {
              console.error('Error deleting associated images', error);
              res.status(500).json({ error: 'Failed to delete blog' });
            });
        })
        .catch((error) => {
          console.error('Error deleting blog', error);
          res.status(500).json({ error: 'Failed to delete blog' });
        });
    })
    .catch((error) => {
      console.error('Error retrieving associated images', error);
      res.status(500).json({ error: 'Failed to delete blog' });
    });
};

const fetchAssociatedImages = (db, blogId) => {
  return db('blog')
    .select('body')
    .where('id', blogId)
    .first()
    .then((result) => {
      const imageLinks = [];
      if (result && result.body) {
        const regex = /<img[^>]+src="([^">]+)"/g;
        let match;
        while ((match = regex.exec(result.body))) {
          imageLinks.push(match[1]);
        }
      }
      return imageLinks;
    })
    .catch((error) => {
      console.error('Error retrieving associated images', error);
      throw error;
    });
};

const deleteImages = (imageLinks) => {
  const deletionPromises = imageLinks.map((imageLink) => {
    const imageName = getImageNameFromLink(imageLink);
    if (imageName) {
      const imagePath = path.join(__dirname, '../image-storage', imageName);
      return new Promise((resolve, reject) => {
        fs.unlink(imagePath, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  });

  return Promise.all(deletionPromises);
};


const getImageNameFromLink = (imageLink) => {
  const imageNameRegex = /\/([^/]+)$/; // Regular expression to extract the image name from the link
  const match = imageLink.match(imageNameRegex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

const updateBlog = (req, res, db, id) => {
  const { title, body, published, publishedDate, author, image } = req.body;

  db('blog')
    .where('id', id)
    .update({
      title: title,
      body: body,
      published: published,
      published_date: publishedDate,
      author: author, 
      image: image
    })
    .then(() => {
      res.json({ message: 'Blog updated successfully' });
    })
    .catch((error) => {
      console.error('Error updating blog', error);
      res.status(500).json({ error: 'Failed to update blog' });
    });
};




module.exports = {
  createBlog,
  getBlogsByAuthor,
  getAllPublishedBlogs,
  getPublishedBlogsByAuthor,
  deleteBlog,
  updateBlog,
};
