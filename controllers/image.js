const path = require('path');
const fs = require('fs');

const uploadImage = (req, res) => {
  // Check if it is an image link
  const { imageUrl } = req.body;
  if (imageUrl) {
    return res.json({ imageUrl });
  }

  // Check if it is an image upload
  if (!req.files || !req.files.image) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const imageFile = req.files.image;
  const fileName = `${Date.now()}_${imageFile.name}`;
  const uploadPath = path.join(__dirname, '../image-storage', fileName);

  imageFile.mv(uploadPath, (error) => {
    if (error) {
      console.error('Error uploading image', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    const imageUrl = `http://localhost:3000/images/${fileName}`;
    return res.json({ imageUrl });
  });
};

const deleteImage = (req, res) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, '../image-storage', imageName);

  fs.unlink(imagePath, (error) => {
    if (error) {
      console.error('Error deleting image', error);
      return res.status(500).json({ error: 'Failed to delete image' });
    }

    return res.json({ message: 'Image deleted successfully' });
  });
};

module.exports = {
  uploadImage,
  deleteImage,
};
