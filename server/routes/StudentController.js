var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

import Student from "../models/Student";

import Rent from "../models/Rent";

/*
  TODO: Get one student - DONE
        Get a list of them - DONE
        Search for a student - DONE
        Add a student
        Remove a student (Not to delete)
        Edit student details
        Login student
*/

router.get("/rents/all", function (req, res) {
  Rent.find().then(rents => {
    if (rents == null) res.send("Error : 90ty32rtu834g9erbo");
    res.json(rents);
  });
});

router.get("/students/all", function (req, res) {
  Student.find({
      "active": true
    })
    .populate(["rents"])
    .then(students => {
      if (students == null) res.send("Error : 9032rtu834g9erbo");
      res.json(students);
    });
});

router.get("/students/all/names", function (req, res) {
  Student.find({
    "active": true
  }, "_id username").then(students => {
    if (students == null) res.send("Error : 9032rtu834g9erbo");
    res.json(students);
  });
});

router.get("/:id/get", function (req, res) {
  let id = req.params.id;
  if (id == null) {
    res.status(404);
    res.send("Invalid ID > " + id);
  } else {
    Student.findById(id).then(student => {
      if (student == null) {
        res.status(404);
        res.send("No student with id : " + id);
      } else {
        res.json(student);
      }
    });
  }
});

/**
 * POST methods
 */

router.post("/:text/search", function (req, res) {
  let text = req.params.text;
  if (text == null || text.length < 3) {
    res.status(404);
    res.send("Cannot search for - " + text);
  } else {
    Student.find({
      where: {
        [Op.or]: [{
            lastName: {
              [Op.like]: "%" + text + "%"
            }
          },
          {
            firstName: {
              [Op.like]: "%" + text + "%"
            }
          }
        ]
      }
    }).then(answer => {
      if (answer == null || answer.length != 1) {
        res.send("firstname or lastname that match : " + text);
      } else {
        res.json(answer);
      }
    });
  }
});

router.post("/login", function (req, res) {
  //Dont forget this is just to disable the nigga
  if (req.body.useEmail) {
    Student.findOne({
      email: req.body.email,
      password: req.body.pass
    }).then(student => {
      if (student == null) {
        res.status(500);
        res.send("Incorrect log in details");
      } else {
        res.json(student);
      }
    });
  } else {
    Student.findOne({
      contactNumbers: req.body.numbers,
      password: req.body.pass
    }).then(student => {
      if (student == null) {
        res.status(500);
        res.send("Incorrect log in details");
      } else {
        res.json(student);
      }
    });
  }
});

router.post("/add", function (req, res) {
  console.log(req.body);
  req.body._id = mongoose.Types.ObjectId();
  Student.find()
    .or([{
        username: req.body.username
      },
      {
        contactNumbers: req.body.contactNumbers
      },
      {
        firstName: req.body.firstName,
        surname: req.body.surname
      }
    ])
    .then(s => {
      console.log(s);
      if (s.length == 0) {
        if (req.body.username == null || req.body.username.length < 2) {
          res.status(404);
          res.send("Username is required");
        } else if (req.body.firstName == null || req.body.surname == null) {
          res.status(404);
          res.send("Name can not be null");
        } else if (
          req.body.contactNumbers.length != 10 &&
          !isNaN(req.body.contactNumbers)
        ) {
          res.status(404);
          res.send("Contact numbers must be 10 digits long");
        } else {
          var student = new Student(req.body);
          student.save(function (err) {
            if (err) {
              console.log("Error .....");
              console.log(err);
              res.status(402);
              res.send(err);
            }
            res.send(student._id);
          });
        }
      } else {
        res.status(400);
        res.send("User already exist");
      }
    });
});

router.post("/:id/remove", function (req, res) {
  //Dont forget this is just to disable the nigga
  let id = req.params.id;
  if (id == null) {
    res.status(404);
    res.send("Invalid ID > " + id);
  } else {
    Student.findById(id).then(student => {
      if (student == null) {
        res.status(404);
        res.send("No student with id : " + id);
      } else {
        student.active = false;
        student.save(function (err) {
          if (err) {
            console.log("Error .....");
            console.log(err);
            res.status(402);
            res.send(err);
          }
          res.json(student);
        });
      }
    });
  }
});

router.post("/:id/update", function (req, res) {
  //Dont forget this is just to disable the nigga
});

module.exports = router;