'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var NotificationSchema = new _mongoose2.default.Schema({
    _id: { type: Schema.Types.ObjectId, default: _mongoose2.default.Types.ObjectId() },
    fromId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    toId: { type: Schema.Types.ObjectId, ref: 'Student' },
    from: String,
    to: String,
    msg: String,
    type: String,
    done: { type: Boolean, default: false },
    seen: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    //If dueDate is not null then it is a reminder to be sent to the from
    dueDate: { type: Date, default: null },
    removed: { type: Boolean, default: false }
});

NotificationSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({ type: this.type }, cb);
};

var Notification = _mongoose2.default.model('Notification', NotificationSchema);
module.exports = Notification;