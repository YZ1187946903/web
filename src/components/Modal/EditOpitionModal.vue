<template lang="pug">
  div.edit-pay-modal
    a-modal(
      :visible="showOpinionModal()",
      :confirmLoading="confirmLoading"
      :closable="false"
      :maskClosable="false"
       width="400px"
      :footer="null"
      :bodyStyle="{padding:'0px'}"
      )
      div.modal-header

        span 意见反馈
        a-icon(
        :component="close"
        style="font-size:22px;float: right"
        @click="closeWin"
        )
      div.cus-modal-content
        div.cus-modal-content-item
          a-textarea(
              placeholder="请输入意见反馈",
              v-model="text",
              :rows="5"
              style="margin-top:10px"
            )
      div(style="font-size:15px;display:flex;flex-direction: row;border-top:1px solid rgba(214, 214, 214, 1)")
          div(
            style="border-right:1px solid rgba(214, 214, 214, 1)"
            @click="closeWin"
            ).bottom-btn
            span 返回
          div(style="color:rgba(89, 201, 96, 1)",@click="handlerFeedback").bottom-btn
            span 提交
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import close from '@/assets/yard/closeWin.svg?inline'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import ARow from 'ant-design-vue/es/grid/Row'
import { addFeedBack } from '@api/common'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  name: 'EditModal',
  components: { ATextarea, ARow, AFormItem },
  data(){
    return {
      confirmLoading:false,
      close,
      text:''
    }
  },
  methods:{
    ...mapGetters(['showOpinionModal','userInfo']),
    ...mapActions(['showOpinion']),
    init(){

    },
    handleCancel(){

    },
    handlerFeedback(){
      if(this.text.length<=0){
        this.$notification.warning({
          duration:4,
          message:"意见不能为空"
        });
        return
      }
      const params={
        userId:this.userInfo().id,
        feedback:this.text
      }
      addFeedBack(params).then(res=>{
        if(res.code==200){
          this.$notification.success({
            duration:4,
            message:"意见反馈成功,感谢您为我们的产品提出宝贵意见！"
          });
          this.showOpinion(false);
          this.text="";
        }else{
          this.$notification.warning({
            duration:4,
            message:res.message
          });
        }
      }).catch(e=>{
        console.error("网络错误");
        this.$notification.error({
          duration:4,
          message:"意见反馈失败，网络错误"
        });
      })
    },
    closeWin(){
      this.showOpinion(false);
      this.text="";
    }
  },
  destroyed(){
    if(this.sendCode){
      clearInterval(this.sendCode);
    }
  },
  created () {
    this.init()

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
    width:50%;
    text-align:center;
    height:40px;
    line-height:40px;
    vertical-align:center
  }
</style>