/* eslint-disable no-console */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

/**
   * Generates an access token for the given username
   * @param {object} user - {username: *}
   * @return {string} access token
   */
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
}

/**
 * Validate email address format
 * @param {string} email
 * @return {boolean} isValid
 */
function validateEmail(email) {
  // eslint-disable-next-line max-len
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

let OTPList = [
  { email: 'e0424619@u.nus.edu', otp: '990811', exp: 1911101657344 },
];

/**
 * Remove expired OTPs.
 */
function removeExpiredOTP() {
  OTPList = OTPList.filter((x) => x.exp > new Date().getTime());
}

/**
 * Generates a random 6-digit number as a string,
 * and remove expired otps
 * @param {string} email - email
 * @return {string} OTP
 */
function generateOTP(email) {
  removeExpiredOTP();
  const otp = ((x) => (x.length < 6 ? '0' * (6 - x.length) + x : x))(Math.floor(
    Math.random() * 1000000,
  ).toString());
  OTPList.push({
    email,
    otp,
    exp: new Date().getTime() + 1000 * 60 * 30, // 30 minutes after now
  });
  return otp;
}

/**
 * Validates the OTP.
 * @param {string} email
 * @param {string} otp
 * @return {boolean} validation result
 */
function testOTP(email, otp) {
  // return true;
  // console.log(OTPList);
  let res = false;
  OTPList.forEach((x) => {
    // console.log(x);
    if (x.email === email) {
      if (x.otp === otp) {
        res = true;
      }
    }
  });
  removeExpiredOTP();
  return res;
}

/**
 *
 * @param {string} to - receiver
 * @param {string} subject - subject
 * @param {string} text - text content
 */
async function sendEmail(to, subject, text) {
  // eslint-disable-next-line global-require
  const send = require('gmail-send')({
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASS,
    to,
    subject,
  });
  try {
    const { result } = await send({
      text,
    });
    console.log(result);
  } catch (error) {
    console.error('ERROR', error);
  }
}

const router = express.Router();

router.get('/', (req, res) => res.redirect(307, 'https://cs2102-doc.netlify.app/'));

router.get('/test', async (req, res) => {
  await sendEmail(process.env.EMAILTO, 'Test mail', 'hello from gmail');
  res.send('Done');
});

router.post('/getotp', (req, res) => {
  if (!req.body.email) {
    res.status(400).json({
      error: 'email not provided',
    });
    return;
  }
  if (!validateEmail(req.body.email)) {
    res.status(422).json({
      error: 'email validation failed',
      invalid_field: 'email',
    });
    return;
  }
  const otp = generateOTP(req.body.email);
  sendEmail(req.body.email, 'Your OTP for Pet-Anything', otp);
});

router.post('/user/register', async (req, res) => {
  try {
    if (
      !req.body.username
        || !req.body.email
        || !req.body.password
        || !req.body.otp
    ) {
      res.status(400).json({
        error: 'Request body missing required fields',
      });
      return;
    }
    if (testOTP(req.body.email, req.body.otp)) {
      // Todo: implement db function in /db/db.js
      const regRes = await db.functions.registerUser(
        req.body.username,
        req.body.email,
        req.body.password,
      );
      if (regRes.success) {
        res.json('success');
      } else {
        res.status(500).json({
          error: regRes.error,
        });
      }
      return;
    }
    res.status(403).json({
      error: 'wrong OTP',
    });
    return;
  } catch (error) { // error in registration
    res.status(500).json({
      error: error.toString(),
    });
  }
});

// POST /user/login?by=email/username
router.post('/user/login', async (req, res, next) => { // look up the user in db
  if (req.query.by === 'email') {
    if (!req.body.email) {
      res.status(400).json({
        error: 'Missing email',
      });
      return;
    }
    // Todo: implement db function in /db/db.js
    req.user = await db.functions.getUserByEmail(req.body.email);
  } else if (req.query.by === 'username') {
    if (!req.body.username) {
      res.status(400).json({
        error: 'Missing usernmae',
      });
      return;
    }
    req.user = await db.functions.getUserByUsername(req.body.username);
  } else {
    res.status(501).json({
      error: 'requested login method not supported',
    });
    return;
  }
  if (req.user === null) {
    res.status(404).json({
      error: 'username or email does not exist',
    });
    return;
  }
  next();
}, async (req, res, next) => { // user found, compare password here
  try {
    if (await bcrypt.compare(req.body.password, req.user.password)) {
      next();
    } else {
      res.status(403).json({
        error: 'Incorrect password',
      });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: 'unknown, devs are working on it...', // Nah, wont fix
    });
  }
}, async (req, res) => { // no error
  console.log(req.user);
  const user = { username: req.user.username };
  const accessToken = generateAccessToken(user);
  await db.functions.pushAccessToken(accessToken);
  res.json({
    access_token: accessToken,
  });
});

router.post('/user/logout', (req, res) => {
  db.functions.removeAccessToken(req.body.access_token, (err) => {
    if (err !== null) {
      // console.log("got err...")
      res.status(404).json({ error: err });
      return;
    }
    res.json('success');
  });
});

router.post('/user/fgtpswd', async (req, res) => {
  if (testOTP(req.body.email, req.body.otp)) {
    const newPassword = Math.random().toString(36).substring(2, 10); // 8dig str
    const rrr = await db.functions.changePassword(req.body.email, newPassword);
    if (rrr === 200) {
      sendEmail(req.body.email, 'Your Temporary Password for Pet-Anything', newPassword);
    } else if (rrr === 500) {
      res.status(500).json({
        error: 'Internal server error :<',
      });
    } else if (rrr === 404) {
      res.status(404).json({
        error: 'Not found',
      });
    }
  } else {
    res.status(403).json({
      error: 'Wrong OTP',
    });
  }
});

router.post('/user/updatepswd', async (req, res, next) => { // look up the user
  if (!req.body.email) {
    res.status(400).json({
      error: 'Missing email',
    });
    return;
  }
  req.user = await db.functions.getUserByEmail(req.body.email);
  if (req.user === null) {
    res.status(404).json({
      error: 'username or email does not exist',
    });
    return;
  }
  next();
}, async (req, res, next) => { // user found, compare password here
  try {
    if (await bcrypt.compare(req.body.old_password, req.user.password)) {
      next();
    } else {
      res.status(403).json({
        error: 'Incorrect password',
      });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: 'unknown, devs are working on it...', // Nah, wont fix
    });
  }
}, async (req, res) => {
  const rrr = db.functions.changePassword(
    req.body.email,
    req.body.new_password,
  );
  if (rrr === 200) {
    res.json('success');
  } else if (rrr === 500) {
    res.status(500).json({
      error: 'Internal server error',
    });
  } else if (rrr === 404) {
    res.status(404).json({
      error: 'Not found',
    });
  }
});

module.exports = router;
