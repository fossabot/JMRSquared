import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const BusinessSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    admin: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Admin'
        },
        authority: {
            type: String,
            enum: ['ADMIN', 'CLIENT', 'WORKER'],
            default: "CLIENT"
        }
    }],
    name: String,
    icon: String,
    type: {
        type: String,
        enum: ['SERVICE', 'SERVICE-CLIENTS', 'MERCHANDISING'],
        default: "SERVICE"
    },
    typeDescription: String,
    description: String,
});

BusinessSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

const Business = mongoose.model('Business', BusinessSchema);
module.exports = Business;