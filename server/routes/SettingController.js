var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

import Setting from "../models/Setting";
import CronJob from "../services/CronManager";
const cronJob = new CronJob();

router.get("/options/business/types", function (req, res) {
  Setting.findOne()
    .then(settings => {
      if (!settings) return res.status(512).send("No settings are avaliable.");
      res.json(settings.options.businessTypes);
    })
    .catch(err => {
      return res.status(512).send("No settings are avaliable.");
    });
});

router.get("/options/business/settings", function (req, res) {
  Setting.findOne()
    .then(settings => {
      if (!settings) return res.status(512).send("No settings are avaliable.");
      res.json(settings.settings);
    })
    .catch(err => {
      return res.status(512).send("No settings are avaliable.");
    });
});

router.get("/cron/reboot", function (req, res) {
  cronJob.fireJobs();
  res.send("Cron rebooted, firing the jobs......");
});

module.exports = router;