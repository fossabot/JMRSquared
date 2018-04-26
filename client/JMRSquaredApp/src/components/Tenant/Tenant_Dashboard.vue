<template>
    <page @@loaded="pageLoaded()">
        <ActionBar>
            <GridLayout rows="auto" columns="auto,*,auto,auto" orientation="horizontal">
                <Ripple class="p-x-15" @tap="$router.back()" verticalAlignment="center" col="0" height="100%" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-arrow-back' | fonticon"></Label>
                </Ripple>
                <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" :text="'Home - ' + $store.state.user.userName"></Label>
                <Ripple class="p-x-15" @tap="reportBug()" verticalAlignment="center" col="2" height="100%" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-bug-report' | fonticon"></Label>
                </Ripple>
                <Ripple class="p-x-15" @tap="logOut()" verticalAlignment="center" col="3" height="100%" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi text-light-red" fontSize="25%" :text="'mdi-power-settings-new' | fonticon"></Label>
                </Ripple>
            </GridLayout>
        </ActionBar>
        <StackLayout>
            <StackLayout class="p-y-20" alignSelf="center" width="100%">
                <Image alignSelf="center" class="m-5" borderWidth="5px" borderColor="white" stretch="aspectFill" :src="user.profilePic ? user.profilePic : $store.state.settings.defaultProfilePic" width="100" height="100" borderRadius="50%" />
                <label class="h2 m-5 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" :text="user.userName"></label>
                <Label class="h3 m-5" textAlignment="center" :text="user.email"></Label>
            </StackLayout>
            <Ripple @tap="$router.push('/tenant/profile/edit')" class="m-5" borderWidth="5px" width="40" height="40" borderRadius="50%">
                <Label class="mdi" textAlignment="center" verticalAlignment="center" fontSize="25%" :text="'mdi-mode-edit' | fonticon"></Label>
            </Ripple>
            <GridLayout class="m-20" rows="*,*" columns="*,*,*">
                <StackLayout :row="item.row" :col="item.col" :key="i" v-for="(item,i) in layouts">
                    <CardView radius="100" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20" width="60" height="60">
                        <Ripple @tap="onItemTap(item)" rippleColor="$blueColor" borderRadius="50%" width="60" height="60">
                            <Label class="mdi" textAlignment="center" fontSize="30%" verticalAlignment="center" :text="'mdi-' + item.icon | fonticon"></Label>
                        </Ripple>
                    </CardView>
                    <Label class="p-t-10" textWrap="true" :text="item.title" textAlignment="center" />
                </StackLayout>
            </GridLayout>
        </StackLayout>
    </page>
</template>

<script>
    const dialogs = require('ui/dialogs')
    import * as Toast from "nativescript-toast";
    
    import * as imagepicker from "nativescript-imagepicker";
    
    var appSettings = require("application-settings");
    
    export default {
        data() {
            return {
                layouts: [{
                        id: "housemates",
                        icon: "people",
                        title: "House mates",
                        row: 0,
                        col: 0
                    },
                    {
                        id: "notifications",
                        icon: "notifications",
                        title: "Notifications",
                        row: 0,
                        col: 1
                    },
                    {
                        id: "rent",
                        icon: "attach-money",
                        title: "Rent",
                        row: 0,
                        col: 2
                    },
                    {
                        id: "lease",
                        icon: "library-books",
                        title: "Lease Agreement",
                        row: 1,
                        col: 0
                    },
                    {
                        id: "info",
                        icon: "info",
                        title: "Info and help",
                        row: 1,
                        col: 1
                    },
                    {
                        id: "bugReport",
                        icon: "bug-report",
                        title: "Bug report",
                        row: 1,
                        col: 2
                    },
                ],
                isLoaded: false,
                currentPage: 0,
                currentTab: 0,
                selectedScreen: 1,
                feeds: []
            }
        },
        computed: {
            user: {
                get() {
                    return this.$store.state.user;
                }
            },
            Reminders: {
                get() {
                    return this.$store.state.collections.tasks.all;
                }
            }
        },
        created() {
            if (!this.isLoaded) {
                this.pageLoaded();
            }
        },
        mounted() {
            if (!this.isLoaded) {
                this.pageLoaded();
            }
        },
        methods: {
            pageLoaded() {
                this.isLoaded = true;
                var firstTime = appSettings.getBoolean("shownChangeLog");
                if (firstTime != true) {
                    this.showChangeLog();
                    appSettings.setBoolean("shownChangeLog", true);
                }
    
                var logged = this.$store.state.user.isLoggedIn;
                if (!logged) {
                    this.$router.push('/home');
                }
            },
            eventChanged(event) {
                dialogs.alert("Changed view").then(() => {
                    console.log("This is it")
                });
            },
            switchPage(card) {
                dialogs.alert("Going to " + card.redirect).then(() => {
                    console.log(card.redirect);
                });
                this.$router.push({
                    path: card.redirect
                });
            },
            onItemTap(item) {
                if (item.id == 'housemates') {
                    this.$router.push('/admin/fulham/students');
                } else if (item.id == 'bugReport') {
                    this.reportBug();
                } else if (item.id == 'documents') {
                    this.$router.push('/admin/documents');
                } else if (item.id == 'reminders') {
                    this.$router.push('/admin/reminders');
                } else {
                    dialogs.alert("Not yet assigned").then(() => {
                        console.log("card.redirect");
                    });
                }
            },
            onBusinessTap(item) {
    
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/variables';
</style>
