<template>
  <page actionBarHidden="true">
    <FlexboxLayout justifyContent="space-between" width="100%" height="100%" flexDirection="column">
      <FlexboxLayout padding="10" justifyContent="center" flexDirection="column">
        <GridLayout columns="auto" rows="auto" justifyContent="center">
          <Image src="~/images/logo/JMRSQUARED-blue.png" row="0" col="0" width="100%" alignSelf="center" stretch="aspectFit" />
        </GridLayout>
      </FlexboxLayout>
      <FlexboxLayout justifyContent="flex-end" flexDirection="column">
        <GridLayout v-show="!$store.state.user.isLoggedIn" justifyContent="flex-end" columns="*,*" rows="*" height="70">
          <Button @tap="$router.push('/register')" col="0" row="0" text="Register"></Button>
          <Button @tap="$router.push('/login')" col="1" row="0" text="Login"></Button>
        </GridLayout>
        <GridLayout v-show="$store.state.user.isLoggedIn" justifyContent="flex-end" columns="*,*" rows="*" height="70">
          <Button @tap="$router.push('/admin/dashboard')" row="0" :text="$store.state.user.userName + '\'s Dashboard'"></Button>
          <button col="1" @tap="$router.push('/register')" text="registerPage"></button>
        </GridLayout>
      </FlexboxLayout>
    </FlexboxLayout>
  </page>
</template>

<script>
  const dialogs = require('ui/dialogs')
  //const http = require("http")
  
  var appSettings = require("application-settings");
  import * as Toast from "nativescript-toast";
  
  export default {
    data() {
      return {}
    },
    created(){
      Toast.makeText("Mounted").show();
    //  this.pageLoaded();
    },
    methods: {
      pageLoaded() {
      
      }
    }
  }
</script>

<style>
  
</style>
