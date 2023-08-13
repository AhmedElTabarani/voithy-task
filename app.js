require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const swaggerUI = require('swagger-ui-express');
const specs = require('./swagger/swaggerSpecs');

const patientRouter = require('./routes/patient.routes');
const doctorRouter = require('./routes/doctor.routes');
const recordRouter = require('./routes/record.routes');

const AppError = require('./utils/AppError');

const {
  globalErrorHandler,
} = require('./middlewares/globalErrorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(cors());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/api/doctors', doctorRouter);
app.use('/api/patients', patientRouter);
app.use('/api/records', recordRouter);

app.use((req, res, next) => {
  next(
    new AppError(
      `Can not ${req.method} ${req.originalUrl}, Please checkout /api-docs`,
      501
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
