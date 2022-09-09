<template lang="pug">
  div.edit-pay-modal
    a-modal(
      :visible="showCustomerServiceModal()",
      :confirmLoading="confirmLoading"
      :closable="false"
      :maskClosable="false"
       width="400px"
      :footer="null"
      :bodyStyle="{padding:'0px'}"
      )
      div.modal-header
        span 客服信息
        a-icon(
        :component="close"
        style="font-size:22px;float: right"
        @click="showCustomerService(false)"
        )
      div.cus-modal-content
        div.cus-modal-content-item
          span 如有任何疑问，请联系客服
        div.cus-modal-content-item(style="margin-top:20px")
          img(src="@assets/common/mobile.png" style="width:30px;height:30px")
          span(style="margin-left:20px") {{info.mobile?info.mobile:"暂无客服电话"}}
        div.cus-modal-content-item
          img(src="@assets/common/qq.png" style="width:30px;height:30px")
          span(style="margin-left:20px;text-decoration:underline;cursor:pointer" @click="openQQ()") {{info.qq?info.qq:"暂时无客服QQ"}}
      div(style="font-size:15px;display:flex;flex-direction: row;border-top:1px solid rgba(214, 214, 214, 1)")
          div(
            style="border-right:1px solid rgba(214, 214, 214, 1)"
            @click="showCustomerService(false)"
            ).bottom-btn
            span 返回

</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import close from '@/assets/yard/closeWin.svg?inline'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import ARow from 'ant-design-vue/es/grid/Row'
import { sendSms } from '../../api/retrieve_pwd'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import {getCustomerService} from '@api/common'
export default {
  name: 'EditModal',
  components: { ATextarea, ARow, AFormItem },
  data(){
    return {
      confirmLoading:false,
      close,
      info:{
        mobile:'18092181700',
        qq:'1415032321'
      }
    }
  },
  methods:{
    ...mapGetters(['showCustomerServiceModal','userInfo']),
    ...mapActions(['showCustomerService']),
    init(){

    },
    handleCancel(){

    },
    openQQ() {
      window.open('http://wpa.qq.com/msgrd?v=3&uin='+this.info.qq+'&site=qq&menu=yes','_brank');
    },

    getData(){
      // getCustomerService().then(res=>{
      //   if(res.code==200){
      //     if(res.data.length>0){
      //       this.info=res.data[0]
      //     }else{

      //     }
      //   }else{
      //     this.$message.warning(res.message);
      //   }

      // }).catch(e=>{
      //   console.error(e)
      //   this.$message.error("网络错误");
      // })
    }

  },
  destroyed(){
    if(this.sendCode){
      clearInterval(this.sendCode);
    }
  },
  created () {
    this.init();
    this.getData();

  }
}
</script>

<style scoped lang="less">
.modal-header{

  width: 100%;

  background-color: white;
  padding: 20px;
  font-size: 18px;
  float: right;
  line-height: 30px;
  vertical-align: center;
  span{
    border-bottom:5px solid rgba(89, 201, 96, 1);
  }
}
.cus-modal-content{
    padding: 20px;
  margin-top: 20px;
  }
.cus-modal-content-item{
  margin-bottom: 10px;
}
  .bottom-btn{
    width:100%;
    text-align:center;
    height:40px;
    line-height:40px;
    vertical-align:center
  }
</style>