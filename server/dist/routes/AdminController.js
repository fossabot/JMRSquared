'use strict';

var _Admin = require('../models/Admin');

var _Admin2 = _interopRequireDefault(_Admin);

var _Document = require('../models/Document');

var _Document2 = _interopRequireDefault(_Document);

var _Transaction = require('../models/Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

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
    _Admin2.default.find().populate(['documents']).populate(['notifications']).populate(['transactions']).then(function (admins) {
        if (admins == null) res.send("Error : 9032rtu834g9erbo");
        res.json(admins);
    });
});

router.get('/GetById/:adminID', function (req, res) {
    var adminID = req.params.adminID;
    _Admin2.default.findById(adminID).populate(['documents']).populate(['notifications']).populate(['transactions']).then(function (admin) {
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
        }).populate(['documents']).populate(['notifications']).populate(['transactions']).then(function (admin) {
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
        }).populate(['documents']).populate(['notifications']).populate(['transactions']).then(function (admin) {
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
        numbers: req.body.numbers
    });

    admin.save(function (err) {
        if (err) res.send(err);
        res.send("User successfully saved");
    });
});

router.post('/transaction/add', function (req, res) {

    var transaction = new _Transaction2.default({
        adminID: req.body.adminID, //ForeignKey
        amount: req.body.amount,
        type: req.body.type,
        rentTenantName: req.body.rentTenantName,
        rentMonth: req.body.rentMonth,
        description: req.body.description,
        proof: req.body.proof,
        date: req.body.date
    });

    console.log(transaction);
    res.json(transaction);

    // transaction.save(function(err) {
    //     if (err) res.send(err);
    //     res.send("User successfully saved");
    // })
});

module.exports = router;