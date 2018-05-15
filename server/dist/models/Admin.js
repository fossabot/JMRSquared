'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var AdminSchema = new _mongoose2.default.Schema({
    _id: { type: Schema.Types.ObjectId, default: _mongoose2.default.Types.ObjectId() },
    userName: String,
    pass: String,
    email: String,
    role: String,
    numbers: Number,
    profilePic: String,
    date: { type: Date, default: Date.now() },
    removed: { type: Boolean, default: false },
    //Relationships
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }]
});

AdminSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({ type: this.type }, cb);
};

var Admin = _mongoose2.default.model('Admin', AdminSchema);
module.exports = Admin;