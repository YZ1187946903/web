<template>
  <div>
    <!--磅单收货弹框-->
    <a-modal
    v-model="bangVisible"
    class ="bangModal"
    @ok="bangOk"
    >
      <div class="modelTitle">
        <span >确认收货</span>
      </div>
      <div class ="bangMarg">
        <span class="lab">运单编号</span>
        <a-input class="bangInput" read-only="read-only" :value=bangElement.transportNum></a-input>
      </div>  
      <a-row class ="bangMarg">
        <a-col :span="12" >         
            <span class="lab">车牌号</span>
            <a-input class="bangInput" read-only="read-only" :value=bangElement.truckNum></a-input>
        </a-col>
        <a-col :span="12" >       
         <label class="lab">货物名称</label>
         <a-input class="bangInput" read-only="read-only" :value=bangElement.goodsName></a-input>        
        </a-col>
      </a-row>
      <a-row class ="bangMarg">
        <a-col :span="12" >         
            <span class="lab">送达时间</span>
            <a-input class="bangInput" read-only="read-only" :value=bangElement.sendTime></a-input>
        </a-col>
        <a-col :span="12" >       
         <label class="lab">收货人名称</label>
         <a-input class="bangInput" read-only="read-only" :value=bangElement.receiverName></a-input>        
        </a-col>
      </a-row>
   
      <p class ="bangMarg "><span>发货磅单</span><span class="notes">*点击可放大查看图片</span></p>
      <div class ="bangMarg bangWidth">
        <a><img :src ="bangElement.proofUrl" v-image-preview="bangElement.proofUrl"  class="bangImg"/></a>
      </div>
      
      <p class ="bangMarg "><span>收货磅单</span><span class="notes">*点击可放大查看图片</span></p>
      <div class ="bangMarg bangWidth ">
        <a><img :src ="bangElement.sendProofUrl" v-image-preview="bangElement.sendProofUrl" class="bangImg"/></a>
      </div>

      <a-row class ="bangMarg">
        <a-col :span="12" >         
            <span class="lab">货物重量(吨)</span>
            <a-input class="bangInput"  v-model=bangElement.goodsWeight style="  color:black; font-weight:400"></a-input>
        </a-col>
        <a-col :span="12" >       
         <label class="lab">实际运费(元)</label>
         <a-input class="bangInput" v-model=bangElement.moneyFreight style="  color:black; font-weight:400" @change=moneyChange1></a-input>        
        </a-col>
      </a-row>
      <a-row class ="bangMarg">
        <a-col :span="12" >         
            <span class="lab">油卡金额(元)</span>
            <a-input class="bangInput"  v-model=bangElement.oilFeeMoney  style="  color:black; font-weight:400" @change=moneyChange2></a-input>
        </a-col>
        <a-col :span="12" >
         <label class="lab">油费余额(元)</label>
         <a-input class="bangInput" read-only="read-only" :value=bangElement.oilFeeBalance ></a-input>
        </a-col>
      </a-row>
      <a-row class ="bangMarg">
        <a-col :span="12" >
          <label class="lab">结算金额(元)</label>
          <a-input class="bangInput" read-only="read-only" :value=bangElement.settlementMoney style="  color:black; font-weight:500"></a-input>
        </a-col>
      </a-row>
      <!-- <a-row class ="bangMarg">
        <a-col :span="12">
          <span class="lab">调整方式：</span>
          <a-select defaultValue="无增减" @change="onChange"  class="select">
            <a-select-option value="0">无增减</a-select-option>
            <a-select-option value="1">增加运费</a-select-option>
            <a-select-option value="2">减少运费</a-select-option>
          </a-select>
        </a-col> -->
        <a-col :span="12" v-if="bangElement.modifyCost>0">
           <span class="lab" v-if="bangElement.modifyCost==1">增加原因：</span>
           <span class="lab" v-if="bangElement.modifyCost==2">减少原因：</span>
           <a-select :value=bangElement.selectValue @change="handleChange" class="select">
            <a-select-option
              v-if="bangElement.modifyCost==1"
              v-for="item in bangElement.select.index1"
              :key="item" :value="item" >{{item}}
            </a-select-option>
            <a-select-option
              v-if="bangElement.modifyCost==2"
              v-for="item in bangElement.select.index2"
              :key="item" :value="item" >{{item}}
            </a-select-option>
           </a-select>
        </a-col>
      </a-row>
      <a-row class ="bangMarg" v-if="bangElement.modifyCost>0">
        <a-col :span="12" >         
            <span class="lab">到货重量(吨)</span>
            <a-input class="bangInput" v-model=bangElement.endWeight></a-input>
        </a-col>
        <a-col :span="12" >       
          <span class="lab" v-if="bangElement.modifyCost==1">增加金额</span>
          <span class="lab" v-if="bangElement.modifyCost==2">减少金额</span>
          <a-input class="bangInput" v-model=bangElement.modfiyMoney @change=moneyChange ></a-input>  
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
/**
 * 收货确认
 */

import { mst,affarm,selectPound,newAffirm } from '@/api/receiving_manage'
import { mapGetters } from 'vuex'
import VueAMap from 'vue-amap'
import nobang from '@assets/nobang.png'
import { setTimeout } from 'timers';
import { isNumber } from 'util';
export default {
  name: 'ReceivBang',
  data() {
    return {
      isBang:false,
      bangVisible:false,
      bangElement:{ //收货榜单元素
        id:"",
        transportNum:"",
        moneyFreightEnd:0,
        moneyFreight:0,
        startMoney:0,
        receiverName:"",
        truckNum:"",
        goodsName:"",
        goodsWeight:"",
        sendTime:"",
        endWeight:"",
        oilFeeBalance:"",
        settlementMoney:"",
        servRate:"",
        oilFeeMoney:"",
        proofUrl:nobang,  //发货图片
        sendProofUrl:nobang,  //收货图片
        modifyCost:0,   //增减方式 1增加，2减少
        modfiyMoney:0,
        selectValue:"请选择",  //增减原因
        select:{
          index1:['请选择','增加原因1','增加原因2'],
          index2:['请选择','减少原因1','减少原因2'],
        },
      },
      render: false,
      poundAuth: false, //是否拥有磅单权限
      reqParams: {
        //查询参数,仅显示毕传参数
        limit: 10,
        page: 1,
        consignId: null
      }
    }
  },
  methods: {
    ...mapGetters(['userInfo']),

    handleChange(value){
      this.bangElement.selectValue=value
    },

    onChange(value) {
      this.bangElement.selectValue="请选择"
      this.bangElement.modifyCost=value
    },

    receiving(id){ //完成收货按钮


      if(this.isBang){
        let that = this
        this.$confirm({
        title: '是否对此运单进行收货操作?',
        content: '',
        onOk() {
          return new Promise(async (resolve, reject) => {

            //调用收货接口
              let param={ids:id,userId:that.userInfo().id}
              affarm(param).then(res=>{
                if(res.code==200){
                  that.$message.success('收货成功')
                  that.$emit('refresh')
                  resolve()
                }else{
                  that.$message.error(res.message+"错误代码："+res.code)
                  reject();
                }
              }).catch(e=>{
               reject(e)
             })
          })
        },
        onCancel() {},
       });
      }else{
        let param ={transportId:id}
        selectPound(param).then(res=>{
          if(res.code==200){
            let data=res.data
            console.log(data.moneyFreight);
            this.bangElement.id=data.id
            this.bangElement.transportNum=data.transportNum
            this.bangElement.truckNum=data.truckNum
            this.bangElement.goodsName=data.goodsName
            this.bangElement.sendTime=data.sendTime
            this.bangElement.receiverName=data.receiverName
            this.bangElement.servRate=data.servRate
            if(data.proofUrl!=null&&data.proofUrl!=""&&data.proofUrl!=undefined){
              this.bangElement.proofUrl=data.proofUrl
            }
            if(data.sendProofUrl!=null&&data.sendProofUrl!=""&&data.sendProofUrl!=undefined){
              this.bangElement.sendProofUrl=data.sendProofUrl
            }
            this.bangElement.oilFeeBalance = Math.floor(data.oilFeeBalance*100)/100
            this.bangElement.goodsWeight=data.goodsWeight
            this.bangElement.moneyFreight=Math.floor(data.moneyFreight*100)/100
            this.bangElement.moneyFreightEnd=Math.floor(data.moneyFreightEnd*100)/100
            this.bangElement.oilFeeMoney=Math.floor(data.moneyFreightEnd*0.4*100)/100
            this.bangElement.settlementMoney=(Math.floor(data.moneyFreightEnd*100)-Math.floor(data.moneyFreightEnd*0.4*100))/100
            this.bangElement.startMoney=Math.floor(data.moneyFreight*100)/100
            this.bangElement.endWeight=data.goodsWeight
          }else{
            this.$message.error(res.message+"错误代码："+res.code)
          }
        }).catch(e=>{
          this.$message.error("未知异常")
        })
        this.modifyCost = 0
        this.bangVisible = true
      }

    },
    async bangOk(){   //调用收货接口
      let modfiyMoney = parseFloat(this.bangElement.modfiyMoney)
      let startMoney = parseFloat(this.bangElement.startMoney)
      if(this.bangElement.servRate==0){
        this.$message.error("货主状态异常，请联系管理员")
        return
      }

      if(this.bangElement.modifyCost>0&&this.bangElement.selectValue=="请选择"){
        this.$message.error("请选择修改原因后提交")
        return
      }
      if(this.bangElement.modifyCost>0&&(modfiyMoney ==null ||modfiyMoney =="" || isNaN(modfiyMoney)||modfiyMoney<=0)){
        this.$message.error("请输入正确的修改金额后提交")
        return
      }
      if(this.bangElement.oilFeeMoney >  this.bangElement.oilFeeBalance){
        this.$message.error("油费余额小于要使用的金额,不能收货")
        return
      }

      let param={
        id:this.bangElement.id,
        reachWeight:this.bangElement.endWeight,
        consignId:this.userInfo().id,
        updateType:this.bangElement.modifyCost,
        updateMoney:this.bangElement.modifyCost==2?0-this.bangElement.modfiyMoney:this.bangElement.modfiyMoney,
        moneyFreightEnd:this.bangElement.moneyFreightEnd,
        moneyFreight:this.bangElement.moneyFreight,
        updateCase:this.bangElement.selectValue,
        oilFeeMoney:this.bangElement.oilFeeMoney,
        settlementMoney:this.bangElement.settlementMoney
      }
      await newAffirm(param).then(res=>{
        if(res.code==200){
          this.$message.success('收货成功')
          this.bangVisible = false
          this.$emit('refresh')

        }else{
          this.$message.error(res.message+"错误代码："+res.code)
        }
      }).catch(e=>{
        this.$message.error("未知错误")
      })

    },

    moneyChange(){ //修改价格结果
      let endMoney =0
      let oilFeeMoney = 0
      let modfiyMoney = parseFloat(this.bangElement.modfiyMoney)
      let startMoney = parseFloat(this.bangElement.startMoney)
      let startOil = parseFloat(this.bangElement.oilFeeMoney)
      if(modfiyMoney ==null ||modfiyMoney =="" || isNaN(modfiyMoney)||modfiyMoney<0){
        this.$message.error('请输入正确数字')
        this.bangElement.moneyFreight = startMoney
        this.bangElement.oilFeeMoney = startOil
        return
      }
      if(this.bangElement.modifyCost==1){
        endMoney = (startMoney*100+modfiyMoney*100)/100
      }else if(this.bangElement.modifyCost==2){
        endMoney = (startMoney*100-modfiyMoney*100)/100
      }
      if(endMoney<0){
        this.$message.error('修改金额不能大于发货金额')
      }else{
        oilFeeMoney =  Math.floor(endMoney*(1-this.bangElement.servRate)*0.4*100)/100;//油卡余额  动态变化  油费 = 运费*0.4

        if(oilFeeMoney > this.bangElement.oilFeeBalance){//油卡金额不能大于油卡余额
          this.$message.error('油卡金额不能大于油卡余额')
        }else{
          this.bangElement.oilFeeMoney = oilFeeMoney
          this.bangElement.moneyFreight=endMoney
          console.log(Math.floor(endMoney*(1-this.bangElement.servRate)*100)/100)
          this.bangElement.moneyFreightEnd=Math.floor(endMoney*(1-this.bangElement.servRate)*100)/100;
          this.bangElement.settlementMoney = Math.floor(this.bangElement.moneyFreightEnd*100- this.bangElement.oilFeeMoney*100)/100;   //结算金额 =运费-油费
        }

      }
    },

    moneyChange1(){
      let endMoney = parseFloat(this.bangElement.moneyFreight )
      let startMoney = parseFloat(this.bangElement.startMoney)
      let startOil = parseFloat(this.bangElement.oilFeeMoney)
      if(endMoney ==null ||endMoney =="" || isNaN(endMoney)||endMoney<0){
        this.$message.error('请输入正确数字')
        this.bangElement.moneyFreight = startMoney
        this.bangElement.oilFeeMoney = startOil
        return
      }
      let oilFeeMoney = parseFloat(this.bangElement.oilFeeMoney )
      let settlementMoney = parseFloat(this.bangElement.settlementMoney )

      this.bangElement.moneyFreightEnd = Math.floor(endMoney*(1-this.bangElement.servRate)*100)/100;
      settlementMoney =  this.bangElement.moneyFreightEnd-oilFeeMoney 
      if(settlementMoney <=0){
        settlementMoney =0
      }
      this.bangElement.settlementMoney =  Math.floor(settlementMoney *100)/100;
      this.bangElement.updateMoney = startMoney - endMoney
    },
    moneyChange2(){
      let oilFeeMoney  = parseFloat(this.bangElement.oilFeeMoney )
      let startMoney = parseFloat(this.bangElement.settlementMoney)
      if(oilFeeMoney  ==null ||oilFeeMoney  =="" || isNaN(oilFeeMoney )||oilFeeMoney <0){
        this.$message.error('请输入正确数字')
        this.bangElement.moneyFreight = startMoney
        this.bangElement.oilFeeMoney = startOil
        return
      }
      let settlementMoney =  this.bangElement.moneyFreightEnd-oilFeeMoney 
      if(settlementMoney <=0){
        settlementMoney =0
      }
      this.bangElement.settlementMoney =  Math.floor(settlementMoney *100)/100;

    },

    async receivingBang(){ //查询磅单权限
      let id = this.userInfo().id
      let res = await mst(id)
      try {
        if(res.data.weightJurisdiction==1){
          this.isBang=false
        }
        // console.log(this.isBang)
      } catch (e) {
        this.$message.error('磅单状态异常')
      }
    },
  },
  created() {
    this.receivingBang()
  }
}
</script>

<style scoped lang="less">
input[readonly]{
  color: rgb(151, 151, 151);
}
.search {
  margin-bottom: 2%;
}
.search .span {
  margin-right: 0.5%;
}
.search .button {
  margin-left: 0.5%;
}
.list {
  background-color:white;
}
.blod {
  color: red;
}

.test {
  color: red;
}
.gpsButton {
  background-color: #057aff;
  border-color: #057aff;
  margin-right: 10px;
}


.tablediv {
  background-color: #ffffff;
  width: 100%;
}

.pageInfo {
  padding-top: 24px;
  float: right;
}

.bangWidth{
  width: 100%;
  height: 160px;
} 

.bangImg{
  width: 100%;
  max-height: 160px;
  border-style: solid;
  border-width: 2px;
  border-color: #cccccc;
}

.bangInput{
  width: 50%;
}


.bangMarg{
  margin-top: 5px;
}

.selectRight {
  display: none;
}
.lab{
  display: inline-block;
  width: 80px;
}

.select {  
  width: 50%;
}
.notes{
  font-size: 0.3em;
  color:#61a331;
}
.modelTitle{
  margin-bottom: 30px;
}
.modelTitle span{
  font-size: 20px; 
  color: black;
  border-bottom: 10px solid #8cc890;
}



 
</style>
