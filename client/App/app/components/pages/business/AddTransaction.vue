<template>
  <page class="page" actionBarHidden="true" width="100%" height="100%">
    <GridLayout rows="auto,*,auto">
      <StackLayout row="0">
        <CardView elevation="5" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
          <StackLayout>
            <GridLayout class="m-10" rows="auto" columns="*,auto">
              <StackLayout row="0" col="0">
                <label class="h3" text="Adding a transaction for : "></label>
                <label class="h3 m-l-20" :text="businessName"></label>
              </StackLayout>
              <Button row="0" col="1" @tap="navigate(null,true)" selfAlign="right" text="Cancel"></Button>
            </GridLayout>
          </StackLayout>
        </CardView>
        <Progress :value="(currentPage + 1) * 33.33"></Progress>
      </StackLayout>
      <ScrollView row="1">
        <FlexboxLayout flexDirection="column" justifyContent="center" width="100%">
          <!-- PAGE 0 -->
          <StackLayout v-show="currentPage == 0">
            <CardView margin="10" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <ScrollView>
                <StackLayout class="form">
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-edit' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Transacter"></label>
                    <label row="1" col="1" :text="$store.state.cache.cachedAdmin.userName" class="h4"></label>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <Ripple @tap="changeTransactionDate()">
                    <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                      <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-calendar-range' | fonticon"></label>
                      <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Date (tap to change)"></label>
                      <label row="1" col="1" :text="getMoment(transaction.date).format('DD MMMM YYYY')" class="h4"></label>
                    </GridLayout>
                  </Ripple>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-bank-transfer-' + (transaction.isMoneyIn ? 'in' : 'out') | fonticon"></label>
                    <label row="0" col="1" colSpan="2" class="h3 font-weight-bold text-mute" text="Transaction type"></label>
                    <Checkbox @tap="changeTransactionType(transaction.isMoneyIn)" :checked="transaction.isMoneyIn" boxType="circle" name="transactionType" row="1" col="1" text="Money in" class="h4"></Checkbox>
                    <Checkbox @tap="changeTransactionType(transaction.isMoneyOut)" :checked="transaction.isMoneyOut" boxType="circle" name="transactionType" row="1" col="2" text="Money out" class="h4"></Checkbox>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-cash-multiple' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="'Amount ' + (!transaction.isMoneyIn ? 'used' : 'deposited')  "></label>
                    <TextField row="1" col="1" v-model="transaction.amount" :hint="'How much did you ' + (!transaction.isMoneyIn ? 'use' : 'deposit')  + '?'" keyboardType="number" returnKeyType="next" class="h4"></TextField>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                </StackLayout>
              </ScrollView>
            </CardView>
          </StackLayout>
          <StackLayout v-show="currentPage == 1">
            <CardView margin="10" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <ScrollView>
                <StackLayout>
                  <Ripple @tap="transaction.isMonthlyPayment = !transaction.isMonthlyPayment">
                    <GridLayout class="m-10" rows="auto" columns="*,auto">
                      <label row="0" col="0" verticalAlignment="center" class="h3 font-weight-bold text-mute" text="MONTHLY PAYMENT"></label>
                      <switch row="0" col="1" v-model="transaction.isMonthlyPayment"></switch>
                    </GridLayout>
                  </Ripple>
  
                  <Ripple v-show="transaction.isMonthlyPayment" @tap="changeRentMonth()">
                    <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                      <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-calendar-today' | fonticon"></label>
                      <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Month of payment (tap to change)"></label>
                      <label :text="rentMonths[rentMonthIndex]" row="1" col="1" class="h4"></label>
                    </GridLayout>
                  </Ripple>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <Ripple @tap="transaction.isClientPayment = !transaction.isClientPayment">
                    <GridLayout class="m-10" rows="auto" columns="*,auto">
                      <label row="0" col="0" verticalAlignment="center" class="h3 font-weight-bold text-mute" text="CLIENT PAYMENT"></label>
                      <switch row="0" col="1" v-model="transaction.isClientPayment"></switch>
                    </GridLayout>
                  </Ripple>
  
                  <GridLayout v-show="transaction.isClientPayment" class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-circle-outline' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Client's name"></label>
                    <StackLayout v-show="clients && clients.length > 0" row="1" col="1">
                      <ScrollView orientation="horizontal">
                        <WrapLayout>
                          <Label v-for="(client,i) in clients" @tap="transaction.client = client" :class="{'chip-selected':transaction.client == client}" :text="client.userName" v-bind:key="i" class="m-10" padding="5" backgroundColor="grey" borderRadius="99%"></Label>
                        </WrapLayout>
                      </ScrollView>
                    </StackLayout>
                  </GridLayout>
                  <StackLayout v-show="transaction.isClientPayment" width="100%" class="hr-light"></StackLayout>
  
                  <GridLayout class="m-10" :rows="categories.filter(v => v == transaction.category).length == 0 ? 'auto,auto,auto' : 'auto,auto'" columns="auto,*">
                    <label row="0" rowSpan="3" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-chart-bubble' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Category"></label>
                    <StackLayout v-show="categories && categories.length > 0" row="1" col="1">
                      <ScrollView orientation="horizontal">
                        <WrapLayout>
                          <Label v-for="(category,i) in categories" @tap="changeTransactionCategory(category)" :class="{'chip-selected':transaction.category == category}" :text="category" v-bind:key="i" class="m-10" padding="5" backgroundColor="grey" borderRadius="99%"></Label>
                          <Label @tap="changeTransactionCategory(null)" :class="{'chip-selected':categories.filter(v => v == transaction.category).length == 0}" text="+ new" class="m-10" padding="5" backgroundColor="grey" borderRadius="99%"></Label>
                        </WrapLayout>
                      </ScrollView>
                    </StackLayout>
                    <TextField row="2" col="1" v-if="categories.filter(v => v == transaction.category).length == 0" v-model="transaction.category" hint="New Category" returnKeyType="next" class="h4"></TextField>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-message-text-outline' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Description"></label>
                    <TextView row="1" col="1" hint="What exactly did you do?" v-model="transaction.description" class="h4"></TextView>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <Ripple v-if="businessSettings.filter(t => t.title == 'Transaction evidence').length > 0" @tap="uploadEvidence()">
                    <GridLayout class="m-10" rows="auto,auto,*" columns="auto,*">
                      <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-file-document' | fonticon"></label>
                      <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Evidence"></label>
                      <label row="1" col="1" text="Tap to upload a proof" class="h4"></label>
                      <Image row="2" col="1" v-show="selectedImage" :src="selectedImage" stretch="aspectFill" width="90%" />
                    </GridLayout>
                  </Ripple>
                  <StackLayout v-if="businessSettings.filter(t => t.title == 'Transaction evidence').length > 0" width="100%" class="hr-light"></StackLayout>
                </StackLayout>
              </ScrollView>
            </CardView>
          </StackLayout>
          <StackLayout v-show="currentPage == 2">
            <CardView margin="10" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <ScrollView>
                <StackLayout>
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-edit' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Transacter"></label>
                    <label row="1" col="1" :text="$store.state.cache.cachedAdmin.userName" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-calendar-range' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Date"></label>
                    <label row="1" col="1" :text="getMoment(transaction.date).format('DD MMMM YYYY')" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-bank-transfer-' + (transaction.isMoneyIn ? 'in' : 'out') | fonticon"></label>
                    <label row="0" col="1" colSpan="2" class="h3 font-weight-bold text-mute" text="Transaction type"></label>
                    <label row="1" col="1" :text="transaction.isMoneyIn ? 'Money in' : 'Money out'" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-cash-multiple' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="'Amount ' + (!transaction.isMoneyIn ? 'used' : 'deposited')  "></label>
                    <label row="1" col="1" :text="'R' + transaction.amount" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout v-if="transaction.isMonthlyPayment" class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-calendar-today' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Month of payment"></label>
                    <label :text="rentMonths[rentMonthIndex]" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout v-if="transaction.isClientPayment && transaction.client" class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-circle-outline' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Client's name"></label>
                    <label :text="transaction.client.userName" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-chart-bubble' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Category"></label>
                    <label :text="transaction.category" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout v-show="transaction.description" class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-message-text-outline' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Description"></label>
                    <label :text="transaction.description" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout v-show="selectedImage" class="m-10" rows="auto,*" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-file-document' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Evidence"></label>
                    <Image row="1" col="1" v-show="selectedImage" :src="selectedImage" stretch="aspectFill" width="90%" />
                  </GridLayout>
                </StackLayout>
              </ScrollView>
            </CardView>
          </StackLayout>
        </FlexboxLayout>
      </ScrollView>
      <StackLayout row="2">
        <CardView class="bg-white m-t-10 p-t-10" elevation="5" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
          <StackLayout>
            <FlexboxLayout v-show="!isLoading" flexDirection="column" alignContent="flex-end" justifyContent="flex-end" width="100%">
              <GridLayout v-show="!savedTransaction" rows="auto,auto" columns="*,*">
                <Label row="0" colSpan="2" :text="txtError.length < 2 ? '' :txtError" textWrap="true" :class="`text-mute text-light-${txtError.length < 2 ? 'blue' : 'red'}`" textAlignment="center"></Label>
                <Button row="1" col="1" @tap="SubmitTransaction()" v-show="currentPage == 2" class="btn-primary bg-light-green" text="submit"></Button>
                <Button row="1" col="0" @tap="currentPage--" v-show="currentPage > 0" :isEnabled="currentPage > 0" class="btn-primary bg-light-red" text="back"></Button>
                <Button row="1" col="1" @tap="moveForward()" v-show="currentPage != 2" class="btn-primary bg-light-blue" text="proceed"></Button>
              </GridLayout>
              <GridLayout v-show="savedTransaction" rows="auto,auto" columns="*">
                <Label row="0" text="Your transaction was saved successfully!" textWrap="true" class="text-mute text-light-blue" textAlignment="center"></Label>
                <Button row="1" @tap="GoTo('/business/home',{businessID:businessId},{clearHistory: true})" class="btn-primary bg-light-blue" text="All Transactions"></Button>
              </GridLayout>
            </FlexboxLayout>
            <ActivityIndicator v-show="isLoading" :busy="isLoading"></ActivityIndicator>
          </StackLayout>
        </CardView>
      </StackLayout>
    </GridLayout>
  </page>
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

export default {
  data() {
    return {
      total: {
        filter: 0,
        values: []
      },
      savedTransaction: false,
      txtError: "",
      txtSearch: "",
      Amount: "",
      clients: [],
      categories: [],
      hasImage: false,
      selectedImage: null,
      selectedType: "All",
      transactionTypes: ["All", "Deposit", "Rent", "Withdraw"],
      rentMonthIndex: new Date().getMonth(),
      rentMonths: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      rentTenantID: "",
      isRent: false,
      description: "",
      transaction: {
        Amount: null,
        date: new Date(),
        category: "",
        description: null,
        evidence: null,
        businessId: null,
        transacterId: null,
        month: null,
        client: null,
        clientID: null,
        isMoneyIn: true,
        isMoneyOut: false,
        isMonthlyPayment: false,
        isClientPayment: false
      },
      transactions: [],
      isWithdraw: false,
      currentPage: false,
      isMainScreen: false,
      selectedScreen: "",
      price: "",
      toggleSearch: false
    };
  },
  props: [
    "businessName",
    "businessId",
    "businessSettings",
    "businessClients",
    "businessCategories"
  ],
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
          if (this.txtSearch.length < 2) {
            return this.transactions;
          } else {
            return this.transactions.filter(t => {
              return (
                JSON.stringify(t)
                  .toLowerCase()
                  .indexOf(this.txtSearch.toLowerCase()) >= 0
              );
            });
          }
        } else {
          if (this.txtSearch.length < 2) {
            return this.transactions.filter(
              v => v.type == this.selectedType.toUpperCase()
            );
          } else {
            return this.transactions.filter(t => {
              return (
                t.type == this.selectedType.toUpperCase() &&
                JSON.stringify(t)
                  .toLowerCase()
                  .indexOf(this.txtSearch.toLowerCase()) >= 0
              );
            });
          }
        }
      },
      set(val) {
        this.transactions = val;
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
    GoTo(link, props) {
      this.navigate(link, props);
    },
    changeTransactionType(isTrue) {
      if (!isTrue) {
        this.transaction.isMoneyIn = !this.transaction.isMoneyIn;
        this.transaction.isMoneyOut = !this.transaction.isMoneyOut;
      }
    },
    changeTransactionCategory(value) {
      this.transaction.category = value;
    },
    changeTotalFilter() {
      if (this.total.filter == this.total.values.length - 1) {
        this.total.filter = 0;
      } else {
        this.total.filter++;
      }
    },
    pageLoaded(args) {
      var self = this;
      this.ApplyNavigation(self);
      this.clients = this.businessClients;
      this.categories = this.businessCategories;
      if (this.categories && this.categories.length > 0) {
        this.transaction.category = this.categories[0];
      }
    },
    canGoForward(all = false) {
      this.txtError = "";
      if (this.currentPage == 0 || all) {
        if (!this.transaction.amount || isNaN(this.transaction.amount)) {
          this.txtError = "Provide a valid amount of money.";
          return false;
        }
      }
      if (this.currentPage == 1 || all) {
        if (
          !this.transaction.category ||
          this.transaction.category.length < 2
        ) {
          this.txtError = "Please enter/pick a valid category.";
          return false;
        }

        if (this.transaction.isClientPayment && !this.transaction.client) {
          this.txtError = "Pick a client.";
          return false;
        }

        if (
          this.businessSettings.filter(t => t.title == "Transaction evidence")
            .length > 0 &&
          !this.selectedImage
        ) {
          this.txtError = "Please upload a proof of your transaction.";
          return false;
        }
      }
      return true;
    },
    moveForward() {
      if (this.canGoForward()) {
        this.currentPage++;
      }
    },
    async SubmitTransaction() {
      this.isLoading = true;

      if (!this.canGoForward(true)) {
        this.isLoading = false;
        return;
      }

      if (this.selectedImage) {
        let source = new imageSource.ImageSource();
        let img = await source.fromAsset(this.selectedImage);
        if (img) {
          this.transaction.evidence =
            "data:image/png;base64," + img.toBase64String("png");
        }
      }

      this.transaction.businessId = this.businessId;
      this.transaction.transacterId = this.$store.state.cache.cachedAdmin._id;
      if (this.transaction.isClientPayment) {
        this.transaction.clientID = this.transaction.client._id;
      } else {
        this.transaction.clientID = null;
      }

      if (this.transaction.isMonthlyPayment) {
        this.transaction.month = this.rentMonths[this.rentMonthIndex];
      } else {
        this.transaction.month = null;
      }

      this.$api
        .submitTransaction(this.transaction)
        .then(response => {
          var statusCode = response.statusCode;
          if (statusCode == 200) {
            this.$feedback.success({
              title: response.content.toString(),
              duration: 4000,
              onTap: () => {
                this.GoTo('/business/home',{businessID:this.businessId},{clearHistory: true});
              }
            });
            this.savedTransaction = true;
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
    changeRentMonth() {
      if (this.rentMonthIndex == 11) {
        this.rentMonthIndex = 0;
      } else {
        this.rentMonthIndex++;
      }
    },
    changeTransactionDate() {
      var self = this;
      this.$showModal({
        template: ` 
                                                                                                            <Page>
                                                                                                                <GridLayout rows="auto,*,auto" columns="*" width="100%" height="60%">
                                                                                                                    <Label row="0" class="h3 m-5" :textWrap="true" textAlignment="center" text="When must the notification be sent?"></Label>
                                                                                                                    <DatePicker verticalAlignment="center" row="1" v-model="selectedDueDate" />
                                                                                                                    <Label row="2" class="mdi h1 m-5" @tap="changeDueRent($modal)" textAlignment="center" :text="'mdi-check' | fonticon"></Label>
                                                                                                                </GridLayout>
                                                                                                            </Page>
                                                                                                            `,
        data: function() {
          return {
            selectedDueDate: new Date()
          };
        },
        methods: {
          changeDueRent(modal) {
            var date = self.transaction.date;
            var now = new Date(
              this.selectedDueDate.getFullYear(),
              this.selectedDueDate.getMonth(),
              this.selectedDueDate.getDate(),
              date.getHours(),
              date.getMinutes()
            );
            self.transaction.date = now;
            this.$modal.close();
          }
        }
      });
    },
    uploadEvidence() {
      if (
        this.businessSettings.filter(
          t => t.title == "Transaction invoice source"
        ).length > 0 &&
        this.businessSettings.filter(
          t => t.title == "Transaction invoice source"
        )[0].value
      ) {
        camera
          .requestPermissions()
          .then(answer => {
            camera
              .takePicture()
              .then(imageAsset => {
                this.selectedImage = imageAsset;
                this.hasImage = true;
              })
              .catch(err => {
                console.log("Error -> " + err.message);
              });
          })
          .catch(err => {
            console.log("Error -> " + err.message);
          });
      } else {
        let context = imagepicker.create({
          mode: "single" // use "multiple" for multiple selection
        });

        context
          .authorize()
          .then(function() {
            return context.present();
          })
          .then(selection => {
            selection.forEach(selected => {
              // process the selected image
              this.selectedImage = selected;
              this.hasImage = true;
            });
          })
          .catch(err => {
            // process error
            this.$feedback.error({
              title: "No file selected",
              message: "Please select a valid image file",
              duration: 4000,
              position: 1,
              onTap: () => {}
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
