var express = require("express");
var path = require("path");
var favicon = require("static-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var app = express();
import 'babel-polyfill';

import mongoose from "mongoose";
import rootController from "./routes/RootController";
import adminController from "./routes/AdminController";
import businessController from "./routes/BusinessController";
import studentController from "./routes/StudentController";
import notificationController from "./routes/NotificationController";
import settingController from "./routes/SettingController";
import authController from "./routes/AuthController";

import CronJob from './services/CronManager';

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(favicon());
app.use(logger("dev"));
app.use(bodyParser.json({
    limit: "50mb"
}));
app.use(bodyParser.urlencoded({
    limit: "50mb"
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
// Local Host
/*
mongoose.connect("mongodb://localhost:27017/JMRdb", {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    dbName: 'JMRdb'
}).then((answer) => {
    console.log("Successfully connected to MONGO!");
});
*/

//    Server

mongoose
    .connect(`mongodb://${process.env.DB_ADDRESS}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`, {
        auth: {
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        },
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 600, // Reconnect every 500ms
        dbName: process.env.DB_NAME
    })
    .then(answer => {
        console.log("Successfully connected to MONGO!");
        const cronJob = new CronJob();
        cronJob.fireJobs();
    });

app.use("/b", businessController);
app.use("/s", studentController);
app.use("/a", adminController);
app.use("/n", notificationController);
app.use("/settings", settingController);
app.use("/auth", authController);
app.use("/", rootController);
require('./config/passport');

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

module.exports = app;