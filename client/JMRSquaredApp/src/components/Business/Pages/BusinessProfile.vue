<template>
  <GridLayout class="m-x-15" rows="auto,*">
    <StackLayout row="0">
      <Image src="res://jmrlogo" alignSelf="center" stretch="aspectFit" />
    </StackLayout>
    <StackLayout row="1">
      <ScrollView>
        <StackLayout>
          <GridLayout rows="auto" columns="*">
            <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Summary"></label>
          </GridLayout>
  
          <CardView margin="15" elevation="10">
            <GridLayout rows="auto,auto" columns="*,*,*">
              <StackLayout class="p-15" :col="i" v-for="(summary,i) in summaryStats" :key="i">
                <label row="0" class="h3 font-weight-bold text-dark-blue summaryStats" :text="summary.value" :class="{'visible':true}" fontSize="30%" vertialAlignment="center" textAlignment="center"></label>
                <label row="1" vertialAlignment="center" textAlignment="center" :text="summary.title"></label>
              </StackLayout>
            </GridLayout>
          </CardView>
        </StackLayout>
      </ScrollView>
    </StackLayout>
  </GridLayout>
</template>

<script>
const dialogs = require("ui/dialogs");
import application from "application";

export default {
  data() {
    return {
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
  methods: {}
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
</style>
