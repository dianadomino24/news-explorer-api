const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { routerIndex } = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');
const { MONGO_DEV_URL } = require('./config');
const limiter = require('./utils/rate-limiter');

const app = express();
const { PORT = 3000, MONGO_URL } = process.env;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL || MONGO_DEV_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const allowedOrigins = [
  'https://dianadomino24.github.io',
  'https://news-explorer-diana.students.nomoreparties.xyz',
  'https://www.news-explorer-diana.students.nomoreparties.xyz',
];

app.use(cors({
  origin(origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not '
                + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));
// app.use(cors());

// app.use((req, res, next) => {
//   const { origin } = req.headers;

//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   next();
// });

// app.use('*', cors({
//   origin: ['https://dianadomino24.github.io'],
//   credentials: true,
// }));

// app.options('*', cors());

app.use(requestLogger);

app.use(limiter);

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
