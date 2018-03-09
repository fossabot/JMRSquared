<template>
<page>
  <stack-layout columns="*,2*" rows="2*,3*" width="300" height="300">
    <button col="1" row="0" @tap="$navigateBack">BACK</button>
  </stack-layout>
  </page>
</template>

<script>
import dialogs from 'ui/dialogs'
  export default {
    name:'register',
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
      
    }
  }
</script>

<style>

</style>
