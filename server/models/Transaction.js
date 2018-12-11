import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const TransactionSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    adminID: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    }, //ForeignKey
    businessID: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        default: mongoose.Types.ObjectId('5be20bfc65aaf50f2b0a839b')
    },
    amount: String,
    itemCount: {
        type: Number,
        default: null
    },
    carName: {
        type: String,
        default: null
    },
    propertyName: {
        type: String,
        default: null
    },
    productName: {
        type: String,
        default: null
    },
    //Withdraw , Deposit , Rent
    type: {
        type: String,
        enum: ['WITHDRAW', 'DEPOSIT', 'RENT'],
        default: "DEPOSIT"
    },
    rentTenantID: String,
    rentTenantName: String,
    rentMonth: String,
    description: String,
    proof: {
        type: Object,
        default: null
    },
    insertedDate: {
        type: Date,
        default: Date.now()
    },
    date: {
        type: Date,
        default: Date.now()
    },
    removed: {
        type: Boolean,
        default: false
    },
    source: {
        type: String,
        enum: ['All', 'PROPERTY', 'TAXIFY', 'COSMETICS'],
        default: 'PROPERTY'
    },
});

TransactionSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;