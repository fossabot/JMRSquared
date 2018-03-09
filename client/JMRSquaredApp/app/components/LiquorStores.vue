<template>
  <stack-layout columns="*,2*" rows="2*,3*" width="300" height="300">
    <Label class="text-primary" text="https://nativescript.org" @tap="taped">{{ Title }}</Label>
    <Label class="text-muted" :text="DateTimeStart"></Label>
    <Label class="text-danger" :text="PostedAt"></Label>
  </stack-layout>
</template>

<script>
  export default {
    data() {
      return {
        title:"This is the title"
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
