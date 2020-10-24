const express = require('express');
const auth = require('./auth');
const db = require('../db/Admin');
// const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post('/promote', auth.authenticateAdminToken, async (req, res) => {
  try {
    const { caretaker } = req.body;
    await db.functions.promotePartime(caretaker);
    await db.functions.insertAvailability(caretaker, '2020-10-01', '2021-12-31');
    // await db.functions.updatePriceforFulltimer(caretaker);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});

router.get('/user', auth.authenticateAdminToken, async (req, res) => {
  try {
    const user = await db.functions.getUserByUsername(req.user.username);
    res.status(200).json({ username: user.username, email: user.email });
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});
/*
router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));
Skip authentication: (req,res,next) => {req.user = 'kyle';next();},
*/

router.get('/cards', auth.authenticateAdminToken, async (req, res) => {
  try {
    const insRes = await db.functions.getCards(req.user.username);
    res.status(200).json(insRes);
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});

router.post('/cards', auth.authenticateAdminToken, async (req, res) => {
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
    await db.functions.insertCard(cardnumber, cvv, exp, username);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

module.exports = router;
