var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
import Admin from "../models/Admin";
import Business from "../models/Business";

router.get("/all/for/:userID", async function (req, res) {
  var adminID = req.params.adminID;

  var admin = await Admin.findById(adminID);
  res.send(admin);
  if (admin == null) return res.status(512).send("Admin of id " + adminID + " does not exist");
  Business.find({
    adminID: adminID
  }).then(businesses => {
    if (businesses == null) return res.status(512).send("Error : 9032rtu834g9erbo");
    res.json(businesses);
  });
});

router.post("/add/business", async function (req, res) {
  var adminID = req.body.adminID;
  var adminAuthority = req.body.adminAuthority;
  var _business = req.body.business;

  var admin = await Admin.findById(adminID);
  if (admin == null) return res.status(512).send("Admin of id " + adminID + " does not exist");
  if (_business == null) return res.status(512).send("Invalid request , make sure you have all the required attributes");

  var business = new Business({
    _id: mongoose.Types.ObjectId(),
    admin: [{
      id: adminID,
      authority: adminAuthority && adminAuthority.toUpperCase()
    }],
    name: _business.name,
    icon: _business.icon,
    logo: _business.logo,
    type: _business.type && _business.type.toUpperCase(),
    description: _business.description
  });

  business.save(function (err) {
    if (err) return res.status(512).send(err);
    res.send("Business successfully saved");
  });
});

router.post("/assign/to/business", async function (req, res) {
  var adminID = req.body.adminID;
  var adminAuthority = req.body.adminAuthority;
  var businessID = req.body.businessID;

  var admin = await Admin.findById(adminID);
  if (admin == null) return res.status(512).send("Admin of id " + adminID + " does not exist");
  if (businessID == null) return res.status(512).send("Invalid request , make sure you have all the required attributes");

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
});

module.exports = router;