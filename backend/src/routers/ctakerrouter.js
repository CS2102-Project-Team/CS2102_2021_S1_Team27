const express = require('express');
const auth = require('./auth');
const db = require('../db/ctaker');
// const { body, validationResult } = require('express-validator');

const router = express.Router();

/* Unfinished */
router.get('/', auth.authenticateToken, async (req, res) => {
  try {
    const rows = await db.functions.getCaretaker(req.user.username);
    if (rows.length === 0) {
      res.status(521).json({ error: 'User is not registered as a care taker' });
      return;
    }
    const results = {};
    results.type = (rows[0].fulltime) ? 'full time' : 'part time';
    results.rating = Number(rows[0].rating).toFixed(2);
    /* add more stuff */
    res.status(200).json(results);
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});
/*
router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));
Skip authentication: (req,res,next) => {req.user = 'kyle';next();},
*/

router.post('/', auth.authenticateToken, async (req, res) => {
  try {
    await db.functions.insertCaretaker(req.user.username);
    res.status(204).json('success');
    return;
  } catch (err) {
    if (err.code === '23505') {
      res.status(422).json({ error: 'already a caretaker' });
      return;
    }
    res.status(500).json('error');
  }
});

router.get('/petcategory', auth.authenticateToken, async (req, res) => {
  try {
    const inRes = await db.functions.getCategory(req.user.username);
    res.status(200).json(inRes);
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});

router.post('/petcategory', auth.authenticateToken, async (req, res) => {
  try {
    await db.functions.insertCategory(req.user.username, req.body.pettype, req.body.price);
    res.status(204).json('success');
    return;
  } catch (err) {
    if (err.code === '23505') {
      res.status(422).json({ error: 'already exists that category' });
      return;
    }
    res.status(500).json('error');
  }
});

router.put('/petcategory', auth.authenticateToken, async (req, res) => {
  try {
    await db.functions.updatePrice(req.user.username, req.body.pettype, req.body.price);
    res.status(204).json('success');
    return;
  } catch (err) {
    if (err.code === '23505') {
      res.status(422).json({ error: 'does not exist that category' });
      return;
    }
    res.status(500).json('error');
  }
});

router.delete('/petcategory', auth.authenticateToken, async (req, res) => {
  try {
    await db.functions.deleteCategory(req.user.username, req.query.pettype);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json('error');
  }
});

module.exports = router;
