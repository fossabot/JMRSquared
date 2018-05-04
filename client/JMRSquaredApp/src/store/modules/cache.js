const state = {
  tenantLoggedInString:'reuygfdoijcufvibiydksgiesahlbowhofvoeighkibuowuthoeguisku',
  adminLoggedInString:'j56herwgfassnytedmumnrbtnyjdtnbrsfvsbtrnyjehhtnwybtgvgtrr',
  cachedAdmin:null,
  cachedTenant:null,
  lastUpdated:null
};

const mutations = {
   refreshCache(state,obj){
    let documentID = obj.appSettings.getString(state.adminLoggedInString);
    
    if (documentID != null) {
        var user = obj.db.getDocument(documentID);
        state.cachedAdmin = user.result;
    }

    documentID = obj.appSettings.getString(state.tenantLoggedInString);

    if (documentID != null) {
        var user = obj.db.getDocument(documentID);
        state.cachedTenant = user.result;
    }
   
   },
   cacheUser(state,obj){
    var cacheString = obj.isAdmin ? state.adminLoggedInString : state.tenantLoggedInString;
    
    let documentID = obj.appSettings.getString(cacheString);
    
    if (documentID == null) {
      var doc = obj.db.createDocument({
        "date": new Date(),
        "result": obj.user
      });

      obj.appSettings.setString(cacheString, doc);
    } else {

      obj.db.updateDocument(documentID, {
        "date": new Date(),
        "result": obj.user
      });
      console.log("Document exists , " + documentID + " , we Updated");
    }

    if(obj.isAdmin){
      state.cachedAdmin = obj.user;
    }else{
      state.cachedTenant = obj.user;
    }
    
  }
 };

 const actions = {
  
};

export default {
  state,
  mutations,
  actions
};
