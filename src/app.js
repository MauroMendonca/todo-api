require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const setupSwagger = require('./config/swagger'); 
setupSwagger(app);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('🟢 Connected to MongoDB'))
.catch(err => console.log('🔴 MongoDB connection error: ', err));

app.use(express.json());
app.use('/tasks', taskRoutes);
app.use('/auth', userRoutes);

module.exports = app;