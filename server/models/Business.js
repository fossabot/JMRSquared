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
            default: "WORKER"
        }
    }],
    name: String,
    icon: String,
    logo: String,
    type: {
        type: String,
        enum: ['SERVICE', 'MANUFACTORING', 'MERCHANDISING'],
        default: "SERVICE"
    },
    // e.g Taxify , Cosmetics , Property
    category: String,
    description: String,
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
});

BusinessSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

const Business = mongoose.model('Business', BusinessSchema);
module.exports = Business;