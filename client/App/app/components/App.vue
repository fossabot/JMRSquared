<template>
  <GridLayout row="auto,*">
    <StackLayout row="0">
      <label textAlignment="center" text="Offline"></label>
    </StackLayout>
    <Navigator row="1" :defaultRoute="this.$router.current.userAuthLevel() != 3 ? currentPage : adminDashboard" />
  </GridLayout>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      currentPage: "/home",
      adminDashboard: "/admin/dashboard"
    };
  },
  beforeCreate() {
    this.$store.commit("refreshCache", {
      db: this.$db,
      api: this.$api,
      appSettings: this.appSettings,
      doc: "admin"
    });
  },
  mounted() {},
  methods: {}
};
</script>

<style>
</style>