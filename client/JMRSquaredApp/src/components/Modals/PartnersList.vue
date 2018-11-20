<template>
  <page actionBarHidden="true">
  <StackLayout backgroundColor="white">
    <Label class="h2 m-15 p-15" textAlignment="center" :text="`All partners of ${businessName}`"></Label>
    <Ripple class="m-15 p-15" @tap="GoToPage(`/business/add/partner/${businessId}/${businessName}`)">
      <GridLayout padding="2%" columns="auto,*,auto" rows="auto,auto,auto">
        <Label row="0" rowSpan="3" col="0" fontSize="25%" verticalAlignment="center" borderRadius="50%" textAlignment="center" class="h2 mdi" :text="'mdi-add' | fonticon"></Label>
        <Label row="0" col="1" textAlignment="center" class="h2" text="Add new partner"></Label>
        <Label row="1" col="1" textAlignment="center" :text="`Assign a new worker to ${businessName}`"></Label>
      </GridLayout>
    </Ripple>
    <ScrollView>
      <StackLayout>
        <Ripple class="m-15" v-for="a in 20" :key="a">
          <GridLayout padding="2%" columns="auto,*,auto" rows="auto,auto,auto">
            <Image row="0" rowSpan="3" col="0" borderWidth="5px" borderColor="$blueLightColor" stretch="aspectFill" :src="$store.state.settings.defaultProfilePic" width="70" height="70" borderRadius="50%" />
            <Label row="0" col="1" textAlignment="center" class="h2" text="student.username"></Label>
            <Label row="1" col="1" textAlignment="center" text="student.email"></Label>
            <Label row="2" col="1" textAlignment="center" text="'Room : ' + student.room"></Label>
            <Label row="2" col="2" textAlignment="center" verticalAlignment="center" text="Paid"></Label>
          </GridLayout>
        </Ripple>
      </StackLayout>
    </ScrollView>
  </StackLayout>
  </page>
</template>

<script>
export default {
  name: "PartnersList",
  data() {
    return {};
  },
  mounted() {
    this.businessId = this.$route.params["businessID"];
    this.businessName = this.$route.params["businessName"];
  },
  props: ["businessName", "businessId"],
  methods: {
    GoToPage(link) {
      this.$router.push(link);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/variables";
</style>