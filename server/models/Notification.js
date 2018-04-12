import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const NotificationSchema = new mongoose.Schema({
    _id:  { type: Schema.Types.ObjectId, default :mongoose.Types.ObjectId() },
    fromId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    toId: { type: Schema.Types.ObjectId, ref: 'Student' },
    from: String,
    to: String,
    msg: String,
    type: String,
    done:{ type:Boolean,default:false },
    seen: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    //If dueDate is not null then it is a reminder to be sent to the from
    dueDate: { type:Date , default: null },
    removed: { type: Boolean, default: false }
});

NotificationSchema.methods.findSimilarTypes = function(cb) {
    return this.model('Animal').find({ type: this.type }, cb);
};

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;