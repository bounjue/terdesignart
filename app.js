const express = require('express');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;
app.use(express.static('public'));
app.use(fileUpload());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'image_upload'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Upload Endpoint
app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let image = req.files.image;
    let uploadPath = path.join(__dirname, 'public/uploads/', image.name);

    image.mv(uploadPath, err => {
        if (err) {
            return res.status(500).send(err);
        }

        let sql = 'INSERT INTO images (filename) VALUES (?)';
        db.query(sql, [image.name], (err, result) => {
            if (err) throw err;
            res.send('File uploaded!');
        });
    });
});

// Get Images Endpoint
app.get('/images', (req, res) => {
    let sql = 'SELECT * FROM images';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
