<template>
  <GridLayout rows="auto,*,auto,auto" columns="*">
    <CardView row="0" class="p-y-15 m-b-5" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
      <Ripple>
        <GridLayout rows="auto,auto" columns="auto,*,auto">
          <Ripple row="0" rowSpan="2" col="2" class="p-10" @tap="logOut()" textAlignmemt="left" verticalAlignment="center" borderRadius="50%">
            <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-dots-vertical' | fonticon"></Label>
          </Ripple>
          <Image v-if="business.logo" row="0" rowSpan="2" col="0" verticalAlignment="center" width="70" height="70" class="circle p-5" borderWidth="5px" borderColor="white" stretch="aspectFill" :src="business.logo" borderRadius="50%" />
          <Ripple v-if="!business.logo" row="0" rowSpan="2" col="0" borderWidth="5px" width="70" height="70" borderColor="white" verticalAlignment="center" borderRadius="50%">
            <Label verticalAlignment="center" textAlignment="center" class="mdi" fontSize="35%" :text="'mdi-image-filter-center-focus' | fonticon"></Label>
          </Ripple>
          <label row="0" col="0" colSpan="3" fontSize="20" verticalAlignment="bottom" textAlignment="center" class="font-weight-bold text-mute text-dark-blue" :text="business.name"></label>
          <Label row="1" col="0" colSpan="3" fontSize="15" verticalAlignment="center" textAlignment="center" :textWrap="true" text="Transactions"></Label>
        </GridLayout>
      </Ripple>
    </CardView>
    <Fab v-if="!isBottomSheetOpen" @tap="goToAddTransaction" rowSpan="3" row="1" icon="res://ic_add_white_24dp" class="fab-button fixedBtn"></Fab>
    <ScrollView rowSpan="2" row="1">
      <StackLayout>
        <CardView v-if="!isLoading" v-for="(transaction,i) in transactions" :key="i" radius="5" margin="1" elevation="5">
          <Ripple class="m-x-5">
            <GridLayout class="m-15" rows="auto,auto,auto" columns="*,auto,auto">
              <label row="0" col="0" class="font-weight-bold text-mute" :text="transaction.category"></label>
              <label row="1" col="0" class="h3 text-mute" :text="getMoment(transaction.date).format('DD MMM YY')"></label>
              <label row="0" rowSpan="2" col="1" verticalAlignment="center" textAlignment="right" class="mdi m-15" fontSize="25%" :text="'mdi-bank-transfer-in' | fonticon"></label>
              <Label row="0" rowSpan="2" col="2" verticalAlignment="center" class="font-weight-bold  text-mute p-x-5" :class="{'text-dark-blue':transaction.type == 'MONEYIN','text-light-red':transaction.type == 'MONEYOUT'}" textAlignment="right" :text="(transaction.type == 'MONEYIN' ? '- R' : '+ R') + transaction.amount"></Label>
            </GridLayout>
          </Ripple>
        </CardView>
       <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
      </StackLayout>
    </ScrollView>
  
    <StackLayout row="2" ref="bottomSheet" backgroundColor="white" :visibility="isBottomSheetOpen ? 'visible' : 'collapse'" verticalAlignment="bottom">
      <CardView elevation="15">
        <StackLayout class="m-x-15 m-y-5">
          <GridLayout textAlignment="right" columns="auto">
            <Ripple textAlignment="right" @tap="closeSheet">
              <label col="1" class="text-light-red mdi m-15" verticalAlignment="center" textAlignment="right" fontSize="25%" :text="'mdi-close' | fonticon"></label>
            </Ripple>
          </GridLayout>
          <GridLayout v-for="a in 5" :key="a" rows="auto,auto" columns="*,*">
            <StackLayout row="1" :col="i" v-for="(summary,i) in summaryStats" :key="i">
              <label class="font-weight-bold" vertialAlignment="center" textAlignment="center" :text="summary.title"></label>
              <label class="font-weight-bold text-dark-blue summaryStats" :text="`R${summary.value}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
            </StackLayout>
          </GridLayout>
          <GridLayout textAlignment="center" columns="*">
            <Ripple @tap="goToStats">
              <label class="m-15" verticalAlignment="center" textAlignment="center" text="Detailed information"></label>
            </Ripple>
          </GridLayout>
        </StackLayout>
      </CardView>
    </StackLayout>
    <CardView row="3" elevation="5" class="m-x-15 m-y-5">
      <Ripple @tap="isBottomSheetOpen ? closeSheet() : openSheet()" class="p-5">
        <GridLayout class="m-x-15 m-y-5" rows="auto" columns="*,*">
          <StackLayout :col="i" v-for="(summary,i) in summaryStats" :key="i">
            <label class="font-weight-bold" vertialAlignment="center" textAlignment="center" :text="summary.title"></label>
            <label class="font-weight-bold text-dark-blue summaryStats" :text="`R${summary.value}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
          </StackLayout>
        </GridLayout>
      </Ripple>
    </CardView>
  </GridLayout>
</template>

<script>
const dialogs = require("ui/dialogs");

export default {
  data() {
    return {
      summaryStats: [
        {
          title: "Revenue",
          value: 9212
        },
        {
          title: "Profit",
          value: 502
        }
      ],
      isLoading: false,
      transactions: [],
      isMainScreen: false,
      isBottomSheetOpen: false,
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
    this.isLoading = true;
    this.$api
      .getAllBusinessTransactions(this.business._id)
      .then(transactions => {
        this.isLoading = false;
        this.transactions = transactions.transactions;
      })
      .catch(err => {
        this.isLoading = false;
      });
  },
  props: ["business"],
  methods: {
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
    },
    goToStats() {
      this.$emit("changeTab", "Stats");
    },
    goToAddTransaction() {
      this.navigate("/business/add/transaction", {
        businessId: this.business._id,
        businessName: this.business.name,
        businessSettings: this.business.settings ? this.business.settings : [],
        businessCategories: this.business.categories
          ? this.business.categories
          : [],
        businessClients: this.business.admin
          ? this.business.admin
              .filter(v => v.authority != "ADMIN" && v.id)
              .map(a => a.id)
          : []
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
