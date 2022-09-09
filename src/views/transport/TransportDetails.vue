<template>
    <div >
      <div class="content-t" style="margin-bottom: 20px">
        <table>
          <tr>
            <td width="100px"><h2><strong>运单详情</strong></h2> </td>
            <td width="100px">
              <div v-if="transports.waybillState == 0">取货中</div>
              <div v-if="transports.waybillState == 1">运货中</div>
              <div v-if="transports.waybillState == 2">待收货</div>
              <div v-if="transports.waybillState == 4">已完成</div>
              <div v-if="transports.waybillState == 3">已撤单</div>
            </td>
          </tr>
          <tr>
            <td width="100px">车主姓名:</td>
            <td width="330px">{{transports.userName}}</td>
            <td width="100px">车主电话:</td>
            <td width="300px">{{transports.mobile}}</td>
            <td width="150px"></td>
            <td width="300px"></td>
          </tr>
        </table>
      </div>
      <div class="content-t"  style="margin-bottom: 10px">
        <table>
          <tr>
            <td width="100px">运单编号：</td>
            <td width="300px">{{transports.transportNum}}</td>
            <td width="100px">车牌号：</td>
            <td width="300px">{{transports.truckNum}}</td>
            <td width="150px">运单创建时间：</td>
            <td width="300px">{{transports.createTime}}</td>
          </tr>
          <tr>
            <td width="100px">货物名称：</td>
            <td width="300px">{{transports.goodsName}}</td>
            <td width="100px">货物重量：</td>
            <td width="300px">{{transports.goodsWeight}} {{transports.goodsUnit}}</td>
            <td width="150px">运单金额：</td>
            <td width="300px">{{transports.moneyFreightEnd}}元</td>
          </tr>
        </table>
      </div>
      <strong>发货信息</strong>
      <div class="content-t"  style="margin-bottom: 10px">
        <table>
          <tr>
            <td width="100px">发货人名：</td>
            <td width="340px">{{userName}}</td>
            <td width="100px">联系电话：</td>
            <td width="300px">{{mobile}}</td>
            <td width="150px"></td>
            <td width="300px"></td>
          </tr>
          <tr>
            <td width="100px">发货地址：</td>
            <td width="300px">{{transports.startProvince}}{{transports.startCity}}{{transports.startArea}}{{transports.startAddress}}</td>
          </tr>
        </table>
      </div>
      <strong>收货信息</strong>
      <div class="content-t" >
        <table>
          <tr>
            <td width="100px">收货人名：</td>
            <td width="340px">{{transports.receiverName}}</td>
            <td width="100px">联系电话：</td>
            <td width="300px">{{transports.receiveTelephone}}</td>
            <td width="160px">收货时间：</td>
            <td width="300px">{{transports.receivingTime}}</td>
          </tr>
          <tr>
            <td width="100px">收货地址：</td>
            <td width="300px">{{transports.endProvince}}{{transports.endCity}}{{transports.endArea}}{{transports.endAddress}}</td>
          </tr>
        </table>
      </div>
      <div class="amap-demo">
        <el-amap vid="amapDemo"  :center="center" :amap-manager="amapManager" :zoom="zoom" :events="events" class="amap-demo">
           <el-amap-marker  :offset="[-26, -13]" ref="marker"
                          :position="position" vid="index"></el-amap-marker>
           <el-amap-polyline :editable="polyline.editable" :path="polyline.path"
                            :events="polyline.events"></el-amap-polyline>
        </el-amap>
      </div>
      <!--<a-button v-if="transports.waybillState == 2" type="primary" @click="showModal" class="yes" >确认收货</a-button>-->
      <a-button v-if="transports.waybillState == 2" type="primary" @click="$refs.modal.receiving(transports.id)" class="yes" >确认收货</a-button>
      <a-button @click="back">返回</a-button>
      <a-button v-if="transports.waybillState == 4" type="primary" @click="reachDetailsInfo(transports.id)" class="yes" >查看榜单信息</a-button>
      <!--弹框1-->
      <a-modal
        title="请输入到货重量"
        :visible="visible"
        @ok="handleOk"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
      >
        <p style="text-align: center">到货重量：<a-input style="width: 200px" v-model="reachWeight"></a-input> 吨</p>
      </a-modal>

      <!--弹框2-->
      <a-modal
        title="请输入到货重量"
        :visible="visibles"
        @ok="handleOks"
        :confirmLoading="confirmLoading"
        @cancel="handleCancels"
      >
        <div >
          <p> 发货榜单预览：<img src="../../assets/logo.png"  style="width: 200px;" /></p>
        </div>
        <div >
          <p> 到货榜单预览： <img src="../../assets/logo.png"  style="width: 200px;" /></p>
        </div>
        <div >
          <p> 确认重量：<a-input v-model="reachWeight" style="width: 200px"></a-input></p>
        </div>
        <div>
          <p>实际运费：<a-input v-model="payfor"  style="width: 200px" disabled="disabled"></a-input></p>
            <p style="margin-left: 70px">
              <a-select id="selectValue" defaultValue="请选择:" style="width: 150px" @change="handleChange" >
                <a-select-option value="0">无增减</a-select-option>
                <a-select-option value="1">增加运费</a-select-option>
                <a-select-option value="2">减少运费</a-select-option>
              </a-select>
            </p>
        </div>
        <div :class="flags">
          <p>
            增加原因：
            <a-select id="select2" defaultValue="请选择:" style="width: 150px"  v-model="updateCase">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option value="上次增补">上次增补</a-select-option>
              <!--<a-select-option value="2">减少运费</a-select-option>-->
            </a-select>
          </p>
          <p style="margin-left: 70px;"><a-input v-model="money"  style="width: 200px;" placeholder="请输入增加金额"></a-input></p>
        </div>
        <div :class="isShow">
          <p>
            减少原因：
            <a-select id="select3" defaultValue="请选择:" style="width: 150px" v-model="updateCase">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option value="损耗扣除">损耗扣除</a-select-option>
              <!--<a-select-option value="2">减少运费</a-select-option>-->
            </a-select>
          </p>
          <p style="margin-left: 70px;"><a-input v-model="money1" style="width: 200px;"  placeholder="请输入减少金额"></a-input></p>
        </div>
      </a-modal>

      <receiv-bang ref="modal" @refresh="getlist"/>

      <!--弹框2-->
      <a-modal
        title="榜单详情"
        :visible="reachDetail"
        @cancel="cancel"
        @ok="cancel"
      >
        <div >
          <p v-if="reachDetailsInfos.sendProofUrl == null || reachDetailsInfos.sendProofUrl == ''"> 发货榜单预览：<img src="../../assets/logo.png" id="sendProofUrl" style="width: 200px;" /></p>
          <p v-if="reachDetailsInfos.sendProofUrl != null && reachDetailsInfos.sendProofUrl != ''"> 发货榜单预览：<img :src="reachDetailsInfo.sendProofUrl"  style="width: 200px;" /></p>
        </div>
        <div >
          <p v-if="reachDetailsInfos.proofUrl == null || reachDetailsInfos.proofUrl == ''"> 到货榜单预览： <img src="../../assets/logo.png" id="hodeProofUrl" style="width: 200px;" /></p>
          <p v-if="reachDetailsInfos.proofUrl != null && reachDetailsInfos.proofUrl != ''"> 到货榜单预览： <img :src="reachDetailsInfo.hodeProofUrl" style="width: 200px;" /></p>
        </div>
        <div >
          <p> 到货重量/吨：<a-input v-model="reachDetailsInfos.reachWeight" style="width: 200px"></a-input></p>
        </div>
        <div >
          <p> 最终金额：<a-input v-model="reachDetailsInfos.payMoney" style="width: 200px"></a-input></p>
        </div>
      </a-modal>
    </div>
</template>

<script>
  import { getReachLog, mst, newAffirm, updateAffirm } from '../../api/transport'
  import ReceivBang from '@/components/Modal/ReceivBang'
  import {mapGetters} from 'vuex'
  import { getRoad } from '@api/invoice_manage'
  import VueAMap from 'vue-amap'
  import { getReceivedList } from '../../api/receiving_manage'

  let amapManager = new VueAMap.AMapManager()
  let lineAttr = [[121.5389385, 31.21515044], [121.5389385, 31.29615044], [121.5273285, 31.21515044]]
  export default {
    name: 'TransportDetails',
    data (){
      return{
        reqParams: {
          //查询参数,仅显示毕传参数
          limit: 10,
          page: 1,
          consignId: null
        },
        flags:'noShow',
        isShow:'noShow',
        transports:this.$route.params,
        reachWeight: '',
        visible: false,
        visibles:false,
        reachDetail:false,
        value:'',
        confirmLoading: false,
        userId:this.userInfo().id,
        userName:this.userInfo().userName,
        mobile:this.userInfo().mobile,
        weightJurisdiction:'',
        updateCase:'',
        money:'',
        money1:'',
        reachDetailsInfos:{
        },
        updateMoney:0,
        moneyFreightEnd:0,
        payfor:this.$route.params.moneyFreightEnd,
        zoom: 12,
        center: [108.894036,34.229056],
        
        amapManager:{},
        
        events: {
          init(o) {
            // let marker = new AMap.Marker({
            //   position: [108.894036,34.229056]
            // });
            // marker.setMap(o);
          }
        },
        polyline: {
          path: lineAttr,
          events: {
            click (e) {
              
            },
            end: (e) => {
              let newPath = e.target.getPath().map(point => [point.lng, point.lat])

            }
          },
          editable: false
        }

      }
    },
    components:{
      ReceivBang
    },
    methods:{
      ...mapGetters(['userInfo']),
      async getlist() {
        //console.log(this.userInfo())
        this.reqParams.consignId = this.userInfo().id
        try {
          let res = await getReceivedList(this.reqParams)
          if (res.code == 200) {
            this.listMode = res.data
          }
        } catch (e) {
          console.log(e)
          this.$message.error('网络错误')
        }
      },
      getPositions(id){
        getRoad({ transportId: id }).then(res=>{
            if (res.code == 200) {
              this.polyline.path = []
              let paths = []
              if (res.data.length > 0) {
                res.data.forEach(e => {
                  paths.push([e.lon, e.lat])
                })
                this.center = paths[Math.floor(paths.length / 2)]
                lineAttr = paths
                this.position = paths[0]
                this.polyline.path = paths
                this.zoom = 7
                this.showMapModal = true
              } else {
                this.$message.warning('暂时无法获取此车辆轨迹', 2)
              }
            } else {
              this.$message.warning('暂时无法获取此车辆轨迹', 2)
            }
        }).catch(e => {
        this.$message.error('网络错误', 2)
      })
      },


      showModal() {
        // console.log(this.weightJurisdiction)
        if (this.weightJurisdiction == 0){
          this.visible = true
        }else {
          this.visibles = true
        }
      },
      handleOk() {
        this.confirmLoading = true;
        updateAffirm({
          transportId:this.transports.id,
          userId:this.userId,
          reachWeight:this.reachWeight
        }).then((data) => {
          this.$message.success('收货成功',5);
        })
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      handleOks() {
        //有榜单全线收货
        this.confirmLoading = true;
        if (this.value == 1){
          this.updateMoney = this.money;
          this.moneyFreightEnd = (parseInt(this.payfor) + parseInt(this.money))
        } else if (this.value == 2){
          this.updateMoney = (parseInt("-"+this.money1));
          this.moneyFreightEnd = (parseInt(this.payfor) - parseInt(this.money))
        }
        newAffirm({
          updateType:this.value,
          id:this.transports.id,
          consignId:this.userId,
          reachWeight:this.reachWeight,
          updateCase:this.updateCase,
          updateMoney:this.updateMoney,
          moneyFreightEnd:this.moneyFreightEnd
        }).then((data) => {
          if (data.code == 200){
            this.$message.success('收货成功',5);
          }else {
            this.$message.error('收货失败',5);
          }
        })
        setTimeout(() => {
          this.visibles = false;
          this.confirmLoading = false;
        }, 2000);
      },
      handleCancel(e) {
        this.visible = false
      },
      cancel(){
        this.reachDetail = false;
      },
      handleCancels(e){
        this.visibles = false
      },
      reachDetailsInfo(id){
        getReachLog({
          consignId:this.userId,
          transportId:id
        }).then((res) =>{
          // console.log(res);
          if (res.code == 200){
            this.reachDetailsInfos = res.data;
            this.reachDetail = true;
          }else{
            this.$message.error('查看榜单详情失败，请重试',5);
          }
        })
      },
      handleChange(value){
        this.value = value;
        if (value == 1){
          this.isShow = 'noShow';
          this.flags = 'show';
        } else if (value == 2){
          this.flags = 'noShow';
          this.isShow = 'show';
        }else {
          this.flags = 'noShow';
          this.isShow = 'noShow';
        }
      },
      back(){
        this.$router.go(-1);
      }
    },
    mounted (){
      mst(this.userId).then( data => {
        this.weightJurisdiction = data.data.weightJurisdiction;
        
      })
    },
    created (){
      // if (typeof(this.$route.params.waybillState) == "undefined" ){
      //   this.$router.push({
      //     name:'TransportManage'
      //   })
      // }
      console.log(this.$route.params);
      this.getPositions(this.$route.params.id);
      this.amapManager = new VueAMap.AMapManager();

    }
  }
</script>

<style>
   .content-t{
     background-color: #ffffff;
   }
  .noShow{
    display: none;
  }
  .show{
    display: block;
  }
  .amap-demo{
    height: 300px;
    margin-bottom: 10px;
  }
  .yes{
    margin-right: 10px;
  }
</style>