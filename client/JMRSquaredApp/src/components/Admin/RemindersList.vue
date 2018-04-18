<template>
  <page class="page" @loaded="pageLoaded()">
        <ActionBar>
        <GridLayout rows="auto" columns="auto,*,auto,auto" orientation="horizontal">
            <Ripple @tap="$router.back()" verticalAlignment="center" col="0" rippleColor="$blueColor" borderRadius="50%">
                <Label verticalAlignment="center" class="mdi h2 p-15" :text="'mdi-arrow-back' | fonticon"></Label>
            </Ripple>
            <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" :text="'Home - ' + $store.state.user.userName"></Label>
            <Ripple @tap="reportBug()" verticalAlignment="center" class="p-15" col="2" rippleColor="$blueColor" borderRadius="50%">
                <Label verticalAlignment="center" class="mdi h2" :text="'mdi-bug-report' | fonticon"></Label>
            </Ripple>
            <Ripple verticalAlignment="center" class="p-15" @tap="logOut()" col="3" rippleColor="$blueColor" borderRadius="50%">
                <Label class="mdi h2 text-light-red" :text="'mdi-power-settings-new' | fonticon"></Label>
            </Ripple>
        </GridLayout>
    </ActionBar>
    <GridLayout rows="auto,*" columns="*">
      <SearchBar row="0" col="0" hint="Search ..." @submit="v" @textChange="onSearchReminders" v-model="searchText"></SearchBar>
      <ScrollView row="1" col="0">
        <StackLayout>
          <ListView for="task in Reminders">
            <v-template>
              <GridLayout backgroundColor="white" columns="auto,*,auto" rows="auto,auto,auto">
                <Label @tap="RemoveFeed(task)" row="0" col="2" textAlignment="center" alignSelf="center" class="mdi h2 text-light-red m-5" :text="'mdi-close' | fonticon"></Label>
                <StackLayout @tap="DoneFeed(task)" textAlignment="center" verticalAlignment="center" row="0" col="0" rowSpan="3">
                  <Label textAlignment="center" class="mdi h1 text-light-green" :text="'mdi-done' | fonticon"></Label>
                </StackLayout>
                <Label class="m-5" row="1" col="1" textAlignment="center" verticalAlignment="center" fontWeight="bold" :text="task.msg" textWrap="true"></Label>
                <Label class="m-5" row="2" col="2" textAlignment="right" alignSelf="right" :text="getMoment(task.dueDate).fromNow()"></Label>
              </GridLayout>
            </v-template>
          </ListView>
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </page>
</template>

<script>
  const dialogs = require('ui/dialogs')
  
  var appSettings = require("application-settings");
  
  export default {
    name: 'Reminders',
    data() {
      return {
        searchText: '',
        isLoaded:false
      }
    },
    computed: {
      Reminders: {
        get() {
          return this.$store.state.collections.tasks.all;
        }
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
      pageLoaded() {
  
      },
      onSearchReminders() {
        dialogs.alert("Searching for " + this.searchText).then(() => {
          console.log("Dialog closed")
        });
      },
      RemoveFeed(feed) {
        dialogs.confirm({
            title: 'Are you sure?',
            message: 'This feed will be removed permanently.',
            okButtonText: 'Yes',
            cancelButtonText: 'No'
          })
          .then(result => {
            if (result) {
              this.feeds.splice(this.feeds.indexOf(feed), 1);
              //TODO : Remove from DB as well.
            }
          })
      },
      DoneFeed(feed) {
        dialogs.confirm({
            title: 'Mark the task as done?',
            message: 'This feed will be removed permanently.',
            okButtonText: 'Yes',
            cancelButtonText: 'No'
          })
          .then(result => {
            if (result) {
              dialogs.alert("Task marked as done").then(() => {
                console.log("....")
              });
  
            }
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/variables';
</style>