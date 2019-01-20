import Admin from "../models/Admin";
const jwt = require('express-jwt');

function getTokenFromHeaders(req) {
    const {
        headers: {
            authorization,
            currentuserid
        }
    } = req;

    if (authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return '';
};

const auth = {
    required: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders
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
        getToken: '',
        credentialsRequired: false,
    })
};
module.exports = auth;