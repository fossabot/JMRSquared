<template>
    <GridLayout rows="auto,*" columns="*">
      <CardView row="0" class="p-y-15 m-b-5" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
        <Ripple>
          <GridLayout rows="auto,auto" columns="auto,*,auto">
            <Ripple row="0" rowSpan="2" col="2" class="p-10" @tap="logOut()" textAlignmemt="left" verticalAlignment="center" borderRadius="50%">
              <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-dots-vertical' | fonticon"></Label>
            </Ripple>
            <Image v-if="business.logo" row="0" rowSpan="2" col="0" verticalAlignment="center" width="70" height="70" class="circle p-5" borderWidth="5px" borderColor="white" stretch="aspectFill" :src="business.logo" borderRadius="50%" />
            <Ripple v-if="!business.logo" row="0" rowSpan="2" col="0" borderWidth="5px" width="70" height="70" borderColor="white" verticalAlignment="center" borderRadius="50%">
              <Label verticalAlignment="center" textAlignment="center" class="mdi" fontSize="35%" :text="'mdi-image-filter-center-focus' | fonticon"></Label>
            </Ripple>
            <label row="0" col="0" colSpan="3" fontSize="20" verticalAlignment="bottom" textAlignment="center" class="font-weight-bold text-mute text-dark-blue" :text="business.name"></label>
            <Label row="1" col="0" colSpan="3" fontSize="15" verticalAlignment="center" textAlignment="center" :textWrap="true" text="Statistics"></Label>
          </GridLayout>
        </Ripple>
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
