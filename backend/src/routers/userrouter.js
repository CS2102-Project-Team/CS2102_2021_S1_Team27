const express = require('express');
const auth = require('./auth');
const db = require('../db/User Authentication/db');
const { user } = require('pg/lib/defaults');
// const { body, validationResult } = require('express-validator');

const router = express.Router();

// tested
router.get('/user', auth.authenticateToken, async (req, res) => {
  try {
    const user = await db.functions.getUserByUsername(req.user.username);
    res.status(200).json({
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.addres,
      realname: user.realname,
    });
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});

//tested
router.put('/user', auth.authenticateToken, async (req, res) => {
  try {
    const { phone } = req.body;
    const { address } = req.body;
    const { realname } = req.body;
    const insRes = await db.functions.updateUser(req.user.username, phone, address, realname);
    res.status(204).json('success');
  } catch (err) {
    res.status(500).json('error');
  }
});
/*
router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));
Skip authentication: (req,res,next) => {req.user = 'kyle';next();},
*/


//tested
router.get('/cards', auth.authenticateToken, async (req, res) => {
  try {
    const insRes = await db.functions.getCards(req.user.username);
    res.status(200).json(insRes);
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});

//tested
router.post('/cards', auth.authenticateToken, async (req, res) => {
  const { cardnumber } = req.body;
  const { cvv } = req.body;
  const { exp } = req.body;
  const { username } = req.user;

  if ((typeof cardnumber !== 'number' || (cardnumber % 1) !== 0)
        || typeof cvv !== 'string'
        || typeof exp !== 'string'
  ) {
    
    res.status(400);
    return;
  }
  try {
    console.log(username);
    const insRes = await db.functions.insertCard(cardnumber, cvv, exp, username);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});


//tested
router.delete('/cards', auth.authenticateToken, async (req, res) => {
  try {
    
    const cardnum  = req.query.cardnumber;
    // console.log(cardnum);
    const insRes = await db.functions.deleteCard(cardnum);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});

module.exports = router;
