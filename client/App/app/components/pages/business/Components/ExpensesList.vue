<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*,auto" backgroundColor="white">
      <CardView row="0" margin="10" elevation="20">
        <StackLayout>
          <GridLayout class="p-10" rows="auto,auto" columns="auto,*">
            <Label row="0" rowSpan="2" col="0" fontSize="25%" verticalAlignment="center" borderRadius="50%" textAlignment="center" class="h2 mdi" :text="'mdi-trending-down' | fonticon"></Label>
            <label row="0" col="1" class="p-x-15 h3" fontSize="20%" text="Expenses"></label>
            <label row="1" col="1" class="p-x-15 h4" :text="`Any known expense that ${businessName} pays`"></label>
          </GridLayout>
        </StackLayout>
      </CardView>
      <Fab @tap="AddBusinessExpense" row="1" icon="res://ic_add_white_24dp" class="fab-button fixedBtn"></Fab>
      <ScrollView row="1">
        <StackLayout>
          <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
          <Ripple v-show="!isLoading" class="p-15" v-for="(expense,i) in expenses" :key="i">
            <CardView elevation="10" margin="1">
              <GridLayout class="p-10" rows="auto,auto" columns="*,auto">
                <label row="0" col="0" fontSize="15%" class="p-x-15 font-weight-bold" :text="expense.title"></label>
                <label row="1" col="0" fontSize="15%" class="p-x-15 text-light-red" :text="`R${expense.value}`"></label>
                <Label row="1" col="1" textAlignment="right" fontSize="15%" textWrap="true" verticalAlignment="center" :text="`${expense.count} transactions`" />
              </GridLayout>
            </CardView>
          </Ripple>
        </StackLayout>
      </ScrollView>
      <CardView margin="15" v-if="expenses.filter(v => v.value) && expenses.filter(v => v.value).length > 0" row="2" elevation="20">
        <StackLayout>
          <GridLayout class="p-10" rows="auto,auto" columns="*,*">
            <label row="0" col="0" fontSize="18%" textAlignment="left" class="p-x-15" text="Total"></label>
            <label row="1" col="0" fontSize="18%" textAlignment="left" class="p-x-15 font-weight-bold text-light-red" :text="`R${expenses.filter(v => v.value).map(v => v.value).reduce(add)}`"></label>
            <label row="0" col="1" fontSize="18%" textAlignment="right" class="p-x-15" text="Transactions"></label>
            <Label row="1" col="1" fontSize="18%" textAlignment="right" class="p-x-15 font-weight-bold text-light-red" :text="`${expenses.filter(v => v.value).map(v => v.count).reduce(add)}`" />
          </GridLayout>
        </StackLayout>
      </CardView>
    </GridLayout>
  </page>
</template>

<script>
export default {
  name: "ExpensesList",
  data() {
    return {
      expenses: [],
      isLoading: false
    };
  },
  mounted() {
    this.GetBusinessExpenses();
  },
  props: ["businessName", "businessId"],
  methods: {
    add(a, b) {
      return a + b;
    },
    GetBusinessExpenses() {
      this.isLoading = true;
      this.$api
        .getBusinessExpenses(this.businessId)
        .then(expenses => {
          this.isLoading = false;
          this.expenses = expenses;
        })
        .catch(err => {
          this.isLoading = false;
          this.$feedback.error({
            title: "Unable to load your expenses",
            duration: 4000,
            message: "Please try again later"
          });
        });
    },
    AddBusinessExpense() {
      prompt({
        title: `Add a new expense for ${this.businessName}`,
        message: "Please enter the name of the expense",
        okButtonText: "Save",
        cancelButtonText: "Cancel"
      }).then(result => {
        if (!result.text || result.text.length < 2) {
          this.$feedback.error({
            title: "Invalid expense",
            duration: 4000,
            message:
              "Please try again with a valid name like : Electricity or Rates"
          });
          return;
        }
        this.isLoading = true;
        this.$api
          .addBusinessExpense(this.businessId, result.text)
          .then(expenses => {
            this.GetBusinessExpenses();
          })
          .catch(err => {
            this.isLoading = false;
            this.$feedback.error({
              title: `Unable to add ${result.text} as an expense`,
              duration: 4000,
              message: "Please try again later"
            });
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>