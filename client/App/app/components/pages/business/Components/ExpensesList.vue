<template>
  <page actionBarHidden="true">
    <StackLayout backgroundColor="white">
      <CardView margin="10" elevation="20">
        <StackLayout>
          <Ripple @tap="GoTo(option)">
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
          <Ripple class="p-15" v-for="a in 5" :key="a">
            <CardView elevation="10" margin="5">
              <GridLayout class="p-15" rows="auto,auto,auto" columns="*,*">
                <Label row="0" col="0" class="h3 p-b-5" colSpan="2" textAlignment="center" verticalAlignment="center" text="Londi Cleaner" />
                <Label row="1" col="0" rowSpan="2" textAlignment="left" textWrap="true" verticalAlignment="center" text="1st of every month" />
                <Label row="1" col="1" class="text-light-blue" textAlignment="right" textWrap="true" verticalAlignment="center" text="R2000" />
                <Label row="2" col="1" textAlignment="right" fontSize="15%" textWrap="true" verticalAlignment="center" text="paid for JUNE" />
              </GridLayout>
            </CardView>
          </Ripple>
        </StackLayout>
      </ScrollView>
    </StackLayout>
  </page>
</template>

<script>
const http = require("http");
export default {
  name: "PartnersList",
  data() {
    return {
      option: {},
      partners: []
    };
  },
  mounted() {
    this.GetPartnersForBusiness();
    this.option = {
      link: "/business/add/partner",
      props: {
        businessId: this.businessId,
        businessName: this.businessName
      }
    };
  },
  props: ["businessName", "businessId"],
  methods: {
    GetPartnersForBusiness() {
      this.$api
        .getPartners(this.businessId)
        .then(partners => {
          this.partners = partners;
        })
        .catch(err => {
          this.$feedback.error({
            title: "Unable to load your partners",
            duration: 4000,
            message: "Please try again later"
          });
        });
    },
    GoTo(option) {
      if (option.link) {
        this.navigate(option.link, option.props);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>