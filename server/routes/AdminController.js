var express = require("express");
var router = express.Router();
const auth = require('../config/auth');

import mongoose from "mongoose";
// import the models
import Admin from "../models/Admin";
import Document from "../models/Document";
import Business from "../models/Business";
import Transaction from "../models/Transaction";
import Bug from "../models/Bug";
import Rent from "../models/Rent";
import Student from "../models/Student";
import User from "../models/User";
import FCM from "../services/FirebaseManager";
import helper from '../services/Helper';

/*
  TODO : Add admin
         Remove Admin
         Log in admin
         Get stats involving the admin
                - Notifications sent
                - 
*/

router.get("/all", auth.required, (req, res, next) => {
    Admin.find()
        .populate(["documents"])
        .populate(["notifications"])
        .then(admins => {
            if (admins == null) res.send("Error : 9032rtu834g9erbo");
            res.json(admins);
        });
});

router.post("/block/user/:adminID", auth.required, (req, res, next) => {
    var adminID = req.params.adminID;
    Admin.findById(adminID)
        .then(admin => {
            if (admin == null) res.status(512).send("User not found");
            admin.removed = true;
            admin.save(function () {
                User.deleteMany({
                    adminID: admin._id
                }).then(t => {
                    FCM.sendToUser(admin._id, helper.makePayload('', '', {
                        link: '/home',
                        props: null,
                        deactive: 'true'
                    })).then(v => {
                        res.send("Removed the user.");
                    }).catch(err => {
                        throw err;
                    })
                }).catch(err => {
                    res.status(512).send(err.message);
                });
            })
        });
});

router.get("/GetById/:adminID", function (req, res) {
    var adminID = req.params.adminID;
    Admin.findById(adminID)
        .populate(["documents"])
        .populate(["notifications"])
        .then(admin => {
            if (admin == null) {
                res.status(500);
                res.send("Invalid user");
            } else {
                res.json(admin);
            }
        })
        .catch(err => {
            res.status(500);
            res.send("Unable to log you in");
        });
});

router.post("/login", auth.disabled, (req, res, next) => {
    if (req.body.useEmail) {
        Admin.findOne({
                email: req.body.email,
                pass: req.body.pass
            })
            .populate(["documents"])
            .populate(["notifications"])
            .then(admin => {
                if (admin == null) {
                    res.status(500);
                    res.send("Incorrect log in details");
                } else {
                    res.json(admin);
                }
            });
    } else {
        Admin.findOne({
                numbers: req.body.numbers,
                pass: req.body.pass
            })
            .populate(["documents"])
            .populate(["notifications"])
            .then(admin => {
                if (admin == null) {
                    res.status(500);
                    res.send("Incorrect log in details");
                } else {
                    res.json(admin);
                }
            });
    }
});

router.post("/add", async (req, res) => {
    var admin = new Admin({
        _id: mongoose.Types.ObjectId(),
        email: req.body.email,
        pass: req.body.pass,
        numbers: req.body.numbers,
        role: req.body.role.toUpperCase(),
        userName: req.body.username,
        fullName: req.body.fullName
    });

    try {
        var found = await Admin.findOne({
            $or: [{
                email: new RegExp('\\b' + admin.email + '\\b', 'i')
            }, {
                numbers: new RegExp('\\b' + admin.numbers + '\\b', 'i')
            }, {
                userName: new RegExp('\\b' + admin.userName + '\\b', 'i')
            }]
        });

        if (found) return json.status(512).send("User already exists , choose a different username or email or contact numbers");

    } catch (ex) {

    }

    admin.save(function (err) {
        if (err) return res.status(512).send(err);
        if (req.body.businessID && req.body.adminID) {
            Business.findById(req.body.businessID, {
                logo: 0,
                transactions: 0,
                settings: 0,
                categories: 0,
                targets: 0
            }).then(business => {
                if (business == null)
                    return res.status(512).send("User is saved, but can't link to a business");
                if (!business.admin.some(v => v.id == admin._id)) {
                    business.admin.push({
                        id: admin._id,
                        assignedBY: req.body.adminID,
                        authority: admin.role && admin.role.toUpperCase()
                    });
                }
                business.save(function (err) {
                    if (err) return res.status(512).send(err);
                    return res.send("Client successfully linked to business");
                });
            }).catch(err => {
                return res.status(512).send("User is saved, but can't link to a business , " + err.message);
            });
        } else {
            return res.send(admin._id);
        }
    });
});

router.post("/device/token/add", function (req, res) {
    var adminID = req.body.adminID;
    var deviceToken = req.body.deviceToken;
    var deviceInfo = req.body.deviceInfo;

    Admin.findById(adminID)
        .then(admin => {
            if (admin == null) {
                return res.status(512).send("Invalid user");
            }
            if (!admin.deviceTokens) {
                admin.deviceTokens = new Array();
            }

            var exist = admin.deviceTokens.filter(v => v.token == deviceToken && !v.removed).length;
            if (exist == 0) {
                admin.deviceTokens.push({
                    date: Date.now(),
                    token: deviceToken,
                    deviceInfo: deviceInfo
                });
                admin.save(function (err) {
                    if (err) return res.status(512).send(err);
                    return res.send("Successfully added the new token");
                })
            } else {
                return res.send("Token was already linked to user");
            }
        })
        .catch(err => {
            return res.status(512).send(err.message);
        });
});

router.get("/bug/get/:bugId", function (req, res) {
    var bugID = req.params.bugId;
    Bug.findById(bugID).then(bug => {
        if (bug == null) {
            res.status(500);
            res.send("Invalid request");
        } else {
            res.json(bug);
        }
    });
});

router.get("/bug/all", function (req, res) {
    Bug.find({}, "_id senderName senderPic bugText date").then(bugs => {
        if (bugs == null) {
            res.status(500);
            res.send("Error : 9032rtu834g9erbo");
        }
        bugs.reverse();
        res.json(bugs);
    });
});

router.post("/bug/add", function (req, res) {
    var bug = new Bug({
        _id: mongoose.Types.ObjectId(),
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

router.get("/document/get/:documentId", function (req, res) {
    var documentID = req.params.documentId;
    Document.findById(documentID).then(document => {
        if (document == null) {
            res.status(500);
            res.send("Invalid request");
        } else {
            res.json(document);
        }
    });
});

router.get("/document/all", function (req, res) {
    Document.find({}, "_id title description type date").then(documents => {
        if (documents == null) {
            res.status(500);
            res.send("Error : 9032rtu834g9erbo");
        }
        documents.reverse();
        res.json(documents);
    });
});

router.post("/document/add", function (req, res) {
    var document = new Document({
        _id: mongoose.Types.ObjectId(),
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

// This function will soon be abolute (it returns for properties only)
router.get("/transaction/all", function (req, res) {
    Transaction.find({
                $or: [{
                        source: "PROPERTY"
                    },
                    {
                        source: null
                    }
                ]
            },
            "_id adminID amount type rentTenantName rentMonth description date"
        )
        .populate("adminID", "userName")
        .then(transactions => {
            if (transactions == null) {
                res.status(500);
                res.send("Error : 9032rtu834g9erbo");
            }
            transactions.reverse();
            res.json(transactions);
        })
        .catch(err => {
            res.status(500);
            res.send("Error : " + err.message);
        });
});

// This is the new function to be used
router.get("/transaction/:source/all", function (req, res) {
    var source = req.params.source.toUpperCase();
    Transaction.find({
                source: source
            },
            "_id adminID amount type itemCount carName propertyName productName source rentTenantName rentMonth description date"
        )
        .populate("adminID", "userName")
        .then(transactions => {
            if (transactions == null) {
                res.status(500);
                res.send("Error : 9032rtu834g9erbo");
            }
            transactions.reverse();
            res.json(transactions);
        });
});

router.get("/notifications/all", function (req, res) {
    Notification.find({
        dueDate: null
    }).then(result => {
        if (result == null) {
            res.status(400);
            res.send("Error : 9032egrrtu834g9erbo");
        }

        res.json(result);
    });
});

module.exports = router;