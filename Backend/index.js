const express = require('express')
const app = express();
const archiver = require('archiver');
const path = require('path');
const cors = require('cors');
const upload = require('./config/multerconfig');
const fs = require('fs');

app.use(express.json());
app.use(cors({
  origin: "https://qsharex.vercel.app",
  methods: ["GET", "POST"],
}));

const port = process.env.PORT || 3000;

const UPLOAD_DIR = path.join(__dirname, "uploads");
const SHARED_DIR = path.join(__dirname, "sharedFiles");


const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(UPLOAD_DIR);
ensureDir(SHARED_DIR);


app.post('/upload', upload.array('file', 100), (req, res) => {

   const sessionId = req.body.sessionId;
  if (!sessionId) {
    return res.status(400).json({ message: "sessionId missing" });
  }

  const url = path.join(UPLOAD_DIR,sessionId);
  console.log('Files received:', url);

  const fileUrls = req.files.map(file =>
    `${url}/${file.filename}`
  );



  res.json({
    message: 'Files uploaded successfully',
    fileUrls: fileUrls,
  });

});


app.get('/zip', (req, res) => {
   const sessionId = req.body.sessionId;
  if (!sessionId) {
    return res.status(400).json({ message: "sessionId missing" });
  }
  const url = path.join(SHARED_DIR,sessionId);
  
  const output = fs.createWriteStream(
    path.join(url, 'share.zip')
  );

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');

  });
  archive.on('error', function (err) {
    throw err;
  });
  archive.pipe(output);
  archive.directory(path.join(UPLOAD_DIR,sessionId), false);
  archive.finalize();

  const zipFileUrl = `${url}/share.zip`;

  res.json({
    message: 'Files zipped successfully',
    zipFileUrl: zipFileUrl,
  });

  setTimeout(() => {
    fs.rmSync(url, { recursive: true, force: true });
    fs.mkdirSync(url);
    console.log('zip deleted');
    fs.rmSync(path.join(UPLOAD_DIR,sessionId), { recursive: true, force: true });
    fs.mkdirSync(path.join(UPLOAD_DIR,sessionId));
    console.log('File deleted');
  }, 60000 * 10);
});


app.post('/delete', (req, res) => {
  const sessionId = req.body.sessionId;
  if (!sessionId) {
    return res.status(400).json({ message: "sessionId missing" });
  }
  const url = path.join(SHARED_DIR,sessionId);
  fs.rmSync(url, { recursive: true, force: true });
    fs.mkdirSync(url);
    console.log('zip deleted');
    fs.rmSync(path.join(UPLOAD_DIR,sessionId), { recursive: true, force: true });
    fs.mkdirSync(path.join(UPLOAD_DIR,sessionId));
    console.log('File deleted');
});

app.post('/delete-uploads', (req, res) => {
   const sessionId = req.body.sessionId;
  if (!sessionId) {
    return res.status(400).json({ message: "sessionId missing" });
  }
  const fileUrl = req.body.fileUrl;
  const url = new URL(fileUrl);
  let file = url.pathname.split('/').pop();
  const filePath = `${path.join(UPLOAD_DIR,sessionId)}/${file}`;

fs.unlink(filePath, (err) => {
  if (err) {
    console.error('Error deleting file:', err);
  } else {
    console.log('File deleted successfully');
    res.json({ message: "File deleted" });
  }
});

});

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})