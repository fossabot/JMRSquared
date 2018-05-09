<template>
  <page @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout rows="auto" columns="auto,*,auto" orientation="horizontal">
        <Ripple class="p-10" @tap="$router.back()" verticalAlignment="center" col="0" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-arrow-back' | fonticon"></Label>
        </Ripple>
        <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" text="Explore"></Label>
        <Ripple class="p-10" @tap="reportBug()" verticalAlignment="center" col="2" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-bug-report' | fonticon"></Label>
        </Ripple>
      </GridLayout>
    </ActionBar>
    <StackLayout>
      <StackLayout class="p-y-20" alignSelf="center" width="100%">
        <FlexboxLayout flexDirection="column">
          <GridLayout columns="auto" rows="auto" justifyContent="center">
            <Image src="~/images/logo/JMRSQUARED-blue.png" row="0" col="0" width="100%" alignSelf="center" stretch="aspectFit" />
          </GridLayout>
        </FlexboxLayout>
      </StackLayout>
      <GridLayout class="m-20" rows="*,*" columns="*,*,*">
        <StackLayout :row="item.row" :col="item.col" :key="i" v-for="(item,i) in layouts">
          <CardView radius="50" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20" width="60" height="60">
            <Ripple @tap="onItemTap(item)" rippleColor="$blueColor" borderRadius="50%" width="60" height="60">
              <Label class="mdi" textAlignment="center" fontSize="30%" verticalAlignment="center" :text="'mdi-' + item.icon | fonticon"></Label>
            </Ripple>
          </CardView>
          <Label class="p-t-10" textWrap="true" :text="item.title" textAlignment="center" />
        </StackLayout>
      </GridLayout>
    </StackLayout>
  </page>
</template>

<script>
  const dialogs = require('ui/dialogs')
  import * as Toast from "nativescript-toast";
  
  var appSettings = require("application-settings");
  
  export default {
    data() {
      return {
        layouts: [{
            id: "housemates",
            icon: "people",
            title: "House mates",
            row: 0,
            col: 0
          },
          {
            id: "notifications",
            icon: "notifications",
            title: "Notifications",
            row: 0,
            col: 1
          },
          {
            id: "rent",
            icon: "attach-money",
            title: "Rent",
            row: 0,
            col: 2
          },
          {
            id: "lease",
            icon: "library-books",
            title: "Lease Agreement",
            row: 1,
            col: 0
          },
          {
            id: "info",
            icon: "info",
            title: "Info and help",
            row: 1,
            col: 1
          },
          {
            id: "proofOfResidence",
            icon: "assignment",
            title: "Proof Of Residence",
            row: 1,
            col: 2
          },
        ],
        isLoaded: false
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
      eventChanged(event) {
        dialogs.alert("Changed view").then(() => {
          console.log("This is it")
        });
      },
      switchPage(card) {
        dialogs.alert("Going to " + card.redirect).then(() => {
          console.log(card.redirect);
        });
        this.$router.push({
          path: card.redirect
        });
      },
      onItemTap(item) {
        if (item.id == 'housemates') {
          this.$router.push('/admin/fulham/students');
        } else if (item.id == 'documents') {
          this.$router.push('/admin/documents');
        } else if (item.id == 'reminders') {
          this.$router.push('/admin/reminders');
        } else {
          dialogs.alert("Not yet assigned").then(() => {
            console.log("card.redirect");
          });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/variables';
</style>
