import User from "../models/User";
const jwt = require('express-jwt');
const getTokenFromHeaders = async (req) => {
    const {
        headers: {
            authorization,
            CurrentUserID
        }
    } = req;

    if (authorization && authorization.split(' ')[0] === 'Token') {
        if (!CurrentUserID) {
            return authorization.split(' ')[1];
        } else {
            try {
                var user = await Admin.findById(CurrentUserID);
                if (!user || user.removed) {
                    throw new Error("User is removed");
                }
                return authorization.split(' ')[1];
            } catch (err) {
                return null;
            }
        }
    }
    return null;
};

const auth = {
    required: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
    disabled: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: null,
        credentialsRequired: false,
    })
};
module.exports = auth;