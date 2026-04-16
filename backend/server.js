const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');

dotenv.config();

connectDB();

const app = express();

app.use(cors()); 

app.use(express.json()); 

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});