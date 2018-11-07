var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
import Admin from "../models/Admin";
import Business from "../models/Business";

router.get("/all/for/:userid", function (req, res) {
  var adminID = req.params.userid;
  Admin.findById(adminID).then(admin => {
    if (admin == null) return res.status(512).send("Admin of id " + adminID + " does not exist");
    Business.find({
      'admin.id': adminID
    }, {
      logo: 0,
      transactions: 0
    }).then(businesses => {
      if (businesses == null) return res.status(512).send("Error : 9032rtu834g9erbo");
      res.json(businesses);
    });
  }).catch(err => {
    return res.status(512).send(err);
  });
});

router.get("/get/:business/for/:userid", function (req, res) {
  var businessID = req.params.business;
  var adminID = req.params.userid;
  Business.findById(businessID).then(business => {
    if (business == null) return res.status(512).send("The requested business is not avaliable");
    if (!business.admin || !business.admin.id || business.admin.id.filter(a => a == adminID).length == 0) return res.status(512).send("You are not part of the requested business");
    res.json(business);
  }).catch(err => {
    return res.status(512).send(err);
  });
})

router.post("/add/business", function (req, res) {
  var adminID = req.body.adminID;
  var adminAuthority = req.body.adminAuthority;
  var _business = req.body.business;
  if (_business == null) return res.status(512).send("Invalid request , make sure you have all the required attributes");

  Admin.findById(adminID).then(admin => {
    if (admin == null) return res.status(512).send("Admin of id " + adminID + " does not exist");
    var business = new Business({
      _id: mongoose.Types.ObjectId(),
      admin: [{
        id: adminID,
        authority: adminAuthority && adminAuthority.toUpperCase()
      }],
      name: _business.name,
      logo: _business.logo,
      description: _business.description,
      type: _business.type,
    });

    business.save(function (err) {
      if (err) return res.status(512).send(err);
      res.send("Business successfully saved");
    });
  }).catch(err => {
    return res.status(512).send(err);
  });
});

router.post("/assign/to/business", function (req, res) {
  var adminID = req.body.adminID;
  var adminAuthority = req.body.adminAuthority;
  var businessID = req.body.businessID;
  if (businessID == null) return res.status(512).send("Invalid request , make sure you have all the required attributes");
  Admin.findById(adminID).then(admin => {
    if (admin == null) return res.status(512).send("Admin of id " + adminID + " does not exist");

    Business.findById(businessID).then(business => {
      if (business == null) return res.status(512).send("Error : 9032rtu834g9erbo");
      business.admin.push({
        id: adminID,
        authority: adminAuthority && adminAuthority.toUpperCase()
      });
      business.save(function (err) {
        if (err) return res.status(512).send(err);
        res.send("Client successfully linked to business");
      });
    });
  }).catch(err => {
    return res.status(512).send(err);
  });
});

module.exports = router;