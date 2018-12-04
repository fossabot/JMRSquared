<template>
  <GridLayout class="p-x-15" columns="*" rows="auto,*">
    <StackLayout class="m-y-15" row="0">
      <Image v-if="business.logo" height="100" :src="business.logo" alignSelf="center" stretch="aspectFit" />
      <label v-if="!business.logo" textAlignment="center" verticalAlignment="center" fontSize="25%" class="h3 font-weight-bold text-dark-blue" :text="business.name"></label>
      <Label class="m-10" textWrap="true" verticalAlignment="center" textAlignment="center" :text="business.description"></Label>
    </StackLayout>
    <StackLayout row="1">
      <GridLayout rows="auto,auto,*" columns="*,auto">
        <SegmentedBar row="0" colSpan="2" #tabs borderColor="$blueDarkColor" class="businessIcon snapTop" backgroundColor="transparent" selectedBackgroundColor="#0093a4" v-model="selectedStat">
          <SegmentedBarItem v-for="(tab,i) in tabs" :key="i" :class="{'text-dark-blue':i == currentTab}" @tap="currentTab = i" :title="tab"></SegmentedBarItem>
        </SegmentedBar>
        <StackLayout v-if="selectedStat == 0" row="2" colSpan="2">
          <CardView margin="5" elevation="10">
            <GridLayout rows="auto,auto,*" columns="*,*,*">
              <StackLayout row="0" :col="i" v-for="(summary,i) in summaryStats" :key="i">
                <Ripple @tap="showStats(summary,summary.isToParent)">
                  <StackLayout class="p-15">
                    <label class="h3 font-weight-bold text-dark-blue summaryStats" :text="summary.value" :class="{'visible':true}" fontSize="30%" vertialAlignment="center" textAlignment="center"></label>
                    <label vertialAlignment="center" textAlignment="center" :text="summary.title"></label>
                  </StackLayout>
                </Ripple>
              </StackLayout>
              <StackLayout row="1" col="0" colSpan="3">
                <StackLayout width="100%" class="hr-light"></StackLayout>
                <label class="h3 font-weight-bold text-mute text-dark-blue m-15" text="Notifications"></label>
              </StackLayout>
              <ScrollView row="2" col="0" colSpan="3">
                <StackLayout>
                   <Ripple class="p-15" @tap="GoTo(sendNotificationPage)">
                    <GridLayout rows="auto,auto" columns="auto,*">
                      <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-bell-plus' | fonticon"></label>
                      <label row="0" col="1" class="h2 font-weight-bold text-mute" fontSize="20%" text="Send new"></label>
                      <label row="1" col="1" class="h4" text="Send a notification to a partner/s"></label>
                    </GridLayout>
                  </Ripple>
                  <Ripple class="m-x-15 p-15" v-for="a in 10" :key="a">
                    <GridLayout rows="auto,auto" columns="auto,*,auto">
                      <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-bell' | fonticon"></label>
                      <label row="0" col="1" verticalAlignment="center" class="h3 text-mute" fontSize="20%" text="optional.title"></label>
                      <label row="1" col="1" verticalAlignment="center" class="" text="optional.answer"></label>
                      <Label row="1" col="2" verticalAlignment="center" class="h4 text-mute p-x-5" textAlignment="right" text="a days ago"></Label>
                    </GridLayout>
                  </Ripple>
                </StackLayout>
              </ScrollView>
            </GridLayout>
          </CardView>
        </StackLayout>
        <StackLayout v-if="selectedStat == 1" row="2" colSpan="2">
          <Ripple>
            <Label verticalAlignment="center" textAlignment="right" alignSelf="right" class="mdi h1 m-10" :text="'mdi-playlist-plus' | fonticon"></Label>
          </Ripple>
          <ScrollView>
            <StackLayout>
              <Ripple class="p-15" v-for="a in 5" :key="a">
                <CardView elevation="10" margin="5">
                  <GridLayout class="p-15" rows="auto,auto,auto" columns="*,*">
                    <Label row="0" col="0" class="h3 p-b-5" colSpan="2" textAlignment="center" verticalAlignment="center" text="Londi Cleaner" />
                    <Label row="1" col="0" rowSpan="2" textAlignment="left" textWrap="true" verticalAlignment="center" text="1st of every month" />
                    <Label row="1" col="1" class="text-light-blue" textAlignment="right" textWrap="true" verticalAlignment="center" text="R2000" />
                    <Label row="2" col="1" textAlignment="right" fontSize="15%" textWrap="true" verticalAlignment="center" text="paid for JUNE" />
                  </GridLayout>
                </CardView>
              </Ripple>
            </StackLayout>
          </ScrollView>
        </StackLayout>
        <StackLayout v-if="selectedStat == 2" row="2" colSpan="2">
          <Ripple>
            <Label verticalAlignment="center" textAlignment="right" alignSelf="right" class="mdi h1 m-10" :text="'mdi-playlist-plus' | fonticon"></Label>
          </Ripple>
          <ScrollView>
            <StackLayout>
              <Ripple class="p-15" v-for="a in 15" :key="a">
                <CardView elevation="10" margin="5">
                  <GridLayout class="p-15" rows="auto,auto,auto" columns="*,*">
                    <Label row="0" col="0" class="h3 p-b-5" colSpan="2" textAlignment="center" verticalAlignment="center" text="Londi Cleaner" />
                    <Label row="1" col="0" rowSpan="2" textAlignment="left" textWrap="true" verticalAlignment="center" text="1st of every month" />
                    <Label row="1" col="1" class="text-light-blue" textAlignment="right" textWrap="true" verticalAlignment="center" text="R2000" />
                    <Label row="2" col="1" textAlignment="right" fontSize="15%" textWrap="true" verticalAlignment="center" text="paid for JUNE" />
                  </GridLayout>
                </CardView>
              </Ripple>
            </StackLayout>
          </ScrollView>
        </StackLayout>
      </GridLayout>
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
      selectedStat: 0,
      Expenses: [12, 12, 12, 12, 12, 12],
      summaryStats: [],
      isMainScreen: false,
      selectedScreen: "",
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
  },
  props: ["business"],
  methods: {
    showStats(option, toParent) {
      if (!toParent) {
        this.GoTo(option);
      } else {
        this.$emit("changeTab", option.link);
      }
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
