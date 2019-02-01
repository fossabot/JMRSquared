const state = {
  tenantLoggedInString: 'reuygfdoijcufvibiydksgiesahlbowhofvoeighkibuowuthoeguisku',
  adminLoggedInString: 'j56herwgfassnytedmumnrbtnyjdtnbrsfvsbtrnyjehhtnwybtgvgtrr',
  BusinessesDBString: 'ewfrthyferthytnyjdtnbrsfvsbtrnthrwgeqfewbrnetmrfcvgfytgub',
  BusinessDBString: 'safvewfueiqwofweniubfwqnvbheirufwnokavlbebaulueainwvrveiuwvn',
  cachedAdmin: null,
  cachedTenant: null,
  cachedBusinesses: null,
  cachedFullBusiness: [],
  lastUpdated: null
};

const mutations = {
  refreshCache(state, obj) {
    console.log("Refresh cache for " + obj.doc);
    if (obj.doc == 'admin') {
      // Cached admin
      let documentID = obj.appSettings.getString(state.adminLoggedInString);
      if (documentID != null) {
        let user = obj.db.getDocument(documentID);
        state.cachedAdmin = user.result;
        state.lastUpdated = user.date;

        if (state.cachedAdmin.device_token != obj.appSettings.getString("device_token")) {
          state.cachedAdmin.device_token = obj.appSettings.getString("device_token");
          obj.api.addUserDeviceToken(state.cachedAdmin._id, state.cachedAdmin.device_token).then(response => {
            var statusCode = response.statusCode;
            if (statusCode != 200) {
              var error = response.content;
              throw new Error(error);
            }
          }).catch(err => {
            console.log("ADDTOKEN-error", err)
          });
        }
      }
    } else if (obj.doc == 'tenant') {
      // Cached tenant (TO BE REMOVED)
      let documentID = obj.appSettings.getString(state.tenantLoggedInString);
      if (documentID != null) {
        let user = obj.db.getDocument(documentID);
        state.cachedTenant = user.result;
        state.lastUpdated = user.date;
      }
    } else if (obj.doc == 'businesses') {
      // Cached businesses
      let documentID = obj.appSettings.getString(state.BusinessesDBString);
      if (documentID != null) {
        let businesses = obj.db.getDocument(documentID);
        state.cachedBusinesses = businesses.result;
        state.lastUpdated = businesses.date;
      }
    } else if (obj.doc == 'business') {
      // Cached businesses
      let documentID = obj.appSettings.getString(state.BusinessDBString);
      if (documentID != null) {
        let business = obj.db.getDocument(documentID);
        state.cachedFullBusiness = business.result;
        state.lastUpdated = business.date;
      }
    }
  },
  cacheFullBusiness(state, obj) {
    var cacheString = state.BusinessDBString;

    let documentID = obj.appSettings.getString(cacheString);
    if (documentID == null) {
      var doc = obj.db.createDocument({
        "date": new Date(),
        "result": [obj.business]
      });

      state.cachedFullBusiness = [obj.business];
      obj.appSettings.setString(cacheString, doc);
    } else {
      let business = obj.db.getDocument(documentID);
      business.result.push(obj.business);
      obj.db.updateDocument(documentID, {
        "date": new Date(),
        "result": business.result
      });
      console.log("Document exists (business) , " + documentID + " , we Updated");
      state.cachedFullBusiness = business.result;
    }

    state.lastUpdated = new Date();
  },
  cacheBusinesses(state, obj) {
    var cacheString = state.BusinessesDBString;

    let documentID = obj.appSettings.getString(cacheString);
    if (documentID == null) {
      var doc = obj.db.createDocument({
        "date": new Date(),
        "result": obj.businesses
      });

      obj.appSettings.setString(cacheString, doc);
    } else {
      obj.db.updateDocument(documentID, {
        "date": new Date(),
        "result": obj.businesses
      });
      console.log("Document exists (businesses) , " + documentID + " , we Updated");
    }
    state.cachedBusinesses = obj.businesses;
    state.lastUpdated = new Date();
  },
  cacheUser(state, obj) {
    var cacheString = obj.isAdmin ? state.adminLoggedInString : state.tenantLoggedInString;

    let documentID = obj.appSettings.getString(cacheString);
    if (obj.user.device_token != obj.appSettings.getString("device_token")) {
      obj.user.device_token = obj.appSettings.getString("device_token");
      obj.api.addUserDeviceToken(obj.user._id, obj.user.device_token).then(response => {
        var statusCode = response.statusCode;
        if (statusCode != 200) {
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