<template>
    <page @loaded="pageLoaded()">
        <ActionBar>
            <GridLayout rows="auto" columns="auto,*,auto,auto" orientation="horizontal">
                <Ripple class="p-x-15" @tap="$router.back()" verticalAlignment="center" col="0" height="100%" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-arrow-back' | fonticon"></Label>
                </Ripple>
                <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" :text="tenant.username + '\'s profile'"></Label>
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

                    <StackLayout class="p-y-20" alignSelf="center" width="100%">
                        <Image alignSelf="center" class="m-5" borderWidth="5px" borderColor="white" stretch="aspectFill" :src="tenant.profilePic ? tenant.profilePic : $store.state.settings.defaultProfilePic" width="100" height="100" borderRadius="50%" />
                    </StackLayout>
    
                    <Label class="h2 font-weight-bold text-mute text-dark-blue" textAlignment="center" :text="tenant.username"></Label>
                    
                    <StackLayout width="100%" class="hr-light"></StackLayout>
                    <GridLayout rows="auto" columns="*,*" class="m-x-20 p-20">
                        <Ripple col="1" class="p-10" borderRadius="100%" textAlignment="center" @tap="ComeOver()">
                            <StackLayout verticalAlignment="center" textAlignment="center">
                                <Label textAlignment="center" fontSize="35%" class="mdi p-5 text-dark-blue" :text="'mdi-directions-run' | fonticon"></Label>                    
                                <Label textAlignment="center" class="text-mute" text="Come over"></Label>
                            </StackLayout>
                        </Ripple>
                        <Ripple col="1" class="p-10" borderRadius="100%" textAlignment="center" @tap="ReportUser()">
                            <StackLayout verticalAlignment="center" textAlignment="center">
                                <Label textAlignment="center" fontSize="35%" class="mdi p-5 text-light-red" :text="'mdi-report' | fonticon"></Label>                    
                                <Label textAlignment="center" class="text-mute" text="Report"></Label>
                            </StackLayout>
                        </Ripple>
                    </GridLayout>

                    <StackLayout width="100%" class="hr-light"></StackLayout>
                    <GridLayout class="m-10" rows="auto" columns="*,auto">
                        <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Tenant information"></label>
                    </GridLayout>
    
                    <StackLayout orientation="horizontal" class="p-5" width="100%">
                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="First Name"></label>
                            <label row="1" col="1" class="h4" :text="tenant.firstName"></label>
                        </GridLayout>

                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Last Name"></label>
                            <label row="1" col="1" class="h4" :text="tenant.surname"></label>
                        </GridLayout>
    
                    </StackLayout>
    
                    <StackLayout orientation="horizontal" class="p-5" width="100%">
    
                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact Numbers"></label>
                            <label row="1" col="1" class="h4" :text="'0' + tenant.contactNumbers"></label>
                        </GridLayout>

                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-home' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Room Number"></label>
                            <label row="1" col="1" class="h4" :text="tenant.room"></label>
                        </GridLayout>
                    </StackLayout>
                    <StackLayout width="100%" class="hr-light"></StackLayout>
    
    
                    <GridLayout class="m-10" rows="auto" columns="*,auto">
                        <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Lease information"></label>
                    </GridLayout>
    
                    <StackLayout orientation="horizontal" class="p-5" width="100%">
                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-money' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Rent Amount"></label>
                            <label :text="'R' + tenant.lease.rentAmount" row="1" col="1" class="h4"></label>
                        </GridLayout>
    
                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Rent Due"></label>
                            <label :text="tenant.lease.rentDueOn" row="1" col="1" class="h4"></label>
                        </GridLayout>
                    </StackLayout>
    
                    <StackLayout orientation="horizontal" class="p-5" width="100%">
                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-today' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Lease Start Date"></label>
                            <label :text="getMoment(tenant.lease.startDate).format('DD/MM/YYYY')" row="1" col="1" class="h4"></label>
                        </GridLayout>
    
                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-event' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Lease End Date"></label>
                            <label :text="getMoment(tenant.lease.endDate).format('DD/MM/YYYY')" row="1" col="1" class="h4"></label>
                        </GridLayout>
                    </StackLayout>
                    <StackLayout width="100%" class="hr-light"></StackLayout>
    
    
                    <GridLayout class="m-10" rows="auto" columns="*,auto">
                        <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Next of kin information"></label>
                    </GridLayout>
    
                    <StackLayout orientation="horizontal" class="p-5" width="100%">
                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Full Names"></label>
                            <label row="1" col="1" class="h4" :text="tenant.nextOfKin.name"></label>
                        </GridLayout>
                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-business' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Busary provider"></label>
                            <label row="1" col="1" class="h4" :text="tenant.nextOfKin.busaryProvider ? tenant.nextOfKin.busaryProvider : 'No Busary'"></label>
                        </GridLayout>
                    </StackLayout>
    
                    <StackLayout orientation="horizontal" class="p-5" width="100%">
                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact Numbers"></label>
                            <label row="1" col="1" class="h4" :text="'0' + tenant.nextOfKin.contact"></label>
                        </GridLayout>
    
                        <GridLayout width="50%" rows="auto,auto" columns="auto,*">
                            <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-group-work' | fonticon"></label>
                            <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Relationship"></label>
                            <label row="1" col="1" class="h4" :text="tenant.nextOfKin.relationship"></label>
                        </GridLayout>
                    </StackLayout>
                    <StackLayout width="100%" class="hr-light"></StackLayout>
                </StackLayout>
            </ScrollView>
        </StackLayout>
    </page>
</template>

<script>
    export default {
        data() {
            return {
                isLoaded: false,
            }
        },
        computed: {
            tenant() {
                return this.$route.meta.user
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
            ComeOver(){
                this.$feedback.info({
                    title: 'Not Implemented',
                    message: "This is not functional yet"
                });
                return;
                //TODO : Put on the functionality
            },
            ReportUser(){
                this.$feedback.info({
                    title: 'Not Implemented',
                    message: "This is not functional yet"
                });
                return;
                //TODO : Put on the functionality
            }
        }
    }
</script>