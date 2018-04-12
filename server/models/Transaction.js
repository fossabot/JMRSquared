import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const TransactionSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, default :mongoose.Types.ObjectId() },
    adminID: { type: Schema.Types.ObjectId, ref: 'Admin' }, //ForeignKey
    amount: String,
    //Withdraw , Deposit , Rent
    type: { type: String, default: "Deposit" },
    rentTenantName:String,
    rentMonth:String,
    description: String,
    proof: { type: Object, default: null },
    date: { type: Date, default: Date.now() },
    removed: { type: Boolean, default: false }
});

TransactionSchema.methods.findSimilarTypes = function(cb) {
    return this.model('Animal').find({ type: this.type }, cb);
};

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;