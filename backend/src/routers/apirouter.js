const express = require('express');

const router = express.Router();

const authRouter = require('./authrouter');
const userRouter = require('./userrouter');
const adminRouter = require('./adminrouter');

router.use('/auth', authRouter);

router.use('/user', userRouter);

router.use('/admin', adminRouter);

router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));

module.exports = router;
