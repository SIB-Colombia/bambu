curl -XPUT "http://$ESDBHOST:9200/sibdataportal/_mapping/resource" -d '
{
  "resource": {
    "properties": {
      "id": {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched" : {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          }
        }
      },
      "name" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "title" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "description" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "intellectual_rights" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "citation" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "logo_url" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "publication_date": {
        "type": "date",
        "format": "YYYY-MM-dd||YYYY||YYYY-MM||dd/MM/YYYY||MM/YYYY||YYYY"
      },
      "gbif_package_id" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "alternate_identifier" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "language" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "keyword" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "keyword_thesaurus" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "hierarchy_level" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "collection_identifier" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "collection_name" :  {
        "type": "string",
        "index": "analyzed",
        "fields" : {
          "untouched": {
            "type": "string",
            "index": "not_analyzed"
          },
          "exactWords": {
            "type": "string",
            "analyzer": "string_lowercase"
          },
          "spanish": {
            "type": "string",
            "analyzer": "spanish_search_analyzer"
          }
        }
      },
      "contact": {
        "type": "nested",
        "properties": {
          "id": {"type" : "integer"},
          "name" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "position_name" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "organization_name" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "address" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "city" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "administrative_area" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "country" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "postal_code" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "phone" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "email" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          },
          "role" :  {
            "type": "string",
            "index": "analyzed",
            "fields" : {
              "untouched": {
                "type": "string",
                "index": "not_analyzed"
              },
              "exactWords": {
                "type": "string",
                "analyzer": "string_lowercase"
              },
              "spanish": {
                "type": "string",
                "analyzer": "spanish_search_analyzer"
              }
            }
          }
        }
      }
    }
  }
}'
