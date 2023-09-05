const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');

const multer = require('multer'); // Middleware for handling file uploads

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', rejectUnauthenticated, (req, res) => {
    const SQLText = `SELECT image_data, first_name, last_name FROM info WHERE info.user_id = $1`;

    pool
        .query(SQLText, [req.user.id])
        .then(result => {
            res.send(result.rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
});

router.post('/', rejectUnauthenticated, upload.single('image'), async (req, res) => {
    try {
        // Access the binary data from req.file.buffer
        const imageBuffer = req.file.buffer;

        // Insert the binary data, firstName, and lastName into your database
        const SQLText = 'INSERT INTO "info" (image_data, first_name, last_name, user_id) VALUES ($1, $2, $3, $4)';
        await pool.query(SQLText, [imageBuffer, req.body.firstName, req.body.lastName, req.user.id]);

        res.sendStatus(201); // Success status code
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});


module.exports = router;