import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const AdminSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    userName: String,
    pass: String,
    email: String,
    role: {
        type: String,
        enum: ['ALL', 'PROPERTY', 'TAXIFY', 'COSMETICS'],
        default: 'PROPERTY'
    },
    numbers: Number,
    profilePic: String,
    date: {
        type: Date,
        default: Date.now()
    },
    removed: {
        type: Boolean,
        default: false
    },
    //Relationships
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    documents: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }]
});

AdminSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};


const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;