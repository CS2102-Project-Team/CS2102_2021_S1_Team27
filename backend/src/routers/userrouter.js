const express = require('express');
const auth = require('./auth');
const db = require('../db/User Authentication/db');
// const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/user', auth.authenticateToken, async (req, res) => {
  try {
    const user = await db.functions.getUserByUsername(req.user.username);
    res.status(200).json({username: user.username, email: user.email});
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});
/*
router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));
Skip authentication: (req,res,next) => {req.user = 'kyle';next();},
*/

router.get('/cards', auth.authenticateToken, async (req, res) => {
  try {
    const insRes = await db.functions.getCards(req.user.username);
    res.status(200).json(insRes);
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});

router.post('/cards', auth.authenticateToken, async (req, res) => {
  const { cardnumber } = req.body;
  const { cvv } = req.body;
  const { exp } = req.body;
  const { username } = req.user;

  if (typeof cardnumber !== 'string'
        || typeof cvv !== 'string'
        || typeof exp !== 'string'
  ) {
    res.status(400);
    return;
  }
  try {
    const insRes = await db.functions.insertCard(cardnumber, cvv, exp, username);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});

router.delete('/cards', auth.authenticateToken, async (req, res) => {
  try {
    const { cardnumber } = req.body;
    const insRes = await db.functions.deleteCard(cardnumber);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});

module.exports = router;
