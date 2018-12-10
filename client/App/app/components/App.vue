<template>
    <Navigator :defaultRoute="this.$router.current.userAuthLevel() != 3 ? currentPage : adminDashboard"/>
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