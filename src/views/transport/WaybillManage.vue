<template>
  <div>
      <a-range-picker
        :showTime="{ format: 'HH:mm' }"
        format="YYYY-MM-DD HH:mm"
        :value="date0"
        :placeholder="['开始时间', '结束时间']"
        @change="onChange"
      />
    <a-input v-model="waybillNum" placeholder="请输入货单编号" style="width: 200px;margin-left: 10px;margin-right: 10px"/>
    <a-input v-model="goodsName" placeholder="请输入货物名称" style="width: 200px;margin-right: 10px"/>
    <a-button type="primary" icon="search" @click="search">搜索</a-button>
    <a-button  type="default" @click="reset" style="margin-left: 10px;">重置</a-button>
    <a-table
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="data"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template slot="operation" slot-scope="record">
        <a-button type="primary" @click.stop="() => oneAgain(record.id)">再来一单</a-button>
      </template>
      <a @click="setClassName(record)" href="javascript:;" slot="waybill_num" slot-scope="text,record" >{{text}}</a>
      <template slot="pay_status" slot-scope="text">
        <span  v-if="text == 0" style='color: #D41B32'>未支付运费</span>
        <span  v-if="text == 1" style='color: #D41B32'>未支付保险费</span>
        <span  v-if="text == 2" style='color: #3A92EA'>运货中</span>
        <span  v-if="text == 3" style='color: #666666'>已完成</span>
      </template>
      <!--<template slot="name" slot-scope="name">-->
        <!--{{ name.first }} {{ name.last }}-->
      <!--</template>-->
    </a-table>
  </div>
</template>

<script>
  import { getTrucksByWaybillId, selectAllWaybill } from '../../api/transport'
import RouteView from '../../layouts/RouteView'
import getMyDateTime from '../../utils/DateUtils'
import { STable } from '@/components'
import {mapGetters} from 'vuex'
const columns = [{
  title: '货单编号',
  dataIndex: 'waybill_num',
  scopedSlots:{customRender: 'waybill_num'}
},
{
  title: '货品名称',
  dataIndex: 'goods_name'
},
{
  title: '起始地市',
  dataIndex: 'start_city'
},
{

  title: '目的地市',
  dataIndex: 'end_city'
},
{
  title: '货物重量',
  dataIndex: 'goods_weight'
},
{
  title: '发货时间',
  dataIndex: 'send_time',
  customRender:(text) =>{
    return getMyDateTime(text);
  }
},
{
  title: '货单总价',
  dataIndex: 'amount_total'
},
{
  title: '货单状态',
  dataIndex: 'pay_status',
  scopedSlots:{customRender: 'pay_status'}
},
{
  title: '操作',
  scopedSlots: { customRender: 'operation' }
}
]

export default {
  components: { RouteView,STable },
  mounted () {
    this.fetch(this.user)
  },
  data () {
    return {
      data: [],
      date0:[],
      waybillNum: '',
      goodsName:'',
      pagination: { showTotal:(total, range) => `共${total}条数据`,showSizeChanger: true,showQuickJumper:true},
      dateValue: [],
      loading: false,
      columns,
      user:{
        consignId:this.userInfo().id,
        page: 1,
        limit: 10
      }
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    oneAgain (id){
      console.log(id);
      this.$router.push({
        name:'DeliverGoods',
        params:{
          id:id
        }
      })
    },
    handleTableChange (pagination, filters) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch({
        limit: pagination.pageSize,
        page: pagination.current,
        consignId: this.user.consignId,
        waybillNum: this.waybillNum,
        goodsName:this.goodsName,
        dataBegin:this.dateValue[0],
        dataEnd: this.dateValue[1],
        ...filters
      })
    },
    fetch (params = {}) {
      // console.log('params:', params)
      this.loading = true
      selectAllWaybill(params).then((data) => {
        // console.log('datas:', data)
        const pagination = { ...this.pagination }
        pagination.total = data.rowCount
        this.loading = false
        this.data = data.data
        this.pagination = pagination
      })
    },

    onChange (value, dateString) {
      // console.log('Selected Time: ', dateString.length)
      if (dateString.length > 0){
        this.dateValue = dateString;
        this.date0 = value;
      }else {

        this.dateValue = null;

      }
    },
    reset(){
      this.waybillNum = '';
      this.date0 = [];
      this.goodsName = '';
    },
    search () {
      this.fetch({
        page: 1,
        limit: 10,
        consignId: this.user.consignId,
        waybillNum: this.waybillNum,
        goodsName:this.goodsName,
        dataBegin:this.dateValue[0],
        dataEnd: this.dateValue[1]
      })
    },
    setClassName (record) {
        // console.log('record: ', record)
      getTrucksByWaybillId({
        waybillId:record.id
      }).then(res =>{
        this.$router.push({
          name:'waybillDetails',
          params:{
            record:record,
            trucks:res.data
          }
        })
      })

    }
  }
}
</script>

<style >
  .content[data-v-07175cda]{
    margin-top: 2px;
  }
</style>
