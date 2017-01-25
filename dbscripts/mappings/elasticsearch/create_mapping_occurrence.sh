curl -XPUT "http://$ESDBHOST:9200/sibdataportal/" -d '
{
	"index": {
		"analysis": {
			"filter": {
				"nGram_filter": {
					"type": "nGram",
					"min_gram": 2,
					"max_gram": 20,
					"token_chars": [
						"letter",
						"digit",
						"punctuation",
						"symbol"
					]
				},
				"snowball_spanish": {
					"type": "snowball",
					"language": "Spanish"
				},
				"stopwords": {
					"type": "stop",
					"stopwords": "_spanish_"
				},
				"worddelimiter": {
					"type": "word_delimiter"
				},
				"my_shingle_filter": {
					"type": "shingle",
					"min_shingle_size": "2",
					"max_shingle_size": "5",
					"output_unigrams": "false",
					"output_unigrams_if_no_shingles": "false"
				},
				"my_ascii_folding": {
					"type" : "asciifolding",
					"preserve_original": true
				},
				"spanish_stop": {
          "type": "stop",
          "stopwords": "_spanish_"
        },
        "spanish_stemmer": {
          "type": "stemmer",
          "language": "light_spanish"
        }
			},
			"analyzer": {
				"nGram_analyzer": {
					"type": "custom",
					"tokenizer": "whitespace",
					"filter": [
						"lowercase",
						"asciifolding",
						"nGram_filter"
					]
				},
				"whitespace_analyzer": {
					"type": "custom",
					"tokenizer": "whitespace",
					"filter": [
						"lowercase",
						"asciifolding"
					]
				},
				"spanish": {
					"type": "custom",
					"tokenizer": "standard",
					"filter": ["lowercase", "stopwords", "my_ascii_folding", "snowball_spanish", "worddelimiter"]
				},
				"spanish_search_analyzer": {
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "spanish_stop",
            "my_ascii_folding",
            "snowball_spanish"
          ]
        },
				"my_shingle_analyzer": {
					"type": "custom",
					"tokenizer": "standard",
					"filter": ["lowercase", "my_shingle_filter"]
				},
				"string_lowercase": {
					"tokenizer": "keyword",
					"filter": ["lowercase"]
				}
			}
		}
	}
}'

curl -XPUT "http://$ESDBHOST:9200/sibdataportal/_mapping/occurrence" -d '
{
  "occurrence": {
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
			"dwca_id":  {
				"type": "text",
				"index": "analyzed",
				"fields": {
					"untouched" : {
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
			"sourcefileid":  {
				"type": "text",
				"index": "analyzed",
				"fields": {
					"untouched" : {
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
			"occurrenceid":  {
				"type": "text",
				"index": "analyzed",
				"fields": {
					"untouched" : {
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
			"canonical":  {
				"type": "text",
				"index": "analyzed",
				"fields": {
					"untouched" : {
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
			"taxon_rank":  {
				"type": "text",
				"index": "analyzed",
				"fields": {
					"untouched" : {
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
			"location" : {
				"type" : "geo_point"
			},
			"country_name": {
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
					"shingles": {
						"type": "text",
						"analyzer": "my_shingle_analyzer"
					},
          "keyword": {
            "type": "keyword"
          }
				}
			},
			"county_name": {
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
					"shingles": {
						"type": "text",
						"analyzer": "my_shingle_analyzer"
					},
          "keyword": {
            "type": "keyword"
          }
				}
			},
			"locality" :  {
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
					"shingles": {
						"type": "text",
						"analyzer": "my_shingle_analyzer"
					}
				}
			},
			"year_start": {
				"type": "date",
				"format": "YYYY"
			},
			"month_start": {
				"type": "date",
				"format": "MM"
			},
			"day_start": {
				"type": "date",
				"format": "dd"
			},
			"year_end": {
				"type": "date",
				"format": "YYYY"
			},
			"month_end": {
				"type": "date",
				"format": "MM"
			},
			"day_end": {
				"type": "date",
				"format": "dd"
			},
			"eventdate_start": {
				"type": "date",
				"format": "YYYY-MM-dd||YYYY||YYYY-MM||dd/MM/YYYY||MM/YYYY||YYYY"
			},
			"eventdate_end": {
				"type": "date",
				"format": "YYYY-MM-dd||YYYY||YYYY-MM||dd/MM/YYYY||MM/YYYY||YYYY"
			},
			"verbatim_elevation": {"type" : "text"},
			"minimum_elevation": {"type" : "integer"},
			"maximum_elevation": {"type" : "integer"},
			"department_name" :  {
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
					"shingles": {
						"type": "text",
						"analyzer": "my_shingle_analyzer"
					},
          "keyword": {
            "type": "keyword"
          }
				}
			},
			"recorded_by" :  {
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
					"shingles": {
						"type": "text",
						"analyzer": "my_shingle_analyzer"
					}
				}
			},
			"habitat" :  {
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
					"shingles": {
						"type": "text",
						"analyzer": "my_shingle_analyzer"
					}
				}
			},
			"taxonomy": {
				"type": "object",
				"properties": {
					"phylum_name" :  {
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
					"kingdom_name" :  {
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
					"class_name" :  {
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
					"order_name" :  {
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
					"family_name" :  {
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
					"genus_name" :  {
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
					"species_name" :  {
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
					"specific_epithet" :  {
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
					"infraspecific_epithet" :  {
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
					}
				}
			},
			"provider": {
				"type": "object",
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
							},
              "keyword": {
                "type": "keyword"
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
					"website_url" :  {
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
					}
				}
			},
			"resource": {
				"type": "object",
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
							},
              "keyword": {
                "type": "keyword"
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
              },
              "keyword": {
                "type": "keyword"
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
					}
				}
			},
			"institution": {
				"type": "object",
				"properties": {
					"code" :  {
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
					}
				}
			},
			"collection": {
				"type": "object",
				"properties": {
					"id" :  {
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
					"code" :  {
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
					}
				}
			},
			"catalog": {
				"type": "object",
				"properties": {
					"number" :  {
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
			},
			"basis_of_record": {
				"type": "object",
				"properties": {
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
					}
				}
			}
    }
  }
}'
