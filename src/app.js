require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const tagRoutes = require('./routes/tagRoutes');
const userRoutes = require('./routes/userRoutes');
const gamificationRoutes = require("./routes/gamificationRoutes");

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
app.use(cors());
app.use('/tasks', taskRoutes);
app.use('/tags', tagRoutes);
app.use('/auth', userRoutes);
app.use('/gamification', gamificationRoutes);

module.exports = app;