import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const BugSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, default :mongoose.Types.ObjectId() },
    bugText: String,
    senderName: String,
    senderPic:String,
    screenshot:{ type: Object, default:null },
    comments:[{type:String}],
    date: { type: Date, default: Date.now() },
    removed: { type: Boolean, default: false }
});

const Bug = mongoose.model('Bug', BugSchema);
module.exports = Bug;