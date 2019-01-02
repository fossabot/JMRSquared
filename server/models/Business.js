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
        },
        assignedBY: {
            type: Schema.Types.ObjectId,
            default: null,
            ref: 'Admin'
        },
        settings: Array
    }],
    name: String,
    icon: String,
    logo: String,
    type: Object,
    settings: Array,
    description: String,
    categories: [String],
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    date: {
        type: Date,
        default: Date.now()
    },
    removed: {
        type: Boolean,
        default: false
    }
});

BusinessSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

const Business = mongoose.model('Business', BusinessSchema);
module.exports = Business;