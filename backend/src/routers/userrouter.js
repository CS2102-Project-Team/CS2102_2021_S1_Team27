const express = require('express');
const auth = require('./auth');
const db = require('../db/db');
//const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));
/*
Skip authentication: (req,res,next) => {req.user = 'kyle';next();},
*/

router.post('/cards', auth.authenticateToken, async (req, res) => {
  const cardnumber = req.body.cardnumber;
  const cvv = req.body.cvv;
  const exp = req.body.exp;
  const username = req.user;

  if (typeof cardnumber !== 'string' || 
        typeof cvv !== 'string' ||
        typeof exp !== 'string'
  ) {
    res.status(400);
    return;
  }
  try {
    const insRes = await db.functions.insertCard(cardnumber, cvv, exp, username);
    res.status(204).json('success');
    return;
  } catch(err) {
    console.log(err);
    res.status(500).json('error');
    return;
  }
});
module.exports = router;
