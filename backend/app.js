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
const URI = 'mongodb+srv://Random:fmKp3qnq7cYaHxPJ@cluster0.zaaieuo.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch(err => {
        console.error(err);
    });


app.use("/api/v1", router);
app.use("*", (req, res) => {
    res.status(404).json({status: "fail", data: "Not Found"})
});

module.exports = app;