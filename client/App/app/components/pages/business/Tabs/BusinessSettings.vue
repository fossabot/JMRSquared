<template>
  <StackLayout>
    <GridLayout rows="auto,*" columns="*">
      <CardView class="m-b-5" row="0" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
          <GridLayout class="bg-dark-blue p-5" rows="auto,auto" columns="auto,*,auto">
             <Ripple rowSpan="2" @tap="navigate(null)" verticalAlignment="center" borderRadius="50%">
            <Label verticalAlignment="center" textAlignment="center" class="mdi text-white" fontSize="25%" :text="'mdi-arrow-left' | fonticon"></Label>
          </Ripple>
            <Image v-if="business.logo" row="0" rowSpan="2" col="2" verticalAlignment="center" width="70" height="70" class="circle p-5" stretch="aspectFill" :src="business.logo" borderRadius="50%" />
            <Ripple v-if="!business.logo" row="0" rowSpan="2" col="2" width="70" height="70" verticalAlignment="center" borderRadius="50%">
              <Label verticalAlignment="center" textAlignment="center" class="mdi" fontSize="35%" :text="'mdi-image-filter-center-focus' | fonticon"></Label>
            </Ripple>
            <label row="0" col="0" colSpan="3" fontSize="18%" verticalAlignment="bottom" textAlignment="center" class="font-weight-bold text-white text-mute" :text="business.name"></label>
            <Label row="1" col="0" colSpan="3" fontSize="15%" verticalAlignment="center" textAlignment="center" class="text-white" :textWrap="true" text="Settings"></Label>
          </GridLayout>
      </CardView>
      <CardView row="1" margin="10" elevation="5">
        <ScrollView>
          <StackLayout>
            <Ripple v-for="(option,i) in options" :key="i" @tap="GoTo(option)">
              <GridLayout class="p-10" rows="auto,auto" columns="auto,*">
                <Label row="0" rowSpan="2" col="0" fontSize="25%" verticalAlignment="center" borderRadius="50%" textAlignment="center" class="h2 mdi" :text="'mdi-' + option.icon | fonticon"></Label>
                <label row="0" col="1" class="p-x-15 h3 font-weight-bold" :text="option.title"></label>
                <label row="1" col="1" class="p-x-15 h4" :text="option.text"></label>
              </GridLayout>
            </Ripple>
            <StackLayout v-if="business.type.optionals.length > 0" width="100%" class="hr-light"></StackLayout>
            <GridLayout v-if="business.type.optionals.length > 0" class="m-10" rows="auto" columns="*,auto">
              <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Optionals"></label>
            </GridLayout>
  
            <GridLayout v-for="(optional,i) in business.type.optionals" :key="i" class="m-10" rows="auto,auto" columns="auto,*">
              <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-' + optional.icon | fonticon"></label>
              <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="optional.title"></label>
              <label :text="optional.answer" row="1" col="1" class="h4"></label>
            </GridLayout>
  
            <StackLayout v-if="business.settings.length > 0" width="100%" class="hr-light"></StackLayout>
            <GridLayout v-if="business.settings.length > 0" class="m-10" rows="auto" columns="*,auto">
              <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Settings"></label>
            </GridLayout>
            <GridLayout class="m-10" rows="auto,auto" columns="auto,*,auto" v-for="(setting,i) in business.settings" :key="i">
              <Label row="0" rowSpan="2" col="0" fontSize="25%" verticalAlignment="center" borderRadius="50%" textAlignment="center" class="h2 mdi" :text="'mdi-' + setting.icon | fonticon"></Label>
              <label row="0" col="1" class="p-x-15 h3 font-weight-bold text-mute" :text="setting.title"></label>
              <label row="1" col="1" :textWrap="true" class="p-x-15 h4 text-mute" :text="setting.description"></label>
              <switch row="0" rowSpan="2" col="2" @checkedChange="changeSetting($event,setting.value,setting._id)" :checked="setting.value"></switch>
            </GridLayout>
          </StackLayout>
        </ScrollView>
      </CardView>
    </GridLayout>
  </StackLayout>
</template>

<script>
const dialogs = require("ui/dialogs");
import application from "application";

export default {
  data() {
    return {
      isMainScreen: false,
      selectedScreen: "",
      options: [],
      businessSettings: {
        evidenceRequired: false
      }
    };
  },
  mounted() {
    this.options.push({
      title: "Partners",
      text: `List of ${this.business.name} partners`,
      link: `/business/partners/list`,
      props: {
        businessId: this.business._id,
        businessName: this.business.name
      },
      icon: "worker"
    });
    this.options.push({
      title: "Expenses",
      text: `Expenses of the business`,
      link: `/business/expenses/list`,
      props: {
        businessId: this.business._id,
        businessName: this.business.name
      },
      icon: "trending-down"
    });

    this.options.push({
      title: "Income",
      text: `Income streams of the business`,
      link: `/business/income/list`,
      props: {
        businessId: this.business._id,
        businessName: this.business.name
      },
      icon: "trending-up"
    });
  },
  props: ["business"],
  methods: {
    changeSetting(event, value, settingsID) {
      console.log("event", event.value);
      console.log("value", value);
      if (event.value != value) {
        this.$api
          .changeBusinessSettings(this.business._id, settingsID, event.value)
          .then(changedBusinessSettings => {
            this.$feedback.success({
              title: "Your changes are saved."
            });
          })
          .catch(err => {
            this.$feedback.error({
              title: "Unable to save your change.",
              duration: 4000,
              message: "You have to be connected to the internet"
            });
          });
      }
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
.fixedBtn {
  position: fixed;
}
</style>
