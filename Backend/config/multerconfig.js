const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const sessionId = req.body.sessionId;
        const url = path.join('uploads', sessionId);
        if (!fs.existsSync(url)) {
      fs.mkdirSync(url, { recursive: true });
    }
        cb(null, url);
    },
    filename: function (req, file, cb) {
        
        cb(null, Date.now() + '-' + file.originalname);
    }   
});

const upload = multer({ storage: storage ,  limits: { fileSize: 100 * 1024 * 1024 }});    
module.exports = upload;