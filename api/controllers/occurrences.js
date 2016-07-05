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

/*
  Returns occurrences and facets data according to params request

  Param facet: type string, name of element used for aggregation
 */
function search(req, res) {
  // Root query for ES
  const query = {
    aggs: {}
  };

  // If facets query param construct the query for ES
  if (req.swagger.params.facet.value) {
    req.swagger.params.facet.value.forEach(value => {
      if (value === 'scientificName') {
        query.aggs.scientificName = {
          terms: {
            field: 'canonical.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'kingdom') {
        query.aggs.kingdom = {
          terms: {
            field: 'taxonomy.kingdom_name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'phylum') {
        query.aggs.phylum = {
          terms: {
            field: 'taxonomy.phylum_name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'class') {
        query.aggs.class = {
          terms: {
            field: 'taxonomy.class_name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'order') {
        query.aggs.order = {
          terms: {
            field: 'taxonomy.order_name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'family') {
        query.aggs.family = {
          terms: {
            field: 'taxonomy.family_name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'genus') {
        query.aggs.genus = {
          terms: {
            field: 'taxonomy.genus_name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'specie') {
        query.aggs.specie = {
          terms: {
            field: 'taxonomy.species_name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'specific_epithet') {
        query.aggs.specific_epithet = {
          terms: {
            field: 'taxonomy.specific_epithet.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'infraspecific_epithet') {
        query.aggs.infraspecific_epithet = {
          terms: {
            field: 'taxonomy.infraspecific_epithet.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'country') {
        query.aggs.country = {
          terms: {
            field: 'country_name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'department') {
        query.aggs.department = {
          terms: {
            field: 'department_name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'county') {
        query.aggs.county = {
          terms: {
            field: 'county_name.untouched',
            size: 10,
            shard_size: 100000
          },
          aggs: {
            department: {
              terms: {
                field: 'department_name.untouched',
                size: 10,
                shard_size: 100000
              }
            }
          }
        };
      }
      if (value === 'habitat') {
        query.aggs.habitat = {
          terms: {
            field: 'habitat.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'basis_of_record') {
        query.aggs.basis_of_record = {
          terms: {
            field: 'basis_of_record.name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'collection_name') {
        query.aggs.collection_name = {
          terms: {
            field: 'collection.name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'provider_name') {
        query.aggs.provider_name = {
          terms: {
            field: 'provider.name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'resource_name') {
        query.aggs.resource_name = {
          terms: {
            field: 'resource.name.untouched',
            size: 10,
            shard_size: 100000
          }
        };
      }
    });
    query.size = 0;
  }

  client.search({
    index: 'sibdataportal',
    type: 'occurrence',
    body: query
  }, (err, response) => {
    if (err) {
      res.status(400).json({ message: 'Error searching occurrence data.' });
    }

    // Create facets and results array
    const facets = [];
    const results = [];

    // Fill if aggregations exits
    if (response.aggregations) {
      Object.keys(response.aggregations).forEach(key => {
        facets.push({
          field: key,
          counts: response.aggregations[key].buckets
        });
      });
    }

    // Fill if results exits
    if (response.hits.hits) {
      response.hits.hits.forEach(occurrence => {
        results.push(occurrence._source);
      });
    }

    // this sends back a JSON response
    res.json({
      count: response.hits.total,
      facets,
      results
    });
  });
}

module.exports = {
  occurrenceCount,
  search
};
