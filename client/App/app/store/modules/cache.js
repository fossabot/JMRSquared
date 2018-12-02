const state = {
  tenantLoggedInString: 'reuygfdoijcufvibiydksgiesahlbowhofvoeighkibuowuthoeguisku',
  adminLoggedInString: 'j56herwgfassnytedmumnrbtnyjdtnbrsfvsbtrnyjehhtnwybtgvgtrr',
  cachedAdmin: null,
  cachedTenant: null,
  lastUpdated: null
};

const mutations = {
  refreshCache(state, obj) {
    let documentID = obj.appSettings.getString(state.adminLoggedInString);

    if (documentID != null) {
      let user = obj.db.getDocument(documentID);
      state.cachedAdmin = user.result;
      state.lastUpdated = user.date;
    }

    documentID = obj.appSettings.getString(state.tenantLoggedInString);

    if (documentID != null) {
      let user = obj.db.getDocument(documentID);
      state.cachedTenant = user.result;
      state.lastUpdated = user.date;
    }

  },
  cacheUser(state, obj) {
    var cacheString = obj.isAdmin ? state.adminLoggedInString : state.tenantLoggedInString;

    let documentID = obj.appSettings.getString(cacheString);
    if (obj.user.device_token != obj.appSettings.getString("device_token")) {
      obj.user.device_token = obj.appSettings.getString("device_token");
      console.log("ADDTOKEN-request", obj.user._id);
      console.log("ADDTOKEN-request-token", obj.user.device_token);
      obj.api.addUserDeviceToken(obj.user._id, obj.user.device_token).then(response => {
        var statusCode = response.statusCode;
        if (statusCode == 200) {
          console.log("ADDTOKEN-success", response)
        } else {
          var error = response.content;
          throw new Error(error);
        }
      }).catch(err => {
        console.log("ADDTOKEN-error", err)
      });
    }

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

    if (obj.isAdmin) {
      state.cachedAdmin = obj.user;
      state.lastUpdated = new Date();
    } else {
      state.cachedTenant = obj.user;
      state.lastUpdated = new Date();
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