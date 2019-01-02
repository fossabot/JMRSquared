var express = require("express");
var router = express.Router();

import mongoose from "mongoose";
import Admin from "../models/Admin";
import Business from "../models/Business";
import Transaction from "../models/Transaction";
import FCM from "../services/FirebaseManager";
const helper = require("../services/Helper");

router.get("/all/for/:userid", function (req, res) {
  var adminID = req.params.userid;
  Admin.findById(adminID)
    .then(admin => {
      if (admin == null)
        return res
          .status(512)
          .send("Admin of id " + adminID + " does not exist");
      Business.find({
        "admin.id": adminID
      }, {
        logo: 0,
        transactions: 0
      }).then(businesses => {
        if (businesses == null)
          return res.status(512).send("Error : 9032rtu834g9erbo");
        res.json(businesses);
      });
    })
    .catch(err => {
      return res.status(512).send(err);
    });
});

router.get("/get/:business/for/:userid", function (req, res) {
  var businessID = req.params.business;
  var adminID = req.params.userid;
  Business.findById(businessID)
    .populate("admin.id", '_id userName fullName')
    .then(business => {
      if (business == null)
        return res.status(512).send("The requested business is not avaliable");
      if (
        !business.admin ||
        !business.admin.find(a => a.id._id == adminID)
      )
        return res
          .status(512)
          .send("You are not part of the requested business");
      res.json(business);
    })
    .catch(err => {
      return res.status(512).send(err);
    });
});

router.post("/set/business/settings", function (req, res) {
  var businessID = req.body.businessID;
  var settingID = req.body.settingID;
  var value = req.body.value;

  Business.findById(businessID).then(business => {
    if (!business) return res.status(512).send("The requested business is not avaliable");

    business.settings.find(s => s._id == settingID).value = value

    business.markModified('settings');
    business.save(function (err) {
      if (err) return res.status(512).send(err);
      res.send("Business setting successfully saved");
    });
  }).catch(err => {
    return res.status(512).send(err);
  })
});

router.get("/get/all/partners/for/:business", function (req, res) {
  var businessID = req.params.business;
  Business.findById(businessID)
    .populate("admin.id")
    .then(business => {
      if (business == null)
        return res.status(512).send("The requested business is not avaliable");
      if (!business.admin) res.json([]);
      res.json(business.admin.map(b => b.id));
    })
    .catch(err => {
      return res.status(512).send(err);
    });
});

router.post("/add/business", function (req, res) {
  var adminID = req.body.adminID;
  var adminAuthority = req.body.adminAuthority;
  var _business = req.body.business;
  if (_business == null)
    return res
      .status(512)
      .send("Invalid request , make sure you have all the required attributes");

  Admin.findById(adminID)
    .then(admin => {
      if (admin == null)
        return res
          .status(512)
          .send("Admin of id " + adminID + " does not exist");
      var business = new Business({
        _id: mongoose.Types.ObjectId(),
        admin: [{
          id: adminID,
          authority: adminAuthority && adminAuthority.toUpperCase()
        }],
        name: _business.name,
        logo: _business.logo,
        description: _business.description,
        type: _business.type
      });

      business.save(function (err) {
        if (err) return res.status(512).send(err);
        res.send("Business successfully saved");
      });
    })
    .catch(err => {
      return res.status(512).send(err);
    });
});

router.post("/assign/to/business", function (req, res) {
  var adminID = req.body.adminID;
  var adminAuthority = req.body.adminAuthority;
  var businessID = req.body.businessID;
  var assignedBY = req.body.assignedBY;
  if (businessID == null)
    return res
      .status(512)
      .send("Invalid request , make sure you have all the required attributes");
  Admin.findById(adminID)
    .then(admin => {
      if (admin == null)
        return res
          .status(512)
          .send("Admin of id " + adminID + " does not exist");

      Business.findById(businessID).then(business => {
        if (business == null)
          return res.status(512).send("Error : 9032rtu834g9erbo");
        business.admin.push({
          id: adminID,
          assignedBY: assignedBY,
          authority: adminAuthority && adminAuthority.toUpperCase()
        });
        business.save(function (err) {
          if (err) return res.status(512).send(err);
          res.send("Client successfully linked to business");
        });
      });
    })
    .catch(err => {
      return res.status(512).send(err);
    });
});

// This is the newest function to be used
router.post("/transactions/for/business/:businessId", function (req, res) {
  var businessID = req.params.businessId;
  var existing = req.body.existing;
  if (!existing) existing = []
  Transaction.find({
        businessID: businessID,
        '_id': {
          "$nin": existing
        }
      },
      "_id adminID amount type itemCount carName propertyName productName source rentTenantName rentMonth description date"
    )
    .populate("adminID", "userName")
    .then(transactions => {
      if (transactions == null) {
        res.status(500);
        res.send("Error : 9032rtu834g9erbo");
      }
      console.log("Got " + transactions.length + " transactions");
      transactions.reverse();
      const revenues = helper.GetTransactionProfitAndRevenue(transactions);
      res.json({
        transactions,
        revenues
      });
    }).catch(err => {
      res.send(err);
    });
});

router.post("/transaction/add", async function (req, res) {
  var transaction = new Transaction({
    _id: mongoose.Types.ObjectId(),
    adminID: req.body.adminID, //ForeignKey
    businessID: req.body.businessID,
    date: req.body.date,
    type: req.body.type.toUpperCase(),
    amount: req.body.amount,
    monthOfPayment: req.body.monthOfPayment,
    client: req.body.client,
    category: req.body.category,
    description: req.body.description,
    proof: req.body.proof
  });

  var business = await Business.findById(transaction.businessID);
  if (!business) {
    return res.status(512).send("The provided business is not avaliable");
  }
  if (transaction.category && !business.categories.find(v => v == transaction.category.toLowerCase())) {
    business.categories.push(transaction.category.toLowerCase());
    business.save(function (err) {
      if (err) {
        return res.status(512).send("The selected category is invalid, please try again");
      }
    })
  }

  var admin = await Admin.findById(transaction.adminID);
  if (!admin) {
    return res.status(512).send("The provided user is not avaliable");
  }

  var _client = null
  if (transaction.client) {
    _client = await Admin.findById(transaction.client);
    if (!_client) {
      return res.status(512).send("The provided client is not avaliable");
    }
  }

  transaction.save(function (err) {
    if (err) return res.status(512).send(err);
    // TODO : Notify the other admins about this transaction.
    if (business && business.admin) {
      business.admin.filter(b => b.authority == 'ADMIN').map(b => {
        var title = `Money was ${transaction.type == 'MONEYIN' ? 'deposited into' : 'withdrawn from'} ${business.name}`;
        var body = `R${transaction.amount} was ${transaction.type == 'MONEYIN' ? 'deposited' : 'withdrawn'} by ${admin.userName} ${transaction.client ? 'from ' + _client.userName : ''} for ${transaction.category}`;
        var data = {
          link: "/open/transaction",
          props: JSON.stringify({
            businessID: transaction.businessID,
            transactionID: transaction._id
          })
        }
        FCM.sendToUser(b.id, helper.makePayload(title, body, data)).then(v => {
          console.log('Notifications success', v);
        }).catch(err => {
          console.log('Notifications error', err);
        })
        return b;
      });
    }

    return res.send("Transaction successfully saved");
  });
});

module.exports = router;