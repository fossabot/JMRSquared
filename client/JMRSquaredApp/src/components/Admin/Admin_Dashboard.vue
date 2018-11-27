<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*">
      <CardView row="0" class="m-b-15 p-y-15" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
        <GridLayout rows="auto,auto,auto" columns="auto,*,auto">
          <Ripple row="0" col="2" class="p-10" @tap="logOut()" textAlignmemt="right" verticalAlignment="center" borderRadius="50%">
            <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-more-vert' | fonticon"></Label>
          </Ripple>
          <Image row="0" rowSpan="3" col="0" verticalAlignment="center" width="60" height="60" class="m-5 circle" borderWidth="5px" borderColor="white" stretch="aspectFill" :src="user.profilePic ? user.profilePic : $store.state.settings.defaultProfilePic" borderRadius="50%"
          />
          <label row="0" verticalAlignment="bottom" col="1" class="h2 m-5 font-weight-bold text-mute text-dark-blue" :text="user.userName"></label>
          <Label row="1" verticalAlignment="bottom" col="1" class="h3 m-5" :text="user.email"></Label>
        </GridLayout>
      </CardView>
      <ScrollView class="m-x-15" row="1">
        <StackLayout>
          <GridLayout rows="auto" columns="*">
            <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Notifications"></label>
          </GridLayout>
  
          <GridLayout rows="auto,auto,auto" columns="*,auto">
            <StackLayout row="0" colSpan="2">
              <CardView elevation="5" margin="5">
                <Ripple>
                  <GridLayout class="p-10" rows="auto,auto,auto" columns="auto,*">
                    <Image row="0" rowSpan="2" verticalAlignment="center" width="60" height="60" col="0" stretch="aspectFill" src="https://picsum.photos/200/300" />
                    <label row="0" col="1" textWrap="true" class="h3 font-weight-bold text-mute text-dark-blue p-x-5" verticalAlignment="center" text="Food was bought by nolo for R400 and this is soo sad"></label>
                    <Label row="1" col="1" class="h4 text-mute p-x-5" verticalAlignment="bottom" textAlignment="right" text="a days ago"></Label>
                  </GridLayout>
                </Ripple>
              </CardView>
            </StackLayout>
            <StackLayout class="p-10" row="1" col="1" orientation="horizontal">
              <Ripple textAlignmemt="right" verticalAlignment="center" borderRadius="50%">
                <Label textAlignmemt="center" verticalAlignment="center" class="mdi" fontSize="40%" :text="'mdi-chevron-left' | fonticon"></Label>
              </Ripple>
              <Ripple textAlignmemt="right" verticalAlignment="center" borderRadius="50%">
                <Label textAlignmemt="center" verticalAlignment="center" class="mdi" fontSize="40%" :text="'mdi-chevron-right' | fonticon"></Label>
              </Ripple>
            </StackLayout>
          </GridLayout>
  
          <GridLayout rows="auto" columns="*">
            <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Businesses"></label>
          </GridLayout>
  
          <GridLayout v-show="layouts.filter(l => l.title).length != 0" class="m-20" rows="auto,auto" columns="*,*,*">
            <CardView :row="item.row" :col="item.col" :key="i" v-for="(item,i) in layouts.filter(l => l.link)" textAlignment="center">
              <Ripple @tap="onItemTap(item)" rippleColor="$blueColor" borderRadius="50%">
                <GridLayout rows="*,*" columns="*">
                  <ActivityIndicator rowSpan="2" v-if="!item.title" textAlignment="center" verticalAlignment="center" :busy="!item.title"></ActivityIndicator>
                  <Label v-show="item.title" :class="{'visible':item.title}" class="mdi businessIcon" textAlignment="center" fontSize="50%" verticalAlignment="center" :text="'mdi-' + item.icon | fonticon"></Label>
                  <Label row="1" v-show="item.title" textWrap="true" class="p-t-10" :text="item.title" textAlignment="center" />
                </GridLayout>
              </Ripple>
            </CardView>
          </GridLayout>
  
          <GridLayout v-show="layouts.filter(l => l.title).length == 0" class="m-20" rows="*" columns="*">
            <ActivityIndicator textAlignment="center" verticalAlignment="center" :busy="layouts.filter(l => l.title).length == 0"></ActivityIndicator>
          </GridLayout>
  
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
import Documents from "./DocumentList.vue";
import * as Toast from "nativescript-toast";

import * as imagepicker from "nativescript-imagepicker";

var appSettings = require("application-settings");
import * as connectivity from "tns-core-modules/connectivity";
const http = require("http");

export default {
  components: {
    Documents
  },
  data() {
    return {
      layouts: [],
      isLoaded: false,
      currentPage: 0,
      currentTab: 0,
      selectedScreen: 1,
      feeds: []
    };
  },
  computed: {
    user: {
      get() {
        return this.$store.state.cache.cachedAdmin;
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
      this.layouts = [];
      this.isLoaded = true;

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          this.layouts.push({
            id: r + "" + c,
            row: r,
            col: c
          });
        }
      }

      var connectionType = connectivity.getConnectionType();
      if (connectionType == connectivity.connectionType.none) {
        this.$feedback.error({
          title: "Error (NO INTERNET CONNECTION)",
          duration: 4000,
          message: "Please switch on your data/wifi."
        });
      } else {
        http
          .getJSON(
            this.$store.state.settings.baseLink +
              "/b/all/for/" +
              this.$store.state.cache.cachedAdmin._id
          )
          .then(results => {
            var count = results.length;
            if (count > this.layouts.length) {
              count = this.layouts.length;
            }
            var i = 0;
            var tank = [];
            var timer = setInterval(() => {
              if (tank.filter(t => t == i).length == 0) {
                if (i < count) {
                  this.layouts[i].icon = results[i].type.icon;
                  this.layouts[i].title = results[i].name;
                  this.layouts[i].link = {
                    name: "BusinessHome",
                    params: {
                      businessID: results[i]._id
                    }
                  };
                } else {
                  if (
                    this.layouts.filter(l => !l.title && !l.icon).length > 0
                  ) {
                    var first = this.layouts.filter(
                      l => !l.title && !l.icon
                    )[0];
                    first.icon = "add";
                    first.title = "Add Business";
                    first.link = "/business/add/business";
                  }
                  this.layouts.filter(l => !l.title && !l.icon).map(layout => {
                    layout.icon = " ";
                    layout.title = " ";
                  });
                  clearInterval(timer);
                }
                tank.push(i);
                i++;
                this.$forceUpdate();
              }
            }, 700);
          })
          .catch(err => {
            this.$feedback.error({
              title: "Unable to load your businesses",
              duration: 4000,
              message: "Please try again later"
            });
            this.layouts.forEach(layout => {
              layout.icon = "bug-report";
              layout.title = "Invalid";
            });
            this.$forceUpdate();
          });
      }

      var firstTime = appSettings.getBoolean("shownChangeLog");
      if (firstTime != true) {
        this.showChangeLog();
        appSettings.setBoolean("shownChangeLog", true);
      }
    },
    eventChanged(event) {
      dialogs.alert("Changed view").then(() => {
        console.log("This is it");
      });
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
      if (item.link) {
        this.$router.push(item.link);
      }
    },
    onBusinessTap(item) {}
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/variables";
.businessIcon {
  &.visible {
    animation-name: show;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
  }
  @keyframes show {
    from {
      transform: scale(4);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
}

.pulse {
  animation-name: pulse;
  animation-duration: 3s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  @keyframes pulse {
    0% {
      transform: opacity(1) scale(1);
    }
    50% {
      transform: opacity(0.5) scale(0.5);
    }
  }
}
</style>
