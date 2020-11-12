require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const apiRouter = require('./routers/apirouter');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" <:body> :status :res[content-length] ":referrer" ":user-agent"'));

app.use('/api/v1', apiRouter);

app.get('/echo', (req, res) => {
  res.send({ header: req.headers, body: req.body });
});

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${PORT}`);
});

server.setTimeout(500000);
