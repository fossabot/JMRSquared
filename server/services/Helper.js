const helper = {};
helper.makePayload = function(title = "Title", body = "This is the body", data = { link: "/link", props: JSON.stringify({}) }) {
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

module.exports = helper;