const state = {
  notifications:{
    all:[],
    lastUpdated:null
  },
  transactions:{
    all:[],
    lastUpdated:null
  },
  documents:{
    all:[],
    lastUpdated:null
  },
  tasks:{
    all:[],
    lastUpdated:null
  },
  lastUpdated:null
};

const mutations = {
   PopulateNotifications(state,obj){
     state.notifications.all = obj.notifications;
     state.notifications.lastUpdated = Date.now();
   },
   PopulateTransactions(state,obj){
    state.transactions.all = obj.transactions;
    state.transactions.lastUpdated = Date.now();
   },
   PopulateTasks(state,obj){
    state.tasks.all = obj.tasks;
    state.tasks.lastUpdated = Date.now();
   }
 };

 const actions = {
  PopulateNotifications: ({commit,state},obj) => commit('PopulateNotifications',obj),
  PopulateTransactions: ({commit,state},obj) => commit('PopulateTransactions',obj),
  PopulateTasks: ({commit,state},obj) => commit('PopulateTasks',obj),
};

export default {
  state,
  mutations,
  actions
};
