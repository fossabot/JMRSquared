const cron = require("node-cron");
const helper = require("./Helper");

import FCM from "./FirebaseManager";
import mongoose from "mongoose";

import Notification from '../models/Notification'
import Setting from '../models/Setting'
import Business from '../models/Business'

export default class CronJob {
    constructor() {
        this.tasks = [];
    }

    schedule(interval, registrationToken, payload, toTopic = false, notificationID = null) {
        console.log('cron', `Scheduled a job (${interval}) to ${registrationToken}`);
        let task = cron.schedule(interval, () => {
            console.log('cron', 'Performing the cron job....');
            if (toTopic) {
                FCM.sendToTopic(registrationToken, payload).then(v => {
                    if (notificationID) {
                        Notification.findById(notificationID).then(notification => {
                            if (notification == null) throw "Scheduled notification does not exist (anymore) , " + notificationID
                            notification.status = "SENT";
                            notification.save(function(err) {
                                if (err) throw "Unable to save notification status change , " + err.message
                            })
                        }).catch(err => {
                            console.log('Notification status change', err)
                        });
                    }
                    console.log('cron', 'Cron job done....');
                }).catch(err => {
                    console.log('cron', err);
                })
            } else {
                FCM.sendToDevice(registrationToken, payload).then(v => {
                    if (notificationID) {
                        Notification.findById(notificationID).then(notification => {
                            if (notification == null) throw "Scheduled notification does not exist (anymore) , " + notificationID
                            notification.status = "SENT";
                            notification.save(function(err) {
                                if (err) throw "Unable to save notification status change , " + err.message
                            })
                        }).catch(err => {
                            console.log('Notification status change', err)
                        });
                    }
                }).catch(err => {
                    console.log('cron', err);
                })
            }
        });
        this.tasks.push(task);
    }

    getTasks() {
        return this.tasks.map(t => t.status)
    }

    // This is called on app.js (everytime the server starts)
    fireJobs() {
        this.resendNotifications();
        this.createIDForStaticFields();
        this.populateBusinessSettings();
        this.populateBusinessTargets();
    }

    // A list of jobs that can be fired.
    resendNotifications() {
        Notification.find({
            status: 'PENDING',
            scheduled: true,
            removed: false,
            expiryDate: {
                $gte: Date.now()
            }
        }).populate('toId').then(notifications => {
            if (notifications == null) return console.log(`Error while reading notifications to re-shedule.`);
            console.log(`Re-scheduling ${ notifications.length } notifications ....`);
            notifications.map(notification => {
                var payload = helper.makePayload(notification.title, notification.body, notification.data);
                if (notification.topic != null) {
                    this.schedule(notification.scheduleInterval, notification.topic, payload, true);
                } else if (notification.toId) {
                    if (notification.toId.deviceTokens && notification.toId.deviceTokens.filter(d => !d.removed && d.token).length > 0) {
                        notification.toId.deviceTokens.map(t => t.token).forEach(device_token => {
                            this.schedule(notification.scheduleInterval, device_token, payload);
                        });
                    } else {
                        console.log(`${ notification.toId.userName } was suppose to be sent a notification , but there is no device linked to them ....`);
                    }
                }
            })
        });
    }

    createIDForStaticFields() {
        Setting.findOne().then(settings => {
            var count = 0;
            settings.settings.business.filter(bs => !bs._id).forEach(victim => {
                victim._id = mongoose.Types.ObjectId();
                count++;
            });

            settings.settings.user.filter(bs => !bs._id).forEach(victim => {
                victim._id = mongoose.Types.ObjectId();
                count++;
            });

            settings.options.businessTypes.filter(bs => !bs._id).forEach(victim => {
                victim._id = mongoose.Types.ObjectId();
                count++;
            });

            settings.save(function(err) {
                if (err) throw err;
                console.log(`${count} settings got new ids`);
            })
        }).catch(err => {
            throw err;
        });
    }

    populateBusinessSettings() {
        Setting.findOne().then(settings => {
            const businessSettings = settings.settings.business;
            Business.find({
                $or: [{
                        removed: false
                    },
                    {
                        removed: null
                    }
                ]
            }).then(businesses => {
                if (!businesses) throw "Unable to find any business that matches";
                businessSettings.forEach(businessSetting => {
                    if (!businessSetting.businessIDs) businessSetting.businessIDs = [];
                    businesses.filter(b => (businessSetting.type == b.type.type || businessSetting.toAll) && (!b.settings || businessSetting.businessIDs.filter(s => s == b._id.toString()).length == 0)).forEach(business => {
                        if (!business.settings) {
                            business.settings = [];
                        }
                        let {
                            businessIDs,
                            ...businessSettingClone
                        } = businessSetting.toObject();

                        if (businessSettingClone.toAll) {
                            businessSettingClone.type = business.type.type
                        }

                        business.settings.push(businessSettingClone);
                        business.save(function(err) {
                            if (err) throw err;
                            Setting.findOne().then(settingsInner => {
                                var count = 0;
                                settingsInner.settings.business.filter(bs => (bs.type == business.type.type || bs.toAll) && (!bs.businessIDs || bs.businessIDs.filter(bsID => bsID == business._id).length == 0)).forEach(victim => {
                                    if (!victim.businessIDs) {
                                        victim.businessIDs = []
                                    }
                                    victim.businessIDs.push(business._id);
                                    count++;
                                });
                                settingsInner.save(function(errr) {
                                    if (errr) throw errr;
                                    console.log(`A business (${business.type.type}) was linked to ${count} settings.`);
                                })
                            });
                        })
                    });
                });
            }).catch(err => {
                console.log('businessGettingError', err)
            });

        });
    }

    populateBusinessTargets() {
        Setting.findOne().then(settings => {
            var targets = settings.targets;
            targets.filter(t => !t._id).forEach(async t => {
                t._id = mongoose.Types.ObjectId();
                console.log("Saving .... " + t._id);
                await settings.save();
            });

            Business.find({
                $or: [{
                        removed: false
                    },
                    {
                        removed: null
                    }
                ]
            }).then(businesses => {
                if (!businesses) throw "Unable to find any business that matches";
                targets.forEach(target => {
                    businesses.forEach(business => {
                        if (!business.targets.find(v => v._id == target._id.toString())) {
                            business.targets.push(target);
                            business.save(function(err) {
                                if (err) throw err;
                                console.log(`A business (${business.name}) got a new target ${target.title}`);
                            });
                        }
                    });

                });

                console.log(`All targets are in sync.`);
            }).catch(err => {
                console.log('businessGettingError', err)
            });
        });
    }
}