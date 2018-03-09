<template>
  <FlexboxLayout flexDirection="column" justifyContent="space-around" width="100%" height="100%">
    <GridLayout columns="auto" rows="auto" alignSelf="center" width="100%">
      <Image padding="10" src="~/images/logo/JMRSQUARED-blue.png" col="0" alignSelf="center" row="0" stretch="aspectFit" width="100%" />
    </GridLayout>
    <Button  @tap="goto('explore')" text="Explore" alignSelf="center"></Button>
    <GridLayout columns="*,*" rows="*" height="70">
      <Button @tap="goto('register')" col="0" row="0" text="Register"></Button>
      <Button @tap="goto('login')" col="1" row="0" text="Login"></Button>
    </GridLayout>
  </FlexboxLayout>
</template>

<script>
  const dialogs = require('ui/dialogs')
  import Register from './Register.vue'
  import Explore from './Explore.vue'
  import Login from './Login.vue'

  export default {
    data() {
      return {}
    },
    mounted() {
      dialogs.alert("In").then(() => {
        console.log(r);
      });
      //  var r = this.$router.push('/food');
      dialogs.alert("check console").then(() => {
        console.log(r);
      });
    },
    methods: {
      goto(link) {
        if(link == 'register'){
          this.$navigateTo(Register);
        }else if(link == 'login'){
          this.$navigateTo(Login);
        }else if(link == 'explore'){
          this.$navigateTo(Explore);
        }
        
      }
    }
  }
</script>

<style>
  
</style>
