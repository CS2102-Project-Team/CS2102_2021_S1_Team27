const express = require('express');
const auth = require('./auth');
const db = require('../db/db');
const router = express.Router();

router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));
/*
router.post('/cards', auth.authenticateToken, async (req, res, next) => {
  const cardnumber = string(req.body.cardnumber);
  const cvv = string(req.body.cvv);
  const exp = string(req.body.exp);
  result = await db.functions.insertCard(cardnumber, cvv, exp, username);
});
*/
router.post('/cards', (req,res,next) => {req.user = 'kyle';next();}, async (req, res, next) => {
    const cardnumber = req.body.cardnumber;
    const cvv = req.body.cvv;
    const exp = req.body.exp;
    const username = req.user;
    
    if (typeof cardnumber !== 'string' || 
        typeof cvv !== 'string' ||
        typeof exp !== 'string'
    ) {
        res.status(400);
    }
    const insRes = await db.functions.insertCard(cardnumber, cvv, exp, username);
    if (insRes.success) {
        res.status(204).json('success');
    } else {
        res.status(500);
    }
  });
module.exports = router;
