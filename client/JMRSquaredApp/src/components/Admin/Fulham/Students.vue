<template>
    <GridLayout class="page" rows="auto,*">
        <Label row="0" @tap="toggleSearch = !toggleSearch" v-show="!toggleSearch" textAlignment="center" class="text-muted p-20" text="Pull to refresh the list."></Label>
        <SearchBar row="0" v-show="toggleSearch" @clear="toggleSearch = !toggleSearch" hint="Search for a student..." v-model="txtSearch"></SearchBar>
        <PullToRefresh row="1" @refresh="refreshList($event)">
            <ListView for="student in searchedStudents" @itemTap="onStudentTap">
                <v-template>
                    <CardView margin="3" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                        <GridLayout padding="2%" columns="auto,*,auto" rows="auto,auto,auto">
                            <Image row="0" rowSpan="3" col="0" borderWidth="5px" borderColor="$blueLightColor" stretch="aspectFill" :src="(student.profilePic && student.profilePic.length > 2) ? student.profilePic : $store.state.settings.defaultProfilePic" width="70" height="70"
                                borderRadius="50%" />
                            <Label row="0" col="1" textAlignment="center" class="h2" :text="student.username"></Label>
                            <Label row="1" col="1" textAlignment="center" :text="student.email"></Label>
                            <Label row="2" col="1" textAlignment="center" :text="'Room : ' + student.room"></Label>
                            <Label row="2" col="2" textAlignment="center" verticalAlignment="center" :class="{'text-dark-blue':student.hasPaid,'text-light-red':!student.hasPaid}" :text="student.hasPaid ? 'Paid' : 'Not Paid'"></Label>
                        </GridLayout>
                    </CardView>
                </v-template>
            </ListView>
        </PullToRefresh>
        <Fab row="1" @tap="AddStudents()" icon="res://ic_add_white_24dp" class="fab-button"></Fab>
    </GridLayout>
</template>

<script>
    const dialogs = require('ui/dialogs')
    
    import * as LocalNotifications from "nativescript-local-notifications";
    
    import * as Toast from "nativescript-toast";
    const http = require("http");
    
    var appSettings = require("application-settings");
    import * as connectivity from "tns-core-modules/connectivity";
    export default {
        data() {
            return {
                isMainScreen: false,
                selectedScreen: '',
                txtSearch: '',
                students: []
            }
        },
        mounted() {
            this.pageLoaded();
        },
        created() {
            this.pageLoaded();
        },
        computed: {
            searchedStudents: {
                get() {
                    var self = this;
                    return this.students.filter(function(student) {
                        return self.txtSearch.length < 1 || student.username.toLowerCase().indexOf(self.txtSearch.toLowerCase()) >= 0;
                    });
                },
                set(value) {
                    this.students = value;
                }
            }
        },
        methods: {
            fabTap() {
                alert("Fab tapped");
            },
            pageLoaded() {
                this.isLoading = true;
                var connectionType = connectivity.getConnectionType();
                if (connectionType == connectivity.connectionType.none) {
                    // TODO : LOAD FROM LOCAL DB
                    let documentID = appSettings.getString("studentsResponse");
    
                    if (documentID == null) {
                        this.$feedback.warning({
                            title: "NO INTERNET CONNECTION",
                            duration: 4000,
                            message: "No data is cached , please connect to the internet."
                        });
                    } else {
                        var t = this.$db.getDocument(documentID);
                        this.searchedStudents = t.result;
                    }
    
                    this.isLoading = false;
                } else {
                    http.getJSON(this.$store.state.settings.baseLink + "/s/students/all").then((result) => {
                        let documentID = appSettings.getString("studentsResponse");
    
                        if (documentID == null) {
                            var doc = this.$db.createDocument({
                                "date": new Date(),
                                "result": result
                            });
    
                            appSettings.setString("studentsResponse", doc);
    
                        } else {
                            this.$db.updateDocument(documentID, {
                                "date": new Date(),
                                "result": result
                            });
                        }
                        this.searchedStudents = result;
                        this.isLoading = false;
                    }, function(e) {
                        Toast.makeText("We got an error").show();
                        this.isLoading = false;
                    });
                }
            },
            refreshList(args) {
                var pullRefresh = args.object;
                var connectionType = connectivity.getConnectionType();
                if (connectionType == connectivity.connectionType.none) {
                    // TODO : LOAD FROM LOCAL DB
                    let documentID = appSettings.getString("studentsResponse");
    
                    if (documentID == null) {
                        this.$feedback.warning({
                            title: "NO INTERNET CONNECTION",
                            duration: 4000,
                            message: "No data is cached , please connect to the internet."
                        });
                    } else {
                        this.searchedStudents = this.$db.getDocument(documentID).result;
                    }
    
                    pullRefresh.refreshing = false;
                } else {
                    http.getJSON(this.$store.state.settings.baseLink + "/s/students/all").then((result) => {
    
                        let documentID = appSettings.getString("studentsResponse");
    
                        if (documentID == null) {
                            var doc = this.$db.createDocument({
                                "date": new Date(),
                                "result": result
                            });
    
                            appSettings.setString("studentsResponse", doc);
    
                        } else {
                            this.$db.updateDocument(documentID, {
                                "date": new Date(),
                                "result": result
                            });
                        }
                        this.searchedStudents = result;
    
                        pullRefresh.refreshing = false;
                    }, function(e) {
                        Toast.makeText("We got an error").show();
                        pullRefresh.refreshing = false;
                    });
                }
            },
            AddStudents() {
                this.$router.push('/admin/students/add');
            },
            RemoveStudents() {
                dialogs.alert('Remove student').then(() => {
                    console.log("FIne");
                });
            },
            ModifyStudents() {
                dialogs.alert('MOdify student').then(() => {
                    console.log("FIne");
                });
            },
            onStudentTap(event) {
    
                /*
                                    LocalNotifications.hasPermission().then(
                                        function(granted) {
                                            dialogs.alert("Permission " + granted).then(() => {
                                                console.log("card.redirect");
                                            });
                                        }
                                    )
                    
                                    LocalNotifications.schedule([{
                                        id: event.item.id,
                                        title: 'Hello ' + event.item.username,
                                        body: 'Recurs every minute until cancelled',
                                        ticker: 'The ticker',
                                        badge: 1,
                                        groupedMessages: ["The first", "Second", "Keep going", "one more..", "OK Stop"], //android only
                                        groupSummary: "Summary of the grouped messages above", //android only
                                        smallIcon: 'res://icon.png',
                                        interval: 'minute',
                                        sound: "customsound-ios.wav", // falls back to the default sound on Android
                                        at: new Date(new Date().getTime() + (10 * 1000)) // 10 seconds from now
                                    }]).then(
                                        function() {
                                            dialogs.alert("Notification scheduled").then(() => {
                                                console.log("card.redirect");
                                            });
                                        },
                                        function(error) {
                                            dialogs.alert("Error while scheduling").then(() => {
                                                console.log(error);
                                            });
                                        }
                                    )
                    
                                    LocalNotifications.addOnMessageReceivedCallback(
                                        function(notification) {
                                            dialogs.alert("Notification clicked " + notification.id).then(() => {
                                                console.log("card.redirect");
                                            });
                                        }
                                    ).then(
                                        function() {
                                            dialogs.alert("Listener added").then(() => {
                                                console.log(error);
                                            });
                                        }
                                    )
                        */
                //TODO : Make this go to student profile.
    
                this.$router.push('/admin/fulham/student/profile/' + event.item._id);
    
    
            },
            switchPage(card) {
                dialogs.alert("Going to " + card.redirect).then(() => {
                    console.log(card.redirect);
                });
                this.$router.push({
                    path: card.redirect
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    $greyColor:#eeeeee;
    $blueDarkColor:#0093a4;
    $blueColor:#4ac4d5;
    $blueLightColor:#84f7ff;
    $redColor:#ed1c24;
    $avoColor:#d7df21;
    $orangeColor:#fcb040;
</style>
