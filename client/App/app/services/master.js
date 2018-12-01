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

master.initFCM = function () {
    let device_token = null;
    firebase
        .init({
            onMessageReceivedCallback: message => {
                master.feedback.success({
                    title: message.title,
                    duration: 4000,
                    message: message.body
                });
                // if your server passed a custom property called 'foo', then do this:
                // console.log("Value of 'foo': " + message.data.foo);
            },
            onPushTokenReceivedCallback: token => {
                master.feedback.success({
                    title: "Got your access token",
                    duration: 4000,
                    message: token
                });
                appSettings.setString("device_token", token);
                device_token = token;
            }
        })
        .then(
            instance => {
                console.log('tag', "firebase.init done")
                master.feedback.success({
                    title: "firebase.init done",
                    duration: 4000
                });
            },
            err => {
                console.log('tag', err)
                master.feedback.success({
                    title: "Firebase cannot connect",
                    duration: 4000,
                    message: err.message
                });
            }
        );
    if (appSettings.getString("device_token") == null) {
        firebase.getCurrentPushToken().then((token) => {
            appSettings.setString("device_token", token);
            device_token = token;
        });
    }
}

export default master;