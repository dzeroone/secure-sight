import express, { Request, Response } from 'express'
import axios from 'axios';
import { ELASTIC_INDICES, ROLES } from '../constant';
import { auth } from '../utils/auth-util';
import assignmentController, { ReportType } from '../controllers/assignment.controller';
import customerController from '../controllers/customer.controller';
import { extractInfoFromIndex } from '../helper/reports.helper';
import commonDataController from '../controllers/common-data.controller';
import weekly from "../dummy-data/weekly.json";
import monthly from "../dummy-data/monthly.json";

const router = express.Router();

const esUrl = process.env.ELASTIC_BASE || "http://localhost:9200";
const eUrl = `${esUrl}/_cat/indices?v&pretty=true`

router.post("/data/", async (req, res) => {
  try {
    let response;
    const test = req.body.test;
    switch (test) {
      case "filtering":
        response = await axios.post(`${esUrl}/${req.body.index}/_search?size=10000`, {
          query: {
            bool: {
              filter: {
                terms: {
                  accountID: req.body.id,
                }
              }
            }
          }
        });
        break;
      default:
        response = await axios.get(`${esUrl}/${req.body.index}/_search?size=10000`);
        break;
    }
    res.json(response.data);

  } catch (error) {
    res.json(error);
  }

});

router.post("/data/search",
  auth,
  async (req, res) => {
    try {
      const dataToSend: any = {
        canSubmitReport: false
      }
      const { date, tCode, rType } = extractInfoFromIndex(req.body.index)
      const customer = await customerController.getCustomerByTenantCode(tCode)
      if (!customer) {
        throw new Error("Customer data not found")
      }

      dataToSend.customer = {
        name: customer.name,
        tCode: customer.tCode
      };
      dataToSend.date = date;

      const commonDataDoc = await commonDataController.get(rType as ReportType)

      if (commonDataDoc) {
        //@ts-ignore
        const { _id, _v, uAt, uBy, ...commonData } = commonDataDoc.toObject()
        dataToSend.commonData = commonData
      }

      if (req.user?.role == ROLES.LEVEL2 || req.user?.role == ROLES.LEVEL1) {
        const assignment = await assignmentController.getAssignmentByIndexForReporter(req.body.index, req.user._id)
        if (!assignment) {
          const err = new Error()
          err.message = "Assignment not found"
          throw err
        }

        dataToSend.assignment = assignment

        // check if he assgined this report to anyother
        dataToSend.canSubmitReport = await assignmentController.isLastReporter(req.body.index, req.user._id)
      }

      // alu
      const response = weekly
      

      // const test = req.body.test;
      // let response = null
      // switch (test) {
      //   case "filtering":
      //     response = await axios.post(`${esUrl}/${rType == 'monthly' ? 'monthly_reports' : 'weekly_reports'}/_doc/${req.body.index}`, {
      //       query: {
      //         bool: {
      //           filter: {
      //             terms: {
      //               accountID: req.body.id,
      //             }
      //           }
      //         }
      //       }
      //     });
      //     break;
      //   default:
      //     response = await axios.get(`${esUrl}/${rType == 'monthly' ? 'monthly_reports' : 'weekly_reports'}/_doc/${req.body.index}`);
      //     break;
      // }
      // response = response.data._source

      dataToSend.data = response
      res.json(dataToSend);

    } catch (error: any) {
      res.status(error.status || 400).json({
        message: error.message
      });
    }
  }
);

router.get("/list", async (req, res) => {
  try {
    let response;
    response = await axios.get(`${eUrl}`);
    const CSVToJSON = (csv: any) => {
      const lines = csv.split('\n');
      const keys = lines[0].split(',');
      return lines.slice(1).map((line: any) => {
        return line.split(',').reduce((acc: any, cur: any, i: any) => {
          const toAdd: any = {};
          toAdd[keys[i]] = cur;
          return { ...acc, ...toAdd };
        }, {});
      });
    };

    res.json(response.data);
  } catch (error) {
    res.json(error);
  }
});

router.post("/dataSource", async (req, res) => {
  try {
    // alu
    // return res.send([
    //   'a',
    //   'b'
    // ])
    // end alu
    let response;
    response = await axios.get(`${eUrl}`);

    console.log(response.data)
    const indicesData = response.data;
    const indicesList: string[] = indicesData.split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => line.split(/\s+/)[2])
      .filter((index: string) => (!index.startsWith('.') && !index.startsWith('read-me') && !index.startsWith('index')));
    res.json(indicesList);
  } catch (error) {
    res.json(error);
  }
});

router.post("/cveSearch", async (req, res) => {
  try {
    let cve = await axios.post(`${esUrl}/${req.body.index1}/_search?size=10000`);
    const cveList = cve.data.hits.hits.map((a: any) => {
      return a['_source']
    })
    var keys: any = [];
    let key
    var results = [];
    for (var i = 0; i < cveList.length; i++) {
      for (key in cveList[i]) {
        if (Array.isArray(cveList[i][key])) {
          if (cveList[i][key].indexOf(req.body.cve) != -1) {
            results.push(cveList[i]);
          }
        }
      }
    }
    (results).map((name) => {
      for (var key in name) {
        keys.push(key);
      }
      return name.keys
    });
    const rule_id = results
    let assignedRuleIds = await axios.post(`${esUrl}/${req.body.index2}/_search?size=10000`, {
      query: {
        bool: {
          filter: {
            terms: {
              assigned_rule_ids: keys,
            }
          }
        }
      }
    });
    let unAssignedRuleIds = await axios.post(`${esUrl}/${req.body.index2}/_search?size=10000`, {
      query: {
        bool: {
          filter: {
            terms: {
              recommended_to_assign_rule_ids: keys,
            }
          }
        }
      }
    });
    const ips = assignedRuleIds.data.hits.hits.concat(unAssignedRuleIds.data.hits.hits)
    const ip = ips.map((a: any) => { return a['_source'].comp_id })
    let computer = await axios.post(`${esUrl}/${req.body.index3}/_search?size=10000`, {
      query: {
        bool: {
          filter: {
            terms: {
              id: ip
            }
          }
        }
      }
    });
    const computers = computer.data.hits.hits
    const data = { rule_id, ips, computers }
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/index", async (req, res) => {
  try {
    let data = await axios.post(`${esUrl}/${req.body.index}/_delete_by_query`, {
      query: {
        match: {
          _index: req.body.index
        }
      }
    });
    res.json(data.data);

  } catch (error) {
    res.json(error);
  }
});

router.get('/monthly-report-form', async (req, res) => {
  const page = Number(req.query.page) || 1
  try {
    const result = await axios.get(`${esUrl}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}/_search`, {
      data: {
        from: (page - 1) * 20,
        size: 20,
        query: req.query.search ? {
          multi_match: {
            query: req.query.search,
            fields: ["monthly_report.doc_title", "monthly_report.client_name", "monthly_report.customer_name", "monthly_report.date"],
          },
        } : undefined,
        _source: ["savedAt", "monthly_report"],
        sort: [
          { "savedAt": { "order": "desc", "format": "strict_date_optional_time_nanos" } }
        ]
      }
    });
    res.json({
      count: result.data.hits.total.value,
      data: result.data.hits.hits
    });

  } catch (e: any) {
    // console.log(e.response.data)
    res.status(400).json(e);
  }
})

router.post('/monthly-report-form',
  auth,
  async (req, res) => {
    try {
      const result = await axios.post(`${esUrl}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}/_doc`, {
        savedAt: new Date().toISOString(),
        ...req.body
      });
      res.json(result.data);

    } catch (e: any) {
      console.log(e.response)
      res.status(400).json(e);
    }
  }
)

router.get('/monthly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.get(`${esUrl}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}/_doc/${req.params.id}`, {
      params: {
        _source_excludes: 'savedAt'
      }
    });
    res.json(result.data);
  } catch (e: any) {
    console.log(e.response.data)
    res.status(404).json(e);
  }
})

router.patch('/monthly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.post(`${esUrl}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}/_update/${req.params.id}`, {
      "doc": {
        savedAt: new Date().toISOString(),
        ...req.body
      }
    });
    res.json(result.data);

  } catch (e) {
    res.status(400).json(e);
  }
})

router.delete('/monthly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.delete(`${esUrl}/${ELASTIC_INDICES.MONTHLY_REPORT_FORM}/_doc/${req.params.id}`);
    res.json(result.data);
  } catch (e: any) {
    console.log(e.response.data)
    res.status(404).json(e);
  }
})

// weekly report
router.get('/weekly-report-form', async (req, res) => {
  const page = Number(req.query.page) || 1
  try {
    const result = await axios.get(`${esUrl}/${ELASTIC_INDICES.WEEKLY_REPORT_FORM}/_search`, {
      data: {
        from: (page - 1) * 20,
        size: 20,
        query: req.query.search ? {
          multi_match: {
            query: req.query.search,
            fields: ["formData.client.clientName", "WEEKLY_REPORT.start_date", "WEEKLY_REPORT.end_date"],
          },
        } : undefined,
        _source: ["savedAt", "formData.client.clientName", "reportData.WEEKLY_REPORT.start_date", "reportData.WEEKLY_REPORT.end_date"],
        sort: [
          { "savedAt": { "order": "desc", "format": "strict_date_optional_time_nanos" } }
        ]
      }
    });
    res.json({
      count: result.data.hits.total.value,
      data: result.data.hits.hits
    });

  } catch (e: any) {
    // console.log(e.response.data, e.response.data.error)
    res.status(400).json(e);
  }
})

router.post('/weekly-report-form', async (req, res) => {
  try {
    const result = await axios.post(`${esUrl}/${ELASTIC_INDICES.WEEKLY_REPORT_FORM}/_doc`, {
      savedAt: new Date().toISOString(),
      ...req.body
    });
    res.json(result.data);

  } catch (e: any) {
    console.log(e.response)
    res.status(400).json(e);
  }
})

router.get('/weekly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.get(`${esUrl}/${ELASTIC_INDICES.WEEKLY_REPORT_FORM}/_doc/${req.params.id}`, {
      params: {
        _source_excludes: 'savedAt'
      }
    });
    res.json(result.data);
  } catch (e: any) {
    console.log(e.response.data)
    res.status(404).json(e);
  }
})

router.patch('/weekly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.post(`${esUrl}/${ELASTIC_INDICES.WEEKLY_REPORT_FORM}/_update/${req.params.id}`, {
      "doc": {
        savedAt: new Date().toISOString(),
        ...req.body
      }
    });
    res.json(result.data);

  } catch (e) {
    res.status(400).json(e);
  }
})

router.delete('/weekly-report-form/:id', async (req, res) => {
  try {
    const result = await axios.delete(`${esUrl}/${ELASTIC_INDICES.WEEKLY_REPORT_FORM}/_doc/${req.params.id}`);
    res.json(result.data);
  } catch (e: any) {
    console.log(e.response.data)
    res.status(404).json(e);
  }
})
// - end weekly report

export default router;

// case "sorting":
//   response = await axios.post(`${esUrl}/${req.params.index}/_search`, {
//     sort: {
//       createdAt: "desc",
//     },
//   });
//   break;

// case "matching":
//     response = await axios.post(`${esUrl}/${req.params.index}/_search?size=500`, {
//         query: {
//             match: {
//                 _accountID: req.query.id,
//             },
//         },
//     });
//     break;
// case "multi-matching":
//   response = await axios.post(`${esUrl}/${req.body.index}/_search`, {
//     query: {
//       bool: {
//         must: [
//           {
//             match: {
//               name: "Anastacio Stamm",
//             },
//           },
//           {
//             match: {
//               country: "Samoa",
//             },
//           },
//         ],
//       },
//     },
//   });
//   break;

router.post("/create-index", async (req, res) => {
  try {
    const checkIndexExist = () =>
      new Promise((resolve) => {
        axios
          .get(`${esUrl}/${req.body.index}`)
          .then((_) => {
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      });

    const ifIndexExist = await checkIndexExist();
    if (!ifIndexExist) {
      const esResponse = await axios.put(`${esUrl}/${req.body.index}`, {
        mappings: {
          properties: {
            name: {
              type: "text",
            },
            email: {
              type: "text",
              fields: {
                raw: {
                  type: "keyword",
                },
              },
            },
            country: {
              type: "text",
            },
            age: {
              type: "integer",
            },
            company: {
              type: "text",
            },
            jobRole: {
              type: "text",
            },
            description: {
              type: "text",
            },
            createdAt: {
              type: "date",
              fields: {
                raw: {
                  type: "keyword",
                },
              },
            },
          },
        },
      });
      res.json(esResponse.data);
    } else {
      res.json("Index exist already");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// import express, { Request, Response } from 'express';
// import axios from 'axios';

// const router = express.Router();

// // Elasticsearch configuration
// const esUrl = 'http://localhost:9200/';
// const eUrl = 'http://localhost:9200/_cat/indices?v&pretty=true';

// // Basic Authentication configuration
// const auth = {
//   username: 'elastic',
//   password: 'EP0VJl52'
// };

// // Endpoint to retrieve list of indices
// router.get('/list', async (req: Request, res: Response) => {
//   try {
//     const response = await axios.get(eUrl, { auth });
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching indices:', error);
//     res.status(500).json({ error: 'Failed to fetch indices.' });
//   }
// });

// // Endpoint to fetch indices based on specific conditions
// router.post('/dataSource', async (req: Request, res: Response) => {
//   try {
//     const response = await axios.get(eUrl, { auth });
//     const indicesData = response.data;

//     const indicesList: string[] = indicesData
//       .split('\n')
//       .filter((line: string) => line.trim())
//       .map((line: string) => line.split(/\s+/)[2])
//       .filter(
//         (index: string) =>
//           !index.startsWith('.') &&
//           !index.startsWith('read-me') &&
//           !index.startsWith('index')
//       );

//     res.json(indicesList);
//   } catch (error) {
//     console.error('Error fetching data source:', error);
//     res.status(500).json({ error: 'Failed to fetch data source.' });
//   }
// });

// // Endpoint to search data with filtering
// router.post('/data/', async (req: Request, res: Response) => {
//   try {
//     let response;
//     const test = req.body.test;

//     switch (test) {
//       case 'filtering':
//         response = await axios.post(
//           `${esUrl}/${req.body.index}/_search?size=10000`,
//           {
//             query: {
//               bool: {
//                 filter: {
//                   terms: {
//                     accountID: req.body.id
//                   }
//                 }
//               }
//             }
//           },
//           { auth }
//         );
//         break;
//       default:
//         response = await axios.get(
//           `${esUrl}/${req.body.index}/_search?size=10000`,
//           { auth }
//         );
//         break;
//     }
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error during data fetch:', error);
//     res.status(500).json({ error: 'Failed to fetch data.' });
//   }
// });

// // Endpoint to search specific data
// router.post('/data/search', async (req: Request, res: Response) => {
//   try {
//     let response;
//     const test = req.body.test;

//     switch (test) {
//       case 'filtering':
//         response = await axios.post(
//           `${esUrl}/${req.body.index}/_search?size=10000`,
//           {
//             query: {
//               bool: {
//                 filter: {
//                   terms: {
//                     accountID: req.body.id
//                   }
//                 }
//               }
//             }
//           },
//           { auth }
//         );
//         break;
//       default:
//         response = await axios.get(
//           `${esUrl}/${req.body.index}/_search?size=10000`,
//           { auth }
//         );
//         break;
//     }
//     res.json(response.data.hits.hits);
//   } catch (error) {
//     console.error('Error during search:', error);
//     res.status(500).json({ error: 'Search failed.' });
//   }
// });

// // Endpoint to create an index
// router.post('/create-index', async (req: Request, res: Response) => {
//   try {
//     const checkIndexExist = async () => {
//       try {
//         await axios.get(`${esUrl}/${req.body.index}`, { auth });
//         return true;
//       } catch {
//         return false;
//       }
//     };

//     const ifIndexExist = await checkIndexExist();
//     if (!ifIndexExist) {
//       const esResponse = await axios.put(
//         `${esUrl}/${req.body.index}`,
//         {
//           mappings: {
//             properties: {
//               name: { type: 'text' },
//               email: { type: 'text', fields: { raw: { type: 'keyword' } } },
//               country: { type: 'text' },
//               age: { type: 'integer' },
//               company: { type: 'text' },
//               jobRole: { type: 'text' },
//               description: { type: 'text' },
//               createdAt: { type: 'date', fields: { raw: { type: 'keyword' } } }
//             }
//           }
//         },
//         { auth }
//       );
//       res.json(esResponse.data);
//     } else {
//       res.json('Index already exists');
//     }
//   } catch (error) {
//     console.error('Error creating index:', error);
//     res.status(500).json({ error: 'Failed to create index.' });
//   }
// });

// // Additional endpoint examples (if needed)
// router.delete('/index', async (req: Request, res: Response) => {
//   try {
//     let data = await axios.post(
//       `${esUrl}/${req.body.index}/_delete_by_query`,
//       {
//         query: {
//           match: {
//             _index: req.body.index
//           }
//         }
//       },
//       { auth }
//     );
//     res.json(data.data);
//   } catch (error) {
//     console.error('Error deleting index:', error);
//     res.status(500).json({ error: 'Failed to delete index.' });
//   }
// });

// export default router;
// // import express, { Request, Response } from 'express';
// // import axios from 'axios';

// // const router = express.Router();

// // // Elasticsearch configuration
// // const esUrl = 'http://localhost:9200/';
// // const eUrl = 'http://localhost:9200/_cat/indices?v&pretty=true';

// // // Basic Authentication configuration
// // const auth = {
// //   username: 'elastic',
// //   password: '5GJYxWwr'
// // };

// // // Endpoint to retrieve list of all indices
// // router.get('/list', async (req: Request, res: Response) => {
// //   try {
// //     const response = await axios.get(eUrl, { auth });
// //     const indicesData = response.data;

// //     // Process response to parse index names and other details
// //     const indices = indicesData
// //       .split('\n')
// //       .filter((line: string) => line.trim())
// //       .map((line: string) => {
// //         const [health, status, index, uuid, pri, rep, docsCount, docsDeleted, storeSize, priStoreSize, dataSize] = line.split(/\s+/);
// //         return {
// //           health,
// //           status,
// //           index,
// //           uuid,
// //           pri: Number(pri),
// //           rep: Number(rep),
// //           docsCount: Number(docsCount),
// //           docsDeleted: Number(docsDeleted),
// //           storeSize,
// //           priStoreSize,
// //           dataSize,
// //         };
// //       });

// //     res.json(indices);
// //   } catch (error) {
// //     console.error('Error fetching indices:', error);
// //     res.status(500).json({ error: 'Failed to fetch indices.' });
// //   }
// // });

// // // Endpoint to fetch indices based on specific conditions
// // router.post('/dataSource', async (req: Request, res: Response) => {
// //   try {
// //     const response = await axios.get(eUrl, { auth });
// //     const indicesData = response.data;

// //     const indicesList: string[] = indicesData
// //       .split('\n')
// //       .filter((line: string) => line.trim())
// //       .map((line: string) => line.split(/\s+/)[2])
// //       .filter(
// //         (index: string) =>
// //           !index.startsWith('.') &&
// //           !index.startsWith('read-me') &&
// //           !index.startsWith('index')
// //       );

// //     res.json(indicesList);
// //   } catch (error) {
// //     console.error('Error fetching data source:', error);
// //     res.status(500).json({ error: 'Failed to fetch data source.' });
// //   }
// // });

// // // Endpoint to search data with filtering
// // router.post('/data/', async (req: Request, res: Response) => {
// //   try {
// //     let response;
// //     const test = req.body.test;

// //     switch (test) {
// //       case 'filtering':
// //         response = await axios.post(
// //           `${esUrl}/${req.body.index}/_search?size=10000`,
// //           {
// //             query: {
// //               bool: {
// //                 filter: {
// //                   terms: {
// //                     accountID: req.body.id
// //                   }
// //                 }
// //               }
// //             }
// //           },
// //           { auth }
// //         );
// //         break;
// //       default:
// //         response = await axios.get(
// //           `${esUrl}/${req.body.index}/_search?size=10000`,
// //           { auth }
// //         );
// //         break;
// //     }
// //     res.json(response.data);
// //   } catch (error) {
// //     console.error('Error during data fetch:', error);
// //     res.status(500).json({ error: 'Failed to fetch data.' });
// //   }
// // });

// // // Endpoint to search specific data
// // router.post('/data/search', async (req: Request, res: Response) => {
// //   try {
// //     let response;
// //     const test = req.body.test;

// //     switch (test) {
// //       case 'filtering':
// //         response = await axios.post(
// //           `${esUrl}/${req.body.index}/_search?size=10000`,
// //           {
// //             query: {
// //               bool: {
// //                 filter: {
// //                   terms: {
// //                     accountID: req.body.id
// //                   }
// //                 }
// //               }
// //             }
// //           },
// //           { auth }
// //         );
// //         break;
// //       default:
// //         response = await axios.get(
// //           `${esUrl}/${req.body.index}/_search?size=10000`,
// //           { auth }
// //         );
// //         break;
// //     }
// //     res.json(response.data.hits.hits);
// //   } catch (error) {
// //     console.error('Error during search:', error);
// //     res.status(500).json({ error: 'Search failed.' });
// //   }
// // });

// // // Endpoint to create an index
// // router.post('/create-index', async (req: Request, res: Response) => {
// //   try {
// //     const checkIndexExist = async () => {
// //       try {
// //         await axios.get(`${esUrl}/${req.body.index}`, { auth });
// //         return true;
// //       } catch {
// //         return false;
// //       }
// //     };

// //     const ifIndexExist = await checkIndexExist();
// //     if (!ifIndexExist) {
// //       const esResponse = await axios.put(
// //         `${esUrl}/${req.body.index}`,
// //         {
// //           mappings: {
// //             properties: {
// //               name: { type: 'text' },
// //               email: { type: 'text', fields: { raw: { type: 'keyword' } } },
// //               country: { type: 'text' },
// //               age: { type: 'integer' },
// //               company: { type: 'text' },
// //               jobRole: { type: 'text' },
// //               description: { type: 'text' },
// //               createdAt: { type: 'date', fields: { raw: { type: 'keyword' } } }
// //             }
// //           }
// //         },
// //         { auth }
// //       );
// //       res.json(esResponse.data);
// //     } else {
// //       res.json('Index already exists');
// //     }
// //   } catch (error) {
// //     console.error('Error creating index:', error);
// //     res.status(500).json({ error: 'Failed to create index.' });
// //   }
// // });

// // // Endpoint to delete all documents in an index
// // router.delete('/index', async (req: Request, res: Response) => {
// //   try {
// //     let data = await axios.post(
// //       `${esUrl}/${req.body.index}/_delete_by_query`,
// //       {
// //         query: {
// //           match_all: {}
// //         }
// //       },
// //       { auth }
// //     );
// //     res.json(data.data);
// //   } catch (error) {
// //     console.error('Error deleting index:', error);
// //     res.status(500).json({ error: 'Failed to delete index.' });
// //   }
// // });

// // export default router;
