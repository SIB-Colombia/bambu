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
			"dwca_id":  {
				"type": "string",
				"index": "analyzed",
				"fields": {
					"untouched" : {
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
			"sourcefileid":  {
				"type": "string",
				"index": "analyzed",
				"fields": {
					"untouched" : {
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
			"occurrenceid":  {
				"type": "string",
				"index": "analyzed",
				"fields": {
					"untouched" : {
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
			"canonical":  {
				"type": "string",
				"index": "analyzed",
				"fields": {
					"untouched" : {
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
			"taxon_rank":  {
				"type": "string",
				"index": "analyzed",
				"fields": {
					"untouched" : {
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
			"location" : {
				"type" : "geo_point",
				"lat_lon": true,
				"geohash": true,
				"geohash_prefix": true,
				"geohash_precision": 6
			},
			"country_name": {
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
					},
					"shingles": {
						"type": "string",
						"analyzer": "my_shingle_analyzer"
					}
				}
			},
			"county_name": {
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
					},
					"shingles": {
						"type": "string",
						"analyzer": "my_shingle_analyzer"
					}
				}
			},
			"locality" :  {
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
					},
					"shingles": {
						"type": "string",
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
			"verbatim_elevation": {"type" : "string"},
			"minimum_elevation": {"type" : "integer"},
			"maximum_elevation": {"type" : "integer"},
			"department_name" :  {
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
					},
					"shingles": {
						"type": "string",
						"analyzer": "my_shingle_analyzer"
					}
				}
			},
			"recorded_by" :  {
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
					},
					"shingles": {
						"type": "string",
						"analyzer": "my_shingle_analyzer"
					}
				}
			},
			"habitat" :  {
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
					},
					"shingles": {
						"type": "string",
						"analyzer": "my_shingle_analyzer"
					}
				}
			},
			"taxonomy": {
				"type": "object",
				"properties": {
					"phylum_name" :  {
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
					"kingdom_name" :  {
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
					"class_name" :  {
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
					"order_name" :  {
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
					"family_name" :  {
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
					"genus_name" :  {
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
					"species_name" :  {
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
					"specific_epithet" :  {
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
					"infraspecific_epithet" :  {
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
			},
			"provider": {
				"type": "object",
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
					"website_url" :  {
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
					}
				}
			},
			"resource": {
				"type": "object",
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
					}
				}
			},
			"institution": {
				"type": "object",
				"properties": {
					"code" :  {
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
			},
			"collection": {
				"type": "object",
				"properties": {
					"id" :  {
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
					"code" :  {
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
					}
				}
			},
			"catalog": {
				"type": "object",
				"properties": {
					"number" :  {
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
			},
			"basis_of_record": {
				"type": "object",
				"properties": {
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
					}
				}
			}
    }
  }
}'
