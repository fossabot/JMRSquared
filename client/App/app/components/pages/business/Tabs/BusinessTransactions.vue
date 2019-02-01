<template>
  <StackLayout>
    <GridLayout rows="auto,auto,*,auto" columns="*">
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
          <Label row="1" col="0" colSpan="3" fontSize="15%" verticalAlignment="center" textAlignment="center" class="text-white" :textWrap="true" text="Transactions"></Label>
        </GridLayout>
      </CardView>
  
      <CardView row="1" class="p-15" textAlignment="right" verticalAlignment="center" radius="5" margin="15" elevation="5">
        <Ripple @tap="changeTransactionShowing">
          <label class="p-10" textAlignment="right" :text="`Showing : ${transactionShowing}`"></label>
        </Ripple>
      </CardView>
  
      <Fab row="2" @tap="goToAddTransaction" icon="res://ic_add_white_24dp" class="fab-button fixedBtn"></Fab>
      <PullToRefresh row="2" rowSpan="2" @refresh="refreshList($event)">
        <ScrollView>
          <StackLayout>
          <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
            <CardView v-if="!isLoading" v-for="(transaction,i) in transactions.filter(t => transactionShowing == 'All' || (transactionShowing == 'Expenses' && t.type == 'MONEYOUT') || (transactionShowing == 'Incomes' && t.type == 'MONEYIN'))" :key="i" radius="5" margin="1" elevation="0">
              <Ripple @tap="goToTransaction(transaction._id)" class="m-x-5">
                <GridLayout class="m-15" rows="auto,auto,auto" columns="auto,*,auto">
                  <label row="0" col="0" class="font-weight-bold text-mute p-x-5" :text="transaction.category"></label>
                  <Label row="1" col="0" fontSize="18%" class="text-mute" :class="{'text-dark-blue':transaction.type == 'MONEYIN','text-light-red':transaction.type == 'MONEYOUT'}" :text="(transaction.type == 'MONEYIN' ? '+ R' : '- R') + transaction.amount"></Label>
                  <label v-if="transaction.client && transaction.client.userName" fontSize="15%" row="0" col="1" textAlignment="center" class="h4" :text="transaction.client.userName"></label>
                  <label v-if="transaction.monthOfPayment" row="1" col="1" textAlignment="center" fontSize="15%" :text="transaction.monthOfPayment"></label>
                  <label row="0" col="2" verticalAlignment="bottom" class="h4 text-mute" :text="getMoment(transaction.date).fromNow()"></label>
                  <label v-if="transaction.adminID && transaction.adminID.userName" row="1" col="2" verticalAlignment="bottom" textAlignment="center" class="h4 text-mute" :text="transaction.adminID.userName"></label>
                </GridLayout>
              </Ripple>
            </CardView>
          </StackLayout>
        </ScrollView>
      </PullToRefresh>
      <CardView v-if="currentTargets && currentTargets.length > summaryStatsActive" row="3" elevation="5" class="m-x-15 m-y-5">
        <Ripple @tap="changeSummaryStatsSelected()" class="p-5">
          <GridLayout class="m-x-15 m-y-5" rows="auto,auto" columns="*">
            <label row="0" col="0" class="font-weight-bold" textAlignment="center" :text="currentTargets[summaryStatsActive].title"></label>
            <label row="1" col="0" class="font-weight-bold text-dark-blue summaryStats" :text="`R${currentTargets[summaryStatsActive].value}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
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
      summaryStatsActive: 0,
      isLoading: false,
      transactions: [],
      currentTargets: [],
      transactionShowing: "All"
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
          this.transactions = transactions;
        })
        .catch(err => {
          this.isLoading = false;
          if (args) {
            args.object.refreshing = false;
          }
        });
      this.currentTargets = this.business.currentTargets.values;
    },
    changeSummaryStatsSelected() {
      if (this.currentTargets) {
        if (this.currentTargets.length - 1 > this.summaryStatsActive) {
          this.summaryStatsActive++;
        } else {
          this.summaryStatsActive = 0;
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
    goToStats() {
      this.$emit("changeTab", "Stats");
    },
    goToTransaction(transactionID) {
      this.navigate("/business/transaction", {
        transactionID: transactionID
      });
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
