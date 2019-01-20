const mongoose = require('mongoose');
const passport = require('../config/passport');
const auth = require('../config/auth');
import Admin from "../models/Admin";
const router = require('express').Router();

import User from "../models/User";

router.get('/', auth.required, (req, res, next) => {
    res.send("You are authenticated!");
});

router.post('/register', auth.disabled, (req, res, next) => {
    const {
        body: {
            user
        }
    } = req;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    const finalUser = new User(user);
    finalUser.createdDate = Date.now();
    finalUser.setPassword(user.password);
    finalUser.adminID = user.adminID;

    return finalUser.save()
        .then(() => {
            return passport.authenticate('local', {
                session: false
            }, (err, passportUser, info) => {
                if (err) {
                    return next(err);
                }

                if (user.adminID) {
                    Admin.findById(user.adminID).then(user => {
                        if (user.removed) {
                            return res.status(512).send("The user is currently removed");
                        } else {
                            if (passportUser) {
                                const user = passportUser;
                                user.token = passportUser.generateJWT();
                                user.lastUsedDate = Date.now();
                                return res.json(user.toAuthJSON());
                            }
                        }
                    }).catch(err => {
                        return res.status(512).send("Invalid user");
                    });
                } else {
                    if (passportUser) {
                        const user = passportUser;
                        user.token = passportUser.generateJWT();
                        user.lastUsedDate = Date.now();
                        return res.json(user.toAuthJSON());
                    }
                }
            })(req, res, next);
        });
});

router.post('/login', auth.disabled, (req, res, next) => {
    const {
        body: {
            user
        }
    } = req;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', {
        session: false
    }, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }

        if (user.adminID) {
            Admin.findById(user.adminID).then(user => {
                if (user.removed) {
                    return res.status(512).send("The user is currently removed");
                } else {
                    if (passportUser) {
                        const user = passportUser;
                        user.token = passportUser.generateJWT();
                        user.lastUsedDate = Date.now();
                        return res.json(user.toAuthJSON());
                    }
                }
            }).catch(err => {
                return res.status(512).send("Invalid user");
            });
        } else {
            if (passportUser) {
                const user = passportUser;
                user.token = passportUser.generateJWT();
                user.lastUsedDate = Date.now();
                return res.json(user.toAuthJSON());
            }
        }
    })(req, res, next);
});
module.exports = router;