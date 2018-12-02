const http = require("http");
export default class API {
    constructor(base) {
        console.log('imported', 'called constructor')
        this.baseUrl = base;
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

    addUserDeviceToken(adminID, deviceToken) {
        return new Promise((resolve, reject) => {
            console.log('Update device token', deviceToken);
            http.request(this.makePost("/a/device/token/add", {
                adminID: adminID,
                deviceToken: deviceToken
            })).then((result) => {
                console.log("ADDTOKEN-success", result)
                resolve(result)
            }).catch(err => {
                console.log("ADDTOKEN-error", err)
                reject(err);
            });
        });
    }
}