const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const colors = require('colors')
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const consentRoutes = require('./routes/consentRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'.bgGreen))
.catch(err => console.error('MongoDB connection error:'.bgRed, err));
// console.log('DB_URI:', process.env.DB_URI);


app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/user', userRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgMagenta);
});
