<template>
  <StackLayout backgroundColor="white">
    <Label row="0" class="h2 m-15" textAlignment="center" :text="`All partners of ${businessName}`"></Label>
    <ScrollView>
              <StackLayout>                     
          <Ripple class="m-x-15" v-for="a in 20" :key="a">
          <GridLayout padding="2%" columns="auto,*,auto" rows="auto,auto,auto">
            <Image row="0" rowSpan="3" col="0" borderWidth="5px" borderColor="$blueLightColor" stretch="aspectFill" :src="$store.state.settings.defaultProfilePic" width="70" height="70"
                borderRadius="50%" />
            <Label row="0" col="1" textAlignment="center" class="h2" text="student.username"></Label>
            <Label row="1" col="1" textAlignment="center" text="student.email"></Label>
            <Label row="2" col="1" textAlignment="center" text="'Room : ' + student.room"></Label>
            <Label row="2" col="2" textAlignment="center" verticalAlignment="center" text="Paid"></Label>
          </GridLayout>
          </Ripple>
          </StackLayout>
      </ScrollView>
    </StackLayout>
</template>

<script>

export default {
  name: "PartnersList",
  data() {
    return {};
  },
  props:[
    'businessName'
  ],
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/variables";
</style>