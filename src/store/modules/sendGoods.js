import Vue from 'vue'

const sendGoods={
  state: {
   sendGoodList:undefined,
    selectCarlist:undefined,
    sendGoodSuccess:undefined,
    sendGoodAgain:undefined
  },
  mutations:{
    SET_SEND_GOOD_LIST(state,obj){
      state.sendGoodList=obj
    },
    SET_SELECT_CAR_LIST(state,obj){
       state.selectCarlist=obj
    },
    SET_SEND_GOOD_SUCCESS(state,obj){
      state.sendGoodSuccess=obj
    },
    SET_SEND_GOOD_AGAIN(state,obj){
      state.sendGoodAgain=obj
    },
    SET_SEND_GOOD_PAYSTATE(state,obj){
      state.sendGoodSuccess.payStatus=obj
    },
  },
  actions:{
    setSendGoodList({commit},obj){
      commit('SET_SEND_GOOD_LIST',obj)
    },
    setSelectCarlist({commit},obj){
      commit('SET_SELECT_CAR_LIST',obj)
    },
    setSendGoodSuccess({commit},obj){
      commit('SET_SEND_GOOD_SUCCESS',obj)
    },
    sendGoodAgain({commit},obj){
      commit('SET_SEND_GOOD_AGAIN',obj)
    },
    setSendGoodpayStatus({commit},obj){
      commit('SET_SEND_GOOD_PAYSTATE',obj)
    },
  },
  getters:{
    sendGoodList:state=>state.sendGoodList,
    selectCarlist:state=>state.selectCarlist,
    sendGoodSuccess:state=>state.sendGoodSuccess,
    sendGoodAgain:state=>state.sendGoodAgain
  }
}
export default sendGoods;