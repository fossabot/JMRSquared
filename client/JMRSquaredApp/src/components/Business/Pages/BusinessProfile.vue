<template>
  <ScrollView>
    <GridLayout class="p-x-15" columns="*" rows="auto,auto,auto,*">
      <Image row="0" width="100" height="100" src="res://jmrlogo" alignSelf="center" stretch="aspectFit" />
      <StackLayout row="1">
        <label textAlignment="center" verticalAlignment="center" fontSize="25%" class="h3 font-weight-bold text-light-red" :text="business.name"></label>
      </StackLayout>
      <StackLayout row="2">
        <GridLayout rows="auto" columns="*">
          <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Summary"></label>
        </GridLayout>
        <CardView margin="15" elevation="10">
          <GridLayout rows="*,*" columns="*,*,*">
            <StackLayout row="0" :col="i" v-for="(summary,i) in summaryStats" :key="i">
              <Ripple @tap="showPartners()">
                <StackLayout class="p-15">
                  <label class="h3 font-weight-bold text-dark-blue summaryStats" :text="summary.value" :class="{'visible':true}" fontSize="30%" vertialAlignment="center" textAlignment="center"></label>
                  <label vertialAlignment="center" textAlignment="center" :text="summary.title"></label>
                </StackLayout>
              </Ripple>
            </StackLayout>
          </GridLayout>
        </CardView>
           <GridLayout rows="auto" columns="*">
      <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Ca$h flow"></label>
       </GridLayout>
        <GridLayout rows="auto,auto,*" columns="*,auto">
          <SegmentedBar row="0" colSpan="2" #tabs borderColor="$blueDarkColor" class="businessIcon snapTop" backgroundColor="transparent" selectedBackgroundColor="#0093a4" v-model="selectedStat">
            <SegmentedBarItem v-for="(tab,i) in tabs" :key="i" :class="{'text-dark-blue':i == currentTab}" @tap="currentTab = i" :title="tab"></SegmentedBarItem>
          </SegmentedBar>
          <Ripple row="1" col="1">
            <Label verticalAlignment="center" textAlignment="right" alignSelf="right" class="mdi h1 m-10" :text="'mdi-add' | fonticon"></Label>
          </Ripple>
          <ScrollView row="2" colSpan="2">
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
        </GridLayout>
      </StackLayout>
    </GridLayout>
  </ScrollView>
</template>

<script>
const dialogs = require("ui/dialogs");
import application from "application";

export default {
  data() {
    return {
      tabs: ["Expenses", "Activities"],
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
      value: 12
    });

    this.summaryStats.push({
      title: "Revenue",
      value:
        "R" +
        this.$approx(90829, {
          min10k: true
        })
    });

    this.summaryStats.push({
      title: "Profit",
      value:
        "R" +
        this.$approx(78239, {
          min10k: true
        })
    });
  },
  props: ["business"],
  methods: {
    showPartners() {
      this.$router.push(
        `/business/partners/list/${this.business._id}/${this.business.name}`
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/variables";
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
