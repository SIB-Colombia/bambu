import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db';
import middleware from './middleware';
import api from './api';
import { config } from '../config/application-config';
import { logger } from './log';

const app = express();
app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
  exposedHeaders: ['Link']
}));

app.use(bodyParser.json({
  limit: '100kb'
}));

// connect to db
db(λ => {
  // internal middleware
  app.use(middleware());

  // api router
  app.use('/api', api());

  app.server.listen(config.get('server.port') || 5000);

  logger.info(`Started on port ${app.server.address().port}`);
});

export default app;
