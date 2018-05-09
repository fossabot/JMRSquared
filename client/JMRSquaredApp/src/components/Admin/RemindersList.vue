<template>
  <page class="page" @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout rows="auto" columns="auto,*,auto,auto" orientation="horizontal">
        <Ripple class="p-10" @tap="$router.back()" verticalAlignment="center" col="0" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-arrow-back' | fonticon"></Label>
        </Ripple>
        <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" text="Reminders"></Label>
        <Ripple class="p-10" @tap="reportBug()" verticalAlignment="center" col="2" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-bug-report' | fonticon"></Label>
        </Ripple>
        <Ripple class="p-10" @tap="logOut()" verticalAlignment="center" col="3" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi text-light-red" fontSize="25%" :text="'mdi-power-settings-new' | fonticon"></Label>
        </Ripple>
      </GridLayout>
    </ActionBar>
    <GridLayout rows="auto,*" columns="*">
       <ScrollView class="m-y-20" row="0" col="0"  orientation="horizontal">
        <StackLayout class="m-x-10" orientation="horizontal">
          <Ripple borderRadius="50%">
            <label text="Show " class="m-10"></label>
          </Ripple>
          <Ripple @tap="pageLoaded(true)" borderRadius="50%">
            <label text="my notifications only" :class="{'bottom-line-blue':mineOnly}" class="m-10"></label>
          </Ripple>
          <Ripple @tap="pageLoaded(false)" borderRadius="50%">
            <label text="all notifications" :class="{'bottom-line-blue':!mineOnly}" class="m-10"></label>
          </Ripple>
        </StackLayout>
      </ScrollView>
      <PullToRefresh row="1" col="0" @refresh="refreshList($event)">
            <ListView for="task in Reminders">
              <v-template>
                <GridLayout class="m-10 p-10" backgroundColor="white" columns="auto,*,auto" rows="auto,auto,auto">
                  <Label v-show="task.to != $store.state.user.userName" text="TO" row="0" col="0" verticalAlignment="center" textAlignment="center" class="text-muted t-10"></Label>
                  <Label v-show="task.to != $store.state.user.userName" :text="task.to" row="1" col="0"  textAlignment="center"  fontWeight="bold" class="text-mute t-12 text-dark-blue"></Label>
                  <Ripple v-show="task.from == $store.state.user.userName" @tap="RemoveFeed(task)" verticalAlignment="center" textAlignment="center" row="0" col="2" rowSpan="3">
                    <Label fontSize="25%" class="mdi text-light-red p-10" :text="'mdi-close' | fonticon"></Label>
                  </Ripple>
                  <Ripple v-show="task.to == $store.state.user.userName" @tap="DoneFeed(task)" verticalAlignment="center" textAlignment="center" row="0" col="0" rowSpan="3">
                   <Label fontSize="25%" class="mdi text-light-green p-10" :text="'mdi-done' | fonticon"></Label>
                  </Ripple>
                  <Label v-show="task.from != $store.state.user.userName" text="FROM" row="0" col="2" verticalAlignment="center" textAlignment="center" class="text-muted t-10"></Label>
                  <Label v-show="task.from != $store.state.user.userName" :text="task.from" row="1" col="2"  fontWeight="bold" textAlignment="center" class="text-mute t-12 text-dark-blue"></Label>
                 
                  <Label class="m-5" row="0" col="1" textAlignment="center" verticalAlignment="center" fontWeight="bold" :text="task.msg" textWrap="true"></Label>
                  <Label class="m-5" row="1" col="1" textAlignment="center" :text="getMoment(task.dueDate).fromNow()"></Label>
                </GridLayout>
              </v-template>
            </ListView>
    </PullToRefresh>
    </GridLayout>
  </page>
</template>

<script>
  const dialogs = require('ui/dialogs')
  
  var appSettings = require("application-settings");
  
  const http = require("http");
  export default {
    name: 'Reminders',
    data() {
      return {
        searchText: '',
        isLoaded: false,
        mineOnly:true,
        Reminders:[]
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
      pageLoaded(mineOnly = true) {
        this.mineOnly = mineOnly;
        if(this.mineOnly){
          http.getJSON(this.$store.state.settings.baseLink + "/n/tasks/all/" + this.$store.state.user.id).then((result) => {
            this.Reminders = result;
    
          }).catch(err => {
            this.$feedback.error({
              title: "Error while loading reminders",
              message: err,
            });
          });
        }else{
          http.getJSON(this.$store.state.settings.baseLink + "/n/tasks/all").then((result) => {
            this.Reminders = result;
    
          }).catch(err => {
            this.$feedback.error({
              title: "Error while loading reminders",
              message: err,
            });
          });
          
        }
      },
      refreshList(args) {
        var pullRefresh = args.object;
        if(this.mineOnly){
          http.getJSON(this.$store.state.settings.baseLink + "/n/tasks/all/" + this.$store.state.user.id).then((result) => {
            this.Reminders = result;
    
            pullRefresh.refreshing = false;
          }).catch(err => {
            this.$feedback.error({
              title: "Error while loading reminders",
              message: err,
            });
            pullRefresh.refreshing = false;
          });
        }else{
          http.getJSON(this.$store.state.settings.baseLink + "/n/tasks/all").then((result) => {
            this.Reminders = result;
    
            pullRefresh.refreshing = false;
          }).catch(err => {
            this.$feedback.error({
              title: "Error while loading reminders",
              message: err,
            });
            pullRefresh.refreshing = false;
          });
          
        }
        
  
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