// Dependencies
import convict from 'convict';
import util from 'util';

const debug = require('debug')('dataportal-api:configuration');
const path = require('path');

export const config = convict({
  appRoot: {
    doc: 'Application root folder.',
    default: `${__dirname}/..`
  },
  env: {
    doc: 'Application environment.',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV'
  },
  service: {
    name: {
      doc: 'The name of your service/platform.',
      default: 'Dataportal API Services',
      env: 'SERVICE_NAME'
    }
  },
  logs: {
    doc: 'Log save location',
    default: 'logs/dataportal-api.log',
    env: 'LOG'
  },
  server: {
    port: {
      doc: 'The server port to bind.',
      format: 'port',
      default: 5000,
      env: 'BAMBU_API_PORT'
    }
  },
  database: {
    elasticSearch: {
      url: {
        doc: 'ElasticSearch url to connect to (including db reference)',
        default: ['localhost:9200'],
        env: 'ELASTICSEARCH_URL'
      }
    }
  }
}).loadFile(path.join(__dirname, 'config.json')).validate();

// catch all error without handler
process.on('uncaughtException', error => {
  debug(`Caught exception without specific handler: ${util.inspect(error)}`);
  debug(error.stack, 'error');
  process.exit(1);
});

// print the environment for debugging
debug(util.inspect(process.env, {
  colors: true
}));

// perform the config validation
config.validate();

debug('Configuration file loaded successfully.');
