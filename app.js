const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const notesRouter = require('./routers/notes');
const app = express();


logger.info('connecting to MongoDB at: ', config.MONGO_URI);
mongoose.set('strictQuery', false);
mongoose
    .connect(config.MONGO_URI)
    .then(() => 
        logger.info('connected to MongoDB'))
    .catch(error => 
        logger.error('error connecting to MongoDB: ', error.message)
);


app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;