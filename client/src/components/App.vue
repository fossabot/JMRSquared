<template>
    <page
        actionBarHidden="true">
        <StackLayout>
            <Home
                v-if="loggedIn">
            </Home>
            <BottomNav
                v-if="!loggedIn"
                style="margin-bottom:2px;bottom:2px"
                :LoggedIn="loggedIn"
                :User="user">
            </BottomNav>
        </StackLayout>
    </page>
</template>

<script>
    import Home from './Home.vue'
    import BottomNav from './BottomNav.vue'   

    const dialogs  = require('ui/dialogs')

    export default {
        name:'App',
        data() {
            return {
                loggedIn:true,
                user:null,
            }
        },
        mounted(){

        },
        components: {
            Home,
            BottomNav
        },
        methods:{
            switch(){
                this.loggedIn = !this.loggedIn;
            }
            
        }
    }
</script>

<style>

</style>
