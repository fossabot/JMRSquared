<template>
  <page actionBarHidden="true" class="page">
    <FlexboxLayout v-if="!isMainScreen">
        <Label>This is the business stats</Label>
    </FlexboxLayout>
  </page>
</template>

<script>
  const dialogs = require('ui/dialogs')
  import application from 'application'

  export default {
    data() {
      return {
        isMainScreen: false,
        selectedScreen: '',
        cards: [{
            text: 'new new 86',
            img: '',
            redirect: '/admin/fulham/home',
            type: 'page'
          },
          {
            text: 'Hot Cash',
            img: '',
            redirect: '/home',
            type: 'page'
          }
        ]
      }
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
  }
</script>

<style lang="scss" scoped>
    @import '../../../assets/variables';
</style>
