<template>
  <GridLayout columns="*" rows="auto,*">
    <CardView class="m-b-5" row="0" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
      <GridLayout class="bg-dark-blue p-5" rows="auto,auto" columns="auto,*,auto">
        <Ripple rowSpan="2" @tap="navigate(null)" verticalAlignment="center" borderRadius="50%">
          <Label verticalAlignment="center" textAlignment="center" class="mdi text-white p-15" fontSize="25%" :text="'mdi-keyboard-backspace' | fonticon"></Label>
        </Ripple>
        <Image v-if="business.logo" row="0" rowSpan="2" col="2" verticalAlignment="center" width="70" height="70" class="circle p-5" stretch="aspectFill" :src="business.logo" borderRadius="50%" />
        <Ripple v-if="!business.logo" row="0" rowSpan="2" col="2" width="70" height="70" verticalAlignment="center" borderRadius="50%">
          <Label verticalAlignment="center" textAlignment="center" class="mdi" fontSize="35%" :text="'mdi-image-filter-center-focus' | fonticon"></Label>
        </Ripple>
        <label row="0" col="0" colSpan="3" fontSize="18%" verticalAlignment="bottom" textAlignment="center" class="font-weight-bold text-white text-mute" text="Notifications"></label>
        <Label row="1" col="0" colSpan="3" fontSize="15%" verticalAlignment="center" textAlignment="center" class="text-white" :textWrap="true" :text="`Reminders and alerts about ${business.name}`"></Label>
      </GridLayout>
    </CardView>
    <StackLayout class="p-x-15" row="1">
      <CardView margin="5" elevation="10">
        <GridLayout rows="auto,auto,auto,*,auto" columns="*,*,*">
          <ActivityIndicator v-if="!Notifications" col="0" colSpan="3" textAlignment="center" verticalAlignment="center" :busy="!Notifications"></ActivityIndicator>
          <PullToRefresh col="0" colSpan="3" @refresh="refreshList($event)">
            <ScrollView v-if="Notifications">
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
          </PullToRefresh>
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
      ],
      businessPartner: {}
    };
  },
  mounted() {
    this.businessPartner = {
      title: "Partners",
      isToParent: false,
      link: `/business/partners/list`,
      props: {
        businessId: this.business._id,
        businessName: this.business.name
      },
      value: this.business.admin && this.business.admin.length
    };

    if (this.businessPartner.value && this.businessPartner.value == 1) {
      this.businessPartner.value = this.businessPartner.value + " partner";
    } else if (this.businessPartner.value != 1) {
      this.businessPartner.value = this.businessPartner.value + " partners";
    }

    var revenue_profit =
      this.business.revenues &&
      this.business.revenues.values &&
      this.business.revenues.values.find(v => v.key == "overall");

    this.summaryStats.push({
      title: "Revenue",
      isToParent: true,
      link: `Stats`,
      value: revenue_profit
        ? "R" +
          this.$approx(revenue_profit.revenue, {
            min10k: true
          })
        : "null"
    });

    this.summaryStats.push({
      title: "Profit",
      isToParent: false,
      link: `/business/income/list`,
      props: {
        businessId: this.business._id,
        businessName: this.business.name
      },
      value: revenue_profit
        ? "R" +
          this.$approx(revenue_profit.profit, {
            min10k: true
          })
        : "null"
    });

    this.summaryStats.push({
      title: "Expenses",
      isToParent: false,
      link: `/business/expenses/list`,
      props: {
        businessId: this.business._id,
        businessName: this.business.name
      },
      value: revenue_profit
        ? "R" +
          this.$approx(revenue_profit.revenue - revenue_profit.profit, {
            min10k: true
          })
        : "null"
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
    refreshList(args) {
      this.getNotifications(args);
    },
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
    getNotifications(args = null) {
      this.$api
        .getNotifications(
          this.$store.state.cache.cachedAdmin._id,
          this.business._id
        )
        .then(notifications => {
          if (args) {
            args.object.refreshing = false;
          }
          this.Notifications = notifications;
        })
        .catch(err => {
          if (args) {
            args.object.refreshing = false;
          }
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
