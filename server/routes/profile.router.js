const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const multer = require('multer'); // Middleware for handling file uploads

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', rejectUnauthenticated, async (req, res) => {
    try {
        const SQLText = `SELECT id, image_data, first_name, last_name FROM info WHERE info.user_id = $1`;
        const result = await pool.query(SQLText, [req.user.id]);
        res.send(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});


router.post('/', rejectUnauthenticated, upload.single('image'), async (req, res) => {
    try {
        // Access the binary data from req.file.buffer
        const imageBuffer = req.file.buffer;

        // Insert the binary data, firstName, and lastName into database
        const SQLText =
            'INSERT INTO "info" (image_data, first_name, last_name, user_id) VALUES ($1, $2, $3, $4)';
        await pool.query(SQLText, [
            imageBuffer,
            req.body.firstName,
            req.body.lastName,
            req.user.id,
        ]);

        res.sendStatus(201); // Success status code
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.put('/:id', rejectUnauthenticated, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName } = req.body;
        let imageBuffer = null;

        if (req.file) {
            // If a new avatar image is provided in the request, access the binary data
            imageBuffer = req.file.buffer;
        }

        // Update the avatar image data, firstName, and lastName in database
        const SQLText = `
      UPDATE "info"
      SET image_data = COALESCE($1, image_data), first_name = $2, last_name = $3
      WHERE id = $4 AND user_id = $5;
    `;

        await pool.query(SQLText, [imageBuffer, firstName, lastName, id, req.user.id]);

        res.sendStatus(200); // Success status code
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

module.exports = router;