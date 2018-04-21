<template>
  <FlexboxLayout v-if="!isMainScreen" class="page">
    <GridLayout rows="auto,auto,*">
  
      <CardView row="0" margin="10" elevation="10" height="40" @tap="ShowNewTransaction(1)" backgroundColor="grey" v-show="currentPage == 0" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
        <label verticalAlignment="center" textAlignment="center" text="Create a new transaction"></label>
      </CardView>
  
  
      <SearchBar row="1" v-show="currentPage == 0" hint="Search ..."></SearchBar>
      <StackLayout row="2" v-show="currentPage == 0">
        <ScrollView orientation="horizontal">
          <StackLayout orientation="horizontal">
            <Ripple @tap="selectedType = transactionType" v-for="(transactionType,i) in transactionTypes" :key="i" borderRadius="50%">
              <label :text="transactionType" :class="{'bottom-line-blue':selectedType == transactionType}" class="m-10"></label>
            </Ripple>
          </StackLayout>
        </ScrollView>
        <PullToRefresh row="1" col="0" @refresh="refreshList($event)">
  
          <ListView borderRightWidth="2px" borderRightColor="transparent" for="transaction in filteredTransactions">
            <v-template>
              <CardView margin="10" elevation="25" radius="10" shadowOffsetHeight="10" shadowOpacity="0.5" shadowRadius="50">
                <GridLayout class="m-10" rows="auto,auto,auto" columns="auto,*,auto">
                  <Label row="0" col="0" textAlignment="center" class="m-5" :text="transaction.type"></Label>
                  <Label row="1" col="0" textAlignment="center" :class="{'text-dark-blue':transaction.type == 'Deposit' || transaction.type == 'Rent','text-light-red':transaction.type == 'Withdraw'}" class="mdi m-5" fontSize="50%" :text="(transaction.type == 'Rent' ? 'mdi-attach-money' : (transaction.type == 'Deposit' ? 'mdi-trending-up' :'mdi-trending-down')) | fonticon"></Label>
                  <Label row="2" col="0" textAlignment="center" class="font-weight-bold m-5" :text="'R' + transaction.amount"></Label>
  
                  <Label row="0" col="1" v-show="transaction.type == 'Rent'" class="m-5" textWrap="true" textAlignment="center" :text="transaction.rentMonth"></Label>
                  
                  <Label row="1" col="1" v-show="transaction.type != 'Rent'" class="body m-10" textWrap="true" textAlignment="center" :text="transaction.description"></Label>
                  <Label row="1" col="1" v-show="transaction.type == 'Rent'" class="h2 m-10" textWrap="true" textAlignment="center" :text="transaction.rentTenantName"></Label>
                
                  <Label row="0" col="2" class="font-italic m-5 tinyText" textWrap="true" textAlignment="center" :text="getMoment(transaction.date).fromNow()"></Label>
                  <Label row="2" col="2" class="m-5" textWrap="true" textAlignment="center" :text="transaction.adminID.userName"></Label>
  
                </GridLayout>
              </CardView>
              </v-template>
          </ListView>
        </PullToRefresh>
      </StackLayout>
  
      <!-- This is the first step -->
      <CardView row="1" margin="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50" elevation="10" height="100%" v-show="currentPage == 1">
        <ScrollView>
          <StackLayout class="form">
            <Label row="0" col="1" @tap="ShowNewTransaction(0)" verticalAlignment="center" textAlignment="right" alignSelf="right" class="mdi h1 m-10" :text="'mdi-close' | fonticon" color="$redColor"></Label>
  
            <label class="h2 m-5 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" text="New Transaction"></label>
  
            <StackLayout width="100%" class="hr-light"></StackLayout>
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Transacter"></label>
              <label row="1" col="1" :text="$store.state.user.userName" class="h4"></label>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <GridLayout @tap="changeTransactionDate()" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Date (tap to change)"></label>
              <label row="1" col="1" :text="TransactionDate.toISOString().slice(0,10)" class="h4"></label>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <GridLayout @tap="isRent = !isRent" class="m-10" rows="auto" columns="*,auto">
              <label row="0" col="0" verticalAlignment="center" class="h3 font-weight-bold text-mute" text="RENT PAYMENT"></label>
              <switch row="0" col="1" v-model="isRent"></switch>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
  
            <GridLayout v-show="isRent" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person-outline' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Tenant's name"></label>
              <StackLayout v-show="users && users.length > 0" row="1" col="1">
                <ScrollView orientation="horizontal">
                  <WrapLayout>
                    <Label v-for="(user,i) in users" @tap="rentTenantName = user.text" :class="{'chip-selected':rentTenantName == user.text}" :text="user.text" v-bind:key="i" class="m-10" padding="5" backgroundColor="grey" borderRadius="99%"></Label>
                  </WrapLayout>
                </ScrollView>
              </StackLayout>
            </GridLayout>
            <StackLayout v-show="isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="!isRent" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-message' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Description"></label>
              <TextView row="1" col="1" hint="What exactly did you do?" v-model="description" class="h4"></TextView>
            </GridLayout>
            <StackLayout v-show="!isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="isRent" class="m-10" @tap="changeRentMonth()" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-today' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Month for rent (tap to change)"></label>
              <label :text="rentMonths[rentMonthIndex]" row="1" col="1" class="h4"></label>
            </GridLayout>
            <StackLayout v-show="isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="!isRent" @tap="isWithdraw = !isWithdraw" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-trending-' + (isWithdraw ? 'down' : 'up') | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Transaction type (tap to change)"></label>
              <label row="1" col="1" :text="isWithdraw ? 'Withdraw' : 'Deposit'" class="h4"></label>
            </GridLayout>
            <StackLayout v-show="!isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="isRent" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" :class="{'text-light-red':isWithdraw,'text-light-blue':!isWithdraw}" class="mdi m-15" fontSize="25%" :text="'mdi-attach-money' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Amount paid"></label>
              <TextField row="1" col="1" v-model="Amount" :hint="'How much did ' + (rentTenantName.length < 2 ? 'he/she' : rentTenantName)  + ' pay?'" keyboardType="number" returnKeyType="next" class="h4"></TextField>
            </GridLayout>
            <StackLayout v-show="isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="!isRent" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-money' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="'Amount ' + (isWithdraw ? 'used' : 'deposited')  "></label>
              <TextField row="1" col="1" v-model="Amount" :hint="'How much did you ' + (isWithdraw ? 'use' : 'deposit')  + '?'" keyboardType="number" returnKeyType="next" class="h4"></TextField>
            </GridLayout>
            <StackLayout v-show="!isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout class="m-10" rows="auto,auto,auto" @tap="uploadEvidence()" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-file' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Evidence"></label>
              <label row="1" col="1" text="Tap to upload a proof" class="h4"></label>
              <Image row="2" col="1" v-show="selectedImage" :src="selectedImage" stretch="aspectFill" width="90%" />
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
      <CardView row="1" margin="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50" elevation="10" height="100%" v-show="currentPage == 2">
        <ScrollView>
          <StackLayout class="form">
            <Label row="0" col="1" @tap="ShowNewTransaction(1)" verticalAlignment="center" textAlignment="right" alignSelf="right" class="mdi h1 m-10 text-light-red" :text="'mdi-keyboard-backspace' | fonticon"></Label>
            <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" text="Verify information"></label>
  
            <label class="m-10 t-10 font-italic" textWrap="true" verticalAlignment="center" text="Please validate if the following information is correct and click submit or go back and fix all the mistakes."></label>
  
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Transacter"></label>
              <label row="1" col="1" :text="$store.state.user.userName" class="h4"></label>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Date"></label>
              <label row="1" col="1" :text="TransactionDate.toISOString().slice(0,10)" class="h4"></label>
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="isRent" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person-outline' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Tenant's name"></label>
              <label row="1" col="1" hint="Who paid this rent?" :text="rentTenantName" returnKeyType="next" class="h4"></label>
            </GridLayout>
            <StackLayout v-show="isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="!isRent" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-message' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Description"></label>
              <label row="1" col="1" hint="What exactly did you do?" :text="description" class="h4"></label>
            </GridLayout>
            <StackLayout v-show="!isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="isRent" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-today' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Month for rent"></label>
              <label :text="rentMonths[rentMonthIndex]" row="1" col="1" class="h4"></label>
            </GridLayout>
            <StackLayout v-show="isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="!isRent" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-trending-' + (isWithdraw ? 'down' : 'up') | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Transaction type"></label>
              <label row="1" col="1" :text="isWithdraw ? 'Withdraw' : 'Deposit'" class="h4"></label>
            </GridLayout>
            <StackLayout v-show="!isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="isRent" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" :class="{'text-light-red':isWithdraw,'text-light-blue':!isWithdraw}" class="mdi m-15" fontSize="25%" :text="'mdi-attach-money' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Amount paid"></label>
              <label row="1" col="1" :text="Amount" class="h4"></label>
            </GridLayout>
            <StackLayout v-show="isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout v-show="!isRent" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-money' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="'Amount ' + (isWithdraw ? 'used' : 'deposited')  "></label>
              <label row="1" col="1" :text="Amount" class="h4"></label>
            </GridLayout>
            <StackLayout v-show="!isRent" width="100%" class="hr-light"></StackLayout>
  
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-file' | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Evidence"></label>
              <Image row="1" col="1" v-show="selectedImage" :src="selectedImage" stretch="aspectFill" width="90%" />
            </GridLayout>
            <StackLayout width="100%" class="hr-light"></StackLayout>
  
            <ActivityIndicator :busy="isLoading"></ActivityIndicator>
  
            <GridLayout v-show="!isLoading" columns="*,*" rows="*" verticalAlignment="bottom">
              <button row="0" col="0" @tap="ShowNewTransaction(1)" verticalAlignment="bottom" width="100%" textAlignment="center" class="btn-primary bg-light-red" text="Back"></button>
              <button row="0" col="1" @tap="SubmitTransaction()" verticalAlignment="bottom" width="100%" textAlignment="center" class="btn-primary bg-light-blue" text="Submit"></button>
            </GridLayout>
  
          </StackLayout>
        </ScrollView>
      </CardView>
  
    </GridLayout>
  </FlexboxLayout>
</template>

<script>
  const dialogs = require('ui/dialogs')
  const application = require('application')
  var AndroidApplication = application.android;
  var activity = AndroidApplication.foregroundActivity;
  import * as imageSource from "tns-core-modules/image-source";
  
  import * as imagepicker from "nativescript-imagepicker";
  
  import * as connectivity from "tns-core-modules/connectivity";
  const http = require("http")
  export default {
    data() {
      return {
        txtError: '',
        Amount: '',
        users: [],
        hasImage: false,
        isLoading: false,
        selectedImage: null,
        selectedType: "All",
        transactionTypes: ["All", "Deposit", "Rent", "Withdraw"],
        rentMonthIndex: new Date().getMonth(),
        rentMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        rentTenantName: '',
        isRent: false,
        description: '',
        TransactionDate: new Date(),
        transactions: [],
        isWithdraw: false,
        currentPage: false,
        isMainScreen: false,
        selectedScreen: '',
        price: ''
      }
    },
    computed: {
      amount: {
        get() {
          return this.price;
        },
        set(value) {
          if (value.length > 0 && value[0] != 'R') {
            return 'R' + this.price;
          }
          this.price = value;
        }
      },
      filteredTransactions: {
        get() {
          if (this.selectedType == this.transactionTypes[0]) {
            return this.transactions;
          } else {
            return this.transactions.filter((v) => v.type == this.selectedType);
          }
        },
        set(val) {
          return this.transactions = val;
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
      pageLoaded(args) {
        var self = this;
        this.ApplyNavigation(self);
        http.getJSON(this.$store.state.settings.baseLink + "/s/students/all/names").then((results) => {
          this.users = [];
  
          results.map((v) => {
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
            message: "Please switch on your data/wifi.",
          });
  
        } else {
          http.getJSON(this.$store.state.settings.baseLink + "/a/transaction/all").then((results) => {
            this.filteredTransactions = results;
          }).catch((err) => {
            this.$feedback.error({
              title: "Error",
              duration: 4000,
              message: err,
            });
          });
        }
      },
      canSubmit() {
        this.txtError = "";
        if (!this.hasImage) {
          this.txtError = "Please an image of your proof (slip)";
        }
        if (this.Amount.toString().length < 1 && !isNaN(this.Amount)) {
          this.txtError = "Please provide a valid amount.";
        }
        if (this.isRent) {
          if (this.rentTenantName.length < 2) {
            this.txtError = "Please select a tenant.";
          }
        } else {
          if (this.description.length < 2) {
            this.txtError = "A description is required.";
          }
        }
        return this.txtError.length < 2;
      },
      SubmitTransaction() {
        this.isLoading = true;
        if (!this.canSubmit()) {
          this.ShowNewTransaction(1);
          this.isLoading = false;
          return;
        }
  
        let source = new imageSource.ImageSource();
        source.fromAsset(this.selectedImage).then((img) => {
          this.selectedImage = img.toBase64String("png");
  
          http.request({
              url: this.$store.state.settings.baseLink + "/a/transaction/add",
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              content: JSON.stringify({
                adminID: this.$store.state.user.id, //ForeignKey
                amount: this.Amount,
                type: this.isRent ? 'Rent' : (this.isWithdraw ? 'Withdraw' : 'Deposit'),
                rentTenantName: this.rentTenantName,
                rentMonth: this.rentMonths[this.rentMonthIndex],
                description: this.description,
                proof: this.selectedImage,
                date: this.TransactionDate
              })
            })
            .then(response => {
              var statusCode = response.statusCode;
              if (statusCode == 200) {
  
                this.$feedback.success({
                  title: "Transaction successfully added",
                  duration: 4000,
                  onTap: () => {
                    this.currentPage = 0;
                  }
                });
                this.isLoading = false;
              } else if (statusCode == 413) {
                this.$feedback.error({
                  title: "Unable to add transaction",
                  message: "The image file is too large",
                  duration: 4000,
                });
                this.isLoading = false;
              }
            })
            .catch(err => {
              this.$feedback.error({
                message: err,
                duration: 4000,
              });
              this.isLoading = false;
            })
        });
  
      },
      refreshList(args) {
        var pullRefresh = args.object;
  
        var connectionType = connectivity.getConnectionType();
        if (connectionType == connectivity.connectionType.none) {
          this.$feedback.error({
            title: "Error (NO INTERNET CONNECTION)",
            duration: 4000,
            message: "Please switch on your data/wifi.",
          });
  
          pullRefresh.refreshing = false;
        } else {
          http.getJSON(this.$store.state.settings.baseLink + "/a/transaction/all").then((results) => {
            this.filteredTransactions = results;
            pullRefresh.refreshing = false;
          }).catch((err) => {
            this.$feedback.error({
              title: "Error",
              duration: 4000,
              message: err,
            });
            pullRefresh.refreshing = false;
  
          });
        }
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
                          <Label row="0" class="h2 m-5" textAlignment="center" text="When was the transaction?"></Label>
                          <DatePicker row="1" v-model="selectedDueDate" />
                          <Label row="2" class="mdi h1 m-5" @tap="changeDueRent($modal,selectedDueDate)" textAlignment="center" :text="'mdi-done' | fonticon"></Label>
                      </GridLayout>
                  </Page>
                  `,
          data: function() {
            return {
              selectedDueDate: new Date()
            }
          },
          methods: {
            changeDueRent(modal, value) {
              self.TransactionDate = value;
              self.TransactionDate.setDate(value.getDate() + 1);
              this.$modal.close();
            }
          },
        })
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
          }
        }
        this.currentPage = value;
      },
      uploadEvidence() {
        let context = imagepicker.create({
          mode: "single" // use "multiple" for multiple selection
        });
  
        context
          .authorize()
          .then(function() {
            return context.present();
          })
          .then((selection) => {
            selection.forEach((selected) => {
              // process the selected image
              this.selectedImage = selected;
              this.hasImage = true;
            });
          }).catch((err) => {
            // process error
            this.$feedback.error({
              title: "No file selected",
              message: "Please select a valid image file",
              duration: 4000,
              position: 1,
              onTap: () => {
  
              }
            });
          });
      }
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
