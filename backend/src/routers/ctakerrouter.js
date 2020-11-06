/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
const express = require('express');
const auth = require('./auth');
const db = require('../db/ctaker');
// const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/', auth.authenticateToken, async (req, res) => {
  try {
    const rows = await db.functions.getCaretaker(req.user.username);
    const rows2 = await db.functions.getCategory(req.user.username);
    const rows3 = await db.functions.getPendingOrders(req.user.username);
    if (rows.length === 0) {
      res.status(521).json({ error: 'User is not registered as a care taker' });
      return;
    }

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
    const { caretakerusername } = req.query; // not params
    console.log(caretakerusername);
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
    const { pastorder } = req.query;
    const inRes = await db.functions.getOrders(req.user.username, pastorder);
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

router.put('/orders/payment', auth.authenticateToken, async (req, res) => {
  const { startdate } = req.body;
  const { enddate } = req.body;
  const { ownerusername } = req.body;
  const { petname } = req.body;
  const { received } = req.query;

  try {
    console.log(received);
    if (received === 'true') {
      await db.functions.updateOrder(ownerusername, petname, startdate, enddate);
    }
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.get('/stats', auth.authenticateToken, async (req, res) => {
  try {
    const result = {};
    if (req.query.petday) {
      // const inRes = await db.functions.getPetdayMonth(req.user.username, '2020-10');
      const inRes = await db.functions.getPetday(req.user.username);
      result.petday = inRes;
    }
    if (req.query.salary) {
      // const inRes = await db.functions.getSalaryMonth(req.user.username, fulltime, '2020-10');
      const inRes = await db.functions.getSalary(req.user.username);
      result.salary = inRes;
    }
    res.status(200).json(result);
    return;
  } catch (err) {
    res.status(500).json({ error: err });
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

/*
router.get('/reviews', auth.authenticateToken, async (req, res) => {
  try {
    const inRes = await db.functions.getReview(req.query.caretakerusername);
    res.status(200).json(inRes);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});
*/

router.get('/availability', auth.authenticateToken, async (req, res) => {
  try {
    const inRes = await db.functions.getAvailability(req.user.username);
    res.status(200).json(inRes.map((element) => {
      element = element.date.toISOString().split('T')[0];
      return element;
    }));
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.post('/availability-d-d', auth.authenticateToken, async (req, res) => {
  try {
    const promisesToAwait = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const element of req.body) {
      promisesToAwait.push(
        db.functions.addAvailabilityDup(req.user.username, element.startdate, element.enddate),
      );
    }
    await Promise.all(promisesToAwait);
    res.status(200).json('success');
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'error' });
  }
});

router.post('/availability-d', auth.authenticateToken, async (req, res) => {
  try {
    if (!req.body.startdate) {
      res.status(422).json('No startdate');
    }
    await db.functions.addAvailabilityDup(req.user.username, req.body.startdate, req.body.enddate);
    res.status(200).json('success');
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'error' });
  }
});

/**
router.post('/availability', auth.authenticateToken, async (req, res) => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const element of req.body) {
      // eslint-disable-next-line
      await db.functions.addAvailability(req.user.username, element.startdate, element.enddate);
    }
    res.status(200).json('success');
    return;
  } catch (err) {
    if (err.code === '23505') {
      res.status(422).json({ error: err.detail });
    } else {
      console.log(err);
      res.status(500).json({ error: 'error' });
    }
  }
});
*/

router.post('/leaves', auth.authenticateToken, async (req, res) => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const element of req.body) {
      // eslint-disable-next-line
      // eslint-disable-next-line no-await-in-loop, eslint-disable-next-line max-len
      if (await db.functions.checkclash(req.user.username, element.startdate, element.enddate) === 'true') {
        res.status(422).json({ error: 'time clash when leave' });
      }

      // eslint-disable-next-line no-await-in-loop
      const availability = await db.functions.getAvailability(req.user.username);
      const storage = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const a of availability) {
        const temp = new Date(a.date.getTime() + (1000 * 60 * 60 * 24));
        // eslint-disable-next-line max-len, no-empty
        if (temp >= new Date(new Date(element.startdate).getTime() + (1000 * 60 * 60 * 24)) && temp <= new Date(new Date(element.enddate).getTime() + (1000 * 60 * 60 * 24))) {

        } else {
          storage.push(temp);
        }
      }
      storage.sort((o1, o2) => o1 - o2);
      const results = [];
      let interval = 1;
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < storage.length - 1; i += 1) {
        // eslint-disable-next-line max-len
        // console.log(new Date(new Date(storage[index + 1]).valueOf() - 1000 * 3600 * 24).getTime() - datetemp.getTime() === 0);
        // eslint-disable-next-line max-len
        if (new Date(new Date(storage[i + 1]).valueOf() - 1000 * 3600 * 24).getTime() === storage[i].getTime()) {
          // console.log(new Date(storage[index + 1]) - datetemp);
          interval += 1;
        } else {
          results.push(interval);
          interval = 1;
        }
      }
      if (interval !== 0) {
        results.push(interval);
      }

      let count = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const duration of results) {
        console.log(duration);
        if (duration >= 150) {
          count += 1;
        }
      }

      if (count < 2) {
        res.status(423).json({ error: 'leave application cannot meet the 2 consequtive 150 working days requirement' });
      }

      // eslint-disable-next-line no-await-in-loop
      await db.functions.addLeave(req.user.username, element.startdate, element.enddate);
    }
    res.status(200).json('success');
    return;
  } catch (err) {
    if (err.code === '23505') {
      res.status(422).json({ error: 'Sorry, the application already exists' });
    } else {
      console.log(err);
      res.status(500).json({ error: 'error' });
    }
  }
});

router.get('/leaves', auth.authenticateToken, async (req, res) => {
  try {
    const inRes = await db.functions.getLeave(req.user.username);
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

module.exports = router;
