var express = require('express');
var router = express.Router();
import mongoose from 'mongoose';

// import the models
import Notification from '../models/Notification';
import Admin from '../models/Admin';
import Student from '../models/Student';

/*
  TODO : Add notification (done)
         Remove notification
         Search
         Mark as seen
         Get all  (done)
         Get all for user (done),
         Get all from user (done)
*/

router.get('/search/:searchText', function(req, res) {
    var text = req.params.searchText;
    Notification.find({
        fromId:req.params.adminId,dueDate:null
    }).populate('fromId').populate('toId').then((notifications) => {
        if (notifications == null) res.send("Error : 9032egrrtu834g9erbo");
        res.json(notifications);
    });
});

router.get('/all/for/:userId', function(req, res) {
    var receiver = req.params.userId;
    Notification.find({ toId: receiver }).then((notifications) => {
        if (notifications == null) res.send("Error : 9032egrrtu834g9erbo");
        res.json(notifications);
    });
});

router.get('/all/:userId', function(req, res) {
    let sender = req.params.userId;
    Notification.find({
        dueDate:null,
        $or : [{fromId:sender},{toId:sender}]
    }).then((result) => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }

        res.json(result);
    });
});


router.get('/tasks/all', function(req, res) {
    Notification.find({
        dueDate: { $ne: null }
    }).then((result) => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }
        res.json(result);
    });
});

router.get('/tasks/all/:userId', function(req, res) {
    var sender = req.params.userId;
    Notification.find({
        dueDate: { $ne: null } ,
        $or : [{fromId:sender},{toId:sender}]
    }).then((result) => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }
        res.json(result);
    });
});

router.post('/add', function(req, res) {

    var notification = new Notification({
        _id:mongoose.Types.ObjectId(),
        fromId:req.body.fromId,
        toId: req.body.toId,
        from: req.body.from,
        to:req.body.to,
        msg:req.body.msg,
        type: req.body.type,
        dueDate:req.body.dueDate
    });

    notification.save(function(err) {
        if (err) { console.log(err); return; };
        Admin.findById(req.body.fromId,function(err,admin){
            if (err || admin == null)  { console.log(err); return; };

            admin.notifications.push(notification._id);
            admin.save(function(err){
                if (err)  { console.log(err); return; };
                Student.findById(req.body.toId,function(err,student){
                    if (err || student == null)  { console.log(err); return; };

                    student.notifications.push(notification._id);
                    student.save(function(err){
                        if (err)  { console.log(err); return; };
                       
                        var answer = Admin.findById(admin._id).populate(['documents']).populate(['notifications']).populate(['transactions']).then((_admin) => {
                            if (_admin == null) {
                                res.status(500);
                                res.send("User not found");
                            } else {
                                console.log("Returning admin " + _admin._id);
                                res.json(_admin);
                            }
                        })

                        //Done ...
                    });
                });

            });
            
        });

        res.json("Notification sent to " + req.body.to);
    })
});

module.exports = router;