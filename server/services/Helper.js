import moment from 'moment';

export default class helper {
    static makePayload(title = "Title", body = "This is the body", data = {
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

    static GetTransactionBusinessTargetsFromTransactions(targets, transactions) {
        if (!transactions) transactions = [];
        if (!targets) targets = [];

        transactions = transactions.filter(t => !isNaN(t.amount) && moment(t.date).isValid())

        var mappedTargets = targets.filter(v => v.enable && v.value).map(target => {
            var mappedTarget = {
                title: '',
                value: 0
            };
            if (target.title && target.title.toLowerCase().indexOf('monthly') >= 0) {
                mappedTarget.title = `Amount due on ${moment().endOf('month').format('Do MMMM YYYY')}`
                mappedTarget.value = transactions.filter(t => moment().endOf('month').diff(t.date, 'months') == 0).map(v => Number(v.amount)).reduce((a, b) => a + b, 0);
            } else if (target.title && target.title.toLowerCase().indexOf('weekly') >= 0) {
                mappedTarget.title = `Amount due this week on ${moment().endOf('week').format('dddd')} the ${moment().endOf('week').format('Do')} `
                mappedTarget.value = transactions.filter(t => moment().endOf('week').diff(t.date, 'week') == 0).map(v => Number(v.amount)).reduce((a, b) => a + b, 0);
            } else if (target.title && target.title.toLowerCase().indexOf('daily') >= 0) {
                mappedTarget.title = `Amount due today ${moment().endOf('day').format('Do MMMM')}`
                mappedTarget.value = transactions.filter(t => moment().endOf('week').diff(t.date, 'week') == 0).map(v => Number(v.amount)).reduce((a, b) => a + b, 0);
            }
            mappedTarget.value = target.value - mappedTarget.value;
            return mappedTarget;
        });
        return mappedTargets;
    }

    static GetTransactionProfitAndRevenue(transactions, maxMonths = 5, maxWeeks = 3, maxDays = 3) {
        var revenues = [];
        if (!transactions) transactions = [];
        transactions.filter(v => moment(v.date).isValid() && !isNaN(v.amount)).forEach(value => {
            // Calculate the overrall profit
            if (true) {
                if (!revenues.some(v => v.key == 'overall')) {
                    revenues.push({
                        key: 'overall',
                        revenue: 0,
                        profit: 0,
                        title: 'Overall',
                        type: 'Overall'
                    });
                }
                revenues.filter(v => v.key == 'overall').map(v => {
                    if (value.type == "MONEYIN") {
                        v.revenue += Number(value.amount);
                        v.profit += Number(value.amount);
                    } else if (value.type == "MONEYOUT") {
                        v.profit -= Number(value.amount);
                    }
                    return v;
                });
            }

            // Calculate monthly profit and revenue
            var monthsDiff = moment().endOf('month').diff(value.date, 'months');
            if (monthsDiff >= 0 && monthsDiff < maxMonths) {
                var monthName = moment().endOf('month').subtract(monthsDiff, 'months').format("MMMM");
                if (!revenues.some(v => v.key == monthsDiff && v.title == monthName)) {
                    revenues.push({
                        key: monthsDiff,
                        revenue: 0,
                        profit: 0,
                        title: monthName,
                        type: "monthly"
                    });
                }
                revenues.filter(v => v.key == monthsDiff && v.type == "monthly").map(v => {
                    if (value.type == "MONEYIN") {
                        v.revenue += Number(value.amount);
                        v.profit += Number(value.amount);
                    } else if (value.type == "MONEYOUT") {
                        v.profit -= Number(value.amount);
                    }
                    return v;
                });
            }

            // Calculate weekly profit and revenue
            var weeksDiff = moment().endOf('week').diff(value.date, "weeks");
            if (weeksDiff >= 0 && weeksDiff < maxWeeks) {
                var weekDate = moment().startOf('week').subtract(weeksDiff, 'weeks').format("Do MMMM YYYY");
                if (!revenues.some(v => v.key == weeksDiff && v.title == weekDate)) {
                    revenues.push({
                        key: weeksDiff,
                        revenue: 0,
                        profit: 0,
                        title: weekDate,
                        type: "weekly"
                    });
                }
                revenues.filter(v => v.key == weeksDiff && v.type == "weekly").map(v => {
                    if (value.type == "MONEYIN") {
                        v.revenue += Number(value.amount);
                        v.profit += Number(value.amount);
                    } else if (value.type == "MONEYOUT") {
                        v.profit -= Number(value.amount);
                    }
                    return v;
                });
            }

            // Calculate daily profit and revenue
            var daysDiff = moment().endOf("day").diff(value.date, "days");
            if (daysDiff >= 0 && daysDiff < maxDays) {
                var dayDate = moment().endOf("day").subtract(daysDiff, 'days').format("dddd Do MMMM");
                if (!revenues.some(v => v.key == daysDiff && v.title == dayDate)) {
                    revenues.push({
                        key: daysDiff,
                        revenue: 0,
                        profit: 0,
                        title: dayDate,
                        type: "daily"
                    });
                }
                revenues.filter(v => v.key == daysDiff && v.title == dayDate).map(v => {
                    if (value.type == "MONEYIN") {
                        v.revenue += Number(value.amount);
                        v.profit += Number(value.amount);
                    } else if (value.type == "MONEYOUT") {
                        v.profit -= Number(value.amount);
                    }
                    return v;
                });
            }
        });
        return revenues;
    }
}