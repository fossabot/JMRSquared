# JMRSquared
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FJMRSquared%2FJMRSquared.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FJMRSquared%2FJMRSquared?ref=badge_shield)

Property management system


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FJMRSquared%2FJMRSquared.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FJMRSquared%2FJMRSquared?ref=badge_large)

## Files to ignore while going live

### server/bin/www

> #### Dev
>
> `app.set("port", 3000)`

### server/app.js

> #### Dev
>
> ```
> mongoose
>   .connect("mongodb://localhost:27017/JMRdb?authSource=admin", {
>    auth: {
>         user: "admin",
>          password: "***********@1"
>      },
>      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
>      reconnectInterval: 500, // Reconnect every 500ms
>      dbName: "JMRdb"
>     }).then(answer => {
>       console.log("Successfully connected to MONGO!");
>     });
> ```

### client/JMRSquaredApp/template/package.json

> #### Dev
>
> ```
> "nativescript": {
>    "id": "com.jmrsquared.dev"
> }
> ```

### client/JMRSquaredApp/template/app/App_Resources/Android/values/strings.xml

and

### client/JMRSquaredApp/template/app/App_Resources/Android/values-v21/strings.xml

> #### Dev
>
> ```
> <?xml version="1.0" encoding="utf-8"?>
> <resources>
>     <string name="app_name">JMRSquaredDev</string>
>     <string name="title_activity_kimera">JMRSquaredDev</string>
> </resources>
> ```

### client/JMRSquaredApp/template/app/package.json

> #### Dev
>
> ```
>   "name": "jmrsquared",
> ```

### client/JMRSquaredApp/template/app/App_Resources/Android/AndroidManifest.xml

> #### Dev
>
> ```
>  android:icon="@drawable/icon_dev"
> ```

### client/JMRSquaredApp/src/store/modules/settings.js

> #### Dev
>
> ```
>  baseLink: "http://68.66.193.181:3000",
> ```
