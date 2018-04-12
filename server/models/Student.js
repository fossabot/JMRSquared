import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const StudentSchema = new mongoose.Schema({
    _id:  { type: Schema.Types.ObjectId, default :mongoose.Types.ObjectId() },
    addedBy:{ type: Schema.Types.ObjectId, ref: 'Admin' },
    idNumber:Number,
    username: String,
    firstName: String,
    surname: String,
    room: String,
    gender:String,
    email:String,
    profilePic:String,
    password:String,
    contactNumbers:Number,
    active:{ type: Boolean, default: true },
    nextOfKin:{
        name:String,
        surname:String,
        relationship:String,
        contact:Number
    },
    sponsor:String,
    lease:{
        rentDueOn:String,
        startDate:Date,
        endDate:Date,
        rentAmount:Number,
        depositAmount:Number
    }, // ForeignKey
    lastUpdatedAt: { type: Date, default: Date.now() },
    lastActivityDate: { type: Date, default: Date.now() },
    date: { type: Date, default: Date.now() },
    removed: { type: Boolean, default: false },
    // Relationships
    notifications:[{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    rents:[{ type: Schema.Types.ObjectId, ref: 'Rent' }]
});

StudentSchema.methods.findSimilarTypes = function(cb) {
    return this.model('Animal').find({ type: this.type }, cb);
};

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;