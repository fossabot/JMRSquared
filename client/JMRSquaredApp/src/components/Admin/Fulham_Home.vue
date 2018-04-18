<template>
  <page actionBarHidden="true" @loaded="pageLoaded">
    <TabView @tabChange="eventChanged($event)" id="bottomNav" :selectedIndex="currentTab" selectedIndexChanged="eventChanged()" selectedTabTextColor="$blueColor" androidSelectedTabHighlightColor="$blueDarkColor" tabBackgroundColor="transparent">
      <TabViewItem v-for="(tab,i) in tabs" :key="i" :iconSource="tab.icon">
        <StackLayout>
          <component :is="tab.view"></component>
        </StackLayout>
      </TabViewItem>
    </TabView>
  </page>
</template>

<script>
  const dialogs = require('ui/dialogs')
  import * as Toast from 'nativescript-toast';
  import TabView from 'ui/tab-view'
  
  import Students from './Fulham/Students.vue'
  import Notifications from './Fulham/Notifications.vue'
  import Transactions from './Fulham/Transactions.vue'
  import Stats from './Fulham/Stats.vue'
  
  import * as connectivity from "tns-core-modules/connectivity";
  export default {
    name: 'Fulham_HomeVue',
    components: {
      Students,
      Notifications,
      Transactions,
      Stats
    },
    data() {
      return {
        count: 20,
        currentTab: 0,
        isLoaded:false,
        tabs: [{
            text: 'Notifications',
            icon: 'res://ic_notifications_black_24dp',
            view: 'Notifications'
          }, {
            text: 'Students',
            icon: 'res://ic_people_black_24dp',
            view: 'Students'
          },
          {
            text: 'Transactions',
            icon: 'res://ic_receipt_black_24dp',
            view: 'Transactions'
          },
          {
            text: 'Stats',
            icon: 'res://ic_equalizer_black_24dp',
            view: 'Stats'
          }
        ]
      }
    },
    created() {
      if (!this.isLoaded) {
        this.pageLoaded();
      }
    },
    mounted() {
      if (!this.isLoaded) {
        this.pageLoaded();
      }
    },
    methods: {
      eventChanged(args) {
  
      },
      pageLoaded() {
        var connectionType = connectivity.getConnectionType();
        if (connectionType == connectivity.connectionType.none) {
          this.$feedback.warning({
            title: "NO INTERNET CONNECTION",
            duration: 4000,
            message: "Data loaded is not recent.",
          });
          this.isLoading = false;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/variables';
</style>