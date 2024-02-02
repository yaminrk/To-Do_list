const express = require('express');
const router = require('./src/route/api');
const app = new express();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

//Security
app.use(cors())
app.use(helmet())
app.use(mongoSanitize())
app.use(hpp())
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb'}));
app.use(bodyParser.json())

// Rate Limiting
const limiter = rateLimit({windowMs:15*60*1000, max:300});
app.use(limiter);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.listen(3000, () => console.log('Server running on port 3000'));

// Database Connection
const username = 'todo_list';
const URI = `mongodb://localhost/${username}`;
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Connected to user's database");
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({status: "fail", data: "Database connection error"});
    });

app.use("/api/v1", router);
app.use("*", (req, res) => {
    res.status(404).json({status: "fail", data: "Not Found"})
});

module.exports = app;