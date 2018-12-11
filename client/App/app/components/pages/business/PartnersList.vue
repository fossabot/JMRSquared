<template>
  <page actionBarHidden="true">
    <StackLayout backgroundColor="white">
      <CardView margin="10" elevation="20">
        <StackLayout>
          <Ripple @tap="GoTo(option)">
            <GridLayout class="p-10" rows="auto,auto" columns="auto,*">
              <Label row="0" rowSpan="2" col="0" fontSize="25%" verticalAlignment="center" borderRadius="50%" textAlignment="center" class="h2 mdi" :text="'mdi-account-multiple-plus' | fonticon"></Label>
              <label row="0" col="1" class="p-x-15 h3" fontSize="20%" text="Add new partner"></label>
              <label row="1" col="1" class="p-x-15 h4" :text="`Assign a new worker to ${businessName}`"></label>
            </GridLayout>
          </Ripple>
        </StackLayout>
      </CardView>
      <ScrollView>
        <StackLayout>
          <Ripple v-for="(partner,i) in partners" :key="i">
            <GridLayout class="p-10" rows="auto,auto" columns="auto,*">
              <Image row="0" rowSpan="3" col="0" borderWidth="5px" borderColor="$blueLightColor" stretch="aspectFill" :src="partner.profilePic ? partner.profilePic : $store.state.settings.defaultProfilePic" width="70" height="70" borderRadius="50%" />
              <label row="0" col="1" class="p-x-15 h2" verticalAlignment="bottom" :text="partner.userName"></label>
              <label row="1" col="1" class="p-x-15 h3" verticalAlignment="bottom" :text="`0${partner.numbers}`"></label>
            </GridLayout>
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
      this.$api.getPartners(this.businessId).then(partners =>{
this.partners = partners;
      }).catch(err =>{
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