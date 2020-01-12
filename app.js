const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/database');
const passport = require('passport');
let users = require('./routes/users');
let data = require('./routes/data');

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function() {
    console.log('Connected to MongoDB');
});
db.on('error', function(error) {
    console.log('DB Error: ', error);
});
const app = express();
// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));
// Pasport Config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
// Set Public Folder
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/users', users);
app.use('/data', data);
app.get('/', function(req, res) {
    res.send({
        message: 'Home page'
    })
});
app.listen(3000, function() {
    console.log('Server started on port 3000');
});