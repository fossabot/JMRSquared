const cron = require("node-cron");
const helper = require("./Helper");

import FCM from "./FirebaseManager";
import mongoose from "mongoose";

import Notification from '../models/Notification'

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
                            notification.status = "SENT";
                            notification.save(function (err) {
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
                            notification.status = "SENT";
                            notification.save(function (err) {
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
}