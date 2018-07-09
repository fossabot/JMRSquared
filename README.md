# JMRSquared

Property management system

# Files to ignore while going live

## server/bin/www

> ### Dev
>
> `app.set("port", 3000)`

## server/app.js

> ### Dev
>
> ```
> mongoose
>   .connect("mongodb://localhost:27017/JMRdb?authSource=admin", {
> ```

     auth: {
         user: "admin",
         password: "***********@1"
     },
     reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
     reconnectInterval: 500, // Reconnect every 500ms
    dbName: "JMRdb"

}).then(answer => {
console.log("Successfully connected to MONGO!");
});

```

```

## client/JMRSquaredApp/template/package.json

> ### Dev
>
> ```
> "nativescript": {
> ```

    "id": "com.jmrsquared.dev"

}

```

```

## client/JMRSquaredApp/template/app/App_Resources/Android/values/strings.xml

and

## client/JMRSquaredApp/template/app/App_Resources/Android/values-v21/strings.xml

> ### Dev
>
> ```
>
> ```

<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">JMRSquaredDev</string>
    <string name="title_activity_kimera">JMRSquaredDev</string>
</resources>
```
```
## client/JMRSquaredApp/template/app/package.json

> ### Dev
>
> ```
>   "name": "jmrsquared",
> ```

## client/JMRSquaredApp/template/app/App_Resources/Android/AndroidManifest.xml

> ### Dev
>
> ```
>  android:icon="@drawable/icon_dev"
> ```
