var admin = require("firebase-admin");

var serviceAccount = require("../firebase_service_account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jmrsquared-5872c.firebaseio.com"
});

var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

var FCM = {
    sendToDevice: (registrationToken, payload) => {
        return new Promise((resolve, reject) => {
            admin
                .messaging()
                .sendToDevice(registrationToken, payload, options)
                .then(function(response) {
                    if (response.successCount > 0 && response.failureCount == 0) {
                        return resolve(response.results);
                    } else {
                        throw response.results;
                    }
                })
                .catch(function(error) {
                    return reject(error);
                });
        });
    },
    sendToTopic: (topic, payload) => {
        return new Promise((resolve, reject) => {
            admin
                .messaging()
                .sendToTopic(topic, payload)
                .then(function(response) {
                    if (response.successCount > 0 && response.failureCount == 0) {
                        return resolve(response.results);
                    } else {
                        throw response.results;
                    }
                })
                .catch(function(error) {
                    return reject(error);
                });
        });
    },
    subscribeToTopic: (registrationToken, topic) => {
        return new Promise((resolve, reject) => {
            admin
                .messaging()
                .subscribeToTopic(registrationToken, topic)
                .then(function(response) {
                    if (response.successCount > 0 && response.failureCount == 0) {
                        return resolve(response.results);
                    } else {
                        throw response.results;
                    }
                })
                .catch(function(error) {
                    return reject(error);
                });
        });
    },
    subscribeToTopic: (registrationToken, topic) => {
        return new Promise((resolve, reject) => {
            admin
                .messaging()
                .subscribeToTopic(registrationToken, topic)
                .then(function(response) {
                    if (response.successCount > 0 && response.failureCount == 0) {
                        return resolve(response.results);
                    } else {
                        throw response.results;
                    }
                })
                .catch(function(error) {
                    return reject(error);
                });
        });
    }
};

export default FCM;