<template>
  <StackLayout>
    <GridLayout rows="auto,auto,*" columns="*">
      <CardView row="0">
        <Label class="text-dark-blue font-weight-bold m-10 h3" fontSize="25%" verticalAlignment="center" textAlignment="center" text="Corolla"></Label>
      </CardView>
      <Image width="200" height="200" row="1" src="https://content.linkedin.com/content/dam/brand/site/img/visual-guidelines.png" alignSelf="center" stretch="aspectFit" />
      <Fab row="2" icon="res://ic_edit_white_24dp" class="fab-button fixedBtn"></Fab>
      <ScrollView row="2">
        <StackLayout>
          <Label class="font-weight-bold m-10 h3" fontSize="20%" verticalAlignment="center" textAlignment="center" text="Taxify"></Label>
          <Label class="m-10" textWrap="true" verticalAlignment="center" textAlignment="center" text="Taxify byubbuysyaf asuyfbsayufvaufw qfyuvayusfbqw fyasbuf wqufuybsayfuv fqwuashyvfuafb wqufhysabfuh fwqyusvbusfwq"></Label>
          <CardView margin="15" radius="30" elevation="10">
            <Ripple>
              <StackLayout class="p-10">
                <label row="0" class="h3 font-weight-bold text-dark-blue" text="Partners"></label>
                <label :row="a" class="p-y-5 p-x-20" v-for="a in 4" :key="a" :text="`value ${a}`"></label>
              </StackLayout>
            </Ripple>
          </CardView>
          <CardView margin="15" radius="30" elevation="10">
            <Ripple>
              <StackLayout class="p-10">
                <label row="0" class="h3 font-weight-bold text-dark-blue" text="Expenses"></label>
                <label :row="a" class="p-y-5 p-x-20" v-for="a in 4" :key="a" :text="`value ${a}`"></label>
              </StackLayout>
            </Ripple>
          </CardView>
        </StackLayout>
      </ScrollView>
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
@import "../../../assets/variables";
.fixedBtn {
  position: fixed;
}
</style>
