<template>
  <page @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout rows="auto" columns="auto,*,auto" orientation="horizontal">
        <Image class="p-5" src="res://ic_arrow_back_black_24dp" col="0" width="30" height="30"/>
        <Label col="1" class="p-5" text="Home"></Label>
        <Image class="p-5" textAlignment="right" src="res://ic_more_vert_black_24dp" col="2" width="30" height="30"/>
      </GridLayout>
    </ActionBar>
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
        <GridLayout v-show="$store.state.user.isLoggedIn" justifyContent="flex-end" columns="*" rows="*" height="70">
          <ActivityIndicator :busy="isLoading"></ActivityIndicator>
          <Button v-show="!isLoading" @tap="loadAdminData()" :text="$store.state.user.userName + '\'s Dashboard'"></Button>
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
        isLoading: false
      }
    },
    beforeDestroy() {
      this.pageLoaded();
    },
    created() {
      this.pageLoaded();
    },
    methods: {
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
              .then(
                function(response) {
                  self.isLoading = false;
  
                  var statusCode = response.statusCode;
                  if (statusCode == 200) {
                    var result = response.content.toJSON();
  
                    let documentID = appSettings.getString("loginResponse");
  
                    if (documentID == null) {
  
                      var doc = self.$db.createDocument({
                        "date": new Date(),
                        "result": result
                      });
  
                      appSettings.setString("loginResponse", doc);
                      console.log("Document did not existed , we created it " + doc);
                    } else {
  
                      self.$db.updateDocument(documentID, {
                        "date": new Date(),
                        "result": result
                      });
  
                      console.log("Document exists , " + documentID + " , we Updated");
                      // console.log(self.$db.getDocument(documentID));
                    }
  
                    self.loginAdmin(self, result);
  
                    self.$router.push("/admin/dashboard");
  
                  } else {
                    var error = response.content.toString();
                    dialogs
                      .alert("Error : " + statusCode + " " + error)
                      .then(() => {
                        console.log(result + " answer ");
                      });
  
                    self.isLoading = false;
                  }
                },
                function(e) {
                  dialogs.alert(e).then(() => {
                    console.log("Error occurred " + e);
                  });
  
                  self.isLoading = false;
                }
              );
  
            break;
          case connectivity.connectionType.none:
  
            var documentID = appSettings.getString("loginResponse");
            if (documentID == null) {
  
              self.isLoading = false;
  
            } else {
  
              var documentsID = appSettings.getString("loginResponse");
  
              console.log(documentID + " found in your storage");
              let admin = self.$db.getDocument(documentID);
              this.loginAdmin(this, admin.result);
  
            }
  
            self.$router.push("/admin/dashboard");
            break;
          case connectivity.connectionType.mobile:
  
            dialogs
              .action("You are about to use your data", "cancel", ["Yes , it is fine", "No , load from cache"])
              .then(useData => {
                if (useData == "Yes , it is fine") {
                  dialogs.alert("TODO : go to database ...");
                  self.$router.push("/admin/dashboard");
                } else {
                  dialogs.alert("TODO : load from cache ...");
                  self.$router.push("/admin/dashboard");
                }
              });
  
            break;
        }
      },
      pageLoaded() {
        var logged = this.$store.state.user.isLoggedIn;
        if (!logged) {
  
          let documentID = appSettings.getString("loginResponse");
  
          if (documentID != null) {
            let admin = this.$db.getDocument(documentID);
            if (admin != null) {
              this.loginAdmin(this, admin.result);
  
            }
          }
  
        }
      }
    }
  }
</script>

<style>
  
</style>
