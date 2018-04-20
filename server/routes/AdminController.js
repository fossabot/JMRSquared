var express = require('express');
var router = express.Router();

// import the models
import Admin from '../models/Admin';
import Document from '../models/Document';
import Transaction from '../models/Transaction';
import Bug from '../models/Bug';

/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.get('/all', function(req, res) {
    Admin.find().populate(['documents']).populate(['notifications']).populate(['transactions','_id adminID amount type rentTenantName rentMonth description date']).then((admins) => {
        if (admins == null) res.send("Error : 9032rtu834g9erbo");
        res.json(admins);
    });
});

router.get('/GetById/:adminID', function(req, res) {
    var adminID = req.params.adminID;
    Admin.findById(adminID).populate(['documents']).populate(['notifications']).populate(['transactions','_id adminID amount type rentTenantName rentMonth description date']).then((admin) => {
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
        }).populate(['documents']).populate(['notifications']).populate(['transactions','_id adminID amount type rentTenantName rentMonth description date']).then((admin) => {
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
        }).populate(['documents']).populate(['notifications']).populate(['transactions','_id adminID amount type rentTenantName rentMonth description date']).then((admin) => {
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
        numbers:req.body.numbers,
        userName:req.body.username
    });

    admin.save(function(err) {
        if (err) res.send(err);
        res.send("User successfully saved");
    })

});

router.get('/bug/get/:bugId',function(req,res){
    var bugID = req.params.bugId;
    Bug.findById(bugID).then((bug) => {
        if (bug == null) {
            res.status(500);
            res.send("Invalid request");
        } else {
            res.json(bug);
        }
    })
});

router.get('/bug/all', function(req, res) {
    Bug.find({},'_id senderName senderPic bugText date').then((bugs) => {
        if (bugs == null){
            res.status(500);
            res.send("Error : 9032rtu834g9erbo");
        } 
        bugs.reverse();
        res.json(bugs);
    });
});

router.post('/bug/add', function(req, res) {
    var bug = new Bug({
        senderName: req.body.senderName,
        senderPic: req.body.senderPic,
        bugText:req.body.bugText
    });

    bug.save(function(err) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        res.send("Bug added successfully saved");
    })

});


router.get('/document/get/:documentId',function(req,res){
    var documentID = req.params.documentId;
    Document.findById(documentID).then((document) => {
        if (document == null) {
            res.status(500);
            res.send("Invalid request");
        } else {
            res.json(document);
        }
    })
});

router.get('/document/all', function(req, res) {
    Document.find({},'_id title description type date').then((documents) => {
        if (documents == null){
            res.status(500);
            res.send("Error : 9032rtu834g9erbo");
        } 
        documents.reverse();
        res.json(documents);
    });
});

router.post('/document/add', function(req, res) {
    var document = new Document({
        title: req.body.title,
        adminID:req.body.adminID,
        location: req.body.location,
        thumbnail:req.body.thumbnail,
        description:req.body.description,
        type:req.body.type
    });

    document.save(function(err) {
        if (err) {
            res.status(500);
            res.send(err);
        }
        res.send("Document added successfully saved");
    })

});

router.get('/transaction/get/:transactionId',function(req,res){
    var transactionID = req.params.transactionId;
    Transaction.findById(transactionID).populate('adminID','userName').then((transaction) => {
        if (transaction == null) {
            res.status(500);
            res.send("Invalid request");
        } else {
            res.json(transaction);
        }
    })
});

router.get('/transaction/all', function(req, res) {
    Transaction.find({},'_id adminID amount type rentTenantName rentMonth description date').populate('adminID','userName').then((transactions) => {
        if (transactions == null){
            res.status(500);
            res.send("Error : 9032rtu834g9erbo");
        } 
        transactions.reverse();
        res.json(transactions);
    });
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

    transaction.save(function(err) {
        if (err) res.send(err);
        Admin.findById(req.body.adminID,function(err,admin){
            if (err || admin == null)  { console.log(err); return; };

            admin.transactions.push(transaction._id);
            admin.save(function(err){
                if (err)  { console.log(err); return; };
                res.send("Transaction successfully saved");
            });
        });
    })

});


router.get('/notifications/all', function(req, res) {
    Notification.find({dueDate:null}).then((result) => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }

        res.json(result);
    });
});

module.exports = router;