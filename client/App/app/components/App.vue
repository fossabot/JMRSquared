<template>
  <GridLayout rows="auto,*">
    <StackLayout row="0" class="bg-light-red" v-show="connectionType == 0">
      <label class="text-white p-5" fontSize="15" textAlignment="center" text="offline"></label>
    </StackLayout>
    <Navigator row="1" :defaultRoute="this.$router.current.userAuthLevel() != 3 ? currentPage : adminDashboard" />
  </GridLayout>
</template>

<script>
import * as connectivity from "tns-core-modules/connectivity";
export default {
  name: "App",
  data() {
    return {
      currentPage: "/home",
      adminDashboard: "/admin/dashboard",
      connectionType: null
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
  mounted() {
    connectivity.startMonitoring(conn => {
      if (this.connectionType == 0 && conn > 0) {
        this.$feedback.success({
          title: "Back online",
          message: "You are now online"
        });
      } else if (this.connectionType > 0 && conn == 0) {
        this.$feedback.warning({
          title: "You are offline",
          message: "Some features are not accessible offline"
        });
      }
      this.connectionType = conn;
    });
  },
  methods: {}
};
</script>

<style>
</style>