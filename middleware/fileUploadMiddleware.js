const multer = require('multer');
const path = require('path');

const storage = (directory) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', directory));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configure multer for multiple file types
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir = 'files'; // default directory
      
      if (file.fieldname === 'videos') {
        uploadDir = 'videos';
      } else if (file.fieldname === 'images') {
        uploadDir = 'images';
      }
      
      cb(null, path.join(__dirname, '..', 'uploads', uploadDir));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
}).fields([
  { name: 'videos', maxCount: 10 },
  { name: 'images', maxCount: 10 },
  { name: 'files', maxCount: 10 }
]);

module.exports = { upload };