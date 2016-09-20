import elasticsearch from 'elasticsearch';
import Geohash from 'latlon-geohash';
import geojsonVt from 'geojson-vt';
import vtpbf from 'vt-pbf';
import { config } from '../../config/application-config';

// const debug = require('debug')('dataportal-api:occurrences');

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
    res.setHeader('Content-Type', 'application/json');
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
  let countAndQueries = 1;

  const from = ((req.swagger.params.page.value) ? req.swagger.params.page.value : 0)
    * ((req.swagger.params.size.value) ? req.swagger.params.size.value : 10);
  // Root query for ES
  const query = {
    from,
    size: (req.swagger.params.size.value) ? req.swagger.params.size.value : 10,
    query: {
      bool: {
        must: [
          {
            query_string: {
              query: '*'
            }
          }
        ]
      }
    },
    aggs: {}
  };

  // Check parameters for bounding box query
  if (req.swagger.params.latitudeTopLeft.value && req.swagger.params.longitudeTopLeft.value && req.swagger.params.latitudeBottomRight.value && req.swagger.params.longitudeBottomRight.value) {
    query.query.bool.filter = {
      geo_bounding_box: {
        location: {
          top_left: {
            lat: req.swagger.params.latitudeTopLeft.value,
            lon: req.swagger.params.longitudeTopLeft.value
          },
          bottom_right: {
            lat: req.swagger.params.latitudeBottomRight.value,
            lon: req.swagger.params.longitudeBottomRight.value
          }
        }
      }
    };
  }

  // If query general condition
  if (req.swagger.params.q.value) {
    query.query.bool.must[0].query_string.query = req.swagger.params.q.value;
  }

  // If wildcard queries
  if (req.swagger.params.scientificName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.scientificName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'canonical.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.kingdomName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.kingdomName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.kingdom_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.phylumName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.phylumName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.phylum_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.className.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.className.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.class_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.orderName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.orderName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.order_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.familyName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.familyName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.family_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.genusName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.genusName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.genus_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.speciesName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.speciesName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.species_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.specificEpithetName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.specificEpithetName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.specific_epithet.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.infraspecificEpithetName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.infraspecificEpithetName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.infraspecific_epithet.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.providerName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.providerName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'provider.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.resourceName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.resourceName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'resource.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.collectionName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.collectionName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'collection.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.institutionCode.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.institutionCode.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'institution.code.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.countryName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.countryName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'country_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.departmentName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.departmentName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'department_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.countyName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.countyName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'county_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.habitat.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.habitat.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'habitat.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.basisOfRecord.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.basisOfRecord.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'basis_of_record.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  // Query related with elevation
  if (req.swagger.params.elevationEqual.value || req.swagger.params.elevationGreaterOrEqualTo.value || req.swagger.params.elevationLessOrEqualTo.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    if (req.swagger.params.elevationEqual.value) {
      req.swagger.params.elevationEqual.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              term: {
                minimum_elevation: parseFloat(value)
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.elevationGreaterOrEqualTo.value) {
      req.swagger.params.elevationGreaterOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  gte: parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.elevationLessOrEqualTo.value) {
      req.swagger.params.elevationLessOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  lte: parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    countAndQueries += 1;
  }
  // Query related with depth
  if (req.swagger.params.depthEqual.value || req.swagger.params.depthGreaterOrEqualTo.value || req.swagger.params.depthLessOrEqualTo.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    if (req.swagger.params.depthEqual.value) {
      req.swagger.params.depthEqual.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              term: {
                minimum_elevation: -parseFloat(value)
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.depthGreaterOrEqualTo.value) {
      req.swagger.params.depthGreaterOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  lte: -parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.depthLessOrEqualTo.value) {
      req.swagger.params.depthLessOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  gte: -parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    countAndQueries += 1;
  }

  // If facets query param construct the query for ES
  if (req.swagger.params.facet.value) {
    req.swagger.params.facet.value.forEach((value) => {
      if (value === 'scientificName') {
        query.aggs.scientificName = {
          terms: {
            field: 'canonical.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'kingdom') {
        query.aggs.kingdom = {
          terms: {
            field: 'taxonomy.kingdom_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'phylum') {
        query.aggs.phylum = {
          terms: {
            field: 'taxonomy.phylum_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'class') {
        query.aggs.class = {
          terms: {
            field: 'taxonomy.class_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'order') {
        query.aggs.order = {
          terms: {
            field: 'taxonomy.order_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'family') {
        query.aggs.family = {
          terms: {
            field: 'taxonomy.family_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'genus') {
        query.aggs.genus = {
          terms: {
            field: 'taxonomy.genus_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'specie') {
        query.aggs.specie = {
          terms: {
            field: 'taxonomy.species_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'specific_epithet') {
        query.aggs.specific_epithet = {
          terms: {
            field: 'taxonomy.specific_epithet.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'infraspecific_epithet') {
        query.aggs.infraspecific_epithet = {
          terms: {
            field: 'taxonomy.infraspecific_epithet.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'country') {
        query.aggs.country = {
          terms: {
            field: 'country_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'department') {
        query.aggs.department = {
          terms: {
            field: 'department_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'county') {
        query.aggs.county = {
          terms: {
            field: 'county_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
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
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'basis_of_record') {
        query.aggs.basis_of_record = {
          terms: {
            field: 'basis_of_record.name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'collection_name') {
        query.aggs.collection_name = {
          terms: {
            field: 'collection.name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'provider_name') {
        query.aggs.provider_name = {
          terms: {
            field: 'provider.name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'resource_name') {
        query.aggs.resource_name = {
          terms: {
            field: 'resource.name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'institution_code') {
        query.aggs.institution_code = {
          terms: {
            field: 'institution.code.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
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
      res.status(400).json({
        message: 'Error searching occurrence data.',
        description: err.message
      });
    } else {
      // Create facets and results array
      const facets = [];
      const results = [];

      // Fill if aggregations exits
      if (response.aggregations) {
        Object.keys(response.aggregations).forEach((key) => {
          facets.push({
            field: key,
            counts: response.aggregations[key].buckets
          });
        });
      }

      // Fill if results exits
      if (response.hits.hits) {
        response.hits.hits.forEach((occurrence) => {
          results.push(occurrence._source);
        });
      }

      // this sends back a JSON response
      res.setHeader('Content-Type', 'application/json');
      res.json({
        offset: (req.swagger.params.page.value) ? req.swagger.params.page.value : 0,
        size: (req.swagger.params.size.value) ? req.swagger.params.size.value : 10,
        count: response.hits.total,
        facets,
        results
      });
    }
  });
}

/*
  Returns a grid with occurrence densities according to params request
 */
function gridSearch(req, res) {
  let countAndQueries = 1;

  // Root query for ES
  const query = {
    size: 0,
    query: {
      bool: {
        must: [
          {
            query_string: {
              query: '*'
            }
          }
        ]
      }
    },
    aggs: {
      occurrence_GeoHashGrid: {
        geohash_grid: {
          field: 'location',
          precision: req.swagger.params.precision.value || 5,
          size: 1000000
        }
      }
    }
  };

  // If query general condition
  if (req.swagger.params.q.value) {
    query.query.bool.must[0].query_string.query = req.swagger.params.q.value;
  }

  // If wildcard queries
  if (req.swagger.params.scientificName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.scientificName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'canonical.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.kingdomName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.kingdomName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.kingdom_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.phylumName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.phylumName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.phylum_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.className.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.className.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.class_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.orderName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.orderName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.order_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.familyName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.familyName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.family_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.genusName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.genusName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.genus_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.speciesName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.speciesName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.species_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.specificEpithetName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.specificEpithetName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.specific_epithet.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.infraspecificEpithetName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.infraspecificEpithetName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.infraspecific_epithet.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.providerName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.providerName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'provider.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.resourceName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.resourceName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'resource.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.collectionName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.collectionName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'collection.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.institutionCode.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.institutionCode.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'institution.code.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.countryName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.countryName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'country_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.departmentName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.departmentName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'department_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.countyName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.countyName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'county_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.habitat.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.habitat.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'habitat.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.basisOfRecord.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.basisOfRecord.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'basis_of_record.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  // Query related with elevation
  if (req.swagger.params.elevationEqual.value || req.swagger.params.elevationGreaterOrEqualTo.value || req.swagger.params.elevationLessOrEqualTo.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    if (req.swagger.params.elevationEqual.value) {
      req.swagger.params.elevationEqual.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              term: {
                minimum_elevation: parseFloat(value)
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.elevationGreaterOrEqualTo.value) {
      req.swagger.params.elevationGreaterOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  gte: parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.elevationLessOrEqualTo.value) {
      req.swagger.params.elevationLessOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  lte: parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    countAndQueries += 1;
  }
  // Query related with depth
  if (req.swagger.params.depthEqual.value || req.swagger.params.depthGreaterOrEqualTo.value || req.swagger.params.depthLessOrEqualTo.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    if (req.swagger.params.depthEqual.value) {
      req.swagger.params.depthEqual.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              term: {
                minimum_elevation: -parseFloat(value)
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.depthGreaterOrEqualTo.value) {
      req.swagger.params.depthGreaterOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  lte: -parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.depthLessOrEqualTo.value) {
      req.swagger.params.depthLessOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  gte: -parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    countAndQueries += 1;
  }

  client.search({
    index: 'sibdataportal',
    type: 'occurrence',
    body: query
  }, (err, response) => {
    if (err) {
      res.status(400).json({
        message: 'Error searching occurrence data.',
        description: err.message
      });
    } else {
      // Create results array

      const features = [];
      let higher = 1;
      let lower = 0;
      let logValueHigher = 1;
      let fillColor = req.swagger.params.color.value;
      const swgPrms = req.swagger.params;

      // Fill features data
      if (response.aggregations.occurrence_GeoHashGrid.buckets.length !== 0) {
        const occurrenceGeoHashGrid = response.aggregations.occurrence_GeoHashGrid;
        if (req.swagger.params.scale.value === 'linear') {
          higher = occurrenceGeoHashGrid.buckets[0].doc_count;
          lower = occurrenceGeoHashGrid.buckets[occurrenceGeoHashGrid.buckets.length - 1].doc_count;
        } else if (req.swagger.params.scale.value === 'logarithmic') {
          higher = occurrenceGeoHashGrid.buckets[0].doc_count;
          logValueHigher = Math.log10(higher);
        }

        Object.keys(occurrenceGeoHashGrid.buckets).forEach((key) => {
          const bounds = Geohash.bounds(occurrenceGeoHashGrid.buckets[key].key);

          let alpha = 0;
          if (req.swagger.params.scale.value === 'linear') {
            let p = (occurrenceGeoHashGrid.buckets[key].doc_count - lower) / (higher - lower);
            p = Math.min(p, 1);
            p = Math.max(p, 0);
            p = Math.pow(p, 0.5);
            alpha = 0.2 + (p * 0.60);
          } else if (req.swagger.params.scale.value === 'logarithmic') {
            let p = occurrenceGeoHashGrid.buckets[key].doc_count;
            p = Math.max(p, 21);
            p = Math.log10(p);
            alpha = (p * 0.8) / logValueHigher;
          }

          if (swgPrms.colorMethod.value === 'gradient' && swgPrms.scale.value === 'logarithmic') {
            alpha = 0.8;
            let p = occurrenceGeoHashGrid.buckets[key].doc_count;
            p = Math.max(p, 2);
            p = Math.log10(p);
            const colorGroup = Math.ceil((p * 12) / logValueHigher);
            switch (colorGroup) {
              case 1:
                fillColor = '#FFE8A5';
                break;
              case 2:
                fillColor = '#FDDC9E';
                break;
              case 3:
                fillColor = '#FBD198';
                break;
              case 4:
                fillColor = '#F9C592';
                break;
              case 5:
                fillColor = '#F7BA8B';
                break;
              case 6:
                fillColor = '#F5AF85';
                break;
              case 7:
                fillColor = '#F3A37F';
                break;
              case 8:
                fillColor = '#F19879';
                break;
              case 9:
                fillColor = '#EF8D72';
                break;
              case 10:
                fillColor = '#ED816C';
                break;
              case 11:
                fillColor = '#EB7666';
                break;
              case 12:
                fillColor = '#EA6B60';
                break;
              default:
                break;
            }
          }

          features.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [
                    bounds.sw.lon,
                    bounds.sw.lat
                  ],
                  [
                    bounds.sw.lon,
                    bounds.ne.lat
                  ],
                  [
                    bounds.ne.lon,
                    bounds.ne.lat
                  ],
                  [
                    bounds.ne.lon,
                    bounds.sw.lat
                  ],
                  [
                    bounds.sw.lon,
                    bounds.sw.lat
                  ]
                ]
              ]
            },
            properties: {
              stroke: '#555555',
              'stroke-width': 0,
              'stroke-opacity': 0,
              fill: fillColor,
              'fill-opacity': alpha,
              count: response.aggregations.occurrence_GeoHashGrid.buckets[key].doc_count,
              hash: response.aggregations.occurrence_GeoHashGrid.buckets[key].key
            }
          });
        });
      }

      // this sends back a JSON response
      res.setHeader('Content-Type', 'application/json');
      res.json({
        type: 'FeatureCollection',
        features
      });
    }
  });
}

/*
  Returns a grid with occurrence densities according to params request using
  vector tile format using protocol buffer
 */
function gridSearchPbf(req, res) {
  let countAndQueries = 1;

  // Root query for ES
  const query = {
    size: 0,
    query: {
      bool: {
        must: [
          {
            query_string: {
              query: '*'
            }
          }
        ]
      }
    },
    aggs: {
      occurrence_GeoHashGrid: {
        geohash_grid: {
          field: 'location',
          precision: req.swagger.params.precision.value || 5,
          size: 1000000
        }
      }
    }
  };

  // If query general condition
  if (req.swagger.params.q.value) {
    query.query.bool.must[0].query_string.query = req.swagger.params.q.value;
  }

  // If wildcard queries
  if (req.swagger.params.scientificName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.scientificName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'canonical.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.kingdomName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.kingdomName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.kingdom_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.phylumName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.phylumName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.phylum_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.className.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.className.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.class_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.orderName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.orderName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.order_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.familyName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.familyName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.family_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.genusName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.genusName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.genus_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.speciesName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.speciesName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.species_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.specificEpithetName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.specificEpithetName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.specific_epithet.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.infraspecificEpithetName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.infraspecificEpithetName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.infraspecific_epithet.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.providerName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.providerName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'provider.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.resourceName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.resourceName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'resource.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.collectionName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.collectionName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'collection.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.institutionCode.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.institutionCode.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'institution.code.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.countryName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.countryName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'country_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.departmentName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.departmentName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'department_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.countyName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.countyName.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'county_name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.habitat.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.habitat.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'habitat.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  if (req.swagger.params.basisOfRecord.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.basisOfRecord.value.forEach((value) => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'basis_of_record.name.exactWords': `*${value.toLowerCase()}*`
        }
      };
      counter += 1;
    });
    countAndQueries += 1;
  }
  // Query related with elevation
  if (req.swagger.params.elevationEqual.value || req.swagger.params.elevationGreaterOrEqualTo.value || req.swagger.params.elevationLessOrEqualTo.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    if (req.swagger.params.elevationEqual.value) {
      req.swagger.params.elevationEqual.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              term: {
                minimum_elevation: parseFloat(value)
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.elevationGreaterOrEqualTo.value) {
      req.swagger.params.elevationGreaterOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  gte: parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.elevationLessOrEqualTo.value) {
      req.swagger.params.elevationLessOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  lte: parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    countAndQueries += 1;
  }
  // Query related with depth
  if (req.swagger.params.depthEqual.value || req.swagger.params.depthGreaterOrEqualTo.value || req.swagger.params.depthLessOrEqualTo.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    if (req.swagger.params.depthEqual.value) {
      req.swagger.params.depthEqual.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              term: {
                minimum_elevation: -parseFloat(value)
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.depthGreaterOrEqualTo.value) {
      req.swagger.params.depthGreaterOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  lte: -parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    if (req.swagger.params.depthLessOrEqualTo.value) {
      req.swagger.params.depthLessOrEqualTo.value.forEach((value) => {
        query.query.bool.must[countAndQueries].bool.should[counter] = {
          constant_score: {
            filter: {
              range: {
                minimum_elevation: {
                  gte: -parseFloat(value)
                }
              }
            }
          }
        };
        counter += 1;
      });
    }
    countAndQueries += 1;
  }

  client.search({
    index: 'sibdataportal',
    type: 'occurrence',
    body: query
  }, (err, response) => {
    if (err) {
      res.status(400).json({
        message: 'Error searching occurrence data.',
        description: err.message
      });
    } else {
      // Create results array

      const features = [];
      let higher = 1;
      let lower = 0;
      let logValueHigher = 1;
      let fillColor = req.swagger.params.color.value;
      const swgPrms = req.swagger.params;

      // Fill features data
      if (response.aggregations.occurrence_GeoHashGrid.buckets.length !== 0) {
        const occurrenceGeoHashGrid = response.aggregations.occurrence_GeoHashGrid;
        if (req.swagger.params.scale.value === 'linear') {
          higher = occurrenceGeoHashGrid.buckets[0].doc_count;
          lower = occurrenceGeoHashGrid.buckets[occurrenceGeoHashGrid.buckets.length - 1].doc_count;
        } else if (req.swagger.params.scale.value === 'logarithmic') {
          higher = occurrenceGeoHashGrid.buckets[0].doc_count;
          logValueHigher = Math.log10(higher);
        }

        Object.keys(occurrenceGeoHashGrid.buckets).forEach((key) => {
          const bounds = Geohash.bounds(occurrenceGeoHashGrid.buckets[key].key);

          let alpha = 0;
          if (req.swagger.params.scale.value === 'linear') {
            let p = (occurrenceGeoHashGrid.buckets[key].doc_count - lower) / (higher - lower);
            p = Math.min(p, 1);
            p = Math.max(p, 0);
            p = Math.pow(p, 0.5);
            alpha = 0.2 + (p * 0.60);
          } else if (req.swagger.params.scale.value === 'logarithmic') {
            let p = occurrenceGeoHashGrid.buckets[key].doc_count;
            p = Math.max(p, 21);
            p = Math.log10(p);
            alpha = (p * 0.8) / logValueHigher;
          }

          if (swgPrms.colorMethod.value === 'gradient' && swgPrms.scale.value === 'logarithmic') {
            alpha = 0.8;
            let p = occurrenceGeoHashGrid.buckets[key].doc_count;
            p = Math.max(p, 2);
            p = Math.log10(p);
            const colorGroup = Math.ceil((p * 12) / logValueHigher);
            switch (colorGroup) {
              case 1:
                fillColor = '#FFE8A5';
                break;
              case 2:
                fillColor = '#FDDC9E';
                break;
              case 3:
                fillColor = '#FBD198';
                break;
              case 4:
                fillColor = '#F9C592';
                break;
              case 5:
                fillColor = '#F7BA8B';
                break;
              case 6:
                fillColor = '#F5AF85';
                break;
              case 7:
                fillColor = '#F3A37F';
                break;
              case 8:
                fillColor = '#F19879';
                break;
              case 9:
                fillColor = '#EF8D72';
                break;
              case 10:
                fillColor = '#ED816C';
                break;
              case 11:
                fillColor = '#EB7666';
                break;
              case 12:
                fillColor = '#EA6B60';
                break;
              default:
                break;
            }
          }

          features.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [
                    bounds.sw.lon,
                    bounds.sw.lat
                  ],
                  [
                    bounds.sw.lon,
                    bounds.ne.lat
                  ],
                  [
                    bounds.ne.lon,
                    bounds.ne.lat
                  ],
                  [
                    bounds.ne.lon,
                    bounds.sw.lat
                  ],
                  [
                    bounds.sw.lon,
                    bounds.sw.lat
                  ]
                ]
              ]
            },
            properties: {
              stroke: '#555555',
              'stroke-width': 0,
              'stroke-opacity': 0,
              fill: fillColor,
              'fill-opacity': alpha,
              count: response.aggregations.occurrence_GeoHashGrid.buckets[key].doc_count,
              hash: response.aggregations.occurrence_GeoHashGrid.buckets[key].key
            }
          });
        });
      }

      const tileIndex = geojsonVt({
        type: 'FeatureCollection',
        features
      });

      const tile = tileIndex.getTile(swgPrms.z.value, swgPrms.x.value, swgPrms.y.value);

      // pass in an object mapping layername -> tile object
      try {
        const buff = vtpbf.fromGeojsonVt({ geojsonLayer: tile });

        // this sends back a JSON response
        res.setHeader('Content-Type', 'application/octet-stream');
        res.end(buff, 'binary');
      } catch (error) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.end(null, 'binary');
        /* res.status(400).json({
          message: 'Error searching occurrence data.',
          description: error.message
        });*/
      }
    }
  });
}

module.exports = {
  occurrenceCount,
  search,
  gridSearch,
  gridSearchPbf
};
