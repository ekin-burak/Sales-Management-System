require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
}); 