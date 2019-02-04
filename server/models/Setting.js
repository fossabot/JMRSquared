import mongoose from 'mongoose';
var Schema = mongoose.Schema;

// This schema is very STATIC, we only have one document
const SettingSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    targets: [{
        _id: {
            type: Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId()
        },
        enable: Boolean,
        value: Number,
        icon: String,
        title: String,
        description: String
    }],
    settings: {
        business: [{
            // Deep down it knows it is an enum from ( options.businessTypes.type )
            _id: {
                type: Schema.Types.ObjectId,
                default: mongoose.Types.ObjectId()
            },
            toAll: Boolean,
            type: {
                type: String
            }, // e.g Taxify
            title: String,
            description: String,
            icon: String,
            value: Schema.Types.Mixed,
            businessIDs: [{
                type: Schema.Types.ObjectId,
                ref: 'Business',
                default: []
            }]
        }],
        user: [{
            // Deep down it knows it is an enum from ( business.admin.authority )
            _id: {
                type: Schema.Types.ObjectId,
                default: mongoose.Types.ObjectId()
            },
            type: {
                type: String
            }, // e.g CLIENT
            title: String,
            description: String,
            icon: String,
            value: Schema.Types.Mixed,
            adminIDs: [{
                type: Schema.Types.ObjectId,
                ref: 'Admin',
                default: []
            }]
        }]
    },
    options: {
        businessTypes: [{
            _id: {
                type: Schema.Types.ObjectId,
                default: mongoose.Types.ObjectId()
            },
            icon: String,
            type: {
                type: String
            },
            category: String,
            optionals: [{
                title: String,
                icon: String,
                type: String,
                required: Boolean,
                requiredError: {
                    type: String,
                    default: null
                },
                hint: String
            }]
        }]
    },
    date: {
        type: Date,
        default: Date.now
    },
    removed: {
        type: Boolean,
        default: false
    }
});

const Setting = mongoose.model('Setting', SettingSchema);
module.exports = Setting;