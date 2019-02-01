<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*" backgroundColor="white">
      <CardView row="0" elevation="15">
        <GridLayout rows="auto,auto" columns="auto,*" class="bg-dark-blue p-10">
          <Ripple rowSpan="2" @tap="navigate(null)" verticalAlignment="center" borderRadius="50%">
            <Label verticalAlignment="center" textAlignment="center" class="mdi text-white p-5" fontSize="25%" :text="'mdi-arrow-left' | fonticon"></Label>
          </Ripple>
          <label class="p-x-15 text-white" fontSize="18%" col="1" text="Partners"></label>
          <label row="1" class="p-x-15 text-white" verticalAlignment="center" fontSize="13%" col="1" :text="`Workers and clients of ${businessName}`"></label>
        </GridLayout>
      </CardView>
      <Fab @tap="GoTo(option)" row="1" icon="res://ic_add_white_24dp" class="fab-button fixedBtn"></Fab>
      <ScrollView row="1">
        <StackLayout>
          <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
          <Ripple v-show="!isLoading" v-for="(partner,i) in partners" :key="i">
            <GridLayout class="p-10" rows="auto,auto" columns="auto,*,auto">
              <Image row="0" rowSpan="3" col="0" borderWidth="5px" borderColor="$blueLightColor" stretch="aspectFill" :src="partner.profilePic ? partner.profilePic : $store.state.settings.defaultProfilePic" width="70" height="70" borderRadius="50%" />
              <label row="0" col="1" class="p-x-15" fontSize="18%" verticalAlignment="bottom" :text="partner.userName"></label>
              <label row="1" col="1" class="p-x-15" fontSize="15%" verticalAlignment="bottom" :text="`0${partner.numbers}`"></label>
              <label row="0" col="2" v-if="partner.lastEventDate" class="p-x-15" :textWrap="true" fontSize="15%" verticalAlignment="bottom" :text="`${partner.lastEventTitle} - ${partner.lastEventDate}`"></label>
              <label row="1" col="2" v-if="partner.lastEventDate" class="p-x-15" fontSize="15%" verticalAlignment="bottom" :text="`R${partner.lastEventAmount}`"></label>
            </GridLayout>
          </Ripple>
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </page>
</template>

<script>
export default {
  name: "PartnersList",
  data() {
    return {
      option: {},
      partners: [],
      isLoading: false
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
      this.isLoading = true;
      this.$api
        .getPartners(this.businessId)
        .then(partners => {
          this.isLoading = false;
          this.partners = partners;
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