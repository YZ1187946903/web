<template>
    <div >
      <div class="content-t" style="margin-bottom: 5px;margin-top: 5px">
        <table>
          <tr>
            <td width="150px"><h2><strong>货单详情</strong></h2> </td>
            <td width="1100px">
              <div v-if="waybill.pay_status == 0"><span style="color: #D41B32">未支付运费</span></div>
              <div v-if="waybill.pay_status == 1"><span style="color: #D41B32">未支付保险费</span></div>
              <div v-if="waybill.pay_status == 2"><span style="color: #3A92EA">运货中</span></div>
              <div v-if="waybill.pay_status == 3">已完成</div>
            </td>
            <td width="100px"><a-button v-if="waybill.pay_status < 2" type="primary" @click="toPay" >完成支付</a-button></td>
            <td width="100px"><a-button type="default" @click="oneAgain" >再来一单</a-button></td>
          </tr>
        </table>
      </div>
      <div class="content-t"  style="margin-bottom: 5px">
        <table style="height: 67px">
          <tr>
            <td width="100px">货单编号：</td>
            <td width="300px">{{waybill.waybill_num}}</td>
            <td width="100px">货物类型：</td>
            <td width="300px">{{waybill.waybill_type == 0? "指派单":"平台单"}}</td>
            <td width="100px">发货时间：</td>
            <td width="190px">{{getDate(waybill.send_time)}}</td>
            <td width="110px"><a href="javascript:" @click="toTransports">查看运单列表</a></td>
          </tr>
          <tr>
            <td width="100px">货物名称：</td>
            <td width="300px">{{waybill.goods_name}}</td>
            <td width="100px">单车重量：</td>
            <td width="300px">{{waybill.goods_weight}}</td>
            <td width="100px">货单总价：</td>
            <td width="300px">{{waybill.amount_total}}元</td>
          </tr>
        </table>
      </div>
      <div class="content-t" style="height: 67px">
        <table style="width: 100%;height: 67px">
          <tr>
            <td width="100px">起始位置：</td>
            <td width="300px">{{waybill.start_city}}</td>
            <td width="100px">起始地址：</td>
            <td width="300px">{{waybill.start_address}}</td>
            <td width="100px"></td>
            <td width="190px"></td>
            <td width="110px"></td>
          </tr>
          <tr>
            <td width="100px">目的区域：</td>
            <td width="335px">{{waybill.end_city}}</td>
            <td width="100px">目的地址：</td>
            <td width="300px">{{waybill.end_address}}</td>
            <td width="100px"></td>
            <td width="300px"></td>
          </tr>
        </table>
      </div>
      <div class="amap-demo">
        <el-amap vid="amapDemo"  :center="center" :amap-manager="amapManager" :zoom="zoom"  class="amap-demo">
          <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events" :vid="index"  :title="marker.title" :icon="marker.icon" ></el-amap-marker>
        </el-amap>
      </div>
      <a-button @click="back">返回</a-button>
    </div>
</template>

<script>
  import ARow from 'ant-design-vue/es/grid/Row'
  import ACol from 'ant-design-vue/es/grid/Col'
  import car from '@/assets/yard/car2.png'
  import { getTrucksByWaybillId, selectAllTransports } from '../../api/transport'
  import VueAMap from 'vue-amap'
  import getMyDateTime from '../../utils/DateUtils'
  const columns = [{
    title: '运单编号',
    dataIndex: 'transport_num'
  },
    {
      title: '车主名称',
      dataIndex: 'user_name'
    },
    {
      title: '车牌号',
      dataIndex: 'truck_num'
    },
    {
      title: '运单金额',
      dataIndex: 'money_freight'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time'
    },
    {
      title: '运单状态',
      dataIndex: 'waybill_state',
      customRender:function (record) {
        const w = record.waybillState;
        if (w == 0){
          return '取货中';
        }else if (w == 1){
          return '运货中';
        }else if (w == 2){
          return '待收货';
        }else if (w == 3){
          return '已撤单';
        }else {
          return '已完成';
        }
      }
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'operation' }
    }
  ]
  export default {
    name: 'WaybillDetails',
    components: { ACol, ARow },
    data () {
      return{
        waybill:this.$route.params.record,
        columns,
        cars:require('../../assets/yard/car2.png'),
        loading:false,
        data:[],
        trucks:this.$route.params.trucks,
        zoom: 6,
        center: [108.894036,34.229056],
        amapManager:{},
        markers:[]
      }
    },
    methods:{
      oneAgain (){
        this.$router.push({
          name:'DeliverGoods',
          params:{
            id:this.waybill.id
          }
        })
      },
      handleTableChange (pagination, filters) {
        this.fetch({
          id: this.waybill.id,
          ...filters
        })
      },
      toPay(){
       getTrucksByWaybillId({
          waybillId:this.waybill.id
        }).then(res =>{
          if (res.code == 200){
            this.$router.push({
              name:'DeliverGoods',
              params:{
                state:(this.waybill.pay_status + 1),
                waybillInfo:this.waybill,
                truckArray:res.data
              }
            })
          }else {
            this.$message.error("获取货单车辆失败，请重试")
          }
        })
      },
      fetch (params = {}) {
        this.loading = true
        selectAllTransports(params).then((data) => {
          this.loading = false
          if (data.data.length > 0){
            this.data = data.data
          }
        })
      },
      getDate(date){
        return getMyDateTime(date);
      },
      back(){
        this.$router.go(-1);
      },
      toTransports (){
        this.$router.push({
          name:'TransportManage',
          params:{
            id:this.waybill.id
          }
        })
      }
    },
    mounted(){
      // console.log(this.trucks)
      for (let i = 0; i < this.trucks.length; i++) {
        let marker = {
          position: [this.trucks[i].truckLon, this.trucks[i].truckLat],
          icon:car,
          title:this.trucks[i].truckNum,
          // content:'<div style="width: 60px"><p style="background-color: white">'+ this.trucks[i].truckNum +'</p><img src="../../assets/yard/car1.svg"></div>'
        };
        this.markers.push(marker);
      }
      this.fetch({
        id:this.waybill.id
      })
    },
    created(){
      this.amapManager = new VueAMap.AMapManager();
    }
  }
</script>

<style>
    .content-t{
      background-color: white;
    }
    .amap-demo {
      height: 430px;
    }
</style>