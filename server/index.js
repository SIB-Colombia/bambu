import SwaggerExpress from 'swagger-express-mw';
import swaggerUiMiddleware from 'swagger-ui-middleware';

import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import db from './db';
import middleware from './middleware';
// import api from './api';
import { config } from '../config/application-config';
import { logger } from './log';

const app = express();
app.use(compression());
const swaggerConfig = {
  appRoot: `${__dirname}/..`
};

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
  // app.use('/api', api());

  SwaggerExpress.create(swaggerConfig, (err, swaggerExpress) => {
    if (err) { throw err; }

    // install middleware
    swaggerExpress.register(app);

    swaggerUiMiddleware.hostUI(app, { path: '/api-doc', overrides: __dirname+'/swagger-ui' });

    app.use(express.static('api/swagger'));

    app.server.listen(config.get('server.port') || 5000);

    logger.info(`Started on port ${app.server.address().port}`);
  });
});

export default app;
