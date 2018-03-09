<template>
    <TabView id="bottomNav" :selectedIndex="currentTab" selectedIndexChanged="eventChanged" :selectedTabChanged="()=>{dialogs.alert('Hello!').then(() => {console.log('Dialog closed')});}" selectedTabTextColor="#aa66cc" androidSelectedTabHighlightColor="#9933CC" tabBackgroundColor="transparent">
      <TabViewItem @tap="tapped" v-for="(tab,i) in tabs" :key="i" :title="tab.text">
          <StackLayout>
            <component :is="tab.view"></component>
          </StackLayout>
      </TabViewItem>
    </TabView>
</template>

<script>

const dialogs = require('ui/dialogs')
import TabView from 'ui/tab-view'

import Profile from './Profile.vue'
import Clubs from './Clubs.vue'
import Events from './Events.vue'
import LiquorStores from './LiquorStores.vue'

export default {
  components:{  Profile,Clubs,Events,LiquorStores },
  data() {
    return {
        count:20, 
        currentTab: 1,
        tabs: [{
            text: 'Profile',
            icon: 'profile',
            view:'Profile'
          },
          {
            text: 'Clubs',
            icon: 'clubs',
            view:'Clubs'
          },
          {
            text: 'Events',
            icon: 'events',
            view:'Events'
          },
          {
            text: 'Liquor',
            icon: 'liquor',
            view:'LiquorStores'
          }
      ]
    }
  },
  props: ['LoggedIn', 'User'],
  mounted() {
    dialogs.alert('Hello!').then(() => {
        console.log("Dialog closed")
      });
   
    // var tab = TabView.getViewById("bottomNav");

    // console.log(".............##########..............####### before #########...............###########");
    // console.log(" ");
    // console.log(" ");
    // console.log(JSON.stringify(tab));
    // console.log(" ");
    // console.log(" ");
    // console.log(".............##########..............####### after #########...............###########");

  },
  events:{
      eventChanged(event){
          dialogs.alert("This").then(()=>{
             console.log("Dialog closed")
          });
        this.currentTab =  2;
      },eventChanged(){
          dialogs.alert("This").then(()=>{
             console.log("Dialog closed")
          });
        this.currentTab =  2;
      }
  },
  methods: {
      tapped(){
        this.currentTab =  2;
        dialogs.alert("This").then(()=>{
             console.log("Dialog closed")
          });
      },
      clicked(value){
        //dialogs.alert("tapped " + value);
        this.tabs[0].text = "clicked " + value;
      },
      onChangeTab(args) {
       // dialogs.alert("args " + args);
        this.tabs[0].text = ".pop()";
      },
      onChangeTab() {
        this.tabs[0].text = ".. .pop()";
      },
      eventChanged(event){
          dialogs.alert("This").then(()=>{
             console.log("Dialog closed")
          });
        this.currentTab =  2;
      },eventChanged(){
          dialogs.alert("This").then(()=>{
             console.log("Dialog closed")
          });
        this.currentTab =  2;
      }
  }
}
</script>

<style scoped>
#bottomNav {
}
</style>
