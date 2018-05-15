'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var DocumentSchema = new _mongoose2.default.Schema({
    _id: { type: Schema.Types.ObjectId, default: _mongoose2.default.Types.ObjectId() },
    adminID: { type: Schema.Types.ObjectId, ref: 'Admin' }, //ForeignKey
    title: String,
    location: String,
    thumbnail: { type: String, default: "ic_picture_as_pdf_black_24dp" },
    description: String,
    type: { type: Object, default: null },
    date: { type: Date, default: Date.now },
    removed: { type: Boolean, default: false }
});

DocumentSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({ type: this.type }, cb);
};

var Document = _mongoose2.default.model('Document', DocumentSchema);
module.exports = Document;