const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {
    Schema
} = mongoose;

const UserSchema = new Schema({
    email: String,
    adminID: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    hash: String,
    salt: String,
    createdDate: Date,
    lastUsedDate: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 999999);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

UserSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        adminID: this.adminID,
        token: this.generateJWT(),
        createdDate: this.createdDate,
        lastUsedDate: this.lastUsedDate
    };
};

const User = mongoose.model('User', UserSchema);
module.exports = User;