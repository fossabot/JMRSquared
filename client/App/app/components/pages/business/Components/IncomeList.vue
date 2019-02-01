<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*,auto" backgroundColor="white">
      <CardView row="0" elevation="15">
        <GridLayout rows="auto,auto" columns="auto,*" class="bg-dark-blue p-10">
          <Ripple rowSpan="2" @tap="navigate(null)" verticalAlignment="center" borderRadius="50%">
            <Label verticalAlignment="center" textAlignment="center" class="mdi text-white p-5" fontSize="25%" :text="'mdi-arrow-left' | fonticon"></Label>
          </Ripple>
          <label class="p-x-15 text-white" fontSize="18%" col="1" text="Income streams"></label>
          <label row="1" class="p-x-15 text-white" verticalAlignment="center" fontSize="13%" col="1" :text="`Any source of income that ${businessName} receives`"></label>
        </GridLayout>
      </CardView>
  
      <Fab @tap="AddBusinessIncome" row="1" icon="res://ic_add_white_24dp" class="fab-button fixedBtn"></Fab>
      <ScrollView rowSpan="2" row="1">
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
      <CardView row="2" margin="15" v-if="incomes.filter(v => v.value) && incomes.filter(v => v.value).length > 0" elevation="20">
        <StackLayout verticalAlignment="center">
          <GridLayout class="m-x-15 m-y-5" rows="auto,auto" columns="*,*">
            <label row="0" col="0" class="font-weight-bold" textAlignment="center" text="Total"></label>
            <label row="1" col="0" class="font-weight-bold text-dark-blue summaryStats" :text="`R${incomes.filter(v => v.value).map(v => v.value).reduce(add)}`" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
            <label row="0" col="1" class="font-weight-bold" textAlignment="center" text="Transactions"></label>
            <label row="1" col="1" class="font-weight-bold text-dark-blue summaryStats" :text="incomes.filter(v => v.value).map(v => v.count).reduce(add)" :class="{'visible':true}" fontSize="15%" vertialAlignment="center" textAlignment="center"></label>
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