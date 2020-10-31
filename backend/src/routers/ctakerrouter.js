/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
const express = require('express');
const auth = require('./auth');
const db = require('../db/ctaker');
// const { body, validationResult } = require('express-validator');

const router = express.Router();

/* Unfinished */
router.get('/', auth.authenticateToken, async (req, res) => {
  try {
    const rows = await db.functions.getCaretaker(req.user.username);
    const rows2 = await db.functions.getCategory(req.user.username);
    const rows3 = await db.functions.getPendingOrders(req.user.username);
    if (rows.length === 0) {
      res.status(521).json({ error: 'User is not registered as a care taker' });
      return;
    }
    /* rows3.forEach((element) => {
      element.startdate = element.startdate.toISOString().split('T')[0];
      element.enddate = element.enddate.toISOString().split('T')[0];
    }); */
    const results = {};
    results.type = (rows[0].fulltime) ? 'full time' : 'part time';
    results.rating = Number(rows[0].rating).toFixed(2);
    results.petcategory = (rows2);
    results.pendingorders = (rows3.map((element) => {
      element.startdate = element.startdate.toISOString().split('T')[0];
      element.enddate = element.enddate.toISOString().split('T')[0];
      return element;
    }));
    /* add more stuff */
    res.status(200).json(results);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.get('/reviews', auth.authenticateToken, async (req, res) => {
  try {
    const { caretakerusername } = req.body;
    if (!caretakerusername) {
      res.status(422).json({ error: 'No username' });
      return;
    }
    const inRes = await db.functions.getReviews(caretakerusername);
    res.status(200).json(inRes);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});
/*
router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));
Skip authentication: (req,res,next) => {req.user = 'kyle';next();},
*/

router.post('/', auth.authenticateToken, async (req, res) => {
  try {
    const { realname } = req.body;
    await db.functions.insertCaretaker(req.user.username, realname);
    res.status(204).json('success');
    return;
  } catch (err) {
    if (err.code === '23505') {
      res.status(422).json({ error: 'already a caretaker' });
      return;
    }
    res.status(500).json({ error: 'error' });
  }
});

router.get('/petcategory', auth.authenticateToken, async (req, res) => {
  try {
    const inRes = await db.functions.getCategory(req.user.username);
    res.status(200).json(inRes);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
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
    if (err.code === '23503' && err.constraint === 'looksafter_ctaker_fkey') {
      res.status(422).json({ error: 'not a caretaker' });
      return;
    }
    res.status(500).json({ error: 'error' });
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
    res.status(500).json({ error: 'error' });
  }
});

router.delete('/petcategory', auth.authenticateToken, async (req, res) => {
  try {
    await db.functions.deleteCategory(req.user.username, req.query.pettype);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.get('/orders', auth.authenticateToken, async (req, res) => {
  try {
    const inRes = await db.functions.getOrders(req.user.username);
    res.status(200).json(inRes.map((element) => {
      element.startdate = element.startdate.toISOString().split('T')[0];
      element.enddate = element.enddate.toISOString().split('T')[0];
      return element;
    }));
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

/* Unfinished */
router.get('/stats', auth.authenticateToken, async (req, res) => {
  try {
    const result = {};
    if (req.query.petday) {
      const inRes = await db.functions.getPetday(req.user.username);
      result.petday = inRes[0].sum ? inRes[0].sum : 0;
    }
    if (req.query.salary) {
      const inRes = await db.functions.getSalary(req.user.username);
      result.salary = inRes;
    }
    res.status(200).json(result);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.post('/orders', auth.authenticateToken, async (req, res) => {
  try {
    const { accept } = req.query;
    const { startdate } = req.body;
    const { enddate } = req.body;
    const { petname } = req.body;
    const { ownerusername } = req.body;
    let status = '';
    if (accept === 'true') {
      status = 'Pending Payment';
      const Res = await db.functions.checkFull(req.user.username, startdate, enddate);
      if (Res.length !== 0) {
        status = 'Rejected Bid';
        // eslint-disable-next-line max-len
        await db.functions.acceptRejectBid(req.user.username, startdate, enddate, ownerusername, petname, status);
        res.status(422).json('Exceed max pets allowed');
        return;
      }
    } else {
      status = 'Rejected Bid';
    }
    // eslint-disable-next-line max-len
    const inRes = await db.functions.acceptRejectBid(req.user.username, startdate, enddate, ownerusername, petname, status);
    res.status(200).json(inRes);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.get('/availability', auth.authenticateToken, async (req, res) => {
  try {
    const inRes = await db.functions.getAvailability(req.user.username);
    res.status(200).json(inRes.map((element) => {
      element.date = element.date.toISOString().split('T')[0];
      return element;
    }));
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.post('/availability', auth.authenticateToken, async (req, res) => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const element of req.body) {
      // eslint-disable-next-line
      // eslint-disable-next-line no-await-in-loop, eslint-disable-next-line max-len
      await db.functions.addAvailability(req.user.username, element.startdate, element.enddate);
    }
    res.status(200).json('success');
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

module.exports = router;
