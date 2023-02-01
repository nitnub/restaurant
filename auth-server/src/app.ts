require('module-alias/register');
import express from 'express';
// import userRouter from '@/routes/userRoute';
import userRouter from './routes/userRoute';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middleware/errorController';
import Logger from './libs/logger.js';
import cors from 'cors';
import unknownRoute from './middleware/unknownRoute';
import logRequests from './middleware/logRequests';

// Documentation
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from 'swagger.json';

const app = express();

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cookieParser());
app.use(logRequests);
// app.use(verifyUser);
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.ORIGIN_URL_1!,
      process.env.ORIGIN_URL_2!,
    ],
    // origin: ['http://localhost:3000', 'http://localhost:3001',],
  })
);

app.get('/ping', (req, res) => {
  console.log('pong');
  Logger.info('Regular logs will show in blue.');
  Logger.warn('Warnings will show in yellow.');
  Logger.error('Errors will show in red.');

  const refreshToken = req.cookies.refreshToken;

  res.status(200).json({
    status: 'Success',
    message: 'Pong',
    timeStamp: new Date().toUTCString(),
    refreshToken,
  });
});

app.use('/', userRouter);
app.use(globalErrorHandler);
app.use(unknownRoute);

export default app;
