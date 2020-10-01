const express = require('express');
const auth = require('./auth');
const db = require('../db/db');
const router = express.Router();

router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));
router.post('/cards', auth.authenticateToken, async (req, res, next) => {
  const cardnumber = string(req.body.cardnumber);
  const cvv = string(req.body.cvv);
  const exp = string(req.body.exp);
  result = await db.functions.insertCard(cardnumber, cvv, exp, username);
});

module.exports = router;
