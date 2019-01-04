<template>
  <StackLayout>
    <StackLayout v-if="currentPage == 1">
      <GridLayout v-show="isLoading" rows="*" columns="*">
        <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
      </GridLayout>
      <GridLayout v-show="!isLoading" rows="auto,auto,*" columns="*">
        <CardView row="0" elevation="15">
          <GridLayout columns="auto,*" class="bg-dark-blue p-15">
            <Ripple @tap="navigate(null)" verticalAlignment="center" borderRadius="50%">
              <Label verticalAlignment="center" textAlignment="center" class="mdi text-white" fontSize="25%" :text="'mdi-arrow-left' | fonticon"></Label>
            </Ripple>
            <label class="p-x-15 text-white" verticalAlignment="center" fontSize="18%" col="1" text="Transaction detail"></label>
          </GridLayout>
        </CardView>
        <StackLayout v-if="currentTransaction" class="m-15" row="1">
          <GridLayout rows="auto,auto,auto,auto,auto,auto,auto,auto" columns="*,auto">
            <label class="p-b-5" row="0" col="0" text="Date"></label>
            <label class="p-b-5" row="0" col="1" :text="getMoment(currentTransaction.date).format('dddd , DD MMMM YYYY')"></label>
            <label class="p-b-5" row="1" col="0" text="Type"></label>
            <label class="p-b-5" row="1" col="1" :text="currentTransaction.type == 'MONEYIN' ? 'Deposit' : 'Withdraw'"></label>
            <label class="p-b-5" row="2" col="0" text="Category"></label>
            <label class="p-b-5" row="2" col="1" :text="currentTransaction.category"></label>
            <label class="p-b-5" row="3" col="0" text="Amount"></label>
            <label class="p-b-5" row="3" col="1" :text="`R${currentTransaction.amount}`"></label>
            <label class="p-b-5" v-if="currentTransaction.description" row="4" col="0" text="Description"></label>
            <label class="p-b-5" v-if="currentTransaction.description" :textWrap="true" row="4" col="1" :text="currentTransaction.description"></label>
            <label class="p-b-5" row="5" col="0" text="Uploaded by"></label>
            <label class="p-b-5" row="5" col="1" :text="currentTransaction.adminID.userName"></label>
            <label class="p-b-5" v-if="currentTransaction.client" row="6" col="0" text="From"></label>
            <label class="p-b-5" v-if="currentTransaction.client" row="6" col="1" :text="currentTransaction.client.userName"></label>
            <label class="p-b-5" v-if="currentTransaction.monthOfPayment" row="7" col="0" text="Month"></label>
            <label class="p-b-5" v-if="currentTransaction.monthOfPayment" row="7" col="1" :text="currentTransaction.monthOfPayment"></label>
          </GridLayout>
        </StackLayout>
        <label  v-if="!currentTransaction" row="2" verticalAlignment="center" textAlignment="center" text="Invalid transaction selected."></label>
        <label v-if="currentTransaction && !currentTransaction.proof" row="2" verticalAlignment="center" textAlignment="center" text="No image"></label>
        <ImageZoom v-if="currentTransaction && currentTransaction.proof" row="2" verticalAlignment="center" textAlignment="center" :src="currentTransaction.proof" maxZoom="5" minZoom="2"></ImageZoom>
      </GridLayout>
    </StackLayout>
    <GridLayout v-if="currentPage == 0" rows="auto,auto,*,auto,auto" columns="*">
      <CardView class="m-b-5" row="0" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
         <GridLayout class="bg-dark-blue p-5" rows="auto,auto" columns="auto,*,auto">
              <Ripple rowSpan="2" @tap="navigate(null)" verticalAlignment="center" borderRadius="50%">
            <Label verticalAlignment="center" textAlignment="center" class="mdi text-white" fontSize="25%" :text="'mdi-arrow-left' | fonticon"></Label>
          </Ripple>
            <Image v-if="business.logo" row="0" rowSpan="2" col="2" verticalAlignment="center" width="70" height="70" class="circle p-5" stretch="aspectFill" :src="business.logo" borderRadius="50%" />
            <Ripple v-if="!business.logo" row="0" rowSpan="2" col="2" width="70" height="70" verticalAlignment="center" borderRadius="50%">
              <Label verticalAlignment="center" textAlignment="center" class="mdi" fontSize="35%" :text="'mdi-image-filter-center-focus' | fonticon"></Label>
            </Ripple>
            <label row="0" col="0" colSpan="3" fontSize="18%" verticalAlignment="bottom" textAlignment="center" class="font-weight-bold text-white text-mute" :text="business.name"></label>
             <Label row="1" col="0" colSpan="3" fontSize="15%" verticalAlignment="center" textAlignment="center" class="text-white" :textWrap="true" text="Transactions"></Label>
          </GridLayout>
      </CardView>
  
      <CardView row="1" class="p-15" textAlignment="right" verticalAlignment="center" radius="5" margin="15" elevation="5">
        <Ripple @tap="changeTransactionShowing">
          <label class="p-15" textAlignment="right" :text="`Showing : ${transactionShowing}`"></label>
        </Ripple>
      </CardView>
  
      <Fab row="2" v-if="!isBottomSheetOpen" @tap="goToAddTransaction" rowSpan="3" icon="res://ic_add_white_24dp" class="fab-button fixedBtn"></Fab>
      <PullToRefresh row="2" rowSpan="3" @refresh="refreshList($event)">
        <ScrollView>
          <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
          <StackLayout v-if="!isLoading">
            <CardView v-for="(transaction,i) in transactions.filter(t => transactionShowing == 'All' || (transactionShowing == 'Expenses' && t.type == 'MONEYOUT') || (transactionShowing == 'Incomes' && t.type == 'MONEYIN'))" :key="i" radius="5" margin="1" elevation="5">
              <Ripple @tap="goToTransaction(transaction)" class="m-x-5">
                <GridLayout class="m-15" rows="auto,auto,auto" columns="auto,*,auto">
                  <label row="0" col="0" class="font-weight-bold text-mute p-x-5" :text="transaction.category"></label>
                  <Label row="1" col="0" fontSize="18%" class="text-mute" :class="{'text-dark-blue':transaction.type == 'MONEYIN','text-light-red':transaction.type == 'MONEYOUT'}" :text="(transaction.type == 'MONEYIN' ? '+ R' : '- R') + transaction.amount"></Label>
                  <label v-if="transaction.client && transaction.client.userName" fontSize="15%" row="0" col="1" textAlignment="center" class="h4" :text="transaction.client.userName"></label>
                  <label v-if="transaction.monthOfPayment" row="1" col="1" textAlignment="center" fontSize="15%" :text="transaction.monthOfPayment"></label>
                  <label v-show="selectedTransaction != transaction._id" row="0" col="2" class="h4 text-mute" :text="getMoment(transaction.date).format('Do MMMM')"></label>
                  <label v-show="selectedTransaction == transaction._id" row="0" col="2" verticalAlignment="bottom" class="h4 text-mute" :text="getMoment(transaction.date).fromNow()"></label>
                  <label v-show="selectedTransaction == transaction._id && transaction.description" row="3" col="0" colSpan="3" :textWrap="true" textAlignment="center" verticalAlignment="bottom" class="h4 text-mute" :text="transaction.description"></label>
                </GridLayout>
              </Ripple>
            </CardView>
          </StackLayout>
        </ScrollView>
      </PullToRefresh>
  
      <CardView row="3" elevation="5" ref="bottomSheet" :visibility="isBottomSheetOpen ? 'visible' : 'collapse'" verticalAlignment="bottom">
        <StackLayout class="m-x-15 m-y-5">
          <GridLayout textAlignment="right" columns="auto">
            <Ripple textAlignment="right" @tap="closeSheet">
              <label col="1" class="text-light-red mdi m-15" verticalAlignment="center" textAlignment="right" fontSize="25%" :text="'mdi-close' | fonticon"></label>
            </Ripple>
          </GridLayout>
          <GridLayout v-for="(summary,i) in summaryStats" :key="i" class="p-15" rows="auto,auto,auto" columns="*,*,*">
            <label row="0" rowSpan="2" col="0" :textWrap="true" class="font-weight-bold" verticalAlignment="center" textAlignment="center" :text="summary.title"></label>
            <label row="0" col="1" class="font-weight-bold" textAlignment="center" text="Profit"></label>
            <label row="1" col="1" class="font-weight-bold text-dark-blue summaryStats" :text="`R${summary.profit}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
            <label row="0" col="2" class="font-weight-bold" textAlignment="center" text="Revenue"></label>
            <label row="1" col="2" class="font-weight-bold text-dark-blue summaryStats" :text="`R${summary.revenue}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
            <StackLayout verticalAlignment="bottom" row="2" colSpan="3" width="100%" class="hr-light p-y-15"></StackLayout>
          </GridLayout>
          <GridLayout textAlignment="center" columns="*">
            <Ripple @tap="goToStats">
              <label class="m-15" verticalAlignment="center" textAlignment="center" text="Detailed information"></label>
            </Ripple>
          </GridLayout>
        </StackLayout>
      </CardView>
      <CardView row="4" elevation="5" class="m-x-15 m-y-5">
        <Ripple @tap="isBottomSheetOpen ? closeSheet() : openSheet()" class="p-5">
          <GridLayout v-for="(summary,i) in summaryStats.filter(v => v.key == 'overall')" :key="i" class="m-x-15 m-y-5" rows="auto,auto" columns="*,*">
            <label row="0" col="0" class="font-weight-bold" textAlignment="center" text="Profit"></label>
            <label row="1" col="0" class="font-weight-bold text-dark-blue summaryStats" :text="`R${summary.profit}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
            <label row="0" col="1" class="font-weight-bold" textAlignment="center" text="Revenue"></label>
            <label row="1" col="1" class="font-weight-bold text-dark-blue summaryStats" :text="`R${summary.revenue}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
          </GridLayout>
        </Ripple>
      </CardView>
    </GridLayout>
  </StackLayout>
</template>

<script>
const dialogs = require("ui/dialogs");

export default {
  data() {
    return {
      currentPage: 0,
      summaryStats: [],
      isLoading: false,
      transactions: [],
      isMainScreen: false,
      isBottomSheetOpen: false,
      selectedScreen: "",
      selectedTransaction: null,
      transactionShowing: "All",
      previousTransactions: [],
      currentTransaction: null,
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
  computed: {},
  mounted() {
    var self = this;
    this.ApplyNavigation(self);
    this.pageLoaded();
  },
  props: ["business"],
  methods: {
    pageLoaded(args = null) {
      this.isLoading = true;
      this.$api
        .getAllBusinessTransactions(this.business._id)
        .then(transactions => {
          this.isLoading = false;
          if (args) {
            args.object.refreshing = false;
          }
          this.transactions = transactions.transactions;
        })
        .catch(err => {
          this.isLoading = false;
          if (args) {
            args.object.refreshing = false;
          }
        });

      var revenue_profit =
        this.business.revenues &&
        this.business.revenues.values &&
        this.business.revenues.values.filter(
          v => v.profit != 0 && v.revenue != 0
        );

      this.summaryStats = revenue_profit;
    },
    goToTransaction(transaction) {
      if (this.selectedTransaction != transaction._id) {
        this.selectedTransaction = transaction._id;
        return;
      } else {
        this.currentPage = 1;
        this.isLoading = true;
        if (this.previousTransactions.find(t => t._id == transaction._id)) {
          this.currentTransaction = this.previousTransactions.find(
            t => t._id == transaction._id
          );
          this.isLoading = false;
        } else {
          this.$api
            .getTransaction(transaction._id)
            .then(t => {
              this.previousTransactions.push(t);
              this.currentTransaction = t;
              this.isLoading = false;
            })
            .catch(err => {
              this.$feedback.error({
                title: "Transaction can not be retrieved",
                duration: 4000,
                message: "Please try again later."
              });
              this.currentPage = 0;
              this.currentTransaction = null;
              this.isLoading = false;
            });
        }
      }
    },
    changeTransactionShowing() {
      switch (this.transactionShowing) {
        case "All":
          this.transactionShowing = "Incomes";
          break;
        case "Incomes":
          this.transactionShowing = "Expenses";
          break;
        case "Expenses":
          this.transactionShowing = "All";
          break;
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
    },
    refreshList(args) {
      this.pageLoaded(args);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
