const cron = require("node-cron");
import FCM from "./FirebaseManager";
var tasks = [];

var CronJob = {
    schedule: (interval, registrationToken, payload) => {
        let task = cron.schedule(interval, () => {
            console.log('cron', 'Performing the cron job....');
            FCM.sendToDevice(registrationToken, payload).then(v => {
                console.log('cron', 'Cron job done....');
            }).catch(err => {
                console.log('cron', 'Error occured during job....');
            })
        });
        tasks.push(task);
    },
    getTasks: () => tasks.map(t => t.status)
}

export default CronJob;