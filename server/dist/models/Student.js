'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var StudentSchema = new _mongoose2.default.Schema({
    _id: { type: Schema.Types.ObjectId, default: _mongoose2.default.Types.ObjectId() },
    addedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    idNumber: Number,
    username: String,
    firstName: String,
    surname: String,
    room: String,
    gender: String,
    email: String,
    profilePic: String,
    password: String,
    contactNumbers: Number,
    active: { type: Boolean, default: true },
    nextOfKin: {
        name: String,
        surname: String,
        relationship: String,
        contact: Number
    },
    sponsor: String,
    lease: {
        rentDueOn: String,
        startDate: Date,
        endDate: Date,
        rentAmount: Number,
        depositAmount: Number
    }, // ForeignKey
    lastUpdatedAt: { type: Date, default: Date.now() },
    lastActivityDate: { type: Date, default: Date.now() },
    date: { type: Date, default: Date.now() },
    removed: { type: Boolean, default: false },
    // Relationships
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    rents: [{ type: Schema.Types.ObjectId, ref: 'Rent' }]
});

StudentSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({ type: this.type }, cb);
};

var Student = _mongoose2.default.model('Student', StudentSchema);
module.exports = Student;