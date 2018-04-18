<template>
    <page class="page" @loaded="pageLoaded()">
        <ActionBar>
            <GridLayout rows="auto" columns="auto,*,auto,auto" orientation="horizontal">
                <Ripple @tap="$router.back()" verticalAlignment="center" col="0" rippleColor="$blueColor" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi h2 p-15" :text="'mdi-arrow-back' | fonticon"></Label>
                </Ripple>
                <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" :text="'Home - ' + $store.state.user.userName"></Label>
                <Ripple @tap="reportBug()" verticalAlignment="center" class="p-15" col="2" rippleColor="$blueColor" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi h2" :text="'mdi-bug-report' | fonticon"></Label>
                </Ripple>
                <Ripple verticalAlignment="center" class="p-15" @tap="logOut()" col="3" rippleColor="$blueColor" borderRadius="50%">
                    <Label class="mdi h2 text-light-red" :text="'mdi-power-settings-new' | fonticon"></Label>
                </Ripple>
            </GridLayout>
        </ActionBar>
        <StackLayout>
            <StackLayout class="p-y-20" alignSelf="center" width="100%">
                <Image alignSelf="center" class="m-5" borderWidth="5px" borderColor="white" stretch="aspectFill" :src="user.profilePic ? user.profilePic : $store.state.settings.defaultProfilePic" width="100" height="100" borderRadius="50%" />
                <Label textAlignment="center" class="h2 m-5 text-white" :text="user.userName"></Label>
                <Label textAlignment="center" class="h3 m-5 text-white" :text="user.role"></Label>
            </StackLayout>
            <GridLayout class="m-20" rows="*,*" columns="*,*,*">
                <StackLayout :row="item.row" :col="item.col" :key="i" v-for="(item,i) in layouts">
                    <CardView radius="100" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20" width="60" height="60">
                        <Ripple @tap="onItemTap(item)" rippleColor="$blueColor" borderRadius="50%" width="60" height="60">
                            <Label class="mdi h2" textAlignment="center" fontSize="30%" verticalAlignment="center" :text="'mdi-' + item.icon | fonticon"></Label>
                        </Ripple>
                    </CardView>
                    <Label class="p-t-10" :text="item.title" textAlignment="center" />
                </StackLayout>
            </GridLayout>
        </StackLayout>
        <!--
                <StackLayout>
                    <GridLayout class="p-10" columns="*,*,*" rows="auto">
                        <StackLayout @tap="selectedScreen = 0" :class="{'bottom-line-blue':selectedScreen == 0}" row="0" col="0">
                            <Label text="2" class="h2" textAlignment="center"></Label>
                            <Label text="Properties" class="h3" textAlignment="center"></Label>
                        </StackLayout>
                        <StackLayout @tap="selectedScreen = 1" :class="{'bottom-line-blue':selectedScreen == 1}" row="0" col="1">
                            <Label :text="Reminders.length" class="h2" textAlignment="center"></Label>
                            <Label text="Reminders" class="h3" textAlignment="center"></Label>
                        </StackLayout>
                        <StackLayout @tap="selectedScreen = 2" :class="{'bottom-line-blue':selectedScreen == 2}" row="0" col="2">
                            <Label text="12" class="h2" textAlignment="center"></Label>
                            <Label text="Documents" class="h3" textAlignment="center"></Label>
                        </StackLayout>
                    </GridLayout>
                    <StackLayout width="100%" class="hr-light"></StackLayout>
                    <WrapLayout v-show="selectedScreen == 0">
                        <CardView class="bottom-line-blue" margin="10" elevation="30" width="40%" height="30%" v-for="(item,j) in properties" :key="j" radius="20" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                            <Image stretch="aspectFill" :src="item.img" width="70" height="70" />
                            <Label verticalAlignment="center" textAlignment="center" selfAlign="center" textWrap="true" :text="item.text"></Label>
                        </CardView>
                    </WrapLayout>
                    <ListView v-show="selectedScreen == 1" for="task in Reminders">
                        <v-template>
                            <GridLayout backgroundColor="white" columns="auto,*,auto" rows="auto,auto,auto">
                                <Label @tap="RemoveFeed(task)" row="0" col="2" textAlignment="center" alignSelf="center" class="mdi h2 text-light-red m-5" :text="'mdi-close' | fonticon"></Label>
                                <StackLayout @tap="DoneFeed(task)" textAlignment="center" verticalAlignment="center" row="0" col="0" rowSpan="3">
                                    <Label textAlignment="center" class="mdi h1 text-light-green" :text="'mdi-done' | fonticon"></Label>
                                </StackLayout>
                                <Label class="m-5" row="1" col="1" textAlignment="center" verticalAlignment="center" fontWeight="bold" :text="task.msg" textWrap="true"></Label>
                                <Label class="m-5" row="2" col="2" textAlignment="right" alignSelf="right" :text="getMoment(task.dueDate).fromNow()"></Label>
                            </GridLayout>
                        </v-template>
                    </ListView>
                    <Documents v-show="selectedScreen == 2"></Documents>
            
                </StackLayout>
               <StackLayout>
                    <ScrollView>
                        <StackLayout>
                            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-circle' | fonticon"></label>
                                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="User name"></label>
                                <TextField v-model="userName" row="1" col="1" returnKeyType="next" class="h4"></TextField>
                            </GridLayout>
                            <StackLayout width="100%" class="hr-light"></StackLayout>
            
                            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-email' | fonticon"></label>
                                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Email"></label>
                                <TextField row="1" col="1" keyboardType="email" returnKeyType="next" v-model="email" class="h4" autocorrect="true" autocapitalizationType="none"></TextField>
                            </GridLayout>
                            <StackLayout width="100%" class="hr-light"></StackLayout>
            
                            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
                                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact numbers"></label>
                                <TextField row="1" col="1" keyboardType="number" returnKeyType="next" v-model="numbers" class="h4" autocorrect="true"></TextField>
                            </GridLayout>
                            <StackLayout>
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-lock-outline' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Old Password"></label>
                                    <TextField row="1" col="1" secure="true" returnKeyType="next" v-model="oldPassword"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-lock' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="New Password"></label>
                                    <TextField row="1" col="1" secure="true" returnKeyType="next" v-model="newPassword"></TextField>
                                </GridLayout>
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-lock' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Confirm new Password"></label>
                                    <TextField row="1" col="1" secure="true" returnKeyType="next" v-model="confirmNewPassword"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
                            </StackLayout>
                            <GridLayout class="m-10" rows="auto,auto,auto" @tap="changeProfilePicture()" columns="auto,*">
                                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-file' | fonticon"></label>
                                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Profile picture"></label>
                                <label row="1" col="1" text="Tap to upload change your profile picture" class="h4"></label>
                                <Image row="2" col="1" v-if="selectedImage" :src="selectedImage" stretch="aspectFill" width="90%" />
                            </GridLayout>
            
                            <GridLayout class="m-10" rows="auto" columns="auto,*">
                                <label row="0" col="0" verticalAlignment="bottom" class="mdi m-x-15 text-mute text-light-red" fontSize="25%" :text="'mdi-delete-forever' | fonticon"></label>
                                <label row="0" col="1" verticalAlignment="bottom" class="h3 font-weight-bold text-mute text-light-red" text="I want to remove this account."></label>
                            </GridLayout>
                            <StackLayout width="100%" class="hr-light"></StackLayout>
            
                            <ActivityIndicator :busy="isLoading"></ActivityIndicator>
            
                            <DockLayout alignSelf="center" justifyContent="flex-end" verticalAlignment="bottom" orientation="horizontal" textAlignment="center">
                                <Label :text="txtError" textWrap="true" class="text-mute text-light-red" textAlignment="center"></Label>
                            </DockLayout>
                            <DockLayout v-if="txtError.length < 2" alignSelf="center" justifyContent="flex-end" verticalAlignment="bottom" orientation="horizontal" textAlignment="center">
                                <Label text="You can proceed" textWrap="true" class="text-mute text-light-blue" textAlignment="center"></Label>
                            </DockLayout>
            
                            <Button :isEnabled="!isLoading" @tap="SaveProfileChanges()" class="btn-primary bg-light-blue" text="Save Changes"></Button>
                        </StackLayout>
                    </ScrollView>
                </StackLayout> -->
    </page>
</template>

<script>
    const dialogs = require('ui/dialogs')
    import Documents from './DocumentList.vue'
    import * as Toast from "nativescript-toast";
    
    import * as imagepicker from "nativescript-imagepicker";
    
    var appSettings = require("application-settings");
    
    export default {
        components: {
            Documents
        },
        data() {
            return {
                layouts: [{
                        id: "rate",
                        icon: "star",
                        title: "Rate",
                        row: 0,
                        col: 0
                    },
                    {
                        id: "reminders",
                        icon: "notifications",
                        title: "Reminders",
                        row: 0,
                        col: 1
                    },
                    {
                        id: "fulham86",
                        icon: "home",
                        title: "Fulham 86",
                        row: 0,
                        col: 2
                    },
                    {
                        id: "documents",
                        icon: "library-books",
                        title: "Documents",
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
                //Edit profile staff --START
                isLoading: false,
                txtError: '',
                userName: '',
                email: '',
                numbers: '',
                newPassword: '',
                confirmNewPassword: '',
                oldPassword: '',
                selectedImage: null,
                hasImage: false,
                //Edit profile staff --END
                currentPage: 0,
                currentTab: 0,
                selectedScreen: 1,
                feeds: [],
                properties: [{
                        id: 'fulham86',
                        text: 'Fulham 86',
                        img: 'data:image/png;base64,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',
                        redirect: '/admin/fulham/home',
                        type: 'page'
                    },
                    {
                        text: 'Hot Cash',
                        img: 'data:image/png;base64,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',
                        redirect: '/home',
                        type: 'page'
                    }
                ]
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
            SaveProfileChanges() {
    
                dialogs.alert(this.txtError);
                this.txtError = '';
                this.isLoading = true;
    
                if (this.userName.length < 2) {
                    this.txtError = 'User name too short.';
                    this.isLoading = false;
                    return;
                }
    
                if (this.email.length < 2) {
                    this.txtError = 'Email too short.';
                    this.isLoading = false;
                    return;
                }
    
                if (this.numbers.length != 10 || isNaN(this.numbers)) {
                    this.txtError = 'Contact numbers must have 10 digits.';
                    this.isLoading = false;
                    return;
                }
    
                if (this.oldPassword.length > 3) {
                    if (this.newPassword.length < 5) {
                        this.txtError = 'Password too short.';
                        this.isLoading = false;
                        return;
                    }
    
                    if (this.newPassword != this.confirmNewPassword) {
                        this.txtError = 'Passwords do not match.';
                        this.isLoading = false;
                        return;
                    }
                }
                // TODO : GO TO post the DB
            },
            changeProfilePicture() {
                let context = imagepicker.create({
                    mode: "single" // use "multiple" for multiple selection
                });
    
                context
                    .authorize()
                    .then(function() {
                        return context.present();
                    })
                    .then((selection) => {
                        selection.forEach((selected) => {
                            // process the selected image
                            this.selectedImage = selected;
                            this.hasImage = true;
                        });
                    }).catch((err) => {
                        // process error
                        this.$feedback.error({
                            title: "No file selected",
                            message: "Please select a valid image file",
                            duration: 4000,
                            position: 1,
                            onTap: () => {
    
                            }
                        });
                    });
            },
            eventChanged(event) {
                dialogs.alert("Changed view").then(() => {
                    console.log("This is it")
                });
            },
            logOut() {
                dialogs.confirm({
                        title: 'Confirm log out',
                        message: 'You want to log out?',
                        okButtonText: 'Yes',
                        cancelButtonText: 'No'
                    })
                    .then(result => {
                        if (result) {
                            this.$store.commit('logout', this);
                            this.$router.replace('/login');
                        }
                    })
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
                if (item.id == 'fulham86') {
                    this.$router.push('/admin/fulham/home');
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
