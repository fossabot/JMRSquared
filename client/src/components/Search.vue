<template>
<page>
     <GridLayout rows="auto,*">
        <SearchBar row="0" hint="Search ..."></SearchBar>
        <ScrollView row="1">
          <Label text="Search results" textWrap="true" fontSize="200"></Label>
        </ScrollView>
      </GridLayout>
</page>
</template>

<script>
  export default {
    data() {
      return {
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
