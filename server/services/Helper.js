const helper = {};
helper.makePayload = function(title = "Title", body = "This is the body", data = { link: "/link", props: {} }) {
    return {
        notification: {
            title: title,
            body: body
        },
        data: data
    }
}

module.exports = helper;