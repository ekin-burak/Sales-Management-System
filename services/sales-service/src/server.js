require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3003;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Sales Service running on port ${PORT}`);
}); 