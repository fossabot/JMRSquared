import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const DocumentSchema = new mongoose.Schema({
    _id:  { type: Schema.Types.ObjectId, default :mongoose.Types.ObjectId() },
    adminID: { type: Schema.Types.ObjectId, ref: 'Admin' }, //ForeignKey
    title: String,
    location: String,
    thumbnail:{ type:String, default:"ic_picture_as_pdf_black_24dp"},
    description: String,
    type: { type: Object, default: null },
    date: { type: Date, default: Date.now },
    removed: { type: Boolean, default: false }
});

DocumentSchema.methods.findSimilarTypes = function(cb) {
    return this.model('Animal').find({ type: this.type }, cb);
};

const Document = mongoose.model('Document', DocumentSchema);
module.exports = Document;