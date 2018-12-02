var master = {};
import {
    Couchbase
} from "nativescript-couchbase";
import {
    Feedback,
    FeedbackType,
    FeedbackPosition
}
from "nativescript-feedback";
import API from "./http";
import store from '../store';
var firebase = require("nativescript-plugin-firebase");

master.couchDB = new Couchbase("jmrdb");
master.feedback = new Feedback();
master.approximateNumber = require('../lib/approximate-number');
master.appSettings = require("application-settings");
master.firebase = firebase;
master.device_token = null;

master.http = new API(store.state.settings.baseLink);
console.log('http', master.http);

master.ChangeLog = {
    GetLogs: (version) => {
        return {
            version: '0.3',
            text: `
                    1. Fix for NOT PAID bug.

                    2. Show proof of transactions.

                    3. Added Taxify

                    4. Added Cosmetics

                    5. Shows totals of all platforms

                    6. Made the UI Better

                    7. More bug fixes

                    `
        };
    }
}

master.initFCM = function (self) {
    return new Promise((resolve, reject) => {
        firebase
            .init({
                onMessageReceivedCallback: (message) => {
                    console.log("Notification", message);
                    if (message.foreground) {
                        master.feedback.success({
                            title: message.title,
                            duration: 4000,
                            message: message.body,
                            onTap: () => {
                                if (message.data && message.data.link) {
                                    self.navigate(message.data.link, message.data.props);
                                }
                            }
                        })
                    } else {
                        self.navigate("/login");
                    }
                },
                onPushTokenReceivedCallback: token => {
                    master.feedback.success({
                        title: "Welcome",
                        duration: 10000,
                        message: "We managed to set you up for push notifications"
                    });
                    master.appSettings.setString("device_token", token);
                    master.device_token = token;
                }
            })
            .then(
                instance => {
                    if (master.appSettings.getString("device_token") == null) {
                        firebase.getCurrentPushToken().then((token) => {
                            master.appSettings.setString("device_token", token);
                            master.device_token = token;
                        });
                    }
                    resolve(instance);
                },
                err => {
                    if (err.message.indexOf('already') >= 0) {
                        if (master.appSettings.getString("device_token") == null) {
                            firebase.getCurrentPushToken().then((token) => {
                                master.appSettings.setString("device_token", token);
                                master.device_token = token;
                            });
                        }
                        resolve();
                    } else {
                        reject(err);
                    }
                }
            );
    });
}

export default master;