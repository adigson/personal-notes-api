require('dotenv').config();
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect Database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

// Middleware
app.use(cors());
app.use(express.json());

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Personal Knowledge Base / Notes API is running live!' });
});

// Mount Routes
app.use('/api/notes', noteRoutes);

// Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
startServer();
