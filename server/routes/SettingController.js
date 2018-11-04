var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

import Setting from "../models/Setting";

router.get("/options/business/types", function (req, res) {
  Setting.find().then(settings => {
    if (settings == null || settings.length == 0) return res.status(512).send("No settings are avaliable.");
    res.json(settings.pop().options["businessTypes"]);
  }).catch(err=>{
    return  res.status(512).send("No settings are avaliable.");
  });
});

module.exports = router;