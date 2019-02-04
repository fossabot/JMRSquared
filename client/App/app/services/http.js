const http = require("http");
import store from "../store";
var appSettings = require("application-settings");
import * as connectivity from "tns-core-modules/connectivity";

export default class API {
    constructor(base, master) {
        this.baseUrl = base;
        this.master = master;
        this.auth_token = appSettings.getString("auth_token");
    }

    randomString() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        // then to call it, plus stitch in '4' in the third group
        return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    }

    async handleResponse(result) {
        if (result.statusCode == 200) {
            return true;
        } else if (result.statusCode == 401) {
            try {
                appSettings.remove("UserToken");
                var token = await this.getAuthToken();
                return token;
            } catch (err) {
                this.master.feedback.warning({
                    title: 'Access denied',
                    message: err.message
                });
                return false;
            }
        }
        return false;
    }

    getAuthToken() {
        return new Promise((resolve, reject) => {
            var isNewUser = true;
            var random = this.randomString() + "_" + Date.now();
            var user = appSettings.getString("UserToken");
            var adminID = appSettings.getString("CurrentUserID");
            if (!user) {
                user = {
                    email: random + "@jmrapp.com",
                    password: this.randomString(),
                    adminID: adminID,
                    device_token: appSettings.getString("device_token")
                };
                appSettings.setString("UserToken", JSON.stringify(user));
            } else {
                isNewUser = false;
                user = JSON.parse(user);
                if (!user.adminID && adminID) {
                    isNewUser = true;
                    user = {
                        email: random + "@jmrapp.com",
                        password: this.randomString(),
                        adminID: adminID,
                        device_token: appSettings.getString("device_token")
                    };
                    appSettings.setString("UserToken", JSON.stringify(user));
                }
            }
            console.log('New user', user);
            http
                .request(
                    this.makePost(isNewUser ? "/auth/register" : "/auth/login", {
                        user: user
                    })
                )
                .then(result => {
                    if (result.statusCode == 200) {
                        var _user = result.content.toJSON();
                        appSettings.setString("auth_token", _user.token);
                        resolve(_user.token);
                    } else if (result.statusCode == 512) {
                        appSettings.remove("auth_token");
                        appSettings.remove("UserToken");
                        throw new Error(result.content.toString());
                    } else {
                        throw new Error("Invalid response from the Auth provider");
                    }
                })
                .catch(err => {
                    console.log('error', err)
                    reject(err);
                });
        });
    }

    makeGet(url) {
        return {
            url: this.makeURL(url),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + appSettings.getString("auth_token"),
                CurrentUserID: appSettings.getString("CurrentUserID"),
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
                Authorization: "Token " + appSettings.getString("auth_token"),
                CurrentUserID: appSettings.getString("CurrentUserID"),
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
    adminLogin(user) {
        return new Promise((resolve, reject) => {
            if (this.getInternetStatus() == connectivity.connectionType.none) {
                this.master.feedback.warning({
                    title: "No internet connection",
                    duration: 4000,
                    message: "Please connect to the internet to login."
                });
                reject(new Error("No internet connection."))
            } else {
                http
                    .request(
                        this.makePost("/a/login", user)
                    )
                    .then(async result => {
                        var answer = await this.handleResponse(result);
                        if (answer) {
                            if (answer == true) {
                                resolve(result);
                            } else {
                                return this.adminLogin(user);
                            }
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        })
    }

    addUserDeviceToken(adminID, deviceToken) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost("/a/device/token/add", {
                        adminID: adminID,
                        deviceToken: deviceToken,
                        deviceInfo: this.master.deviceInfo
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        resolve(result);
                    }
                })
                .catch(err => {
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
                    .request(this.makeGet("/b/all/for/" + adminID))
                    .then(result => {
                        console.log("answer", result);
                        console.log('getting', appSettings.getString("auth_token"));
                        var answer = this.handleResponse(result);
                        if (answer) {
                            result = result.content.toJSON();
                            store.commit("cacheBusinesses", {
                                db: this.master.couchDB,
                                api: this,
                                appSettings: appSettings,
                                businesses: result
                            });
                            resolve(result);
                        }
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
                let business = store.state.cache.cachedFullBusiness.filter(
                    b => b._id == businessID
                )[0];
                if (!business) {
                    store.commit("refreshCache", {
                        db: this.master.couchDB,
                        appSettings: appSettings,
                        api: this,
                        doc: "business"
                    });
                    business = store.state.cache.cachedFullBusiness.filter(
                        b => b._id == businessID
                    )[0];
                    if (!business) {
                        reject(new Error("You have no internet connection."));
                    }
                }
                resolve(business);
            } else {
                http
                    .getJSON(this.makeGet(`/b/get/${businessID}/for/${adminID}`))
                    .then(result => {
                        var answer = this.handleResponse(result);
                        if (answer) {

                            store.commit("cacheFullBusiness", {
                                db: this.master.couchDB,
                                api: this,
                                appSettings: appSettings,
                                business: result
                            });
                            resolve(result);
                        }
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
                .getJSON(
                    this.makeGet(`/n/get/new/for/${adminID}/business/${businessID}`)
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        resolve(result);
                        return resolve(result);
                    }
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
                    var answer = this.handleResponse(result);
                    if (answer) {

                        return resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    addPartner(email, pass, numbers, role, username, fullName, businessID = null, adminID = null) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost("/a/add", {
                        email,
                        pass,
                        numbers,
                        role,
                        username,
                        fullName,
                        businessID: businessID,
                        adminID: adminID
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        return resolve(result);
                    }
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
                    var answer = this.handleResponse(result);
                    if (answer) {

                        return resolve(result);
                    }
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
                    var answer = this.handleResponse(result);
                    if (answer) {
                        return resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    getBusinessSettings(businessID) {
        return new Promise((resolve, reject) => {
            http
                .getJSON(this.makeGet("/settings/options/business/types")).then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        return resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    submitTransaction(transaction) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost(`/b/transaction/add`, {
                        adminID: transaction.transacterId,
                        businessID: transaction.businessId,
                        type: transaction.isMoneyIn ? "MONEYIN" : "MONEYOUT",
                        amount: transaction.amount,
                        date: transaction.date,
                        category: transaction.category,
                        client: transaction.clientID,
                        monthOfPayment: transaction.month,
                        description: transaction.description,
                        proof: transaction.evidence
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        resolve(result);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    getAllBusinessTransactions(businessID, existing = []) {
        return new Promise((resolve, reject) => {
            http
                .getJSON(
                    this.makePost(`/b/transactions/for/business/${businessID}`, {
                        existing
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        resolve(result);
                    }
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
                    var answer = this.handleResponse(result);
                    if (answer) {
                        resolve(result);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    submitNotification(notification) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost("/n/add", {
                        notification
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        resolve(result);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    markNotificationAsSeen(notificationID) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost("/n/mark/as/seen", {
                        notificationID
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        return resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    changeBusinessSettings(businessID, settingID, value) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost("/b/set/business/settings", {
                        businessID,
                        settingID,
                        value
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        return resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    changeBusinessTarget(businessID, targetID, enable, value) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost("/b/set/business/target", {
                        businessID,
                        targetID,
                        enable,
                        value
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        return resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    addBusiness(adminID, adminAuthority, business) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost("/b/add/business", {
                        adminID,
                        adminAuthority,
                        business
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        return resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    addBusinessExpense(businessID, value) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost("/b/set/business/expense", {
                        businessID,
                        value
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        return resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    addBusinessIncome(businessID, value) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost("/b/set/business/income", {
                        businessID,
                        value
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        return resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }

    addBusinessPartner(assignedBY, adminID, adminAuthority, businessID) {
        return new Promise((resolve, reject) => {
            http
                .request(
                    this.makePost("/b/assign/to/business", {
                        assignedBY,
                        adminID,
                        adminAuthority,
                        businessID
                    })
                )
                .then(result => {
                    var answer = this.handleResponse(result);
                    if (answer) {
                        return resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }
}