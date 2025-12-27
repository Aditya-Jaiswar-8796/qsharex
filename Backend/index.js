const express = require('express')
const app = express();
const archiver = require('archiver');
const path = require('path');
const cors = require('cors');
const upload = require('./config/multerconfig');
const fs = require('fs');
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/sharedFiles', express.static(path.join(__dirname, 'sharedFiles')));


app.post('/upload', upload.array('file', 100), (req, res) => {

  const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(path.join(__dirname, "uploads"));
ensureDir(path.join(__dirname, "sharedFiles"));

  const url = req.protocol + '://' + req.get('host');
  console.log('Files received:', url);

  const fileUrls = req.files.map(file =>
    `${url}/uploads/${file.filename}`
  );



  res.json({
    message: 'Files uploaded successfully',
    fileUrls: fileUrls,
  });

});


app.get('/zip', (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  
  const output = fs.createWriteStream(
    path.join(__dirname, 'sharedFiles', 'share.zip')
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
  archive.directory('./uploads', false);
  archive.finalize();

  const zipFileUrl = `${url}/sharedFiles/share.zip`;

  res.json({
    message: 'Files zipped successfully',
    zipFileUrl: zipFileUrl,
  });

  setTimeout(() => {
    fs.rmSync(`./sharedFiles/`, { recursive: true, force: true });
    fs.mkdirSync('./sharedFiles');
    console.log('zip deleted');
    fs.rmSync(`./uploads/`, { recursive: true, force: true });
    fs.mkdirSync('./uploads');
    console.log('File deleted');
  }, 60000 * 10);
});


app.post('/delete', (req, res) => {
  fs.rmSync(`./uploads/`, { recursive: true, force: true });
  fs.mkdirSync('./uploads');
  console.log('File deleted');
  fs.rmSync(`./sharedFiles/`, { recursive: true, force: true });
  fs.mkdirSync('./sharedFiles');
  console.log('zip deleted');
  res.json({ message: 'File and zip deleted successfully' });
});

app.post('/delete-uploads', (req, res) => {

  const fileUrl = req.body.fileUrl;
  const url = new URL(fileUrl);
  let file = url.pathname.split('/').pop();
  const filePath = `./uploads/${file}`;

fs.unlink(filePath, (err) => {
  if (err) {
    console.error('Error deleting file:', err);
  } else {
    console.log('File deleted successfully');
  }
});

});

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})