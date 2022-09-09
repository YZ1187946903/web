import Vue from 'vue'
const modal={
  state:{
    showEditPayPwdModal:false,
    showEditPasswordModal:false,
    showOpinionModal:false,
    showCustomerServiceModal:false
  },
  mutations:{
    SET_EDIT_PAY_PWD_MODAL(state,isShow){
      state.showEditPayPwdModal=isShow
    },
    SET_EDIT_PASSWORD_MODAL(state,isShow){
      state.showEditPasswordModal=isShow
    },
    SET_OPINION_MODAL(state,isShow){
      state.showOpinionModal=isShow
    },
    SET_SHOW_CUSTOMER_SERVICE_MODAL(state,isShow){
      state.showCustomerServiceModal=isShow
    }
  },
  actions:{
    showPayPwd({commit},isShow){
      console.log("进来了")
      commit('SET_EDIT_PAY_PWD_MODAL',isShow)
    },
    showPassword({commit},isShow){
      commit('SET_EDIT_PASSWORD_MODAL',isShow)
    },
    showOpinion({commit},isShow){
      commit('SET_OPINION_MODAL',isShow)
    },
    showCustomerService({commit},isShow){
      commit('SET_SHOW_CUSTOMER_SERVICE_MODAL',isShow)
    }

  }
}
export default modal