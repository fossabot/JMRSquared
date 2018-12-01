<template>
  <StackLayout>
    <ScrollView>
      <GridLayout rows="auto,*" columns="*">
        <Image height="200" row="0" :src="business.logo ? business.logo : 'https://content.linkedin.com/content/dam/brand/site/img/visual-guidelines.png'" alignSelf="center" stretch="aspectFit" />
        <StackLayout row="1">
          <Label class="font-weight-bold m-10 h3" fontSize="25%" verticalAlignment="center" textAlignment="center" :text="business.name"></Label>
          <Label class="m-10" textWrap="true" verticalAlignment="center" textAlignment="center" :text="business.description"></Label>
          <Fab icon="res://ic_add_white_24dp" class="fab-button fixedBtn"></Fab>
          <CardView margin="10" elevation="5">
            <StackLayout>
              <Ripple v-for="(option,i) in options" :key="i" @tap="GoTo(option)">
                <GridLayout class="p-10" rows="auto,auto" columns="auto,*">
                  <Label row="0" rowSpan="2" col="0" fontSize="25%" verticalAlignment="center" borderRadius="50%" textAlignment="center" class="h2 mdi" :text="'mdi-' + option.icon | fonticon"></Label>
                  <label row="0" col="1" class="p-x-15 h3 font-weight-bold" :text="option.title"></label>
                  <label row="1" col="1" class="p-x-15 h4" :text="option.text"></label>
                </GridLayout>
              </Ripple>
            </StackLayout>
          </CardView>
        </StackLayout>
      </GridLayout>
    </ScrollView>
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
      options: []
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
      title: "Expences",
      text: `Expences of the business`,
      link: "",
      icon: "trending-down"
    });
  },
  props: ["business"],
  methods: {
    GoTo(option) {
      if (option.link) {
        this.navigate(option.link, option.props);
      }
    },
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
.fixedBtn {
  position: fixed;
}
</style>
