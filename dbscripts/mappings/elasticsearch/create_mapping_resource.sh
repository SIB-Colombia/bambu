curl -XPUT "http://$ESDBHOST:9200/sibdataportal/_mapping/resource" -d '
{
  "resource": {
    "properties": {
      "id": {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched" : {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          }
        }
      },
      "name" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          },
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "title" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "description" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "intellectual_rights" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "citation" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "logo_url" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "publication_date": {
        "type": "date",
        "format": "YYYY-MM-dd||YYYY||YYYY-MM||dd/MM/YYYY||MM/YYYY||YYYY"
      },
      "gbif_package_id" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "alternate_identifier" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "language" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          },
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "keyword" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          },
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "keyword_thesaurus" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "hierarchy_level" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "collection_identifier" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          },
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "collection_name" :  {
        "type": "text",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "text",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "text",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "text",
            "analyzer": "spanish_search_analyzer"
          },
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "contact": {
        "type": "nested",
        "properties": {
          "id": {"type" : "integer"},
          "name" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "position_name" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "organization_name" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              },
              "keyword": {
                "type": "keyword"
              }
            }
          },
          "address" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "city" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              },
              "keyword": {
                "type": "keyword"
              }
            }
          },
          "administrative_area" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "country" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              },
              "keyword": {
                "type": "keyword"
              }
            }
          },
          "postal_code" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              },
              "keyword": {
                "type": "keyword"
              }
            }
          },
          "phone" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "email" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              },
              "keyword": {
                "type": "keyword"
              }
            }
          },
          "role" :  {
            "type": "text",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "text",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "text",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "text",
                "analyzer": "spanish_search_analyzer"
              }
            }
          }
        }
      }
    }
  }
}'
