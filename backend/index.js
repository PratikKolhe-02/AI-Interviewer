const express = require('express');
const cors = require('cors');
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


app.post('/upload', upload.single('file'), (req, res) => {
    
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log("File received:", req.file.filename);
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

app.get('/', (req, res) => {
    res.send('Backend is running and ready to accept files!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});