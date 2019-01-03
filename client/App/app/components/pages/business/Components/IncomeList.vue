<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*,auto" backgroundColor="white">
      <CardView row="0" margin="10" elevation="20">
        <StackLayout>
          <GridLayout class="p-10" rows="auto,auto" columns="auto,*">
            <Label row="0" rowSpan="2" col="0" fontSize="25%" verticalAlignment="center" borderRadius="50%" textAlignment="center" class="h2 mdi" :text="'mdi-trending-up' | fonticon"></Label>
            <label row="0" col="1" class="p-x-15 h3" fontSize="20%" text="Income streams"></label>
            <label row="1" col="1" class="p-x-15 h4" :text="`Any source of income that ${businessName} receives`"></label>
          </GridLayout>
        </StackLayout>
      </CardView>
      <Fab @tap="AddBusinessIncome" row="1" icon="res://ic_add_white_24dp" class="fab-button fixedBtn"></Fab>
      <ScrollView row="1">
        <StackLayout>
          <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
          <Ripple v-show="!isLoading" v-for="(income,i) in incomes" :key="i">
            <GridLayout class="p-10" rows="auto,auto" columns="*,auto">
              <label row="0" col="0" fontSize="15%" class="p-x-15 font-weight-bold" :text="income.title"></label>
              <label row="1" col="0" fontSize="15%" class="p-x-15 text-dark-blue" :text="`R${income.value}`"></label>
              <Label row="1" col="1" textAlignment="right" fontSize="15%" textWrap="true" verticalAlignment="center" :text="`${income.count} transactions`" />
            </GridLayout>
          </Ripple>
        </StackLayout>
      </ScrollView>
      <CardView margin="15" v-if="incomes.filter(v => v.value) && incomes.filter(v => v.value).length > 0" row="2" elevation="20">
        <StackLayout>
          <GridLayout class="p-10" rows="auto,auto" columns="auto,*">
            <label row="0" col="0" fontSize="18%" textAlignment="left" class="p-x-15" text="Total"></label>
            <label row="1" col="0" fontSize="18%" textAlignment="left" class="p-x-15 font-weight-bold text-dark-blue" :text="`R${incomes.filter(v => v.value).map(v => v.value).reduce(add)}`"></label>
            <label row="0" col="1" fontSize="18%" textAlignment="right" class="p-x-15" text="Transactions"></label>
            <Label row="1" col="1" fontSize="18%" textAlignment="right" class="p-x-15 font-weight-bold text-dark-blue" :text="`${incomes.filter(v => v.value).map(v => v.count).reduce(add)}`" />
          </GridLayout>
        </StackLayout>
      </CardView>
    </GridLayout>
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
    add(a, b) {
      return a + b;
    },
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
            this.GetBusinessIncomes();
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