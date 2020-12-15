const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { routerIndex } = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const allowedOrigins = [
  'https://news-explorer-diana.students.nomoreparties.xyz',
  'https://www.news-explorer-diana.students.nomoreparties.xyz',
];
app.use(cors());

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

app.options('*', cors());

app.use(requestLogger);

app.use('/', routerIndex);
app.use(errorLogger);

// Централизованная обработка ошибок
app.use(errors());

app.use(() => {
  throw new NotFoundError('The requested resource is not found');
});

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message || 'Sorry, some error on server.' });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
