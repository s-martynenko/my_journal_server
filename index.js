const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config/local');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const habitRoutes = require('./routes/habit');

mongoose.connect(config.DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true
}).then(function(){
    console.log('connected to db');
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/habits', habitRoutes);

app.listen(config.port, function() {
    console.log('hello world')
});
