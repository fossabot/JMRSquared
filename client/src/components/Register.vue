<template>
<page>
  <StackLayout class="form">
      <StackLayout class="input-field">
        <Label text="Option 2" class="label font-weight-bold m-b-5" />
        <TextField hint="Email Address" keyboardType="email" returnKeyType="next" autocorrect="false" autocapitalizationType="none"
                class="light hidden" ></TextField>
      
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>
      <GridLayout class="input-field input-sides" rows="auto, auto" columns="*,*">
        <Label text="Option 3" class="label font-weight-bold" row="0" col="0" />
        <TextField class="input right" row="0" col="1" />
        <StackLayout class="hr-light" row="1" colSpan="2"></StackLayout>
      </GridLayout>
  </StackLayout>
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
