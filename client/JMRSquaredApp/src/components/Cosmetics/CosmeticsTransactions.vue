<template>
  <FlexboxLayout v-if="!isMainScreen" class="page">
    <GridLayout rows="auto,auto,*,auto">
      <Label v-show="currentPage == 0" row="0" textAlignment="center" class="text-muted p-20" text="Pull to refresh the list."></Label>
      <ScrollView row="1" v-show="currentPage == 0" textAlignment="center" orientation="horizontal">
        <StackLayout textAlignment="center" orientation="horizontal">
          <Ripple @tap="selectedType = transactionType" v-for="(transactionType,i) in transactionTypes" :key="i" borderRadius="50%">
            <label :text="transactionType" :class="{'bottom-line-blue':selectedType == transactionType}" class="m-10"></label>
          </Ripple>
        </StackLayout>
      </ScrollView>
      <PullToRefresh v-show="currentPage == 0" row="2" col="0" @refresh="refreshList($event)">
        <ListView borderRightWidth="2px" borderRightColor="transparent" for="transaction in filteredTransactions">
          <v-template>
            <CardView margin="10" elevation="25" radius="10" shadowOffsetHeight="10" shadowOpacity="0.5" shadowRadius="50">
              <GridLayout class="m-10" rows="auto,auto,auto" columns="auto,*,auto">
                <Label row="0" col="1" class="m-5" textAlignment="center" :text="getMoment(transaction.date).format('dddd')"></Label>
                <!--Remember to pluralize the products -->
                <Label row="1" col="1" class="m-5 font-weight-bold" textAlignment="center" :text="transaction.itemCount + ' ' + transaction.productName"></Label>
  
                <Label row="1" col="0" fontSize="20%" class="body m-10" :class="{'text-light-red':transaction.type == 'WITHDRAW','text-light-blue':transaction.type == 'DEPOSIT'}" textWrap="true" textAlignment="center" :text="(transaction.type == 'DEPOSIT' ? '+' : '-' ) + ' R' + transaction.amount"></Label>
  
                <Label row="2" col="0" textWrap="true" verticalAlignment="bottom" fontSize="10%" class="m-5" textAlignment="center" :text="(transaction.type == 'DEPOSIT') ? 'Sale' : 'Stock'"></Label>
  
                <Label row="0" col="2" class="font-italic m-5 tinyText" textWrap="true" textAlignment="center" :text="getMoment(transaction.date).fromNow()"></Label>
                <Label row="2" col="2" class="m-5" textWrap="true" textAlignment="center" :text="transaction.adminID.userName"></Label>
              </GridLayout>
            </CardView>
          </v-template>
        </ListView>
      </PullToRefresh>
      <Fab v-show="currentPage == 0" row="2" @tap="ShowNewTransaction(1)" icon="res://ic_add_white_24dp" class="fab-button"></Fab>
      <StackLayout row="3">
        <Ripple>
          <CardView elevation="25" radius="10" shadowOpacity="0.5" shadowRadius="50">
            <GridLayout class="m-10" rows="auto" columns="*,*">
              <CardView row="0" col="0" elevation="25" radius="10" shadowOpacity="0.5" shadowRadius="50">
                <GridLayout class="m-10" rows="auto,auto" columns="*">
                  <label row="0" col="0" class="font-weight-bold" textAlignment="center" verticalAlignment="center" text="Total Sales"></label>
                  <label row="1" col="0" class="text-mute text-light-blue" fontSize="15%" verticalAlignment="center" textAlignment="center" :text="total.sales + ' products'"></label>
                </GridLayout>
              </CardView>
              <CardView row="0" col="1" elevation="25" radius="10" shadowOpacity="0.5" shadowRadius="50">
                <GridLayout class="m-10" rows="auto,auto" columns="*">
                  <label row="0" col="0" class="font-weight-bold" textAlignment="center" verticalAlignment="center" text="Total PROFIT"></label>
                  <label row="1" col="0" class="text-mute text-light-blue" fontSize="15%" verticalAlignment="center" textAlignment="center" :text="'R' + total.profit"></label>
                </GridLayout>
              </CardView>
            </GridLayout>
          </CardView>
        </Ripple>
      </StackLayout>
  
      <!-- This is the first step -->
      <CardView row="0" margin="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50" elevation="10" height="100%" v-show="currentPage == 1">
        <ScrollView>
          <StackLayout class="form">
            <Label row="0" col="1" @tap="ShowNewTransaction(0)" verticalAlignment="center" textAlignment="right" alignSelf="right" class="mdi h1 m-10" :text="'mdi-close' | fonticon" color="$redColor"></Label>
  
            <label class="h2 m-5 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" text="New Transaction"></label>
  
            <StackLayout width="100%" class="hr-light"></StackLayout>
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Transacter"></label>
              <label row="1" col="1" :text="$store.state.cache.cachedAdmin.userName" class="h4"></label>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <Ripple @tap="changeTransactionDate()">
              <GridLayout @tap="changeTransactionDate()" class="m-10" rows="auto,auto" columns="auto,*">
                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Date (tap to change)"></label>
                <label row="1" col="1" :text="TransactionDate.toISOString().slice(0,10)" class="h4"></label>
              </GridLayout>
            </Ripple>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  

            <Ripple @tap="isWithdraw = !isWithdraw">
              <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :class="{'text-dark-blue':!isWithdraw,'text-light-red':isWithdraw}" :text="'mdi-' + (isWithdraw ? 'money-off' : 'attach-money') | fonticon"></label>
                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Transaction type (tap to change)"></label>
                <label row="1" col="1" :text="isWithdraw ? 'Stock' : 'Sale'" class="h4"></label>
              </GridLayout>
            </Ripple>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <Ripple v-show="ProductNames[ProductNameIndex] != 'Other'" @tap="ProductNameIndex >= (ProductNames.length-1) ? ProductNameIndex = 0:ProductNameIndex++">
              <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-local-florist' | fonticon"></label>
                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Product name (tap to change)"></label>
                <label row="1" col="1" :text="ProductNames[ProductNameIndex]" class="h4"></label>
              </GridLayout>
            </Ripple>
            <StackLayout width="100%" class="hr-light"></StackLayout>

            <GridLayout v-show="ProductNames[ProductNameIndex] == 'Other'" class="m-10" rows="auto,auto" columns="auto,*,auto">
                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-local-florist' | fonticon"></label>
                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Add new product"></label>
                <button @tap="ProductNameIndex >= (ProductNames.length-1) ? ProductNameIndex = 0:ProductNameIndex++" row="0" col="2" text="Cancel" class="h4"></button>
                <TextField row="1" col="1" v-model="productName" hint="Name of the product" returnKeyType="next" class="h4"></TextField>
                <button row="1" col="2" text="Save Product" @tap="AddNewProduct()" class="h4"></button>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>

            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-whatshot' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="'Number of ' + ProductNames[ProductNameIndex] + 's '  + (isWithdraw ? ' bought' : ' sold')"></label>
              <TextField row="1" col="1" v-model="itemCount" :hint="'How many ' + ProductNames[ProductNameIndex] + 's did you ' + (isWithdraw ? 'buy' : 'sell')  + '?'" keyboardType="number" returnKeyType="next" class="h4"></TextField>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="m-15" fontSize="25%" text="R"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Money spent"></label>
              <TextField row="1" col="1" v-model="Amount" :hint="'How much ' + (isWithdraw ? 'was the stock' : 'did you get')  + '?'" keyboardType="number" returnKeyType="next" class="h4"></TextField>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <DockLayout v-show="txtError.length > 2" alignSelf="center" justifyContent="flex-end" orientation="horizontal" textAlignment="center">
              <Label :text="txtError" textWrap="true" class="text-mute text-light-red" textAlignment="center"></Label>
            </DockLayout>
            <DockLayout v-show="txtError.length < 2" alignSelf="center" justifyContent="flex-end" orientation="horizontal" textAlignment="center">
              <Label text="You can proceed" textWrap="true" class="text-mute text-light-blue" textAlignment="center"></Label>
            </DockLayout>
  
            <StackLayout row="7" col="0" colSpan="2">
              <Button selfAlign="center" textAlignment="center" @tap="ShowNewTransaction(2)" text="Proceed" class="btn btn-primary" />
            </StackLayout>
          </StackLayout>
        </ScrollView>
      </CardView>
      <!-- This is the second step -->
      <CardView row="0" margin="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50" elevation="10" height="100%" v-show="currentPage == 2">
        <ScrollView>
          <StackLayout class="form">
            <Label row="0" col="1" @tap="ShowNewTransaction(1)" verticalAlignment="center" textAlignment="right" alignSelf="right" class="mdi h1 m-10 text-light-red" :text="'mdi-keyboard-backspace' | fonticon"></Label>
            <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" text="Verify information"></label>
  
            <label class="m-10 t-10 font-italic" textWrap="true" verticalAlignment="center" text="Please validate if the following information is correct and click submit or go back and fix all the mistakes."></label>
  
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Transacter"></label>
              <label row="1" col="1" :text="$store.state.cache.cachedAdmin.userName" class="h4"></label>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Date"></label>
              <label row="1" col="1" :text="TransactionDate.toISOString().slice(0,10)" class="h4"></label>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-trending-' + (isWithdraw ? 'down' : 'up') | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Transaction type"></label>
              <label row="1" col="1" :text="isWithdraw ? 'Withdraw' : 'Deposit'" class="h4"></label>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-money' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="'Amount ' + (isWithdraw ? 'used' : 'deposited')  "></label>
              <label row="1" col="1" :text="Amount" class="h4"></label>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>

            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-local-florist' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="'Number of items ' + (isWithdraw ? 'bought' : 'sold')"></label>
              <label row="1" col="1" :text="'You ' + (isWithdraw ? 'bought ' : 'sold ')  + itemCount +  ' ' + ProductNames[ProductNameIndex]"  class="h4"></label>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>

            <ActivityIndicator :busy="isLoading"></ActivityIndicator>
  
            <GridLayout v-show="!isLoading && !donePayment" columns="*,*" rows="*" verticalAlignment="bottom">
              <button row="0" col="0" @tap="ShowNewTransaction(1)" verticalAlignment="bottom" width="100%" textAlignment="center" class="btn-primary bg-light-red" text="Back"></button>
              <button row="0" col="1" @tap="SubmitTransaction()" verticalAlignment="bottom" width="100%" textAlignment="center" class="btn-primary bg-light-blue" text="Submit"></button>
            </GridLayout>
  
            <GridLayout v-show="!isLoading && donePayment" columns="*" rows="*" verticalAlignment="bottom">
              <button row="0" col="0" @tap="ShowNewTransaction(0)" verticalAlignment="bottom" width="100%" textAlignment="center" class="btn-primary bg-light-blue" text="Back to transactions"></button>
            </GridLayout>
  
          </StackLayout>
        </ScrollView>
      </CardView>
  
    </GridLayout>
  </FlexboxLayout>
</template>

<script>
const dialogs = require("ui/dialogs");
const application = require("application");
var AndroidApplication = application.android;
var activity = AndroidApplication.foregroundActivity;
import * as imageSource from "tns-core-modules/image-source";

import * as imagepicker from "nativescript-imagepicker";

import * as connectivity from "tns-core-modules/connectivity";

import * as camera from "nativescript-camera";

const http = require("http");
export default {
  data() {
    return {
      total: {
        revenue: 0,
        profit: 0,
        sales: 0
      },
      txtError: "",
      Amount: "",
      ProductName: "",
      ProductNames: ["Perfume", "Oil", "Lipstick", "Other"],
      ProductNameIndex: 0,
      users: [],
      hasImage: false,
      selectedImage: null,
      selectedType: "All",
      transactionTypes: ["All", "Sale", "Stock"],
      description: "",
      TransactionDate: new Date(),
      transactions: [],
      isWithdraw: false,
      currentPage: false,
      isMainScreen: false,
      selectedScreen: "",
      price: "",
      donePayment: false,
      itemCount: 0
    };
  },
  computed: {
    amount: {
      get() {
        return this.price;
      },
      set(value) {
        if (value.length > 0 && value[0] != "R") {
          return "R" + this.price;
        }
        this.price = value;
      }
    },
    filteredTransactions: {
      get() {
        if (this.selectedType == this.transactionTypes[0]) {
          return this.transactions;
        } else {
          if (this.selectedType == "Sale") {
            return this.transactions.filter(v => v.type == "DEPOSIT");
          } else if (this.selectedType == "Stock") {
            return this.transactions.filter(v => v.type == "WITHDRAW");
          }
        }
      },
      set(val) {
        this.transactions = val;
        this.updateTotals();
      }
    }
  },
  created() {
    this.pageLoaded();
  },
  mounted() {
    this.pageLoaded();
  },
  methods: {
    updateTotals() {
      var revenue = 0;
      var profit = 0;
      var sales = 0;
      this.transactions.map(value => {
        if (value.type == "DEPOSIT") {
          sales += Number(value.itemCount);
          profit += Number(value.amount);
          revenue += Number(value.amount);
        } else if (value.type == "WITHDRAW") {
          profit -= Number(value.amount);
        }
      });
      this.total.revenue = revenue.toFixed(2);
      this.total.profit = profit.toFixed(2);
      this.total.sales = sales;
    },
    AddNewProduct() {
      this.ProductNames.pop();

      this.ProductNames.push(this.productName);
      this.ProductNames.push("Other");
      this.ProductNameIndex = this.ProductNames.indexOf(this.productName);
      this.productName = "";
    },
    pageLoaded(args) {
      var self = this;
      this.ApplyNavigation(self);
      http
        .getJSON(this.$store.state.settings.baseLink + "/s/students/all/names")
        .then(results => {
          this.users = [];

          results.map(v => {
            this.users.push({
              id: v._id,
              text: v.username,
              selected: false
            });
          });
        });

      var connectionType = connectivity.getConnectionType();
      if (connectionType == connectivity.connectionType.none) {
        this.$feedback.error({
          title: "Error (NO INTERNET CONNECTION)",
          duration: 4000,
          message: "Please switch on your data/wifi."
        });
      } else {
        http
          .getJSON(
            this.$store.state.settings.baseLink + "/a/transaction/COSMETICS/all"
          )
          .then(results => {
            this.filteredTransactions = results;
          })
          .catch(err => {
            this.$feedback.error({
              title: "Error",
              duration: 4000,
              message: err
            });
          });
      }
    },
    canSubmit() {
      this.txtError = "";
      if (this.Amount.toString().length < 1 || isNaN(this.Amount)) {
        this.txtError = "Please provide a valid amount.";
        return false;
      }
      if (this.ProductNames[this.ProductNameIndex] == "Other") {
        this.txtError =
          "Please write the name of the product and click 'Save Product'";
        return false;
      }
      if (this.itemCount.toString().length < 1 || isNaN(this.itemCount)) {
        this.txtError =
          "Please provide the number of " +
          this.ProductNames[this.ProductNameIndex] +
          "s";
        return false;
      }
      if (
        this.ProductNames[this.ProductNameIndex].indexOf("s") !=
        this.ProductNames[this.ProductNameIndex].length - 1
      ) {
        if (this.itemCount > 1) {
          this.ProductNames[this.ProductNameIndex] += "s";
        }
      } else {
        if (this.itemCount == 1) {
          this.ProductNames[this.ProductNameIndex] -= "s";
        }
      }
      return true;
    },
    SubmitTransaction() {
      this.isLoading = true;
      if (!this.canSubmit()) {
        this.ShowNewTransaction(1);
        this.isLoading = false;
        return;
      }

      http
        .request({
          url: this.$store.state.settings.baseLink + "/a/transaction/add",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          content: JSON.stringify({
            adminID: this.$store.state.cache.cachedAdmin._id, //ForeignKey
            amount: this.Amount,
            type: this.isWithdraw ? "Withdraw" : "Deposit",
            proof: this.selectedImage,
            date: this.TransactionDate,
            itemCount: this.itemCount,
            productName: this.ProductNames[this.ProductNameIndex],
            source: "COSMETICS"
          })
        })
        .then(response => {
          alert(this.ProductNames[this.ProductNameIndex]);
          var statusCode = response.statusCode;
          if (statusCode == 200) {
            this.$feedback.success({
              title: response.content.toString(),
              duration: 4000,
              onTap: () => {
                this.ShowNewTransaction(0);
              }
            });
            this.donePayment = true;
            this.isLoading = false;
          } else if (statusCode == 413) {
            this.$feedback.error({
              title: "Unable to add transaction",
              message: "The image file is too large",
              duration: 4000
            });
            this.isLoading = false;
          }
        })
        .catch(err => {
          this.$feedback.error({
            message: err,
            duration: 4000
          });
          this.isLoading = false;
        });
    },
    refreshList(args) {
      var pullRefresh = args.object;

      var connectionType = connectivity.getConnectionType();
      if (connectionType == connectivity.connectionType.none) {
        this.$feedback.error({
          title: "Error (NO INTERNET CONNECTION)",
          duration: 4000,
          message: "Please switch on your data/wifi."
        });

        pullRefresh.refreshing = false;
      } else {
        http
          .getJSON(
            this.$store.state.settings.baseLink + "/a/transaction/COSMETICS/all"
          )
          .then(results => {
            this.filteredTransactions = results;
            pullRefresh.refreshing = false;
          })
          .catch(err => {
            this.$feedback.error({
              title: "Error",
              duration: 4000,
              message: err
            });
            pullRefresh.refreshing = false;
          });
      }
    },
    changeTransactionDate() {
      var self = this;
      this.$showModal({
        template: ` 
                            <Page>
                                <GridLayout rows="auto,*,auto" columns="*" width="100%" height="60%">
                                    <Label row="0" class="h2 m-5" textAlignment="center" text="When was the transaction?"></Label>
                                    <DatePicker row="1" v-model="selectedDueDate" />
                                    <Label row="2" class="mdi h1 m-5" @tap="changeDueRent($modal,selectedDueDate)" textAlignment="center" :text="'mdi-done' | fonticon"></Label>
                                </GridLayout>
                            </Page>
                            `,
        data: function() {
          return {
            selectedDueDate: new Date()
          };
        },
        methods: {
          changeDueRent(modal, value) {
            self.TransactionDate = value;
            self.TransactionDate.setDate(value.getDate() + 1);
            this.$modal.close();
          }
        }
      });
    },
    onBackPressed(event) {
      dialogs.alert("Going Back").then(() => {
        console.log("card.redirect");
      });
    },
    switchPage(card) {
      dialogs.alert("Going to " + card.redirect).then(() => {
        console.log(card.redirect);
      });
      this.$router.push({
        path: card.redirect
      });
    },
    ShowNewTransaction(value) {
      if (value == 2) {
        if (!this.canSubmit()) {
          return;
        } else {
          this.donePayment = false;
        }
      } else if (value == 0) {
        http
          .getJSON(
            this.$store.state.settings.baseLink + "/a/transaction/COSMETICS/all"
          )
          .then(results => {
            this.filteredTransactions = results;
          })
          .catch(err => {
            this.$feedback.error({
              title: "Error",
              duration: 4000,
              message: err
            });
          });
      }
      this.currentPage = value;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
