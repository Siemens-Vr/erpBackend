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
      let uploadDir = 'files'; 
      
      if (file.fieldname === 'videos') {
        uploadDir = 'videos';
      } else if (file.fieldname === 'images') {
        uploadDir = 'images';
      } else if (file.fieldname === 'invoice') {
        uploadDir = 'invoices';
      } else if (file.fieldname === 'approval') {
        uploadDir = 'approvals';
      } 
      else if (file.fieldname === 'voucher') {
        uploadDir = 'vouchers';
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
  { name: 'files', maxCount: 10 },
  { name: 'voucher', maxCount: 10 },
  { name: 'invoice', maxCount: 10 },
  { name: 'approval', maxCount: 10 }, 
]);

module.exports = { upload };
