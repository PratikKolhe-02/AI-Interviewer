const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse'); // We are now sure this is the correct version

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// The Upload Route
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    try {
        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);

        // Parse the PDF (Standard Version 1.1.1)
        const data = await pdfParse(dataBuffer);

        // Print result to terminal
        console.log("--- RESUME TEXT FOUND ---");
        console.log(data.text.substring(0, 200)); // Print just the first 200 chars to keep it clean
        console.log("-------------------------");

        res.json({ 
            message: 'File uploaded and parsed successfully!', 
            filename: req.file.filename,
            extractedText: data.text 
        });

    } catch (error) {
        console.error("Error parsing PDF:", error);
        res.status(500).send("Error parsing the PDF file.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});