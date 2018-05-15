<template>
  <ScrollView orientation="vertical">
   <StackLayout orientation="vertical">
       <GridLayout v-for="(club,i) in clubs" :key="i"  padding="2%" className="card card-4" alignSelf="center" columns="*" rows="*,*,*">
              <Label col="1" row="1" colSpan="1" rowSpan="2" textWrap="true" className="card card-4">
                <FormattedString>
                  <Span row="1" :text="club.Name"  fontWeight="bold"  className="card-4"/>
                  <Span row="2" text=" in " />
                  <Span row="2" :text="club.Location" style="color:blue" />
                </FormattedString>
              </Label>
            </GridLayout>
    </StackLayout>
 </ScrollView>
</template>

<script>
  const dialogs = require('ui/dialogs');

  export default {
    data() {
      return {
        clubs:[
          {
            Name:"Stones",
            GeneralEntranceFee:"R200",
            Rating:5,
            Reviews:[
              "Very dirty",
              "Clean as hell"
            ],
            OpenTime:'08:30',
            CloseTime:'19:00',
            Location:'Melville'
          },{
            Name:"Stones",
            GeneralEntranceFee:"R200",
            Rating:5,
            Reviews:[
              "Very dirty",
              "Clean as hell"
            ],
            OpenTime:'08:30',
            CloseTime:'19:00',
            Location:'New Town'
          },{
            Name:"Tshikorokoroni",
            GeneralEntranceFee:"R200",
            Rating:5,
            Reviews:[
              "Very dirty",
              "Clean as hell"
            ],
            OpenTime:'08:30',
            CloseTime:'19:00',
            Location:'Melville'
          },{
            Name:"Stones",
            GeneralEntranceFee:"R200",
            Rating:5,
            Reviews:[
              "Very dirty",
              "Clean as hell"
            ],
            OpenTime:'08:30',
            CloseTime:'19:00',
            Location:'Zimbabwe'
          },{
            Name:"Stones",
            GeneralEntranceFee:"R200",
            Rating:5,
            Reviews:[
              "Very dirty",
              "Clean as hell"
            ],
            OpenTime:'08:30',
            CloseTime:'19:00',
            Location:'Melville'
          }
        ]
      }
    },
    mounted() {
    //  dialogs.alert("Started clubs").then(()=>{ console.log("asfsafasf")});
    },
    methods: {
    }
  }
</script>

<style>

.cardStyle {
    background-color: #3489db;
    color: #fff;
}

  .card {
      border-radius: 2px;
      margin: 1rem;
    }
    
    .card-1 {
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }
    
    .card-1:hover {
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
    
    .card-2 {
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
    
    .card-3 {
      box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    }
    
    .card-4 {
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
    
    .card-5 {
      box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
    }
</style>
