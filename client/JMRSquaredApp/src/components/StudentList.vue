<template>
    <page @loaded="pageLoaded()">
        <ActionBar>
            <GridLayout rows="*" columns="auto,*,auto,auto" orientation="horizontal">
                <Ripple class="p-10" @tap="$router.back()" verticalAlignment="center" col="0" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-arrow-back' | fonticon"></Label>
                </Ripple>
                <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" text="Student List"></Label>
                <Ripple class="p-10" @tap="reportBug()" verticalAlignment="center" col="2" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-bug-report' | fonticon"></Label>
                </Ripple>
                <Ripple class="p-10" @tap="logOut()" verticalAlignment="center" col="3" borderRadius="50%">
                    <Label verticalAlignment="center" class="mdi text-light-red" fontSize="25%" :text="'mdi-power-settings-new' | fonticon"></Label>
                </Ripple>
            </GridLayout>
        </ActionBar>
        <GridLayout row="*">
            <component :is="View"></component>
        </GridLayout>
    </page>
</template>

<script>
    const dialogs = require('ui/dialogs')
    import Students from './Admin/Fulham/Students.vue'
    
    var appSettings = require("application-settings");
    
    export default {
        components: {
            Students
        },
        data() {
            return {
                View:"Students"
            }
        },created() {
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
            pageLoaded() {}
        }
    }
</script>
