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
        ref: 'Business'
    },
    amount: String,
    type: {
        type: String,
        enum: ['MONEYIN', 'MONEYOUT'],
        default: "MONEYIN"
    },
    category: String,
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    monthOfPayment: {
        type: String,
        default: null
    },
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
    }
});

TransactionSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;