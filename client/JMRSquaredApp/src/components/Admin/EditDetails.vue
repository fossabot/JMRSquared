<template>
    <page @loaded="pageLoaded()">
        <ActionBar>
            <GridLayout rows="auto" columns="auto,*,auto,auto" orientation="horizontal">
                <Ripple class="p-x-15" @tap="$router.back()" verticalAlignment="center" col="0" height="100%" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-arrow-back' | fonticon"></Label>
                </Ripple>
                <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" :text="'Edit ' + $store.state.user.userName + '\'s details'"></Label>
                <Ripple class="p-x-15" @tap="reportBug()" verticalAlignment="center" col="2" height="100%" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-bug-report' | fonticon"></Label>
                </Ripple>
                <Ripple class="p-x-15" @tap="logOut()" verticalAlignment="center" col="3" height="100%" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi text-light-red" fontSize="25%" :text="'mdi-power-settings-new' | fonticon"></Label>
                </Ripple>
            </GridLayout>
        </ActionBar>
        <StackLayout>
            <ScrollView>
                <StackLayout>
                    <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" text="Edit Profile"></label>
    
                    <label class="m-10 t-10 font-italic" textWrap="true" verticalAlignment="center" text="Please make sure the information you enter is valid, and press SAVE CHANGES."></label>
    
                    <StackLayout class="p-y-20" alignSelf="center" width="100%">
                        <Image @tap="changeProfilePicture()" alignSelf="center" class="m-5" borderWidth="5px" borderColor="white" stretch="aspectFill" :src="selectedImage ? selectedImage : $store.state.settings.defaultProfilePic" width="100" height="100" borderRadius="50%" />
                        <Label class="footnote" textAlignment="center" text="Tap to change the profile picture"></Label>
                    </StackLayout>
    
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
        </StackLayout>
    </page>
</template>

<script>
    import * as imageSource from "tns-core-modules/image-source";
    
    import * as imagepicker from "nativescript-imagepicker";
    export default {
        data() {
            return {
                isLoaded: false,
                //Edit profile staff --START
                txtError: '',
                userName: this.$store.state.user.userName,
                email: this.$store.state.user.email,
                numbers: this.$store.state.user.numbers ? '0' + this.$store.state.user.numbers : '',
                newPassword: '',
                confirmNewPassword: '',
                oldPassword: '',
                selectedImage: this.$store.state.user.profilePic,
                hasImage: false,
                //Edit profile staff --END
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
            },
            SaveProfileChanges() {
    
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
                this.$feedback.info({
                    title: 'Not Implemented',
                    message: "This is not functional yet"
                });
    
                //TODO : REMOVE THIS RETURN AND GO TO post the DB
                this.isLoading = false;
                return;
    
                http.request({
                    url: this.$store.state.settings.baseLink + "/a/update",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    content: JSON.stringify({
                        id: this.$store.state.user.id,
                        userName: this.userName,
                        email: this.email,
                        numbers: this.numbers,
                        newPassword: this.newPassword,
                        oldPassword: this.oldPassword,
                        profilePic: this.profilePic
                    })
                }).then(response => {
    
                }).catch(err => {
                    this.$feedback.error({
                        message: err
                    });
                });
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
            }
        }
    }
</script>