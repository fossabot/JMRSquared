'use strict';

var _Test = require('../models/Test');

var _Test2 = _interopRequireDefault(_Test);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');
var router = express.Router();
var db = require('../app');

var _user = new _Test2.default(db.sequelize);

var Op = _sequelize2.default.Op;

/*
  TODO: Get one student - DONE
        Get a list of them - DONE
        Search for a student - DONE
        Add a student
        Remove a student (Not to delete)
        Edit student details
        Login student
*/

router.get('/students', function (req, res) {
  _user.User.findAll().then(function (answer) {
    res.json(answer);
  });
});

router.get('/:id/get', function (req, res) {
  var id = req.params.id;
  if (isNaN(id)) {
    res.status(404);
    res.send("Invalid ID - " + id);
  } else {
    _user.User.findById(id).then(function (answer) {
      console.log(answer);
      if (answer == null) {
        res.send("No student with id : " + id);
      } else {
        res.json(answer);
      }
    });
  }
});

/**
 * POST methods
 */

router.post('/:text/search', function (req, res) {
  var text = req.params.text;
  if (text == null || text.length < 3) {
    res.status(404);
    res.send("Cannot search for - " + text);
  } else {
    _user.User.findAll({
      where: _defineProperty({}, Op.or, [{
        lastName: _defineProperty({}, Op.like, '%' + text + '%')
      }, {
        firstName: _defineProperty({}, Op.like, '%' + text + '%')
      }])
    }).then(function (answer) {
      if (answer == null || answer.length != 1) {
        res.send("firstname or lastname that match : " + text);
      } else {
        res.json(answer);
      }
    });
  }
});

router.post('/add', function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  if (firstName == null || lastName == null) {
    res.status(404);
    res.send("Name can not be null");
  } else if (firstName.length < 3) {
    res.status(404);
    res.send("first name is too short");
  } else if (lastName.length < 3) {
    res.status(404);
    res.send("last name is too short");
  } else {
    _user.User.sync({ force: true }).then(function () {
      return _user.User.create({
        firstName: firstName,
        lastName: lastName
      });
    });
    res.send("added " + firstName);
  }
});

router.post('/:id/remove', function (req, res) {
  //Dont forget this is just to disable the nigga

});

router.post('/:id/update', function (req, res) {
  //Dont forget this is just to disable the nigga

});

module.exports = router;