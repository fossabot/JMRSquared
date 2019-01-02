const helper = {};
import moment from 'moment';

helper.makePayload = function (title = "Title", body = "This is the body", data = {
    link: "/link",
    props: JSON.stringify({})
}) {
    if (data.link != '/link') {
        data.props = JSON.stringify(data.props);
    }
    return {
        notification: {
            title: title,
            body: body
        },
        data: data
    }
}

helper.GetTransactionProfitAndRevenue = function (transactions, maxMonths = 5, maxWeeks = 3, maxDays = 3) {
    var revenues = [];
    if (!transactions) transactions = [];
    transactions.forEach(value => {
        // Calculate the overrall profit
        if (true) {
            if (!revenues.find(v => v.key == 'overall')) {
                revenues.push({
                    key: 'overall',
                    revenue: 0,
                    profit: 0,
                    title: 'Overall',
                    type: 'Overall'
                });
            }
            revenues.filter(v => v.key == 'overall').map(v => {
                if (value.type == "MoneyIn") {
                    v.revenue += Number(value.amount);
                    v.profit += Number(value.amount);
                } else if (value.type == "MoneyOut") {
                    v.profit -= Number(value.amount);
                }
                return v;
            });
        }

        // Calculate monthly profit and revenue
        var monthsDiff = moment().endOf('month').diff(value.date, 'months');
        if (monthsDiff >= 0 && monthsDiff < maxMonths) {
            var monthName = moment().endOf('month').subtract(monthsDiff, 'months').format("MMMM");
            if (!revenues.find(v => v.key == monthsDiff && v.title == monthName)) {
                revenues.push({
                    key: monthsDiff,
                    revenue: 0,
                    profit: 0,
                    title: monthName,
                    type: "monthly"
                });
            }
            revenues.filter(v => v.key == monthsDiff && v.type == "monthly").map(v => {
                if (value.type == "MoneyIn") {
                    v.revenue += Number(value.amount);
                    v.profit += Number(value.amount);
                } else if (value.type == "MoneyOut") {
                    v.profit -= Number(value.amount);
                }
                return v;
            });
        }

        // Calculate weekly profit and revenue
        var weeksDiff = moment().endOf('week').diff(value.date, "weeks");
        if (weeksDiff >= 0 && weeksDiff < maxWeeks) {
            var weekDate = moment().startOf('week').subtract(weeksDiff, 'weeks').format("Do MMMM YYYY");
            if (!revenues.find(v => v.key == weeksDiff && v.title == weekDate)) {
                revenues.push({
                    key: weeksDiff,
                    revenue: 0,
                    profit: 0,
                    title: weekDate,
                    type: "weekly"
                });
            }
            revenues.filter(v => v.key == weeksDiff && v.type == "weekly").map(v => {
                if (value.type == "MoneyIn") {
                    v.revenue += Number(value.amount);
                    v.profit += Number(value.amount);
                } else if (value.type == "MoneyOut") {
                    v.profit -= Number(value.amount);
                }
                return v;
            });
        }

        // Calculate daily profit and revenue
        var daysDiff = moment().endOf("day").diff(value.date, "days");
        if (daysDiff >= 0 && daysDiff < maxDays) {
            var dayDate = moment().endOf("day").subtract(daysDiff, 'days').format("dddd Do MMMM");
            if (!revenues.find(v => v.key == daysDiff && v.title == dayDate)) {
                revenues.push({
                    key: daysDiff,
                    revenue: 0,
                    profit: 0,
                    title: dayDate,
                    type: "daily"
                });
            }
            revenues.filter(v => v.key == daysDiff && v.title == dayDate).map(v => {
                if (value.type == "MoneyIn") {
                    v.revenue += Number(value.amount);
                    v.profit += Number(value.amount);
                } else if (value.type == "MoneyOut") {
                    v.profit -= Number(value.amount);
                }
                return v;
            });
        }
    });
    return revenues;
}

module.exports = helper;