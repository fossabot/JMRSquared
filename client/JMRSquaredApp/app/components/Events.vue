<template>
  <stack-layout columns="*,2*" rows="2*,3*" width="300" height="300">
    <Label class="text-primary" text="https://nativescript.org" @tap="taped">{{ Title }}</Label>
    <Label class="text-muted" :text="DateTimeStart"></Label>
    <Label class="text-danger" :text="PostedAt"></Label>
  </stack-layout>
</template>

<script>
import dialogs from 'ui/dialogs'
  export default {
    data() {
      return {
        Title:'the title',
        Img:'',
        LineUp:['','',''],
        Fee:0,
        Description:'',
        DateTimeStart:new Date(),
        DateTimeEnd:new Date(),
        PostedBy:new Object(),
        PostedAt:new Date(),
        Location:new Object()
      }
    },
    created() {
    },
    methods: {
      taped(){
        dialogs.alert("Tap");
      }
    }
  }
</script>

<style>

</style>
