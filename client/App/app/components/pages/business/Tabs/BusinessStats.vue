<template>
  <GridLayout rows="auto,*,auto,auto" columns="*">
    <CardView class="m-b-5" row="0" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
      <GridLayout class="bg-dark-blue p-5" rows="auto,auto" columns="auto,*,auto">
        <Ripple rowSpan="2" @tap="navigate(null)" verticalAlignment="center" borderRadius="50%">
          <Label verticalAlignment="center" textAlignment="center" class="mdi text-white p-15" fontSize="30%" :text="'mdi-arrow-left' | fonticon"></Label>
        </Ripple>
        <Image v-if="business.logo" row="0" rowSpan="2" col="2" verticalAlignment="center" width="70" height="70" class="circle p-5" stretch="aspectFill" :src="business.logo" borderRadius="50%" />
        <Ripple v-if="!business.logo" row="0" rowSpan="2" col="2" width="70" height="70" verticalAlignment="center" borderRadius="50%">
          <Label verticalAlignment="center" textAlignment="center" class="mdi" fontSize="35%" :text="'mdi-image-filter-center-focus' | fonticon"></Label>
        </Ripple>
        <label row="0" col="0" colSpan="3" fontSize="18%" verticalAlignment="bottom" textAlignment="center" class="font-weight-bold text-white text-mute" :text="business.name"></label>
        <Label row="1" col="0" colSpan="3" fontSize="15%" verticalAlignment="center" textAlignment="center" class="text-white" :textWrap="true" text="Statistics"></Label>
      </GridLayout>
    </CardView>
    <CardView row="2" margin="15" elevation="15" ref="bottomSheet" :visibility="isBottomSheetOpen ? 'visible' : 'collapse'" verticalAlignment="bottom">
      <StackLayout class="m-x-15 m-y-5">
        <GridLayout textAlignment="right" columns="*,auto">
          <Ripple col="1" textAlignment="right" @tap="closeSheet">
            <label class="text-light-red mdi m-15" verticalAlignment="center" textAlignment="right" fontSize="25%" :text="'mdi-close' | fonticon"></label>
          </Ripple>
        </GridLayout>
        <GridLayout v-for="(summary,i) in summaryStats" :key="i" class="p-15" rows="auto,auto,auto" columns="*,*,*">
          <label row="0" rowSpan="2" col="0" :textWrap="true" class="font-weight-bold" verticalAlignment="center" textAlignment="center" :text="summary.title"></label>
          <label row="0" col="1" class="font-weight-bold" textAlignment="center" text="Profit"></label>
          <label row="1" col="1" class="font-weight-bold text-dark-blue summaryStats" :text="`R${summary.profit}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
          <label row="0" col="2" class="font-weight-bold" textAlignment="center" text="Revenue"></label>
          <label row="1" col="2" class="font-weight-bold text-dark-blue summaryStats" :text="`R${summary.revenue}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
          <StackLayout verticalAlignment="bottom" row="2" colSpan="3" width="100%" class="hr-light m-t-15"></StackLayout>
        </GridLayout>
      </StackLayout>
    </CardView>
          <CardView v-if="summaryStats" row="3" elevation="5" class="m-x-15 m-y-5">
        <Ripple @tap="changeSummaryStatsSelected()" class="p-5">
          <GridLayout v-for="(summaryStat,i) in summaryStats.filter(s => s.key == 'overall')" :key="i" class="m-x-15 m-y-5" rows="auto,auto" columns="*,*">
            <label row="0" col="0" class="font-weight-bold" textAlignment="center" text="Profit"></label>
            <label row="1" col="0" class="font-weight-bold text-dark-blue summaryStats" :text="`R${summaryStat.profit}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
            <label row="0" col="1" class="font-weight-bold" textAlignment="center" text="Revenue"></label>
            <label row="1" col="1" class="font-weight-bold text-dark-blue summaryStats" :text="`R${summaryStat.revenue}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
          </GridLayout>
        </Ripple>
      </CardView>
  </GridLayout>
</template>

<script>
const dialogs = require("ui/dialogs");
import application from "application";

export default {
  data() {
    return {
      summaryStats: [],
      isLoading: false,
      isMainScreen: false,
      isBottomSheetOpen: false
    };
  },
  mounted() {
    this.pageLoaded();
  },
  props: ["business"],
  methods: {
    pageLoaded(args = null) {
      var revenue_profit =
        this.business.revenues && this.business.revenues.values
          ? this.business.revenues.values.filter(
              v => v.profit != 0 && v.revenue != 0
            )
          : null;

      if (revenue_profit) {
        this.summaryStats = JSON.parse(JSON.stringify(revenue_profit));
      } else {
        this.summaryStats = [
          {
            key: "overall",
            title: "Overall",
            profit: 0,
            revenue: 0
          }
        ];
      }
    },
    openSheet() {
      this.isBottomSheetOpen = true;
      const bottomSheet = this.$refs.bottomSheet;
      console.log("sheet", bottomSheet);
      if (bottomSheet) {
        bottomSheet.translateY = 100;
        bottomSheet.nativeView.animate({
          translate: {
            x: 0,
            y: 0
          },
          duration: 200
        });
      }
    },
    changeSummaryStatsSelected() {
      if (this.isBottomSheetOpen) {
        this.closeSheet();
      } else {
        this.openSheet();
      }
    },
    closeSheet() {
      const bottomSheet = this.$refs.bottomSheet;
      if (bottomSheet) {
        bottomSheet.nativeView
          .animate({
            translate: {
              x: 0,
              y: 100
            },
            duration: 200
          })
          .then(_ => {
            this.isBottomSheetOpen = false;
          });
      } else {
        this.isBottomSheetOpen = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
