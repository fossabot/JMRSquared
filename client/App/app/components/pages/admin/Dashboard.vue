<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,auto,*">
      <CardView row="0" class="m-b-15 p-y-15" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
        <GridLayout rows="auto,auto,auto" columns="auto,*,auto">
          <Ripple row="0" rowSpan="3" col="2" class="p-10" @tap="logOut()" textAlignmemt="left" verticalAlignment="center" borderRadius="50%">
            <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-dots-vertical' | fonticon"></Label>
          </Ripple>
          <Image row="0" rowSpan="3" col="0" verticalAlignment="center" width="60" height="60" class="m-5 circle" borderWidth="5px" borderColor="white" stretch="aspectFill" :src="user.profilePic ? user.profilePic : $store.state.settings.defaultProfilePic" borderRadius="50%"
          />
          <label row="0" verticalAlignment="bottom" col="1" class="h2 m-5 font-weight-bold text-mute text-dark-blue" :text="user.userName"></label>
          <Label row="1" verticalAlignment="bottom" col="1" class="h3 m-5" :text="user.email"></Label>
        </GridLayout>
      </CardView>
  
      <StackLayout class="m-x-15" row="1">
        <GridLayout rows="auto" columns="*">
          <label class="h3 font-weight-bold text-mute text-dark-blue" text="Pick a business or Add new one"></label>
        </GridLayout>
      </StackLayout>
  
      <PullToRefresh row="2" @refresh="refreshList($event)">
        <ScrollView class="m-x-15">
          <StackLayout>
            <GridLayout v-show="layouts.filter(l => l.title).length != 0" class="m-20" rows="auto,auto" columns="*,*,*">
              <CardView class="m-y-15" elevation="0" :row="item.row" :col="item.col" :key="i" v-for="(item,i) in layouts.filter(l => l.link)" textAlignment="center">
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
      </PullToRefresh>
    </GridLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
import * as Toast from "nativescript-toast";

import * as imagepicker from "nativescript-imagepicker";

var appSettings = require("application-settings");
import * as connectivity from "tns-core-modules/connectivity";
const http = require("http");

export default {
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
    cachedBusinesses: {
      get() {
        return this.$store.state.cache.cachedBusinesses;
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
    pageLoaded(args = null) {
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

      this.$api
        .getAllBusinessesForUser(this.$store.state.cache.cachedAdmin._id)
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
                this.layouts[i].link = "/business/home";
                this.layouts[i].props = {
                  businessID: results[i]._id
                };
              } else {
                if (this.layouts.filter(l => !l.title && !l.icon).length > 0) {
                  var first = this.layouts.filter(l => !l.title && !l.icon)[0];
                  first.icon = "briefcase-plus";
                  first.title = "Add Business";
                  first.link = "/business/add/business";
                }
                this.layouts
                  .filter(l => !l.title && !l.icon)
                  .map(layout => {
                    layout.icon = " ";
                    layout.title = " ";
                  });
                clearInterval(timer);
                if (args) {
                  args.object.refreshing = false;
                }
              }
              tank.push(i);
              i++;
              this.$forceUpdate();
            }
          }, 300);
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
          if (args) {
            args.object.refreshing = false;
          }
          this.$forceUpdate();
        });

      var firstTime = appSettings.getBoolean("shownChangeLog");
      if (!firstTime) {
        this.showChangeLog();
        appSettings.setBoolean("shownChangeLog", true);
      }
    },
    refreshList(args) {
      this.pageLoaded(args);
    },
    eventChanged(event) {
      dialogs.alert("Changed view").then(() => {
        console.log("This is it");
      });
    },
    onItemTap(item) {
      if (item.link) {
        this.navigate(item.link, item.props);
      }
    },
    onBusinessTap(item) {}
  }
};
</script>

<style lang="scss" scoped>
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
