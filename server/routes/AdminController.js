var express = require('express');
var router = express.Router();

// import the models
import Admin from '../models/Admin';
import Document from '../models/Document';
import Transaction from '../models/Transaction';

/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.get('/all', function(req, res) {
    Admin.find().populate(['documents']).populate(['notifications']).populate(['transactions']).then((admins) => {
        if (admins == null) res.send("Error : 9032rtu834g9erbo");
        res.json(admins);
    });
});

router.get('/GetById/:adminID', function(req, res) {
    var adminID = req.params.adminID;
    Admin.findById(adminID).populate(['documents']).populate(['notifications']).populate(['transactions']).then((admin) => {
        if (admin == null) {
            res.status(500);
            res.send("Invalid user");
        } else {
            res.json(admin);
        }
    }).catch(err => {
        res.status(500);
        res.send("Unable to log you in");
    });
});


router.post('/login', function(req, res) {
    if(req.body.useEmail){
        Admin.findOne({
            email: req.body.email,
            pass: req.body.pass
        }).populate(['documents']).populate(['notifications']).populate(['transactions']).then((admin) => {
            if (admin == null) {
                res.status(500);
                res.send("Incorrect log in details");
            } else {
                res.json(admin);
            }
        })
    }else{
        Admin.findOne({
            numbers: req.body.numbers,
            pass: req.body.pass
        }).populate(['documents']).populate(['notifications']).populate(['transactions']).then((admin) => {
            if (admin == null) {
                res.status(500);
                res.send("Incorrect log in details");
            } else {
                res.json(admin);
            }
        })
    }
});

router.post('/add', function(req, res) {

    var admin = new Admin({
        email: req.body.email,
        pass: req.body.pass,
        numbers:req.body.numbers
    });

    admin.save(function(err) {
        if (err) res.send(err);
        res.send("User successfully saved");
    })

});

router.post('/transaction/add', function(req, res) {

    var transaction = new Transaction({
        adminID:req.body.adminID, //ForeignKey
        amount: req.body.amount,
        type: req.body.type,
        rentTenantName: req.body.rentTenantName,
        rentMonth: req.body.rentMonth,
        description: req.body.description,
        proof: req.body.proof,
        date:req.body.date
    });

    console.log(transaction);
    res.json(transaction);

    // transaction.save(function(err) {
    //     if (err) res.send(err);
    //     res.send("User successfully saved");
    // })

});

module.exports = router;