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
var firebase = require("nativescript-plugin-firebase");

master.couchDB = new Couchbase("jmrdb");
master.feedback = new Feedback();
master.approximateNumber = require('../lib/approximate-number');
master.appSettings = require("application-settings");
master.firebase = firebase;

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
    let device_token = null;
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
                        title: "Got your access token",
                        duration: 4000,
                        message: token
                    });
                    master.appSettings.setString("device_token", token);
                    device_token = token;
                }
            })
            .then(
                instance => {
                    if (master.appSettings.getString("device_token") == null) {
                        firebase.getCurrentPushToken().then((token) => {
                            master.appSettings.setString("device_token", token);
                            device_token = token;
                        });
                    }
                    resolve(instance);
                },
                err => {
                    if (err.message.indexOf('already') >= 0) {
                        if (master.appSettings.getString("device_token") == null) {
                            firebase.getCurrentPushToken().then((token) => {
                                master.appSettings.setString("device_token", token);
                                device_token = token;
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