<template>
  <page actionBarHidden="true">
    <StackLayout backgroundColor="white">
      <CardView margin="10" elevation="20">
        <StackLayout>
          <Ripple @tap="AddBusinessExpense()">
            <GridLayout class="p-10" rows="auto,auto" columns="auto,*">
              <Label row="0" rowSpan="2" col="0" fontSize="25%" verticalAlignment="center" borderRadius="50%" textAlignment="center" class="h2 mdi" :text="'mdi-trending-down' | fonticon"></Label>
              <label row="0" col="1" class="p-x-15 h3" fontSize="20%" text="Add a fixed expense"></label>
              <label row="1" col="1" class="p-x-15 h4" :text="`Any known expense that ${businessName} pays`"></label>
            </GridLayout>
          </Ripple>
        </StackLayout>
      </CardView>
      <ScrollView>
        <StackLayout>
          <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
          <Ripple v-show="!isLoading" class="p-15" v-for="(expense,i) in expenses" :key="i">
            <CardView elevation="10" margin="5">
              <GridLayout class="p-15" rows="auto,auto,auto" columns="*,*">
                <Label row="0" col="0" class="h3 p-b-5" colSpan="2" textAlignment="center" verticalAlignment="center" :text="expense.title" />
                <Label row="1" col="1" class="text-light-blue" textAlignment="right" textWrap="true" verticalAlignment="center" :text="`R${expense.value}`" />
                <Label row="2" col="1" textAlignment="right" fontSize="15%" textWrap="true" verticalAlignment="center" :text="`${expense.count} transactions`" />
              </GridLayout>
            </CardView>
          </Ripple>
        </StackLayout>
      </ScrollView>
    </StackLayout>
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
            this.isLoading = false;
            this.expenses = expenses;
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