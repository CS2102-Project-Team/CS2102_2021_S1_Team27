const express = require('express');
const auth = require('./auth');
const db = require('../db/Admin');
const dbct = require('../db/ctaker');
// const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post('/promote', auth.authenticateAdminToken, async (req, res) => {
  try {
    const { caretaker } = req.body;
    // await dbadjs.query('BEGIN');
    // const queryText = 'UPDATE caretakers SET fulltime=true, maxpets=5 WHERE username = $1';
    // await dbadjs.query(queryText, [caretaker]);
    // eslint-disable-next-line max-len
    // const queryText2 = 'INSERT INTO looksafter(ctaker, price, ptype) SELECT $1, 0, ptype FROM pettypes';
    // await dbadjs.query(queryText2, [caretaker]);
    // const queryText3 = 'SELECT update_price_f(ptype) FROM pettypes';
    // await dbadjs.query(queryText3);
    // await dbadjs.query('COMMIT');
    await db.functions.promotePartime(caretaker);
    // await db.functions.promotePartimeStep2(caretaker);
    // await db.functions.promotePartimeStep3(caretaker);
    // await db.functions.insertAvailability(caretaker, '2020-10-01', '2021-12-31');
    // await db.functions.updatePriceforFulltimer(caretaker);
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get('/user', auth.authenticateAdminToken, async (req, res) => {
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

/*
router.get('/cards', auth.authenticateAdminToken, async (req, res) => {
  try {
    const insRes = await db.functions.getCards(req.user.username);
    res.status(200).json(insRes);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
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
*/

router.get('/', auth.authenticateAdminToken, async (req, res) => {
  try {
    const adminInfo = await db.functions.getAdminByUsername(req.user.username);
    res.status(200).json({ username: adminInfo.username, email: adminInfo.email });
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.get('/price', auth.authenticateAdminToken, async (req, res) => {
  try {
    const prices = await db.functions.getFullTimePrices();
    res.status(200).json(prices);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

// insert or update
router.put('/price', auth.authenticateAdminToken, async (req, res) => {
  const { category } = req.body;
  const { classes } = req.body;
  const { price } = req.body;

  if (typeof category !== 'string'
        || typeof classes !== 'number'
        || typeof price !== 'number'
  ) {
    res.sendStatus(400);
    return;
  }
  try {
    if (classes === 1) {
      await db.functions.insertFullTimePrice1(category, price);
    } else if (classes === 2) {
      await db.functions.insertFullTimePrice2(category, price);
    } else {
      await db.functions.insertFullTimePrice3(category, price);
    }
    res.status(204).json('success');
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.get('/leave', auth.authenticateAdminToken, async (req, res) => {
  try {
    const leave = await db.functions.getLeave();
    // eslint-disable-next-line no-var, no-restricted-syntax, vars-on-top
    for (var temp of leave) {
      // eslint-disable-next-line no-await-in-loop
      if (await db.functions.checkclash(temp.caretakerusername, temp.startdate, temp.enddate) === 'true') {
        temp.clash = 'true';
      } else {
        temp.clash = 'false';
      }
    }
    leave.map((element) => {
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      element.startdate = element.startdate.toISOString().split('T')[0];
      // eslint-disable-next-line no-param-reassign, prefer-destructuring
      element.enddate = element.enddate.toISOString().split('T')[0];
      return element;
    });
    res.status(200).json(leave);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.put('/leave', auth.authenticateAdminToken, async (req, res) => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    const { caretakerusername } = req.body;
    const { startdate } = req.body;
    const { enddate } = req.body;
    const { approve } = req.body;
    // eslint-disable-next-line
    if (approve === true) {
      // eslint-disable-next-line no-await-in-loop, max-len
      await db.functions.updateLeaveStatus(caretakerusername, startdate,
        enddate, 'approved');
    } else {
      await db.functions.updateLeaveStatus(caretakerusername, startdate,
        enddate, 'rejected');
    }
    res.status(200).json('success');
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.get('/caretakers', auth.authenticateAdminToken, async (req, res) => {
  try {
    const inRes = await db.functions.getAllCaretaker();
    // eslint-disable-next-line no-restricted-syntax, no-var, vars-on-top
    for (var element of inRes) {
      // eslint-disable-next-line no-await-in-loop
      element.salary = await dbct.functions.getSalary(element.username);
    }
    res.status(200).json(inRes);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.get('/petowners', auth.authenticateAdminToken, async (req, res) => {
  try {
    const inRes = await db.functions.getAllPetowners();
    inRes.map((element) => {
      // eslint-disable-next-line radix, no-param-reassign
      element.deals = parseInt(element.deals);
      // eslint-disable-next-line radix, no-param-reassign
      element.spending = parseInt(element.spending);
      return element;
    });
    res.status(200).json(inRes);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.get('/service', auth.authenticateAdminToken, async (req, res) => {
  try {
    const { from } = req.query;
    const { to } = req.query;
    const start = new Date(from);
    const end = new Date(to);
    // // eslint-disable-next-line no-var
    // const fromMonth = from.substring(5);
    // const toMonth = to.substring(5);
    // // eslint-disable-next-line radix
    // let fromIntMonth = parseInt(fromMonth);
    // // eslint-disable-next-line radix
    // const toIntMonth = parseInt(toMonth);
    // const fromYear = from.substring(0, 4);
    // const toYear = to.substring(0, 4);
    // // eslint-disable-next-line radix
    // const fromIntYear = parseInt(fromYear);
    // // eslint-disable-next-line radix
    // const toIntYear = parseInt(toYear);
    // if (fromIntYear !== toIntYear) {
    //   res.status(422).json({ error: 'Please enter the range within the current year' });
    // }
    const Res = [];
    while (start <= end) {
      const result = {};
      const pethour = {};
      // eslint-disable-next-line prefer-template, quotes
      // const curr = fromYear + "-" + fromIntMonth.toString();
      // eslint-disable-next-line no-plusplus
      const dateString = start.toISOString().substring(0, 7);
      // eslint-disable-next-line no-await-in-loop
      const type = await db.functions.getPetType();

      result.month = dateString;

      // eslint-disable-next-line no-restricted-syntax
      for (const t of type) {
        // eslint-disable-next-line no-await-in-loop
        const number = await dbct.functions.getPetdayByPet(t.ptype, dateString);
        const name = t.ptype; // cat , dog, fish
        // console.log(t.ptype, dateString, number);
        pethour[name] = number;
      }
      // pethour.cat = catN;
      // pethour.dog = dogN;
      // pethour.fish = fishN;
      result.pethour = pethour;
      Res.push(result);
      start.setMonth(start.getMonth() + 1);
    }
    res.status(200).json(Res);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

router.get('/revenue', auth.authenticateAdminToken, async (req, res) => {
  try {
    const { from } = req.query;
    const { to } = req.query;
    const start = new Date(from);
    const end = new Date(to);
    // // eslint-disable-next-line no-var
    // const fromMonth = from.substring(5);
    // const toMonth = to.substring(5);
    // // eslint-disable-next-line radix
    // let fromIntMonth = parseInt(fromMonth);
    // // eslint-disable-next-line radix
    // const toIntMonth = parseInt(toMonth);
    // const fromYear = from.substring(0, 4);
    // const toYear = to.substring(0, 4);
    // // eslint-disable-next-line radix
    // const fromIntYear = parseInt(fromYear);
    // // eslint-disable-next-line radix
    // const toIntYear = parseInt(toYear);
    // if (fromIntYear !== toIntYear) {
    //   res.status(422).json({ error: 'Please enter the range within the current year' });
    // }
    const Res = [];
    while (start <= end) {
      const result = {};
      // eslint-disable-next-line prefer-template, quotes
      // const curr = fromYear + "-" + fromIntMonth.toString();
      // // eslint-disable-next-line no-plusplus
      // fromIntMonth++;
      const dateString = start.toISOString().substring(0, 7);
      // eslint-disable-next-line no-await-in-loop
      const income = await dbct.functions.getAllTotalOrderAmountMonth(dateString);
      // eslint-disable-next-line no-await-in-loop
      const ctakers = await db.functions.getAllCaretaker();
      // console.log(ctakers);
      let salary = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const temp of ctakers) {
        // eslint-disable-next-line no-await-in-loop, no-unused-vars
        salary += await dbct.functions.getSalaryMonth(temp.username, dateString);
      }
      result.month = dateString;
      result.income = income;
      result.salary = salary;
      result.revenue = income - salary;
      Res.push(result);
      start.setMonth(start.getMonth() + 1);
    }
    res.status(200).json(Res);
    return;
  } catch (err) {
    res.status(500).json({ error: 'error' });
  }
});

module.exports = router;
