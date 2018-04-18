var Logs = [
    {
        version:'0.1',
        text:
`

1. Added Top Nav on document list.

2. Reminders are being read from the DB.
`
    }
];

function GetLogs(version){
    "use strict";
    return Logs.find(l => l.version == version);
}

exports.GetLogs = GetLogs;
