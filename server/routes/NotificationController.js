var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

// import the models
import Notification from "../models/Notification";
import Admin from "../models/Admin";
import Student from "../models/Student";
import FCM from "../services/FirebaseManager";
import CronJob from "../services/CronManager";
const cronJob = new CronJob();

/*
  TODO : Add notification (done)
         Remove notification
         Search
         Mark as seen
         Get all  (done)
         Get all for user (done),
         Get all from user (done)
*/

router.post("/test/push/notification", function (req, res) {
    var deviceToken = req.body.token;
    var payload = {
        notification: {
            title: "Testing push!!",
            body: "This is the body of the push"
        },
        data: {
            link: "/home",
            props: JSON.stringify({
                device_token: deviceToken
            })
        }
    };
    FCM.sendToDevice(deviceToken, payload)
        .then(response => {
            return res.json(response);
        })
        .catch(err => {
            return res.status(512).send(err);
        });
});

router.post("/push/notification/to/admin", function (req, res) {
    var adminID = req.body.adminID;
    var notification = req.body.notification;
    var data = req.body.data;
    var link = req.body.link;
    var props = req.body.props;

    if (!notification) {
        notification = {
            title: "Testing push!!",
            body: "This is the body of the push"
        }
    }
    Admin.findById(adminID).then(user => {
        if (user == null) return res.status(514).send("User of id " + adminID + " not found");
        var tokens = user.deviceTokens.filter(v => !v.removed).map(v => v.token);
        if (tokens) {
            var payload = {
                notification: notification,
                data: {
                    link: link,
                    props: JSON.stringify(props),
                    data: JSON.stringify(data),

                }
            };
            tokens.forEach(deviceToken => {
                FCM.sendToDevice(deviceToken, payload)
                    .then(response => {

                    })
                    .catch(err => {
                        // return res.status(512).send(err);
                    });
            });
            return res.json("Notification will be sent to " + tokens.length + " devices");
        } else {
            return res.status(514).send("User has no device");
        }
    }).catch(err => {
        return res.status(514).send(err);
    });
});

router.post("/test/push/notification/schedule", function (req, res) {
    var deviceToken = req.body.token;
    var payload = {
        notification: {
            title: "Testing push!!",
            body: "This is the body of the push"
        },
        data: {
            link: "/home",
            props: JSON.stringify({
                device_token: deviceToken
            })
        }
    };
    cronJob.schedule("30 5 * * *", deviceToken, payload);
});

router.get("/cron/get/tasks", function (req, res) {
    res.send(cronJob.getTasks());
});

router.get("/get/new/for/:userId", function (req, res) {
    var receiver = req.params.userId;
    Notification.find({
        $or: [{
            expiryDate: null,
        }, {
            expiryDate: {
                $lt: new Date()
            }
        }],
        $or: [{
            status: {
                $ne: 'SEEN'
            }
        }],
        removed: false,
        toId: receiver
    }).sort('-date').then(notifications => {
        if (notifications == null) res.send("Error : 9032egrrtu834g9erbo");
        res.json(notifications);
    });
});

router.get("/all/for/:userId/:scheduled", function (req, res) {
    var receiver = req.params.userId;
    let scheduled = req.params.scheduled ? true : false;
    Notification.find({
        scheduled: scheduled,
        $or: [{
            expiryDate: null,
        }, {
            expiryDate: {
                $lt: new Date()
            }
        }],
        toId: receiver
    }).then(notifications => {
        if (notifications == null) res.send("Error : 9032egrrtu834g9erbo");
        res.json(notifications);
    });
});

router.get("/all/:userId/:scheduled", function (req, res) {
    let sender = req.params.userId;
    let scheduled = req.params.scheduled ? true : false;
    Notification.find({
        scheduled: scheduled,
        $or: [{
            expiryDate: null,
        }, {
            expiryDate: {
                $lt: new Date()
            }
        }],
        $or: [{
            fromId: sender
        }, {
            toId: sender
        }]
    }).then(result => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }

        res.json(result);
    });
});

router.get("/tasks/all", function (req, res) {
    Notification.find({
        dueDate: {
            $ne: null
        }
    }).then(result => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }
        res.json(result);
    });
});

router.get("/tasks/all/:userId", function (req, res) {
    var sender = req.params.userId;
    Notification.find({
        dueDate: {
            $ne: null
        },
        $or: [{
            fromId: sender
        }, {
            toId: sender
        }]
    }).then(result => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }
        res.json(result);
    });
});

router.post("/add", function (req, res) {
    var notification = new Notification({
        _id: mongoose.Types.ObjectId(),
        fromId: req.body.fromId,
        toId: req.body.toId,
        title: req.body.title,
        body: req.body.body,
        data: req.body.data,
        type: req.body.type,
        status: req.body.status,
        scheduled: req.body.scheduled,
        topic: req.body.topic,
        scheduleInterval: req.body.scheduleInterval,
        expiryDate: req.body.expiryDate
    });

    notification.save(function (err) {
        if (err) return res.status(512).send(err);

        Admin.findById(req.body.fromId, function (err, admin) {
            if (err || admin == null) {
                console.log(err);
                return;
            }

            admin.notifications.push(notification._id);
            admin.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                Student.findById(req.body.toId, function (err, student) {
                    if (err || student == null) {
                        console.log(err);
                        return;
                    }

                    student.notifications.push(notification._id);
                    student.save(function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        var answer = Admin.findById(admin._id)
                            .populate(["documents"])
                            .populate(["notifications"])
                            .populate(["transactions"])
                            .then(_admin => {
                                if (_admin == null) {
                                    res.status(500);
                                    res.send("User not found");
                                } else {
                                    console.log("Returning admin " + _admin._id);
                                    res.json(_admin);
                                }
                            });

                        //Done ...
                    });
                });
            });
        });

        res.json("Notification sent to " + req.body.to);
    });
});

module.exports = router;