<template>
  <page @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout rows="auto" columns="auto,*,auto" orientation="horizontal">
        <Ripple class="p-x-15" @tap="$router.back()" verticalAlignment="center" col="0" height="100%" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-arrow-back' | fonticon"></Label>
        </Ripple>
        <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" text="Login"></Label>
        <Ripple class="p-x-15" @tap="reportBug()" verticalAlignment="center" col="2" height="100%" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-bug-report' | fonticon"></Label>
        </Ripple>
      </GridLayout>
    </ActionBar>
    <ScrollView width="100%">
      <CardView verticalAlignment="center" margin="20" elevation="40" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
        <GridLayout width="100%">
          <FlexboxLayout class="m-10" justifyContent="space-between" width="100%" alignSelf="center" height="100%" flexDirection="column">
            <CardView padding="10" margin="4" elevation="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <Image alignSelf="flex-start" src="~/images/logo/JMR-blue.png" width="40" height="40" />
              <Label textAlignment="center" class="h1" text="Login"></Label>
            </CardView>
  
            <FlexboxLayout @tap="isEnterEmail = !isEnterEmail" justifyContent="flex-end" alignSelf="flex-end" flexDirection="" orientation="horizontal" class="m-10" width="100%" textAlignment="right">
              <Label class="h3 m-r-10 font-weight-bold" verticalAlignment="center" alignSelf="right" textAlignment="right" text="Use email instead"></Label>
              <Switch verticalAlignment="center" alignSelf="right" textAlignment="right" v-model="isEnterEmail" checked="true" />
            </FlexboxLayout>
  
            <GridLayout v-show="!isEnterEmail" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact numbers"></label>
              <TextField row="1" col="1" :isEnabled="!isEnterEmail" keyboardType="number" returnKeyType="next" v-model="user.numbers" autocorrect="true"></TextField>
            </GridLayout>
  
            <GridLayout v-show="isEnterEmail" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-email' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Email"></label>
              <TextField row="1" col="1" :isEnabled="isEnterEmail" keyboardType="email" returnKeyType="next" v-model="user.email" autocorrect="true" autocapitalizationType="none" :class="{ 'light hidden': isEnterEmail}" :hidden="!isEnterEmail"></TextField>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-lock' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Password"></label>
              <TextField row="1" col="1" ref="password" secure="true" returnKeyType="done" v-model="user.password" @returnPress="submit()" :class="{ light: !isLoading }"></TextField>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <ActivityIndicator :busy="isLoading"></ActivityIndicator>
  
            <StackLayout v-show="!isLoading">
              <Button text="Login" :isEnabled="!isLoading" class="submit-button" @tap="submit()"></Button>
            </StackLayout>
  
            <GridLayout v-show="$store.state.user.isLoggedIn" justifyContent="flex-end" columns="*" rows="auto">
              <Button @tap="$router.push('/admin/dashboard')" :text="'Continue as '+ $store.state.user.userName"></Button>
            </GridLayout>
  
          </FlexboxLayout>
        </GridLayout>
      </CardView>
    </ScrollView>
  
  </page>
</template>

<script>
  const dialogs = require("ui/dialogs");
  const http = require("http");
  
  import * as Toast from "nativescript-toast";
  var appSettings = require("application-settings");
  
  import * as connectivity from "tns-core-modules/connectivity";
  
  export default {
    name: "login",
    data() {
      return {
        isLoading: false,
        isEnterEmail: false,
        user: {
          numbers: "",
          password: "",
          email: ""
        }
      };
    },
    beforeDestroy() {
      Toast.makeText("Destroy login").show();
      this.pageLoaded();
    },
    created() {
      Toast.makeText("Mounted login").show();
      this.pageLoaded();
    },
    methods: {
      pageLoaded() {
        var logged = this.$store.state.user.isLoggedIn;
        if (logged) {
          //this.$router.push('/home');
        }
      },
      submit() {
        var self = this;
        this.isLoading = true;
  
        dialogs
          .action("What type of user are you?", "cancel", ["Student", "Admin"])
          .then(userType => {
            if (userType == "Student") {
              return;
              http
                .request({
                  url: this.$store.state.settings.baseLink + "/s/login",
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  content: JSON.stringify({
                    useEmail: this.isEnterEmail,
                    numbers: this.user.numbers,
                    email: this.user.email,
                    pass: this.user.password
                  })
                })
                .then(
                  function(response) {
                    self.isLoading = false;

                    var statusCode = response.statusCode;
                    if (statusCode == 200) {
                      var result = response.content.toJSON();
                      appSettings.setNumber("authLevel",1);
                      // TODO : DO staff correctly
                      self.$router.push("/tenant/dashboard");
                    } else {
                      var error = response.content.toString();
                      dialogs
                        .alert("Error : " + statusCode + " " + error)
                        .then(() => {
                          console.log(result);
                        });
                    }
                  },
                  function(e) {
                    dialogs.alert(e).then(() => {
                      console.log("Error occurred " + e);
                    });
  
                    self.isLoading = false;
                  }
                );
            } else if (userType == "Admin") {
  
              var connectionType = connectivity.getConnectionType();
              switch (connectionType) {
                case connectivity.connectionType.wifi:
  
                  http
                    .request({
                      url: this.$store.state.settings.baseLink + "/a/login",
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      content: JSON.stringify({
                        useEmail: this.isEnterEmail,
                        numbers: this.user.numbers,
                        email: this.user.email,
                        pass: this.user.password
                      })
                    })
                    .then(
                      function(response) {
                        self.isLoading = false;
  
                        var statusCode = response.statusCode;
                        if (statusCode == 200) {
                          var result = response.content.toJSON();
  
                          appSettings.setNumber("authLevel",3);
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
                        }
                      },
                      function(e) {
                        dialogs.alert("There is an error!!").then(() => {
                          console.log("Error occurred " + e);
                        });
  
                        self.isLoading = false;
                      }
                    );
  
                  break;
                case connectivity.connectionType.none:
  
                  var documentID = appSettings.getString("loginResponse");
                  if (documentID == null) {
  
                    this.$feedback.error({
                      title: "Error (NO INTERNET CONNECTION)",
                      duration: 4000,
                      message: "Please switch on your data/wifi.",
                    });
  
                    self.isLoading = false;
                  } else {
  
                    appSettings.setNumber("authLevel",3);
                    var documentsID = appSettings.getString("loginResponse");
  
                    console.log(documentID + " found in your storage");
                    let admin = self.$db.getDocument(documentID);
                    this.loginAdmin(this, admin.result);
  
                    this.$router.push("/admin/dashboard");
                  }
  
                  break;
                case connectivity.connectionType.mobile:
  
                  dialogs
                    .action("You are about to use your data", "cancel", ["Yes , it is fine", "No , load from cache"])
                    .then(useData => {
                      if (useData == "Yes , it is fine") {
                        dialogs.alert("TODO : go to database ...");
                      } else {
                        dialogs.alert("TODO : load from cache ...");
                      }
                    });
                  break;
              }
            }
          });
      }
    }
  };
</script>

<style>
  
</style>