import mongoose from "mongoose";
var Schema = mongoose.Schema;

const NotificationSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId()
  },
  fromId: {
    type: Schema.Types.ObjectId,
    ref: "Admin"
  },
  toId: {
    type: Schema.Types.ObjectId,
    ref: "Admin"
  },
  businessID: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    default: null
  },
  topic: {
    type: String,
    default: null
  },
  title: String,
  body: String,
  data: Object,
  icon: {
    type: String,
    default: 'bell'
  },
  type: {
    type: String,
    enum: ["REMINDER", "INFO", "WARNING", "ERROR", "SUCCESS"],
    default: "REMINDER"
  },
  status: {
    type: String,
    enum: ["PENDING", "SENT", "SEEN"],
    default: "PENDING"
  },
  viewedDates: [{
    type: Date,
    default: []
  }],
  date: {
    type: Date,
    default: Date.now()
  },
  scheduled: {
    type: Boolean,
    default: false
  },
  scheduleInterval: String, // cron format e.g. * * * * * (seconds{optional} minute hour day month year )
  expiryDate: {
    type: Date,
    default: null
  },
  removed: {
    type: Boolean,
    default: false
  }
});

NotificationSchema.methods.findSimilarTypes = function (cb) {
  return this.model("Animal").find({
      type: this.type
    },
    cb
  );
};

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;