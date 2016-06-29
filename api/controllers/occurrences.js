import elasticsearch from 'elasticsearch';
import { config } from '../../config/application-config';
const debug = require('debug')('dataportal-api:occurrences');

const client = new elasticsearch.Client({
  hosts: config.get('database.elasticSearch.url'),
  log: 'trace'
});

/*
  Returns count of occurrences according to query parameters

  Param 1: isGeoreferenced (boolean), if true returns the count of georeferenced occurrences
 */
function occurrenceCount(req, res) {
  const isGeoreferenced = {
    bool: {
      must: {
        exists: {
          field: 'location'
        }
      }
    }
  };

  const isNotGeoreferenced = {
    bool: {
      must_not: {
        exists: {
          field: 'location'
        }
      }
    }
  };

  const query = {
    query: {
      bool: {
        should: [isGeoreferenced]
      }
    }
  };

  const onlyGeoreferenced = req.swagger.params.isGeoreferenced.value || false;

  if (!onlyGeoreferenced) {
    query.query.bool.should.push(isNotGeoreferenced);
  }

  client.count({
    index: 'sibdataportal',
    type: 'occurrence',
    body: query
  }, (err, response) => {
    // this sends back a JSON response which is a single string
    res.json({
      count: response.count
    });
  });
}

module.exports = {
  occurrenceCount
};
