'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Notification = require('../models/Notification');

var _Notification2 = _interopRequireDefault(_Notification);

var _Admin = require('../models/Admin');

var _Admin2 = _interopRequireDefault(_Admin);

var _Student = require('../models/Student');

var _Student2 = _interopRequireDefault(_Student);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();

// import the models


/*
  TODO : Add notification (done)
         Remove notification
         Search
         Mark as seen
         Get all  (done)
         Get all for user (done),
         Get all from user (done)
*/

router.get('/search/:searchText', function (req, res) {
    var text = req.params.searchText;
    _Notification2.default.find({
        fromId: req.params.adminId, dueDate: null
    }).populate('fromId').populate('toId').then(function (notifications) {
        if (notifications == null) res.send("Error : 9032egrrtu834g9erbo");
        res.json(notifications);
    });
});

router.get('/all/for/:userId', function (req, res) {
    var receiver = req.params.userId;
    _Notification2.default.find({ toId: receiver }).then(function (notifications) {
        if (notifications == null) res.send("Error : 9032egrrtu834g9erbo");
        res.json(notifications);
    });
});

router.get('/all/:userId', function (req, res) {
    var sender = req.params.userId;
    _Notification2.default.find({
        dueDate: null,
        $or: [{ fromId: sender }, { toId: sender }]
    }).then(function (result) {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }

        res.json(result);
    });
});

router.get('/tasks/all', function (req, res) {
    _Notification2.default.find({
        dueDate: { $ne: null }
    }).then(function (result) {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }
        res.json(result);
    });
});

router.get('/tasks/all/:userId', function (req, res) {
    var sender = req.params.userId;
    _Notification2.default.find({
        dueDate: { $ne: null },
        $or: [{ fromId: sender }, { toId: sender }]
    }).then(function (result) {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }
        res.json(result);
    });
});

router.post('/add', function (req, res) {

    var notification = new _Notification2.default({
        _id: _mongoose2.default.Types.ObjectId(),
        fromId: req.body.fromId,
        toId: req.body.toId,
        from: req.body.from,
        to: req.body.to,
        msg: req.body.msg,
        type: req.body.type,
        dueDate: req.body.dueDate
    });

    notification.save(function (err) {
        if (err) {
            console.log(err);return;
        };
        _Admin2.default.findById(req.body.fromId, function (err, admin) {
            if (err || admin == null) {
                console.log(err);return;
            };

            admin.notifications.push(notification._id);
            admin.save(function (err) {
                if (err) {
                    console.log(err);return;
                };
                _Student2.default.findById(req.body.toId, function (err, student) {
                    if (err || student == null) {
                        console.log(err);return;
                    };

                    student.notifications.push(notification._id);
                    student.save(function (err) {
                        if (err) {
                            console.log(err);return;
                        };

                        var answer = _Admin2.default.findById(admin._id).populate(['documents']).populate(['notifications']).populate(['transactions']).then(function (_admin) {
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