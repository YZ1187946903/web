<template>
  <div>
    <a-range-picker
      :showTime="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      :value="date0"
      :placeholder="['开始时间', '结束时间']"
      @change="onChange"
    />
    <a-input v-model="truck" placeholder="请输入车牌号" style="width: 200px;margin-left: 10px;margin-right: 10px"/>
    <a-select defaultValue="" style="width: 150px" @change="handleChanges" >
      <a-select-option value="">请选择运单状态</a-select-option>
      <a-select-option value="0">取货中</a-select-option>
      <a-select-option value="1">运货中</a-select-option>
      <a-select-option value="2">待收货</a-select-option>
      <a-select-option value="4">已完成</a-select-option>
    </a-select>
    <a-button type="primary" style="margin-left: 10px" icon="search" @click="search">搜索</a-button>
    <a-button  type="default" @click="reset" style="margin-left: 10px;">重置</a-button>
    <a-table
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="data"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template slot="operation" slot-scope="text, record">
          <!--<a-button v-if="record.waybillState == 2" type="primary" @click.stop="() => confirmReceipt(record.id,record.waybillState,record.moneyFreightEnd)" >确认收货</a-button>-->
          <a-button v-if="record.waybillState == 2" type="primary" @click="$refs.modal.receiving(record.id)" >确认收货</a-button>
          <a-button v-else type="primary" disabled="disabled" >确认收货</a-button>
      </template>
      <a @click="setClassName(record)" href="javascript:;" slot="transportNum" slot-scope="text,record" >{{text}}</a>
      <template slot="waybillState" slot-scope="text">
        <span  v-if="text == 0" style='color: #51C758'>取货中</span>
        <span  v-if="text == 1" style='color: #3A92EA'>运货中</span>
        <span  v-if="text == 2" style='color: #F4AC3E'>待收货</span>
        <span  v-if="text == 3" style='color: #000000'>已撤单</span>
        <span  v-if="text == 4" style='color: #666666'>已完成</span>
      </template>
      <!--<template slot="name" slot-scope="name">-->
        <!--{{ name.first }} {{ name.last }}-->
      <!--</template>-->
    </a-table>
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
        <p> 发货榜单预览：<img src="../../assets/logo.png" id="sendProofUrl" style="width: 200px;" /></p>
      </div>
      <div >
        <p> 到货榜单预览： <img src="../../assets/logo.png" id="hodeProofUrl" style="width: 200px;" /></p>
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
  </div>
</template>
<script>
  import { mst, newAffirm, selectTransportsList, updateAffirm } from '../../api/transport'
  import {mapGetters} from 'vuex'
  import ReceivBang from '@/components/Modal/ReceivBang'
  import { getReceivedList } from '../../api/receiving_manage'
  const columns = [
    {
      title: '运单编号',
      dataIndex: 'transportNum',
      scopedSlots:{customRender: 'transportNum'}
    },
    {
      title: '货物名称',
      dataIndex: 'goodsName'
    },
    {
      title: '车牌号',
      dataIndex: 'truckNum'
    },
    {
      title: '货物重量',
      dataIndex: 'goodsWeight'
    },
    {
      title: '运单创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '运单金额',
      dataIndex: 'moneyFreight'
    },
    {
      title: '运单状态',
      dataIndex: 'waybillState',
      scopedSlots:{customRender: 'waybillState'}
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'operation' }
    }
  ]

  export default {
    mounted () {
      mst(this.userId).then( data => {
        this.weightJurisdiction = data.data.weightJurisdiction;
      });
      this.fetch(this.params);
    },
    components:{
      ReceivBang
    },
    data () {
      return {
        date0:[],
        reqParams: {
          //查询参数,仅显示毕传参数
          limit: 10,
          page: 1,
          consignId: null
        },
        flags:'noShow',
        isShow:'noShow',
        data: [],
        waybillNum: '',
        pagination: {showTotal:(total, range) => `共${total}条数据`,showSizeChanger: true,showQuickJumper:true},
        dateValue: [],
        loading: false,
        truck:'',
        selected: '',
        value:'',
        weightJurisdiction:'',
        columns,
        visible: false,
        visibles:false,
        confirmLoading: false,
        money:'',
        money1:'',
        updateMoney:0,
        updateCase:'',
        moneyFreight:0,
        moneyFreightEnd:0,
        payfor:0,
        reachWeight: '',
        userId:this.userInfo().id,
        id:'',
        params:{
          page: 1,
          limit: 10,
          waybillId:this.$route.params.id,
          pro:1
        }
      }
    },
    methods: {
      ...mapGetters(['userInfo']),
      showModal() {
        console.log(this.weightJurisdiction)
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
      handleChanges(value){
        this.selected = value;
      },
      handleOks() {
        //有榜单全线收货
        this.confirmLoading = true;
        if (this.value == 1){
          this.updateMoney = this.money;
          this.moneyFreightEnd = (parseInt(this.payfor) + parseInt(this.money))
        } else if (this.value == 2){
          this.updateMoney = (parseInt("-"+this.money1));
          this.moneyFreightEnd = (parseInt(this.payfor) - parseInt(this.money1))
        }
        newAffirm({
          updateType:this.value,
          id:this.id,
          consignId:this.userId,
          reachWeight:this.reachWeight,
          updateCase:this.updateCase,
          updateMoney:this.updateMoney,
          moneyFreightEnd:this.moneyFreightEnd
        }).then((data) => {
          if (data.code == 200){
            this.$message.success('收货成功',5);
            this.fetch(this.params);
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
      handleCancels(e){
        this.visibles = false
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
      confirmReceipt (id,state,moneyFreightEnd){
        this.id = id;
        this.payfor = moneyFreightEnd;
        this.showModal()
      },
      handleTableChange (pagination, filters) {
        const pager = { ...this.pagination }
        pager.current = pagination.current
        this.pagination = pager
        this.fetch({
          limit: pagination.pageSize,
          page: pagination.current,
          waybillId:this.$route.params.id,
          pro:1,
          truckNum: this.truck,
          selected:this.selected,
          startTime:this.dateValue[0],
          endTime:this.dateValue[1],
          ...filters
        })
      },
      fetch (params = {}) {
        // console.log('params:', params)
        this.loading = true
        selectTransportsList(params,this.userInfo().id).then((data) => {
          // console.log('datas:', data)
          const pagination = { ...this.pagination }
          pagination.total = data.rowCount
          this.loading = false
          this.data = data.data
          this.pagination = pagination
        })
      },
      onChange (value, dateString) {
        if (dateString.length > 0){
          this.dateValue = dateString;
          this.date0 = value;
        }else {
          this.dateValue = null;
        }
      },
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
      reset(){
        this.truck = '';
        this.date0 = [];
        this.value = '';
      },
      search () {
        this.fetch({
          page: 1,
          limit: 10,
          pro:1,
          waybillId:this.$route.params.id,
          truckNum: this.truck,
          selected:this.selected,
          startTime:this.dateValue[0],
          endTime:this.dateValue[1]
        })
      },
      setClassName (record) {
        console.log(record);
          this.$router.push({
            name:'transportDetails',
            params:record
          })
      }
    }
  }


</script>
<style >
  .noShow{
    display: none;
  }
  .show{
    display: block;
  }
</style>
