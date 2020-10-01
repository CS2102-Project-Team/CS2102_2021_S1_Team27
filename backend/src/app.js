require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const apiRouter = require('./routers/apirouter');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use(cors());
app.use('/api/v1', apiRouter);

app.get('/echo', (req, res) => {
  res.send({ header: req.headers, body: req.body });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${PORT}`);
});
