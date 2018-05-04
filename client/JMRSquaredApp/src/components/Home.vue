<template>
  <page @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout rows="auto" columns="*,auto" orientation="horizontal">
        <Label col="0" class="m-l-25 font-weight-bold" verticalAlignment="center" text="Home"></Label>
        <Ripple v-show="$route.meta.userAuthLevel > 0" class="p-x-15" @tap="logOut()" verticalAlignment="center" col="2" height="100%" borderRadius="50%">
          <Label verticalAlignment="center" text="Log out"></Label>
        </Ripple>
      </GridLayout>
    </ActionBar>
    <FlexboxLayout justifyContent="space-between" width="100%" height="100%" flexDirection="column">
      <FlexboxLayout justifyContent="flex-start" flexDirection="column">
        <label :text="introTxt" textWrap="true" class="body p-t-30 p-l-15 p-r-15" textAlignment="center"></label>
      </FlexboxLayout>
      <FlexboxLayout flexDirection="column">
        <GridLayout columns="auto" rows="auto" justifyContent="center">
          <Image src="~/images/logo/JMRSQUARED-blue.png" row="0" col="0" width="100%" alignSelf="center" stretch="aspectFit" />
        </GridLayout>
      </FlexboxLayout>
      <FlexboxLayout justifyContent="flex-end" flexDirection="column">
        <GridLayout rows="auto" columns="*" textAlginment="center">
          <Button backgroundColor="transparent" width="50%" selfAlign="center" @tap="$router.push('/explore')" textAlignment="center" borderColor="$blueDarkColor" text="Explore"></Button>
        </GridLayout>
        <GridLayout v-show="$route.meta.userAuthLevel == 0" justifyContent="flex-end" columns="*,*" rows="*" height="70">
          <Button @tap="$router.push('/register')" col="0" row="0" text="Register"></Button>
          <Button @tap="$router.push('/login')" col="1" row="0" text="Login"></Button>
        </GridLayout>
        <GridLayout v-show="$route.meta.userAuthLevel > 0" justifyContent="flex-end" columns="*" rows="*" height="70">
          <ActivityIndicator :busy="isLoading"></ActivityIndicator>
          <Button v-show="!isLoading" @tap="loadData($route.meta.userAuthLevel)" text="My Dashboard"></Button>
        </GridLayout>
      </FlexboxLayout>
    </FlexboxLayout>
  </page>
</template>

<script>
  const dialogs = require('ui/dialogs')
  const http = require("http")
  
  var appSettings = require("application-settings");
  
  import * as connectivity from "tns-core-modules/connectivity";
  export default {
    data() {
      return {
        introTxt: 'JMRSqaured is a company that deals with blah blah blah blah ......'
      }
    },
    created() {
      this.pageLoaded();
    },
    mounted() {
      this.pageLoaded();
    },
    beforeDestroy() {
      this.isLoading = false;
    },
    Destroy() {
      this.isLoading = false;
    },
    beforeRouteLeave: (to, from, next) => {
      this.isLoading = false;
      alert("Before router leave");
    },
    methods: {
      pageLoaded() {
        this.$store.commit("refreshCache", {
          db: this.$db,
          appSettings: appSettings
        });
      },
      loadData(userAuthLevel) {
        if (userAuthLevel == 1) {
          this.loadTenantData()
        } else if (userAuthLevel == 3) {
          this.loadAdminData();
        }
      },
      loadTenantData() {
        this.$feedback.info({
          message: "Logging in as a tenant"
        })
      },
      loadAdminData() {
        var connectionType = connectivity.getConnectionType();
        var self = this;
        this.isLoading = true;
        switch (connectionType) {
          case connectivity.connectionType.wifi:
  
            http
              .request({
                url: this.$store.state.settings.baseLink + "/a/getById/" + this.$store.state.user.id,
                method: "GET",
                headers: {
                  "Content-Type": "application/json"
                }
              })
              .then(response => {
                var statusCode = response.statusCode;
                if (statusCode == 200) {
                  var result = response.content.toJSON();
                  this.loginAdmin(this, result);
                  this.$router.push("/admin/dashboard");
  
                } else {
                  var error = response.content.toString();
                  this.$feedback.error({
                    message: error
                  });
  
                  this.isLoading = false;
                }
              }).catch(err => {
                this.$feedback.error({
                  message: error
                });
                this.isLoading = false;
              });
  
            break;
          case connectivity.connectionType.none:
            var user = this.$store.state.cache.cachedAdmin;
            if (user != null) {
              this.loginAdmin(this, user);
              this.$router.push("/admin/dashboard");
            } else {
              this.$feedback.error({
                title: "NO INTERNET CONNECTION",
                duration: 4000,
                message: "Please switch on your data/wifi.",
              });
              this.isLoading = false;
            }
            break;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/variables';
</style>
