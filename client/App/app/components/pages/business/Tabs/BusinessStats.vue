<template>
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
            <Label row="1" col="0" colSpan="3" fontSize="15%" verticalAlignment="center" textAlignment="center" class="text-white" :textWrap="true" text="Statistics"></Label>
          </GridLayout>
      </CardView>
        <Label row="1" verticalAlignment="center" textAlignment="center" text="Stats"></Label>
    </GridLayout>
</template>

<script>
const dialogs = require("ui/dialogs");
import application from "application";

export default {
  data() {
    return {
      isMainScreen: false,
      selectedScreen: "",
      cards: [
        {
          text: "new new 86",
          img: "",
          redirect: "/admin/fulham/home",
          type: "page"
        },
        {
          text: "Hot Cash",
          img: "",
          redirect: "/home",
          type: "page"
        }
      ]
    };
  },
  mounted() {
    console.log(application);
  },
  props: ["business"],
  methods: {
    switchPage(card) {
      dialogs.alert("Going to " + card.redirect).then(() => {
        console.log(card.redirect);
      });
      this.$router.push({
        path: card.redirect
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
