import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const AdminSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    userName: String,
    fullName: String,
    pass: String,
    email: String,
    role: {
        type: String,
        enum: ['ALL', 'PROPERTY', 'TAXIFY', 'COSMETICS', 'WORKER'],
        default: 'WORKER'
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
    }],
    deviceTokens: [{
        date: {
            type: Date
        },
        lastActiveDate: {
            type: Date,
            default: new Date()
        },
        token: {
            type: String
        },
        deviceInfo: {
            deviceType: {
                type: String,
                default: null
            },
            screen: {
                width: String,
                height: String,
                scale: String,
                widthPixels: String,
                heightPixels: String
            },
            model: {
                type: String,
                default: null
            },
            manufacturer: {
                type: String,
                default: null
            },
            manufacturer: {
                type: String,
                default: null
            },
            os: {
                type: String,
                default: null
            },
            osVersion: {
                type: String,
                default: null
            },
            sdkVersion: {
                type: String,
                default: null
            },
            language: {
                type: String,
                default: null
            },
        },
        removed: {
            type: Boolean,
            default: false
        }
    }]
});

AdminSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};


const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;