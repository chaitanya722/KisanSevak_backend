const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import cors
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors()); // Enable cors for all routes

// MongoDB connection URI - replace this with your actual MongoDB connection string
const uri = 'mongodb+srv://chaitanyapawar410:chaitanya@cluster0.nlaldan.mongodb.net/';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB cluster
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// POST endpoint to handle crop information
app.post('/api/crops', (req, res) => {
  const { crop_name, crop_info, crop_image } = req.body;

  // Use the connected MongoDB client to interact with the database
  const database = client.db('crops'); // Use 'crops' as the database name
  const collection = database.collection('crop_data'); // Use 'crop_data' as the collection name

  // Insert the crop information into the 'crop_data' collection
  collection.insertOne({
    crop_name,
    crop_info,
    crop_image
  })
    .then(result => {
      console.log('Crop information inserted into MongoDB:', result.ops);
      res.status(200).json({ message: 'Crop information received and stored successfully' });
    })
    .catch(err => {
      console.error('Error inserting crop information into MongoDB:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// GET endpoint to retrieve crop data
app.get('/api/crops', (req, res) => {
  // Use the connected MongoDB client to interact with the database
  const database = client.db('crops'); // Use 'crops' as the database name
  const collection = database.collection('crop_data'); // Use 'crop_data' as the collection name

  // Retrieve all documents from the 'crop_data' collection
  collection.find({}).toArray()
    .then(crops => {
      res.status(200).json(crops);
    })
    .catch(err => {
      console.error('Error retrieving crop data from MongoDB:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
