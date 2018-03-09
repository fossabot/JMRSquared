<template>
<page 
      xmlns:Card="nativescript-cardview"
      actionBarHidden="true">
    <stack-layout columns="*,2*" rows="2*,3*,*,*" width="300" height="300">
    <label col="0" row="1">This is explore</label>
    <button col="1" row="0" @tap="$navigateBack">back</button>

    <!-- <CardView col="0" row="2" class="cardStyle" elevation="40" radius="8">
       <Label :text="text"></Label>
    </CardView>
    <Label  col="0" row="3" :text="text"></Label> -->
    </stack-layout>
  </page>
</template>

<script>
import dialogs from 'ui/dialogs'
  export default {
    name:'explore',
    data() {
      return {
        text:"The popo"
      }
    },
    created() {
    },
    methods: {
      
    }
  }
</script>

<style>

</style>
