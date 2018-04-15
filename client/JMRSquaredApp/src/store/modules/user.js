var appSettings = require("application-settings");
const state = {
  userName: 'admin',
  id:'',
  pass: 'admin',
  email : 'admin@gmail.com',
  numbers : '0760487292',
  role:'admin',
  profilePic : null,
  isLoggedIn:false,
  isAdmin:false,
  cacheStrings:['loginResponse','studentsResponse']
};

const mutations = {
   login(state,user) {
    state.id = user.id;
    state.userName = user.userName;
    state.pass= user.pass;
    state.email = user.email;
    state.numbers = user.numbers;
    state.profilePic = user.profilePic;
    state.role = user.role;
    state.isLoggedIn= user.isLoggedIn;
    state.isAdmin = user.isAdmin;
   },
   logout (state,self) {

    for(var obj in state.cacheStrings){
      let documentID = appSettings.getString(obj);
  
      if (documentID != null) {
        var isDeleted = self.$db.deleteDocument(documentID);
        appSettings.remove(obj);
        console.log("Deleted ? " + isDeleted);
      }
    }

    state.id = null;
    state.userName = null;
    state.pass= null;
    state.email = null;
    state.numbers = null;
    state.profilePic = null;
    state.role = null;
    state.isLoggedIn = false;
    state.isAdmin = false;
   },
 };

const actions = {
   login: ({commit}) => commit('login'),
   logout: ({commit}) => commit('logout'),
 };

export default {
  state,
  mutations,
  actions,
};
