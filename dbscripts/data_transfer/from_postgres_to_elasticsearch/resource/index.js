'use strict';

// Import required libraroes
var pg = require('pg');
var _ = require('lodash');
var async = require('async');
var elasticsearch = require('elasticsearch');

var conString = 'postgres://'+process.env.POSTGRES_USER+':'+process.env.POSTGRES_PASSWORD+'@'+process.env.POSTGRES_SERVER+'/dataportal';

var clientElastic = new elasticsearch.Client({
  host: process.env.ESDBHOST+':9200'
});

var client = new pg.Client(conString);

function fixDate(date) {
  var day = new Date(date).getDate();
  var month = new Date(date).getMonth();
  var year = new Date(date).getFullYear();

  if(day < 1) {
    day = 1;
  }
  if(month < 1) {
    month = 1;
  } else if(month > 12) {
    month = 12;
  }

  if (day > 28 && month == 2) {
    day = 28;
  }
  if (day > 31 && (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)) {
    day = 31;
  }
  if (day > 30 && (month == 4 || month == 6 || month == 9 || month == 11)) {
    day = 30;
  }
  return year+'-'+month+'-'+day;
}

client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT \
    "public"."dwca_resource"."id" AS id, \
    "public"."dwca_resource"."name" AS name, \
    "public"."resource_metadata"."gbif_package_id" AS gbif_package_id, \
    "public"."resource_metadata"."alternate_identifier" AS alternate_identifier, \
    "public"."resource_metadata"."title" AS title, \
    "public"."resource_metadata"."publication_date" AS publication_date, \
    "public"."resource_metadata"."language" AS language, \
    "public"."resource_metadata"."_abstract" AS resource_description, \
    "public"."resource_metadata"."keyword" AS keyword, \
    "public"."resource_metadata"."keyword_thesaurus" AS keyword_thesaurus, \
    "public"."resource_metadata"."intellectual_rights" AS intellectual_rights, \
    "public"."resource_metadata"."citation" AS citation, \
    "public"."resource_metadata"."hierarchy_level" AS hierarchy_level, \
    "public"."resource_metadata"."resource_logo_url" AS logo_url, \
    "public"."resource_metadata"."parent_collection_identifier", \
    "public"."resource_metadata"."collection_identifier" AS collection_identifier, \
    "public"."resource_metadata"."collection_name" \
    FROM "public"."dwca_resource" \
    JOIN "public"."resource_metadata" ON "public"."dwca_resource"."id" = "public"."resource_metadata"."dwca_resource_id"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    var resource = {};
    async.eachSeries(result.rows, function(n,callback) {
      async.series({
        fillInitialData: function(callback) {
          var parsedAndFixedDate = fixDate(n.publication_date);
          resource = {
            id: n.id,
            name: n.name,
            title: n.title,
            description: n.resource_description,
            intellectual_rights: n.jerarquianombrescomunes,
            citation: n.citation,
            logo_url: n.logo_url,
            publication_date: parsedAndFixedDate,
            gbif_package_id: n.gbif_package_id,
            alternate_identifier: n.alternate_identifier,
            language: n.language,
            keyword: n.keyword,
            keyword_thesaurus: n.keyword_thesaurus,
            hierarchy_level: n.hierarchy_level,
            collection_identifier: n.collection_identifier,
            collection_name: n.collection_name
          };
          callback();
        },
        getContactData: function(callback) {
          client.query('SELECT \
            "public"."contact"."auto_id" AS id_contact, \
            "public"."contact"."name" AS name, \
            "public"."contact"."position_name" AS position_name, \
            "public"."contact"."organization_name" AS organization_name, \
            "public"."contact"."address" AS address, \
            "public"."contact"."city" AS city, \
            "public"."contact"."administrative_area" AS administrative_area, \
            "public"."contact"."country" AS country, \
            "public"."contact"."postal_code" AS postal_code, \
            "public"."contact"."phone" AS phone, \
            "public"."contact"."email" AS email, \
            "public"."contact"."role" AS role, \
            "public"."contact"."publisher_fkey", \
            "public"."contact"."resource_metadata_fkey" \
            FROM \
            "public"."contact" \
            WHERE \
            "public"."contact"."resource_metadata_fkey" = '+n.id, function(err, result) {
            if((typeof result !== 'undefined')) {
              if(result.rows.length > 0) {
                resource.contact = [];
                _.forEach(result.rows, function(n2,key2) {
                  resource.contact[key2] = {
                    id: n2.id_contact,
                    name: n2.name,
                    position_name: n2.position_name,
                    organization_name: n2.organization_name,
                    address: n2.address,
                    city: n2.city,
                    administrative_area: n2.administrative_area,
                    country: n2.country,
                    postal_code: n2.postal_code,
                    phone: n2.phone,
                    email: n2.email,
                    role: n2.role
                  };
                });
              }
            }
            callback();
          });
        },
        saveToElasticSearch: function(callback) {
          if((typeof resource !== 'undefined')) {
            clientElastic.create({
              index: 'sibdataportal',
              type: 'resource',
              body: resource
            }, function (error, response) {
              if(error) {
                console.log(error);
              }
              callback();
            });
          } else {
            callback();
          }
        }
      }, function(err) {
        if(err) {
          console.log("Error saving data");
        } else {
          // Continue data processing
          //console.log(ficha);
          callback();
        }
      })
    }, function(err) {
      if(err) {
        console.log("Error saving data");
      } else {
        console.log("Catalog info saved successfully");
        client.end();
      }
    });
  });
});
