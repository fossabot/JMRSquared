<template>
  <page actionBarHidden="true">
    <StackLayout backgroundColor="white">
      <CardView margin="10" elevation="20">
        <StackLayout>
          <Ripple @tap="AddBusinessIncome()">
            <GridLayout class="p-10" rows="auto,auto" columns="auto,*">
              <Label row="0" rowSpan="2" col="0" fontSize="25%" verticalAlignment="center" borderRadius="50%" textAlignment="center" class="h2 mdi" :text="'mdi-trending-up' | fonticon"></Label>
              <label row="0" col="1" class="p-x-15 h3" fontSize="20%" text="Add a fixed income stream"></label>
              <label row="1" col="1" class="p-x-15 h4" :text="`Any source of income that ${businessName} receives`"></label>
            </GridLayout>
          </Ripple>
        </StackLayout>
      </CardView>
      <ScrollView>
        <StackLayout>
          <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
          <Ripple v-show="!isLoading" v-for="(income,i) in incomes" :key="i">
            <GridLayout class="p-10" rows="auto,auto,auto" columns="*,auto">
              <label row="0" col="0" class="p-x-15 h2" :text="income.title"></label>
              <label row="1" col="0" class="p-x-15 h3" :text="`R${income.value}`"></label>
              <Label row="2" col="1" textAlignment="right" fontSize="15%" textWrap="true" verticalAlignment="center" :text="`${income.count} transactions`" />
            </GridLayout>
          </Ripple>
        </StackLayout>
      </ScrollView>
    </StackLayout>
  </page>
</template>

<script>
export default {
  name: "IncomeList",
  data() {
    return {
      incomes: [],
      isLoading: false
    };
  },
  mounted() {
    this.GetBusinessIncomes();
  },
  props: ["businessName", "businessId"],
  methods: {
    GetBusinessIncomes() {
      this.isLoading = true;
      this.$api
        .getBusinessIncomes(this.businessId)
        .then(incomes => {
          this.isLoading = false;
          this.incomes = incomes;
        })
        .catch(err => {
          this.isLoading = false;
          this.$feedback.error({
            title: "Unable to load your partners",
            duration: 4000,
            message: "Please try again later"
          });
        });
    },
    AddBusinessIncome() {
      prompt({
        title: `Add a new income for ${this.businessName}`,
        message: "Please enter the name of the income",
        okButtonText: "Save",
        cancelButtonText: "Cancel"
      }).then(result => {
        if (!result.text || result.text.length < 2) {
          this.$feedback.error({
            title: "Invalid income",
            duration: 4000,
            message: "Please try again with a valid name like : Salary or Rent"
          });
          return;
        }
        this.isLoading = true;
        this.$api
          .addBusinessIncome(this.businessId, result.text)
          .then(expenses => {
            this.isLoading = false;
            this.expenses = expenses;
          })
          .catch(err => {
            this.isLoading = false;
            this.$feedback.error({
              title: `Unable to add ${result.text} as an income`,
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