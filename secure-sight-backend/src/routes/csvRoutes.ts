// // // // File: src/routes/csvRoutes.ts

// // // import express, { Request, Response } from 'express'
// // // import mongoose from 'mongoose'

// // // const router = express.Router()

// // // router.post('/file-get', async (req: Request, res: Response) => {
// // //   const { dbName, user_id, _id, document_name } = req.body

// // //   try {
// // //     const db = mongoose.connection.useDb(dbName)
// // //     const CSVDataModel = db.model('CSVData', new mongoose.Schema({}, { strict: false }))

// // //     const data = await CSVDataModel.findOne({ _id, document_name })

// // //     if (!data) {
// // //       return res.status(404).json({ success: false, msg: 'CSV data not found' })
// // //     }

// // //     res.json({ success: true, msg: 'CSV data retrieved successfully', data: [data] })
// // //   } catch (error) {
// // //     console.error('Error retrieving CSV data:', error)
// // //     res.status(500).json({ success: false, msg: 'Error retrieving CSV data' })
// // //   }
// // // })

// // // router.post('/document/upload-document', async (req: Request, res: Response) => {
// // //   const { dbName, user_id, csvData } = req.body

// // //   try {
// // //     const db = mongoose.connection.useDb(dbName)
// // //     const CSVDataModel = db.model('CSVData', new mongoose.Schema({}, { strict: false }))

// // //     await CSVDataModel.insertMany(csvData)

// // //     res.json({ success: true, msg: 'CSV data uploaded successfully' })
// // //   } catch (error) {
// // //     console.error('Error uploading CSV data:', error)
// // //     res.status(500).json({ success: false, msg: 'Error uploading CSV data' })
// // //   }
// // // })

// // // export default router
// // import express, { Request, Response } from 'express';
// // import mongoose, { Document, Schema } from 'mongoose';

// // const router = express.Router();

// // // Define an interface for the CSV data
// // interface ICsvData extends Document {
// //   document_name: string; // Name of the document
// //   user_id: string;       // ID of the user who uploaded the document
// //   upload_date: Date;     // Date when the document was uploaded
// //   data: { [key: string]: any }; // Dynamic fields to store CSV data
// // }

// // // Create a schema for CSV data
// // const CsvDataSchema: Schema = new Schema({
// //   document_name: { type: String, required: true },
// //   user_id: { type: String, required: true },
// //   upload_date: { type: Date, default: Date.now },
// //   data: { type: Schema.Types.Mixed, required: true } // Allows for dynamic fields
// // });

// // // Create a model for the CSV data
// // const CsvDataModel = mongoose.model<ICsvData>('CSVData', CsvDataSchema);

// // // Route to get CSV data by ID and document name
// // router.post('/file-get', async (req: Request, res: Response) => {
// //   const { dbName, user_id, _id, document_name } = req.body;

// //   try {
// //     const db = mongoose.connection.useDb(dbName);
// //     const data = await CsvDataModel.findOne({ _id, document_name }).exec();

// //     if (!data) {
// //       return res.status(404).json({ success: false, msg: 'CSV data not found' });
// //     }

// //     res.json({ success: true, msg: 'CSV data retrieved successfully', data: [data] });
// //   } catch (error) {
// //     console.error('Error retrieving CSV data:', error);
// //     res.status(500).json({ success: false, msg: 'Error retrieving CSV data' });
// //   }
// // });

// // // Route to upload CSV data
// // router.post('/document/upload-document', async (req: Request, res: Response) => {
// //   console.log('Incoming request body:', req.body); // Log the request body
// //   const { dbName, user_id, info, data } = req.body;

// //   // Validate required fields
// //   if (!user_id || !info || !data) {
// //     return res.status(400).json({ success: false, msg: 'user_id, info, and data are required' });
// //   }

// //   try {
// //     const db = mongoose.connection.useDb(dbName);
// //     const newCsvData = new CsvDataModel({
// //       document_name: info.document_name,
// //       user_id,
// //       data: data.data // Assuming data.data is the array of objects you want to save
// //     });

// //     await newCsvData.save();
// //     res.json({ success: true, msg: 'CSV data uploaded successfully' });
// //   } catch (error) {
// //     console.error('Error uploading CSV data:', error);
// //     res.status(500).json({ success: false, msg: 'Error uploading CSV data' });
// //   }
// // });

// // export default router;
// import express, { Request, Response } from 'express';
// import mongoose, { Document, Schema } from 'mongoose';

// const router = express.Router();

// // Define an interface for the CSV data
// interface ICsvData extends Document {
//   document_name: string; // Name of the document
//   user_id: string;       // ID of the user who uploaded the document
//   upload_date: Date;     // Date when the document was uploaded
//   data: Array<{ [key: string]: any }>; // Array of objects for CSV data
// }

// // Create a schema for CSV data
// const CsvDataSchema: Schema = new Schema({
//   document_name: { type: String, required: true },
//   user_id: { type: String, required: true },
//   upload_date: { type: Date, default: Date.now },
//   data: { type: [Schema.Types.Mixed], required: true } // Array of mixed types
// });

// // Create a model for the CSV data
// const CsvDataModel = mongoose.model<ICsvData>('CSVData', CsvDataSchema);

// // Route to upload CSV data
// router.post('/document/upload-document', async (req: Request, res: Response) => {
//   console.log('Incoming request body:', req.body); // Log the request body
//   const { dbName, user_id, info, data } = req.body;

//   // Validate required fields
//   if (!user_id || !info || !data) {
//     return res.status(400).json({ success: false, msg: 'user_id, info, and data are required' });
//   }

//   try {
//     const db = mongoose.connection.useDb(dbName);
//     const newCsvData = new CsvDataModel({
//       document_name: info.document_name,
//       user_id,
//       data: data.data // Assuming data.data is the array of objects you want to save
//     });

//     await newCsvData.save();
//     res.json({ success: true, msg: 'CSV data uploaded successfully' });
//   } catch (error) {
//     console.error('Error uploading CSV data:', error);
//     res.status(500).json({ success: false, msg: 'Error uploading CSV data' });
//   }
// });

// export default router;
import express, { Request, Response } from 'express';
import mongoose, { Document, Schema } from 'mongoose';

const router = express.Router();

// Define an interface for the CSV data
interface ICsvData extends Document {
  document_name: string; // Name of the document
  user_id: string;       // ID of the user who uploaded the document
  upload_date: Date;     // Date when the document was uploaded
  data: Array<{ [key: string]: any }>; // Array of objects for CSV data
}

// Create a schema for CSV data
const CsvDataSchema: Schema = new Schema({
  document_name: { type: String, required: true },
  user_id: { type: String, required: true },
  upload_date: { type: Date, default: Date.now },
  data: { type: [Schema.Types.Mixed], required: true } // Array of mixed types
});

// Create a model for the CSV data
const CsvDataModel = mongoose.model<ICsvData>('CSVData', CsvDataSchema);

// Route to upload CSV data
router.post('/document/upload-document', async (req: Request, res: Response) => {
  console.log('Incoming request body:', req.body); // Log the request body

  // Hardcoded values
  const dbName = "secure-sight"; // Hardcoded database name
  const user_id = "6704c7e61118b252ff43f13"; // Hardcoded user ID
  const info = {
    document_name: "color_x11.csv" // Hardcoded document name
  };
  const data = req.body.data; // Assuming data is passed in the request body

  // Validate required fields
  if (!data) {
    return res.status(400).json({ success: false, msg: 'data is required' });
  }

  try {
    const db = mongoose.connection.useDb(dbName);
    const newCsvData = new CsvDataModel({
      document_name: info.document_name,
      user_id, // Use the hardcoded user ID
      data: data.data // Assuming data.data is the array of objects you want to save
    });

    await newCsvData.save();
    res.json({ success: true, msg: 'CSV data uploaded successfully' });
  } catch (error) {
    console.error('Error uploading CSV data:', error);
    res.status(500).json({ success: false, msg: 'Error uploading CSV data' });
  }
});

export default router;
