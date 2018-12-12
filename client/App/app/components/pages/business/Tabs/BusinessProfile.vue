<template>
  <GridLayout class="p-x-15" columns="*" rows="auto,*">
    <Ripple class="m-y-15" row="0">
      <StackLayout>
        <Image v-if="business.logo" height="100" :src="business.logo" alignSelf="center" stretch="aspectFit" />
        <label v-if="!business.logo" textAlignment="center" verticalAlignment="center" fontSize="25%" class="h3 font-weight-bold text-dark-blue" :text="business.name"></label>
        <Label class="m-10" textWrap="true" verticalAlignment="center" textAlignment="center" :text="business.description"></Label>
      </StackLayout>
    </Ripple>
    <StackLayout row="1">
      <CardView margin="5" elevation="10">
        <GridLayout rows="auto,*,auto" columns="*,*,*">
          <Ripple row="0" col="0" colSpan="3">
            <GridLayout class="m-15" rows="auto" columns="*">
              <label row="0" col="0" verticalAlignment="center" class="h3 font-weight-bold text-mute text-dark-blue" text="Notifications"></label>
            </GridLayout>
          </Ripple>
  
          <ActivityIndicator v-if="!Notifications" row="1" col="0" colSpan="3" textAlignment="center" verticalAlignment="center" :busy="!Notifications"></ActivityIndicator>
  
          <Fab @tap="GoTo(sendNotificationPage)" row="1" col="0" colSpan="3" icon="res://ic_bell_plus_white_24dp" class="fab-button fixedBtn"></Fab>
          <ScrollView v-if="Notifications" row="1" col="0" colSpan="3">
            <StackLayout>
              <GridLayout rows="auto" columns="*,auto" v-for="(notification,i) in Notifications" :key="i">
                <Ripple @tap="selectedNotification == i ? selectedNotification = null: selectedNotification = i" col="0" :colSpan="selectedNotification == i ? '1' : '2'" class="m-r-15 p-15">
                  <GridLayout rows="auto,auto,auto" columns="auto,*,auto">
                    <label row="0" rowSpan="3" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-' + notification.icon | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="notification.title"></label>
                    <label row="1" col="1" :textWrap="true" class="h4" :text="notification.body"></label>
                    <Label row="2" col="2" verticalAlignment="center" class="h4 text-mute p-x-5" textAlignment="right" :text="getMoment(notification.date).fromNow()"></Label>
                  </GridLayout>
                </Ripple>
                <StackLayout verticalAlignment="center" textAlignment="center" row="0" col="1" v-if="selectedNotification == i">
                  <Ripple @tap="markNotificationAsSeen(notification)">
                    <label verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-thumb-up-outline' | fonticon"></label>
                  </Ripple>
                </StackLayout>
              </GridLayout>
            </StackLayout>
          </ScrollView>
  
          <StackLayout row="2" :col="i" v-for="(summary,i) in summaryStats" :key="i">
            <Ripple @tap="showStats(summary,summary.isToParent)">
              <StackLayout class="p-15">
                <label class="h3 font-weight-bold text-dark-blue summaryStats" :text="summary.value" :class="{'visible':true}" fontSize="25%" vertialAlignment="center" textAlignment="center"></label>
                <label class="font-weight-bold" vertialAlignment="center" textAlignment="center" :text="summary.title"></label>
              </StackLayout>
            </Ripple>
            <StackLayout width="100%" class="hr-light"></StackLayout>
          </StackLayout>
        </GridLayout>
      </CardView>
    </StackLayout>
  </GridLayout>
</template>

<script>
const dialogs = require("ui/dialogs");
import application from "application";

export default {
  data() {
    return {
      tabs: ["Summary", "Expenses", "Activities"],
      sendNotificationPage: {},
      Notifications: null,
      Expenses: [12, 12, 12, 12, 12, 12],
      summaryStats: [],
      isMainScreen: false,
      selectedScreen: "",
      selectedNotification: null,
      cards: [
        {
          text: "new new 86",
          img: "",
          redirect: "/admin/fulham/home",
          type: "page"
        },
        {
          text: "Hot Cash",
          img: "",
          redirect: "/home",
          type: "page"
        }
      ]
    };
  },
  mounted() {
    this.summaryStats.push({
      title: "Partners",
      isToParent: false,
      link: `/business/partners/list`,
      props: {
        businessId: this.business._id,
        businessName: this.business.name
      },
      value: 12
    });

    this.summaryStats.push({
      title: "Revenue",
      isToParent: true,
      link: `Stats`,
      value:
        "R" +
        this.$approx(90829, {
          min10k: true
        })
    });

    this.summaryStats.push({
      title: "Profit",
      isToParent: true,
      link: `Stats`,
      value:
        "R" +
        this.$approx(78239, {
          min10k: true
        })
    });

    this.sendNotificationPage = {
      link: "/notification/send",
      props: {
        businessId: this.business._id,
        businessName: this.business.name
      }
    };
    this.getNotifications();
  },
  props: ["business"],
  methods: {
    markNotificationAsSeen(notification) {
      dialogs
        .confirm({
          title: "Mark as seen",
          message: "Are you sure you want to remove this notification?",
          okButtonText: "Yes",
          cancelButtonText: "No"
        })
        .then(result => {
          if (result) {
            this.$api
              .markNotificationAsSeen(notification._id)
              .then(response => {
                this.selectedNotification = null;
                this.$feedback.success({
                  title: "Notification removed"
                });
                var index = this.Notifications.indexOf(notification);
                this.Notifications.splice(index, 1);
              })
              .catch(err => {
                this.$feedback.error({
                  title: "Notification not removed",
                  message: err.message
                });
              });
          }
        });
    },
    showStats(option, toParent) {
      if (!toParent) {
        this.GoTo(option);
      } else {
        this.$emit("changeTab", option.link);
      }
    },
    getNotifications() {
      this.$api
        .getNotifications(
          this.$store.state.cache.cachedAdmin._id,
          this.business._id
        )
        .then(notifications => {
          this.Notifications = notifications;
        })
        .catch(err => {
          this.$feedback.error({
            title: "Unable to load new notifications.",
            duration: 4000,
            message: "Please try again later"
          });
          this.Notifications = [];
        });
    },
    GoTo(option) {
      if (option.link) {
        this.navigate(option.link, option.props);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.overlayBG {
  background-image: url("res://jmrlogo");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.snapTop {
  position: fixed;
}

.summaryStats {
  &.visible {
    animation-name: show;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
  @keyframes show {
    from {
      transform: scale(0.1);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
}

.b-r-15 {
  border: 2px solid red;
}
</style>
