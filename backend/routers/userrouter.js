const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));

module.exports = router;
