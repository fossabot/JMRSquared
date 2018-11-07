<template>
  <page @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout rows="*" columns="auto,*,auto,auto" orientation="horizontal">
        <Ripple class="p-10" @tap="$router.back()" verticalAlignment="center" col="0" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-arrow-back' | fonticon"></Label>
        </Ripple>
        <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" :text="'Home - ' + user.userName"></Label>
        <Ripple class="p-10" @tap="reportBug()" verticalAlignment="center" col="2" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-bug-report' | fonticon"></Label>
        </Ripple>
        <Ripple class="p-10" @tap="logOut()" verticalAlignment="center" col="3" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi text-light-red" fontSize="25%" :text="'mdi-power-settings-new' | fonticon"></Label>
        </Ripple>
      </GridLayout>
    </ActionBar>
    <StackLayout>
      <StackLayout class="p-y-20" alignSelf="center" width="100%">
        <Image alignSelf="center" class="m-5" borderWidth="5px" borderColor="white" stretch="aspectFill" :src="user.profilePic ? user.profilePic : $store.state.settings.defaultProfilePic" width="100" height="100" borderRadius="50%" />
        <label class="h2 m-5 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" :text="user.userName"></label>
        <Label class="h3 m-5" textAlignment="center" :text="user.email"></Label>
      </StackLayout>
      <Ripple @tap="$router.push('/admin/profile/edit')" class="m-5" borderWidth="5px" width="40" height="40" borderRadius="50%">
        <Label class="mdi" textAlignment="center" verticalAlignment="center" fontSize="25%" :text="'mdi-mode-edit' | fonticon"></Label>
      </Ripple>
      <GridLayout class="m-20" rows="*,*" columns="*,*,*">
        <CardView :row="item.row" :col="item.col" :key="i" v-for="(item,i) in layouts" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
          <Ripple @tap="onItemTap(item)" rippleColor="$blueColor" borderRadius="50%">
            <GridLayout rows="*,*" columns="*">
              <ActivityIndicator rowSpan="2" v-if="!item.title" textAlignment="center" verticalAlignment="center" :busy="!item.title"></ActivityIndicator>
              <Label v-show="item.title" :class="{'visible':item.title}" class="mdi businessIcon" textAlignment="center" fontSize="50%" verticalAlignment="center" :text="'mdi-' + item.icon | fonticon"></Label>
              <Label row="1" v-show="item.title" class="p-t-10" :text="item.title" textAlignment="center" />
            </GridLayout>
          </Ripple>
        </CardView>
      </GridLayout>
    </StackLayout>
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
      layouts: [
        {
          id: "taxify",
          icon: "local-taxi",
          link: "/taxify/home",
          title: "Taxify",
          row: 0,
          col: 0
        },
        {
          id: "cosmetics",
          icon: "local-florist",
          link: "/cosmetics/home",
          title: "Cosmetics",
          row: 0,
          col: 1
        },
        {
          id: "fulham86",
          link: "/admin/fulham/home",
          icon: "home",
          title: "Property",
          row: 0,
          col: 2
        },
        {
          id: "reminders",
          icon: "add",
          title: "Add Business",
          row: 1,
          col: 0
        },
        {
          id: "bugReport",
          icon: "add",
          link: "/admin/reminders",
          title: "Add Business",
          row: 1,
          col: 1
        },
        {
          id: "info",
          icon: "info",
          title: "Info and help",
          row: 1,
          col: 2
        }
      ],
      isLoaded: false,
      currentPage: 0,
      currentTab: 0,
      selectedScreen: 1,
      feeds: [],
      properties: [
        {
          id: "fulham86",
          text: "Fulham 86",
          img:
            "data:image/png;base64,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",
          redirect: "/admin/fulham/home",
          type: "page"
        },
        {
          text: "Hot Cash",
          img:
            "data:image/png;base64,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",
          redirect: "/home",
          type: "page"
        }
      ]
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
                  this.layouts
                    .filter(l => !l.title && !l.icon)
                    .forEach(layout => {
                      layout.icon = "add";
                      layout.title = "Add Business";
                      layout.link = "/business/add/business";
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
    animation-duration: 2s;
    animation-fill-mode: forwards;
  }
  @keyframes show {
    from {
      transform: scale(5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
}
</style>
