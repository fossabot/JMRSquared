var Logs = [{
        version: '0.1',
        text: `

1. Added Top Nav on document list.

2. Reminders are being read from the DB.
`
    },
    {
        version: '0.2',
        text: `

1. Added Tenant Dashboard.

2. Fixed the Tenant profile page.

3. Fixed using data and loading from cache

4. Enabled logging in as a tenant
`
    },
    {
        version: '0.3',
        text: `

1. Fix for NOT PAID bug.

2. Show proof of transactions.

3. Added Taxify

4. Added Cosmetics

5. Shows totals of all platforms

6. Made the UI Better

7. More bug fixes

`
    }
];

function GetLogs(version) {
    "use strict";
    return Logs.find(l => l.version == version);
}

exports.GetLogs = GetLogs;