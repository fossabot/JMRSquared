'use strict';

var _Admin = require('../models/Admin');

var _Admin2 = _interopRequireDefault(_Admin);

var _Document = require('../models/Document');

var _Document2 = _interopRequireDefault(_Document);

var _Transaction = require('../models/Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

var _Bug = require('../models/Bug');

var _Bug2 = _interopRequireDefault(_Bug);

var _Rent = require('../models/Rent');

var _Rent2 = _interopRequireDefault(_Rent);

var _Student = require('../models/Student');

var _Student2 = _interopRequireDefault(_Student);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();

// import the models


/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.get('/all', function (req, res) {
    _Admin2.default.find().populate(['documents']).populate(['notifications']).then(function (admins) {
        if (admins == null) res.send("Error : 9032rtu834g9erbo");
        res.json(admins);
    });
});

router.get('/GetById/:adminID', function (req, res) {
    var adminID = req.params.adminID;
    _Admin2.default.findById(adminID).populate(['documents']).populate(['notifications']).then(function (admin) {
        if (admin == null) {
            res.status(500);
            res.send("Invalid user");
        } else {
            res.json(admin);
        }
    }).catch(function (err) {
        res.status(500);
        res.send("Unable to log you in");
    });
});

router.post('/login', function (req, res) {
    if (req.body.useEmail) {
        _Admin2.default.findOne({
            email: req.body.email,
            pass: req.body.pass
        }).populate(['documents']).populate(['notifications']).then(function (admin) {
            if (admin == null) {
                res.status(500);
                res.send("Incorrect log in details");
            } else {
                res.json(admin);
            }
        });
    } else {
        _Admin2.default.findOne({
            numbers: req.body.numbers,
            pass: req.body.pass
        }).populate(['documents']).populate(['notifications']).then(function (admin) {
            if (admin == null) {
                res.status(500);
                res.send("Incorrect log in details");
            } else {
                res.json(admin);
            }
        });
    }
});

router.post('/add', function (req, res) {

    var admin = new _Admin2.default({
        email: req.body.email,
        pass: req.body.pass,
        numbers: req.body.numbers,
        userName: req.body.username
    });

    admin.save(function (err) {
        if (err) res.send(err);
        res.send("User successfully saved");
    });
});

router.get('/bug/get/:bugId', function (req, res) {
    var bugID = req.params.bugId;
    _Bug2.default.findById(bugID).then(function (bug) {
        if (bug == null) {
            res.status(500);
            res.send("Invalid request");
        } else {
            res.json(bug);
        }
    });
});

router.get('/bug/all', function (req, res) {
    _Bug2.default.find({}, '_id senderName senderPic bugText date').then(function (bugs) {
        if (bugs == null) {
            res.status(500);
            res.send("Error : 9032rtu834g9erbo");
        }
        bugs.reverse();
        res.json(bugs);
    });
});

router.post('/bug/add', function (req, res) {
    var bug = new _Bug2.default({
        senderName: req.body.senderName,
        senderPic: req.body.senderPic,
        bugText: req.body.bugText
    });

    bug.save(function (err) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        res.send("Bug added successfully saved");
    });
});

router.get('/document/get/:documentId', function (req, res) {
    var documentID = req.params.documentId;
    _Document2.default.findById(documentID).then(function (document) {
        if (document == null) {
            res.status(500);
            res.send("Invalid request");
        } else {
            res.json(document);
        }
    });
});

router.get('/document/all', function (req, res) {
    _Document2.default.find({}, '_id title description type date').then(function (documents) {
        if (documents == null) {
            res.status(500);
            res.send("Error : 9032rtu834g9erbo");
        }
        documents.reverse();
        res.json(documents);
    });
});

router.post('/document/add', function (req, res) {
    var document = new _Document2.default({
        title: req.body.title,
        adminID: req.body.adminID,
        location: req.body.location,
        thumbnail: req.body.thumbnail,
        description: req.body.description,
        type: req.body.type
    });

    document.save(function (err) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        res.send("Document added successfully saved");
    });
});

router.get('/transaction/get/:transactionId', function (req, res) {
    var transactionID = req.params.transactionId;
    _Transaction2.default.findById(transactionID).populate('adminID', 'userName').then(function (transaction) {
        if (transaction == null) {
            res.status(500);
            res.send("Invalid request");
        } else {
            res.json(transaction);
        }
    });
});

router.get('/transaction/all', function (req, res) {
    _Transaction2.default.find({}, '_id adminID amount type rentTenantName rentMonth description date').populate('adminID', 'userName').then(function (transactions) {
        if (transactions == null) {
            res.status(500);
            res.send("Error : 9032rtu834g9erbo");
        }
        transactions.reverse();
        res.json(transactions);
    });
});

router.post('/transaction/add', function (req, res) {

    var transaction = new _Transaction2.default({
        adminID: req.body.adminID, //ForeignKey
        amount: req.body.amount,
        type: req.body.type,
        rentTenantID: req.body.rentTenantID,
        rentTenantName: req.body.rentTenantName,
        rentMonth: req.body.rentMonth,
        description: req.body.description,
        proof: req.body.proof,
        date: req.body.date
    });

    transaction.save(function (err) {
        if (err) res.send(err);
        _Admin2.default.findById(req.body.adminID, function (err, admin) {
            if (err || admin == null) {
                console.log(err);return;
            };

            admin.transactions.push(transaction._id);
            admin.save(function (err) {
                if (err) {
                    console.log(err);return;
                };
                if (req.body.type == 'Rent') {
                    var rent = new _Rent2.default({
                        studentID: req.body.rentTenantID,
                        datePaid: req.body.date,
                        monthOfPayment: req.body.rentMonth,
                        amount: req.body.amount
                    });

                    rent.save(function (err) {
                        if (err) {
                            console.log(err);return;
                        };
                        _Student2.default.findById(req.body.rentTenantID, function (err, student) {
                            if (err || student == null) {
                                console.log(err);return;
                            };
                            student.rents.push(rent._id);
                            student.save(function (err) {
                                if (err) {
                                    console.log(err);return;
                                };
                                res.send("Rent payment successfully saved");
                            });
                        });
                    });
                } else {

                    console.log("On else");
                    res.send("Transaction successfully saved");
                }
            });
        });
    });
});

router.get('/notifications/all', function (req, res) {
    Notification.find({ dueDate: null }).then(function (result) {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }

        res.json(result);
    });
});

module.exports = router;