'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _AdminController = require('./routes/AdminController');

var _AdminController2 = _interopRequireDefault(_AdminController);

var _StudentController = require('./routes/StudentController');

var _StudentController2 = _interopRequireDefault(_StudentController);

var _NotificationController = require('./routes/NotificationController');

var _NotificationController2 = _interopRequireDefault(_NotificationController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Local Host

_mongoose2.default.connect("mongodb://localhost:27017/JMRdb", {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    dbName: 'JMRdb'
}).then(function (answer) {
    console.log("Successfully connected to MONGO!");
});

/*
    Server
mongoose.connect("mongodb://cluster0-shard-00-00-xbjvr.mongodb.net:27017,cluster0-shard-00-01-xbjvr.mongodb.net:27017,cluster0-shard-00-02-xbjvr.mongodb.net:27017/JMRdb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin", {
    auth: {
        user: "mulavhe",
        password: "Mulavhelesi@1"
    },
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    dbName: 'JMRdb'
}).then((answer) => {
    console.log("Successfully connected to MONGO!");
});
*/

app.use('/s', _StudentController2.default);
app.use('/a', _AdminController2.default);
app.use('/n', _NotificationController2.default);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;