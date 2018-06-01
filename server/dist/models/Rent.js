'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var RentSchema = new _mongoose2.default.Schema({
    _id: { type: Schema.Types.ObjectId, default: _mongoose2.default.Types.ObjectId() },
    studentID: { type: Schema.Types.ObjectId, ref: 'Student' }, // ForeignKey
    datePaid: Date,
    monthOfPayment: String,
    amount: Number,
    isDeposit: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    removed: { type: Boolean, default: false }
});

var Rent = _mongoose2.default.model('Rent', RentSchema);
module.exports = Rent;