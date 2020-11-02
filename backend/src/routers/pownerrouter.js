/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const express = require('express');
const auth = require('./auth');
const db = require('../db/powner');
// const { body, validationResult } = require('express-validator');

const router = express.Router();

// tested
router.get('/user', auth.authenticateToken, async (req, res) => {
  try {
    const user = await db.functions.getUserByUsername(req.user.username);
    res.status(200).json({ username: user.username, email: user.email });
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});
/*
router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));
Skip authentication: (req,res,next) => {req.user = 'kyle';next();},
*/

router.get('/pet', auth.authenticateToken, async (req, res) => {
  try {
    const insRes = await db.functions.getPets(req.user.username);
    res.status(200).json(insRes);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.post('/pet', auth.authenticateToken, async (req, res) => {
  const { name } = req.body;
  const { remark } = req.body;
  const { type } = req.body;

  if (typeof name !== 'string'
        || typeof remark !== 'string'
  ) {
    res.status(400);
    return;
  }
  try {
    await db.functions.insertPet(req.user.username, name, type, remark);
    res.status(204).json('success');
    return;
  } catch (err) {
    if (err.code === '23505') {
      res.status(500).json({ error: 'duplicate petname' });
      return;
    }
    res.status(500).json({ error: 'error' });
  }
});

router.put('/pet', auth.authenticateToken, async (req, res) => {
  const { name } = req.body;
  const { remark } = req.body;
  const { type } = req.body;

  if (typeof name !== 'string'
        || typeof remark !== 'string'
  ) {
    res.status(400);
    return;
  }
  try {
    await db.functions.changePet(req.user.username, name, type, remark);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.delete('/pet', auth.authenticateToken, async (req, res) => {
  try {
    const { petname } = req.query;

    // if (typeof petname !== 'string') {
    //   console.log("debug");
    //   res.status(400);
    //   return;
    // }
    // eslint-disable-next-line no-console
    console.log(`${petname} ${req.user.username}`);
    await db.functions.deletePet(req.user.username, petname);
    res.status(204).json('success');
    return;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.status(500).json({ error: 'error' });
  }
});

// pending test
router.get('/search', auth.authenticateToken, async (req, res) => {
  const petcat = req.query.petcategory;
  const stdate = req.query.startdate;
  const edate = req.query.enddate;

  try {
    const insRes = await db.functions.getService(petcat, stdate, edate);
    res.status(200).json(insRes);
    return;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.status(500).json({ error: 'error' });
  }
});

// tested
router.post('/order', auth.authenticateToken, async (req, res) => {
  const { caretakername } = req.body;
  const { petname } = req.body;
  // const { petcategory } = req.body;
  const { startdate } = req.body;
  const { enddate } = req.body;
  const { paymentmethod } = req.body;
  const { deliverymode } = req.body;
  const { username } = req.user;

  if (typeof startdate !== 'string'
        || typeof petname !== 'string'
        || typeof enddate !== 'string'
        // || typeof petcategory !== 'string'
        || typeof paymentmethod !== 'string'
        || typeof deliverymode !== 'string'
  ) {
    res.status(400).json('incorrect data format');
    return;
  }
  try {
    const pet = await db.functions.getThePet(username, petname);
    const { ptype } = pet[0];
    const { remark } = pet[0];
    // eslint-disable-next-line no-console
    console.log(ptype);

    await db.functions.insertBid(username, petname, caretakername, ptype,
      startdate, enddate, paymentmethod, deliverymode, remark);

    res.status(204).json('success');
    return;
  } catch (err) {
    if (err.code === '23505') {
      res.status(422).json('duplicate bid');
      return;
    }
    if (err.code === '23503' && err.constraint === 'orders_ctaker_ptype_fkey') {
      res.status(422).json('ctaker not allowed this pettype');
      return;
    }
    if (err.code === '23503') {
      res.status(422).json('pet not existing');
      return;
    }
    // eslint-disable-next-line no-console
    console.log(err);
    if (typeof err === 'object') {
      res.status(500).json({ error: 'cannot find the pet' });
      return;
    }
    res.status(500).json({ error: 'error' });
  }
});

// tested, a little different from API -> added powner and ptype, little confused about pricing
router.get('/order', auth.authenticateToken, async (req, res) => {
  const { include_history: includeHistory } = req.query;

  try {
    // eslint-disable-next-line no-console
    console.log(includeHistory);
    if (includeHistory) {
      const insRes = await db.functions.getAllBids(req.user.username);
      /* insRes.forEach((element) => {
        element.sdate = element.sdate.toISOString().split('T')[0];
        element.edate = element.edate.toISOString().split('T')[0];
      }); */
      res.status(200).json(insRes.map((element) => {
        const temp = element;
        temp.sdate = temp.sdate.toISOString().split('T')[0];
        temp.edate = temp.edate.toISOString().split('T')[0];
        return temp;
      }));
    } else {
      const insRes = await db.functions.getBidExceptStatus(req.user.username, 'Service Finished');
      /* insRes.forEach((element) => {
        element.sdate = element.sdate.toISOString().split('T')[0];
        element.edate = element.edate.toISOString().split('T')[0];
      }); */
      res.status(200).json(insRes.map((element) => {
        const temp = element;
        temp.sdate = temp.sdate.toISOString().split('T')[0];
        temp.edate = temp.edate.toISOString().split('T')[0];
        return temp;
      }));
    }

    return;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.status(500).json({ error: 'error' });
  }
});

router.delete('/bid', auth.authenticateToken, async (req, res) => {
  try {
    const { bidid } = req.body;
    await db.functions.deleteBid(bidid);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

// tested yayy
router.put('/order', auth.authenticateToken, async (req, res) => {
  const { petname } = req.body;
  const { caretakerusername } = req.body;
  const { startdate } = req.body;
  const { enddate } = req.body;
  const { rating } = req.body;
  const { feedback } = req.body;

  if (typeof rating !== 'number'
  || rating < 1
  || rating > 5
  // as many of the attributes are not limited to not null, not sure if gonna check
  ) {
    res.status(400).json('invalid rating');
    return;
  }
  try {
    await db.functions.changeBid(req.user.username, petname, caretakerusername,
      startdate, enddate, rating, feedback);
    res.status(204).json('success');
    return;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.status(500).json({ error: 'error' });
  }
});

// Tested
router.put('/pay', auth.authenticateToken, async (req, res) => {
  const { petname } = req.body;
  const { caretakerusername } = req.body;
  const { startdate } = req.body;
  const { enddate } = req.body;
  try {
    await db.functions.payOrder(req.user.username, petname, caretakerusername,
      startdate, enddate);
    res.status(204).json('success');
    return;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.status(500).json({ error: 'Order not exists' });
  }
});

module.exports = router;
