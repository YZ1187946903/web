<template lang="pug">
  div.edit-pay-modal
    a-modal(
      :visible="showEditPayPassword()",
      :confirmLoading="confirmLoading"
      :closable="false"
      :maskClosable="false"
       width="400px"
      :footer="null"
      :bodyStyle="{padding:'0px'}"
      )
      div.modal-header

        span 修改支付密码
        a-icon(
        :component="close"
        style="font-size:22px;float: right"
        @click="closeWin"
        )
      div.cus-modal-content
        div.cus-modal-content-item
          span 手机号
          a-input(
              placeholder="请输入手机号",
              disabled,
              v-model="userModal.mobile",
              style="margin-top:10px"
            )
        div.cus-modal-content-item
          span 验证码
          br
          a-input(
            placeholder="请输入验证码",
            v-model="userModal.vcode",
            style="margin-top:10px;width:71%"
          )
          a-button(
            type="primary",
            style="margin-left:10px;width:26%;align-item:center"
            @click="sendSms"
          :disabled="isSend"
          )
            span {{sendText}}
        div.cus-modal-content-item
            span 输入密码
            a-input(
              placeholder="请输入密码",
              type="password",
              style="margin-top:10px",
            v-model="userModal.password"
            )
        div.cus-modal-content-item
          span 再次输入密码
          a-input(
            placeholder="请输入密码",
            type="password",
          v-model="userModal.cofpassword",
            style="margin-top:10px"
          )
      div(style="font-size:15px;display:flex;flex-direction: row;border-top:1px solid rgba(214, 214, 214, 1)")
          div(
            style="border-right:1px solid rgba(214, 214, 214, 1)"
            @click="closeWin"
            ).bottom-btn
            span 返回
          div(style="color:rgba(89, 201, 96, 1)",@click="handlerSubmit").bottom-btn
            span 提交
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import close from '@/assets/yard/closeWin.svg?inline'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import ARow from 'ant-design-vue/es/grid/Row'
import { sendSms } from '../../api/retrieve_pwd'
import {editPayPassword}from '@api/edit_pay_pwd_modal'
export default {
  name: 'EditModal',
  components: { ARow, AFormItem },
  data(){
    return {
      confirmLoading:false,
      close,
      userModal:{
        mobile:'',
        vcode:'',
        password:'',
        cofpassword:'',

      },
      isSend:false,
      sendText:"发送验证码",
      sendCode:undefined
    }
  },
  methods:{
    ...mapGetters(['showEditPayPassword','userInfo']),
    ...mapActions(['showPayPwd']),
    init(){

    },
    sendSms(){
      let sendNum=60;
      this.isSend=true;
      this.sendCode=setInterval(()=>{
        if(sendNum>1){
          sendNum=sendNum-1;
          this.sendText=`${sendNum}秒重试`;
        }else{
          this.sendText="发送验证码"
          this.isSend=false;
          clearInterval(this.sendCode);
          this.sendCode=undefined;
        }

      },1000);
      let sendData = {
        mobileNum: this.userModal.mobile,
        smsTpye: 0,
        regType: 0,
        tempId: 1
      };
      sendSms(sendData).then(res=>{
        if(res.code===200){
          this.$notification.success({
            message: '验证码发送成功,请注意查收',
            duration: 4
          });
        }else{
          this.$notification.error({
            message: '验证码发送错误',
            duration: 4
          });
        }
      }).catch(e=>{
        console.log(e);
        this.$notification.error({
          message: '网络错误',
          duration: 4
        });
      })
    },
    handleCancel(){

    },
    handlerSubmit(){
      if(this.userModal.mobile.length!==11){
        this.$notification.warning({
          message: '电话号码未输入或不正确',
          duration: 4
        });
        return;
      }
      if(this.userModal.vcode.length<=0){
        this.$notification.warning({
          message: '验证码不能为空',
          duration: 4
        });
        return;
      }
      if(this.userModal.password.length<=5){
        this.$notification.warning({
          message: '密码不能小于6位',
          duration: 4
        });
        return;
      }
      if(this.userModal.password!==this.userModal.cofpassword){
        this.$notification.warning({
          message: '两次密码不一致，请重新输入',
          duration: 4
        });
        return;
      }
      const editData={
        mobile:this.userModal.mobile,
        newPwd:this.userModal.password,
        conPwd:this.userModal.cofpassword,
        regType:0,
        verCode:this.userModal.vcode
      }
      console.log(editData)
      editPayPassword(editData).then(res=>{
        if(res.code===200){
          this.$notification.success({
            duration:4,
            message:"支付密码修改成功"
          });
          this.closeWin();
        }else{
          this.$notification.error({
            duration:4,
            message:res.message
          });
        }
      }).catch(e=>{
        console.error(e);
        this.$notification.error({
          duration:4,
          message:"请求错误"
        });
      })
    },
    closeWin(){
      this.userModal.cofpassword="";
      this.userModal.password="";
      this.userModal.vcode="";
      this.showPayPwd(false)
    }
  },

  destroyed(){
    if(this.sendCode){
      clearInterval(this.sendCode);
    }
  },
  created () {
    this.init()
   this.userModal.mobile=this.userInfo().mobile;
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
  }
.cus-modal-content-item{
  margin-bottom: 10px;
}
  .bottom-btn{
    width:50%;
    text-align:center;
    height:40px;
    line-height:40px;
    vertical-align:center
  }
</style>