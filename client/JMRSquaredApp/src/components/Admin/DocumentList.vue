<template>
  <page class="page" @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout rows="auto" columns="auto,*,auto,auto" orientation="horizontal">
        <Ripple class="p-10" @tap="$router.back()" verticalAlignment="center" col="0" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-arrow-back' | fonticon"></Label>
        </Ripple>
        <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" text="Documents"></Label>
        <Ripple class="p-10" @tap="reportBug()" verticalAlignment="center" col="2" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-bug-report' | fonticon"></Label>
        </Ripple>
        <Ripple class="p-10" @tap="logOut()" verticalAlignment="center" col="3" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi text-light-red" fontSize="25%" :text="'mdi-power-settings-new' | fonticon"></Label>
        </Ripple>
      </GridLayout>
    </ActionBar>
    <GridLayout rows="auto,*" columns="*,auto">
      <SearchBar row="0" col="0" hint="Search ..." @submit="onSearchDocuments" @textChange="onSearchDocuments" v-model="searchText"></SearchBar>
      <Button row="0" col="1" @tap="uploadDocument()" class="">Upload</Button>
      <PullToRefresh row="1" col="0" colSpan="2" @refresh="refreshList($event)">
    <ListView columns="*" rows="auto" for="document in Documents">
              <v-template>
                <CardView row="0" margin="10" elevation="10" height="100%" width="97%" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                  <GridLayout backgroundColor="white" padding="10%" columns="auto,*,auto" rows="auto,auto,auto">
                    <Image row="0" rowSpan="3" col="0" borderWidth="5px" borderColor="$blueLightColor" stretch="aspectFill" :src="'res://' + document.thumbnail" width="70" height="70" />
                    <Label @tap="DocumentMenu(document)" borderRadius="50%" row="0" rowSpan="3" verticalAlignment="center" col="2" textAlignment="center" alignSelf="center" class="mdi h2" :text="'mdi-more-vert' | fonticon" color="$redColor"></Label>
                    <Label row="1" col="1" textAlignment="center" fontWeight="bold" :text="document.title" textWrap="true"></Label>
                    <Label row="2" col="1" textAlignment="center" textWrap="true" alignSelf="center" :text="document.description"></Label>
                  </GridLayout>
                </CardView>
              </v-template>
            </ListView>
      </PullToRefresh>
    </GridLayout>
  </page>
</template>

<script>
  const dialogs = require('ui/dialogs')
  
  var appSettings = require("application-settings");
  
  const http = require("http");
  export default {
    name: 'Documents',
    data() {
      return {
        searchText: '',
        isLoaded: false,
        Documents: []
      }
    },
    created() {
      if (!this.isLoaded) {
        this.pageLoaded();
      }
    },
    mounted() {
      if (!this.isLoaded) {
        this.pageLoaded();
      }
    },
    methods: {
      pageLoaded() {
        http.getJSON(this.$store.state.settings.baseLink + "/a/document/all").then((result) => {
          this.Documents = result;
        }).catch(err => {
          this.$feedback.error({
            title: "Error while loading documents",
            message: err,
          });
        });
      },
      refreshList(args) {
        var pullRefresh = args.object;
        http.getJSON(this.$store.state.settings.baseLink + "/a/document/all").then((result) => {
          this.Documents = result;
  
          pullRefresh.refreshing = false;
        }).catch(err => {
          this.$feedback.error({
            title: "Error while loading documents",
            message: err,
          });
          pullRefresh.refreshing = false;
        });
  
      },
      uploadDocument() {
  
  
        this.$feedback.info({
          title: 'Not Implemented',
          message: "This is not functional yet"
        });
        return;
        //TODO : Put on the functionality
  
        if (documentID == null) {
  
          var doc = this.$db.createDocument({
            "date": new Date(),
            "result": "result"
          });
  
          appSettings.setString("loginResponses", doc);
          dialogs.alert("Document did not existed , we created it " + doc);
        } else {
  
          this.$db.updateDocument(documentID, {
            "date": new Date(),
            "result": "result"
          });
  
          dialogs.alert("Document exists , " + documentID + " , we Updated");
          // console.log(self.$db.getDocument(documentID));
        }
  
        this.$showModal({
          template: `
                                      <Page>
                                        <ActionBar title="Detail"/>
                                        <StackLayout>
                                                    <CardView row="1" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50" elevation="60">
                                            <GridLayout class="m-15" rows="auto,auto,auto,auto,*,*" columns="*,*,*">
                                              <StackLayout row="0" col="0" colSpan="3" class="input-field m-t-10">
                                                <Label row="0" col="1" @tap="$modal.close" verticalAlignment="center" textAlignment="right" alignSelf="right" class="mdi h1" :text="'mdi-close' | fonticon" color="$redColor"></Label>
                                                <Label row="0" text="Uploaded by" col="0" class="label font-weight-bold m-b-5" />
                                                <Label row="0" :text="adminName" textAlignment="center" col="1" class="h3" />
                                                <StackLayout width="100%" class="hr-light"></StackLayout>
                                              </StackLayout>
                                              <StackLayout row="1" col="0" colSpan="3" class="input-field m-t-10">
                                                <Label text="Title" col="0" class="label font-weight-bold m-b-5" />
                                                <TextField v-model="title" class="m-r-30" hint="Document title..." returnKeyType="next" col="1"></TextField>
                                                <StackLayout width="100%" class="hr-light"></StackLayout>
                                              </StackLayout>
                                              <StackLayout row="2" col="0" colSpan="3" class="input-field m-t-10">
                                                <Label text="Description" col="0" class="label font-weight-bold m-b-5" />
                                                <TextView v-model="description" class="m-r-30" hint="Document description..." col="1"></TextView>
                                                <StackLayout width="100%" class="hr-light"></StackLayout>
                                              </StackLayout>
                                              <StackLayout row="3" col="0" colSpan="3" class="input-field m-t-10">
                                                <Label text="Type" col="0" class="label font-weight-bold m-b-5" />
                                                <ListPicker :items="types" v-model="selectedType" />
                                                <StackLayout width="100%" class="hr-light"></StackLayout>
                                              </StackLayout>
                                              <StackLayout row="4" col="1" verticalAlignment="center">
                                                <button @tap="pickFile()" selfAlign="center" textAlignment="center" text="Select File"></button>
                                              </StackLayout>
                                              <button row="5" @tap="submitDocument()" verticalAlignment="bottom" col="0" colSpan="3" width="100%" textAlignment="center" class="btn btn-active" text="Save Document"></button>
                                            </GridLayout>
                                          </CardView>        
                                        </StackLayout>
                                      </Page>
                                    `,
          data: function() {
            return {
              types: ['Lease Agreement', 'Invoice', 'Company Docs', 'Other'],
              selectedType: 0,
              adminName: 'Joe',
              title: '',
              description: '',
              file: ''
            }
          },
          methods: {
            pickFile() {
              this.file = "selectedFile";
            },
            submitDocument() {
              dialogs.alert(this.types[this.selectedType] + " " + this.adminName + " " + this.title + " " + this.description + " " + this.file).then(() => {
                console.log("This is it");
              });
            }
          }
        });
      },
      onSearchDocuments() {
        
      },
      DocumentMenu(document) {
        
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/variables';
</style>