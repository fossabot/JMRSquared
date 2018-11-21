import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const SettingSchema = new mongoose.Schema({
    _id:  { type: Schema.Types.ObjectId, default :mongoose.Types.ObjectId() },
    settings: [{
         type:Array, default:new Array() 
    }],
    options:Object,
    date: { type: Date, default: Date.now },
    removed: { type: Boolean, default: false }
});

const Setting = mongoose.model('Setting', SettingSchema);
module.exports = Setting;
