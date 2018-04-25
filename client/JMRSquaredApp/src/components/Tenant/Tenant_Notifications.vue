<template>
    <GridLayout class="page" rows="auto,auto,*" @loaded="pageLoaded">
        <CardView focus="true" margin="10" elevation="10" height="40" @tap="SendNotification()" backgroundColor="grey" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
            <label verticalAlignment="center" textAlignment="center" text="Send new notification"></label>
        </CardView>
        <SearchBar row="1" hint="Search for a Notification..." v-model="txtSearch"></SearchBar>
        <Label textAlignment="center" class="text-muted p-20" text="Pull to refresh"></Label>
        <PullToRefresh row="2" @refresh="refreshList($event)">
            <ScrollView>
                <StackLayout>
                    <CardView v-for="(notify,i) in searchedNotifications" :key="i" class="p-20 bg-white" margin="3" elevation="20" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                        <GridLayout columns="auto,*,auto" rows="auto,auto,auto,auto">
                            <Image row="0" col="0" rowSpan="2" alignSelf="center" class="p-5" backgroundColor="#ffffff" stretch="aspectFill" src="data:image/png;base64,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"
                                width="60" height="60" borderRadius="50%" />
                            <Label row="0" col="1" class="m-t-5" verticalAlignment="bottom">
                                                        <FormattedString>
                                                            <Span :text="notify.from" fontWeight="bold" class="text-dark-blue"/>
                                                            <Span :text="' sent a ' + notify.type + ' to '" />
                                                            <Span :text="notify.to" fontWeight="bold" class="text-dark-blue" />
                                                        </FormattedString>
                                                    </Label>
                            <Label row="1" col="1" class="font-italic text-muted t-10" :text="getMoment(notify.date).fromNow()"></Label>
                            <Label row="2" col="0" colSpan="3" class="body p-5" :text="notify.msg" textWrap="true"></Label>
                            <StackLayout row="3" col="2" textAlignment="right" orientation="horizontal">
                                <Label textAlignment="right" v-show="notify.seen" class="mdi m-10 text-dark-blue" :text="'mdi-visibility' | fonticon"></Label>
                                <Label textAlignment="right" v-show="notify.removed" class="mdi m-10 text-light-red" :text="'mdi-delete' | fonticon"></Label>
                            </StackLayout>
                        </GridLayout>
                    </CardView>
                </StackLayout>
            </ScrollView>
        </PullToRefresh>
    </GridLayout>
</template>

<script>
    const dialogs = require('ui/dialogs');
    import * as Toast from 'nativescript-toast';
    import moment from 'moment';
    
    import * as connectivity from "tns-core-modules/connectivity";
    const http = require("http");
    
    var appSettings = require("application-settings");
    export default {
        data() {
            return {
                userX: '',
                txtSearch: '',
            }
        },
        computed: {
            notifications: {
                get() {
                    return this.$store.state.collections.notifications.all;
                },
                set(value) {
                    this.$store.dispatch("PopulateNotifications", {
                        notifications: value
                    });
                }
            },
            searchedNotifications: {
                get() {
                    var self = this;
                    return this.notifications.filter(function(notify) {
                        return self.txtSearch.length < 1 || notify.msg.toLowerCase().indexOf(self.txtSearch.toLowerCase()) >= 0;
                    });
                }
            }
        },
        mounted() {
            this.pageLoaded();
        },
        created() {
            this.pageLoaded();
        },
        methods: {
            pageLoaded() {
    
            },
            refreshList(args) {
                var pullRefresh = args.object;
    
                var connectionType = connectivity.getConnectionType();
                if (connectionType == connectivity.connectionType.none) {
                    this.$feedback.error({
                        title: "Error (NO INTERNET CONNECTION)",
                        duration: 4000,
                        message: "Please switch on your data/wifi.",
                    });
    
                    pullRefresh.refreshing = false;
                } else {
                    http.getJSON(this.$store.state.settings.baseLink + "a/notifications/all").then((results) => {
                        this.notifications = results;
                        pullRefresh.refreshing = false;
                    }).catch((err) => {
                        this.$feedback.error({
                            title: "Error",
                            duration: 4000,
                            message: err,
                        });
                        pullRefresh.refreshing = false;
    
                    });
                }
    
            },
            getMoment(val) {
                return moment(val);
            },
            onEnter(e) {
                dialogs.alert("Send notification to students").then(() => {
                    console.log("hit");
                });
            },
            AddUser() {
                if (this.userX.length() > 2) {
                    this.users.push(this.userX);
                    this.userX = '';
                }
            },
            onNotificationTap(event) {
                dialogs.alert('clicked ' + event.item.msg).then(() => {
                    console.log("FIne");
                });
            }
        }
    }
</script>

<style>
    
</style>