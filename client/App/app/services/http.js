const http = require("http");
import store from "../store";
var appSettings = require("application-settings");
import * as connectivity from "tns-core-modules/connectivity";

export default class API {
    constructor(base, master) {
        this.baseUrl = base;
        this.master = master;
        this.authToken = appSettings.getString("auth_token");
        if (!this.authToken) {
            this.getAuthToken()
                .then(token => {
                    if (token) {
                        this.authToken = token;
                        appSettings.setString("auth_token", this.authToken);
                    } else {
                        throw new Error("Invalid auth_token");
                    }
                })
                .catch(err => {
                    // TODO : What to do if we dont have a token? , SECURITY IS KEY.
                    throw err;
                });
        }
    }

    getAuthToken() {
        return new Promise((resolve, reject) => {
            http
                .request(this.makePost("/token", {
                    email: "sacsac",
                    password: "cwevwvasc",
                    device_token: appSettings.getString(
                        "device_token"
                    )
                }))
                .then(token => {
                    resolve(token);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    makeGet(url) {
        return {
            url: this.makeURL(url),
            headers: {
                "Content-Type": "application/json",
                Authorization: appSettings.getString("auth_token"),
                device_token: appSettings.getString("device_token")
            },
            method: "GET"
        };
    }

    makePost(url, content = {}) {
        return {
            url: this.makeURL(url),
            headers: {
                "Content-Type": "application/json",
                Authorization: appSettings.getString("auth_token"),
                device_token: appSettings.getString("device_token")
            },
            method: "POST",
            content: JSON.stringify(content)
        };
    }

    makeURL(url) {
        return this.baseUrl + url;
    }

    // All calls
    addUserDeviceToken(adminID, deviceToken) {
        return new Promise((resolve, reject) => {
            console.log("Update device token", deviceToken);

            http
                .request(this.makePost(
                    "/a/device/token/add", {
                        adminID: adminID,
                        deviceToken: deviceToken,
                        deviceInfo: this.master.deviceInfo
                    }
                ))
                .then(result => {
                    console.log("ADDTOKEN-success", result);
                    resolve(result);
                })
                .catch(err => {
                    console.log("ADDTOKEN-error", err);
                    reject(err);
                });
        });
    }

    getAllBusinessesForUser(adminID) {
        return new Promise((resolve, reject) => {
            if (this.getInternetStatus() == connectivity.connectionType.none) {
                this.master.feedback.warning({
                    title: "NO INTERNET CONNECTION",
                    duration: 4000,
                    message: "Data loaded might not be recent."
                });
                let businesses = store.state.cache.cachedBusinesses;
                if (!businesses) {
                    store.commit("refreshCache", {
                        db: this.master.couchDB,
                        api: this,
                        appSettings: appSettings,
                        doc: "businesses"
                    });
                    businesses = store.state.cache.cachedBusinesses;
                }
                resolve(businesses);
            } else {
                http
                    .getJSON(this.makeGet("/b/all/for/" + adminID))
                    .then(result => {
                        store.commit("cacheBusinesses", {
                            db: this.master.couchDB,
                            api: this,
                            appSettings: appSettings,
                            businesses: result
                        });
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });
    }

    getBusiness(businessID, adminID) {
        return new Promise((resolve, reject) => {
            if (this.getInternetStatus() == connectivity.connectionType.none) {
                this.master.feedback.warning({
                    title: "NO INTERNET CONNECTION",
                    duration: 4000,
                    message: "Data loaded might not be recent."
                });
                let business = store.state.cache.cachedFullBusiness.filter(b => b._id == businessID)[0];
                console.log("Business", business);
                if (!business) {
                    store.commit("refreshCache", {
                        db: this.master.couchDB,
                        appSettings: appSettings,
                        api: this,
                        doc: "business"
                    });
                    business = store.state.cache.cachedFullBusiness.filter(b => b._id == businessID)[0];
                    if (!business) {
                        reject(new Error("You have no internet connection."));
                    }
                }
                resolve(business);
            } else {
                http
                    .getJSON(this.makeGet(`/b/get/${businessID}/for/${adminID}`))
                    .then(result => {
                        store.commit("cacheFullBusiness", {
                            db: this.master.couchDB,
                            api: this,
                            appSettings: appSettings,
                            business: result
                        });
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });
    }

    getInternetStatus() {
        return connectivity.getConnectionType();
    }

    getNotifications(adminID, businessID) {
        return new Promise((resolve, reject) => {
            http
                .getJSON(this.makeGet(`/n/get/new/for/${adminID}/business/${businessID}`))
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    getPartners(businessID) {
        return new Promise((resolve, reject) => {
            http
                .getJSON(this.makeGet(`/b/get/all/partners/for/${businessID}`))
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    getBusinessIncomes(businessID) {
        return new Promise((resolve, reject) => {
            http
                .getJSON(this.makeGet(`/b/get/all/incomes/for/${businessID}`))
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    getBusinessExpenses(businessID) {
        return new Promise((resolve, reject) => {
            http
                .getJSON(this.makeGet(`/b/get/all/expenses/for/${businessID}`))
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    submitTransaction(transaction) {
        return new Promise((resolve, reject) => {
            http
                .request(this.makePost(
                    `/b/transaction/add`, {
                        adminID: transaction.transacterId,
                        businessID: transaction.businessId,
                        type: transaction.isMoneyIn ?
                            "MONEYIN" : "MONEYOUT",
                        amount: transaction.amount,
                        date: transaction.date,
                        category: transaction.category,
                        client: transaction.clientID,
                        monthOfPayment: transaction.month,
                        description: transaction.description,
                        proof: transaction.evidence
                    }
                ))
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    getAllBusinessTransactions(businessID, existing = []) {
        return new Promise((resolve, reject) => {
            http
                .getJSON(this.makePost(
                    `/b/transactions/for/business/${businessID}`, {
                        existing
                    }
                ))
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    getTransaction(transactionID) {
        return new Promise((resolve, reject) => {
            http
                .getJSON(this.makeGet(`/b/get/transaction/${transactionID}`))
                .then(result => {
                    console.log('transaction........', result);
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    submitNotification(notification) {
        return new Promise((resolve, reject) => {
            http
                .request(this.makePost("/n/add", {
                    notification
                }))
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    markNotificationAsSeen(notificationID) {
        return new Promise((resolve, reject) => {
            http
                .request(this.makePost(
                    "/n/mark/as/seen", {
                        notificationID
                    }
                ))
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    changeBusinessSettings(businessID, settingID, value) {
        return new Promise((resolve, reject) => {
            http
                .request(this.makePost(
                    "/b/set/business/settings", {
                        businessID,
                        settingID,
                        value
                    }
                ))
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    addBusinessExpense(businessID, value) {
        return new Promise((resolve, reject) => {
            http
                .request(this.makePost(
                    "/b/set/business/expense", {
                        businessID,
                        value
                    }
                ))
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    addBusinessIncome(businessID, value) {
        return new Promise((resolve, reject) => {
            http
                .request(this.makePost(
                    "/b/set/business/income", {
                        businessID,
                        value
                    }
                ))
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }
}