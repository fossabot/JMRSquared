<template>
  <GridLayout class="p-x-15" columns="*" rows="auto,auto,*">
    <Image row="0" width="100" height="100" src="res://jmrlogo" alignSelf="center" stretch="aspectFit" />
    <StackLayout row="1">
      <label textAlignment="center" verticalAlignment="center" fontSize="25%" class="h3 font-weight-bold text-light-red" :text="business.name"></label>
    </StackLayout>
    <StackLayout row="2">
      <ScrollView>
        <StackLayout>
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
            <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Stats"></label>
          </GridLayout>
  
          <GridLayout rows="auto" columns="*,*">
            <CardView class="p-15" row="0" col="0" margin="5" elevation="1">
              <GridLayout rows="auto,auto" columns="*,*,*">
                <label row="0" col="0" colSpan="2" verticalAlignment="center" class="h3 font-weight-bold text-mute text-light-blue p-5" text="Expenses"></label>
                <Ripple row="0" col="2" class="p-5" textAlignment="right" verticalAlignment="center" borderRadius="50%">
                  <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-add' | fonticon"></Label>
                </Ripple>
                <StackLayout row="1" col="0" class="p-15 b-r-15">
                  <label row="0" class="h3 font-weight-bold text-dark-blue" fontSize="30%" text="1"></label>
                  <label row="1" vertialAlignment="center" textAlignment="center" text="3"></label>
                </StackLayout>
                <StackLayout row="1" col="1" class="p-15">
                  <label row="0" class="h3 font-weight-bold text-dark-blue" fontSize="30%" text="1"></label>
                  <label row="1" vertialAlignment="center" textAlignment="center" text="3"></label>
                </StackLayout>
              </GridLayout>
            </CardView>
            <CardView class="p-15" row="0" col="1" margin="5" elevation="1">
              <GridLayout rows="auto,auto" columns="*,*,*">
                <label row="0" col="0" colSpan="2" class="h3 font-weight-bold text-mute text-light-blue p-5" text="Activities"></label>
                <StackLayout row="1" col="0" class="p-15">
                  <label row="0" class="h3 font-weight-bold text-dark-blue" fontSize="30%" text="1"></label>
                  <label row="1" vertialAlignment="center" textAlignment="center" text="3"></label>
                </StackLayout>
              </GridLayout>
            </CardView>
          </GridLayout>
        </StackLayout>
      </ScrollView>
    </StackLayout>
  </GridLayout>
</template>

<script>
const dialogs = require("ui/dialogs");
import application from "application";

import PartnersList from '../../Modals/PartnersList'

export default {
  components:{
    PartnersList
  },
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
  methods: {
    showPartners() {
    this.$showModal(PartnersList, { 
      props: { businessName: "this.business.name" }
    });
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
