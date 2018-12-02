export default class API {
    constructor(base) {
        console.log('imported', 'called constructor')
        this.baseUrl = base;
        this.http = require("http");
    }

    makePost(url, content = {}) {
        return {
            url: this.makeURL(url),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            content: JSON.stringify(content)
        }
    }

    makeURL(url) {
        return this.baseUrl + url
    }

    addUserDeviceToken(userID, deviceToken) {
        return new Promise((resolve, reject) => {
            console.log('Update device token', deviceToken);
            http.request(this.makePost("/a/device/token/add", {
                userID: userID,
                deviceToken: deviceToken
            })).then((result) => {
                resolve(result)
            }).catch(err => {
                reject(err);
            });
        });
    }
}