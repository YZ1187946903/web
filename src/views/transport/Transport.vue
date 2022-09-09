<template>
  <div>

    <div  style="margin: 15px 0px;">
      <a-range-picker
        :showTime="{ format: 'HH:mm' }"
        format="YYYY-MM-DD HH:mm"
        :value="date0"
        :placeholder="['开始时间', '结束时间']"
        @change="onChange"
      />
       <a-select defaultValue="" style="width: 150px" @change="handleChanges" >
        <a-select-option value="">请选择运单状态</a-select-option>
        <a-select-option value="0">配货中</a-select-option>
        <a-select-option value="1">交接中</a-select-option>
        <a-select-option value="3">已完成</a-select-option>
        <a-select-option value="4">异常</a-select-option>
       </a-select>

      <a-button type="primary" style="margin-left: 10px;" @click="search">搜索</a-button>

    </div>
    <div>
    <a-table :columns="columns" :dataSource="infoList"  :pagination="false">
        <template slot="statusFormat" slot-scope="text">
            <span  v-if="text == 0" style='color: #51C758'>配送中</span>
            <span  v-if="text == 1" style='color: #2a5caa'>交接中</span>
            <span  v-if="text == 3" style='color: #3A92EA'>已完成</span>
            <span  v-if="text == 4" style='color: #F4AC3E'>异常</span>
        </template>

        <span slot="timeFormat" slot-scope="text, record">
             {{ record.createTime.replace("T"," ") }}
        </span>

        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="toInfo(record.id)" >详情</a-button>&nbsp;
          <a-button v-if="record.status == 4" type="primary" @click="addTranModel(record.id)" >异常处理</a-button>
          <a-button v-else type="primary" disabled="disabled" >异常处理</a-button>
        </template>
    </a-table>
      <div class="pageInfo">
        <a-pagination
          :total=total
          :pageSize=pageParams.pageSize
          :current=pageParams.pageNum
          :showTotal="(total, range) => `共${total}条数据`"
          @change="pageChange"
          @showSizeChange="pageChange"
        />
      </div>
    </div>

    <div  v-show="showAddmodal">
      <a-modal
        title=""
        v-model="showAddmodal"
        width="1000px"
        :maskClosable="false"
        :footer="null"
        :closable="false"
        style="top: 20px;bottom: 0px;"

      >
        <div class="modal-header" @click="closeAlert">
          <a-icon :component="close" style="font-size: 22px"/>
        </div>
        <br>
        <div class="modal-header-content">
          <span style="font-size: 20px;color: black">选择车辆</span>
        </div>
            <a-table :columns="truckColumns"
            :dataSource="truckList"
            :pagination="false"
            >
                <template slot="operation" slot-scope="text, record">
                  <a-button type="primary" @click="editOne(record.id)" >选择</a-button>
                </template>
            </a-table>

        <div class="modal-content-bottom">
          <a-button style="margin-left: 10px" @click="closeAlert">返回</a-button>
        </div>
      </a-modal>
    </div>


  </div>
</template>

<script>
  import {getList} from '@/api/truck'
  import {getTranList,handlex} from '@/api/transport'
  import add from '@/assets/yard/add.svg?inline'
  import {mapGetters} from 'vuex'
  import VueAmap from 'vue-amap'
  export default {
    name: 'TransportList',
    data(){
       return{
         add,
         showAddmodal:false,
         loadingSave:false,
         loading:false,
         infoList:[],
         truckNum:"",
         name:"",
         mobile:"",
         total:0, //列表总条数
         pageParams:{
           pageSize: 10,
           pageNum: 1,
           // total: 10
         },
         tranId:"",
         truckList:[],
         dateValue:[],
         date0:"",
         selected:"",
         columns:[
            {
             title: '运单编号',
             dataIndex: 'id',
           },
           {
             title: '车牌号',
             dataIndex: 'truckNum',
           }, {
             title: '司机名称',
             dataIndex: 'driverName',
           },{
             title: '司机电话',
             dataIndex: 'driverMobile',
           },
           {
             title: '状态',
             dataIndex: 'status',
             scopedSlots: { customRender: 'statusFormat' },
           },
           {
             title: '发起时间',
             dataIndex: 'createTime',
             scopedSlots: { customRender: 'timeFormat' },
           },{
                title: '操作',
                scopedSlots: { customRender: 'operation' }
            }
         ],
        truckColumns:[
           {
             title: '车牌号',
             dataIndex: 'truckNum',
           }, {
             title: '司机名称',
             dataIndex: 'driverName',
           }, {
             title: '司机电话',
             dataIndex: 'driverMobile',
           },{
                title: '操作',
                scopedSlots: { customRender: 'operation' }
            }
         ],
        plugin: [],

      }
    },
    watch:{
      showAddmodal(newVal,oldVal){

        if(!newVal){
          this.closeAlert();
        }
      }
    },
    methods:{
      async addTranModel(id){
         this.tranId=id
         try {
          let pageParam={};
          let res=await getList(pageParam);
          if(res.code==200) {
            this.truckList=res.data.list;
          }else {
            this.$message.error(res.message, 2)
          }
        }catch (e) {
          this.loading = false
          this.$message.error("网络错误",2);
        }
        this.showAddmodal=true
        this.isSelectClickMap=false;
        console.log( this.isSelectClickMap)
      },

      onChange (value, dateString) {
        console.log('Selected Time: ', dateString)
        if (dateString.length > 0){
            this.dateValue = dateString;
            this.date0 = value;

        }else {
            this.dateValue = null;
        }
      },
      editOne(id){
        let params={
          truckId:id,
          id:this.tranId
        };

        handlex(params).then(res=>{
            if(res.code==200){
              this.$notification['success']({
                message: '提示',
                description: res.msg,
                duration: 2
              })
           this.showAddmodal=false;
           this.getPageList();

            }else{
              this.$notification['warning']({
                message: '提示',
                description: res.msg,
                duration: 2
              })
            }
            this.loadingSave=false;
          }).catch(e=>{
            this.loadingSave=false;
            this.$notification['error']({
              message: '提示',
              description: "添加失败，网络错误",
              duration: 2
            })
          })
      },

      handleChanges(value){
        this.selected = value;
      },

      ...mapGetters(["userInfo"]),


      addInfoTo(){
        this.showAddmodal=true
        this.isSelectClickMap=false;
        console.log( this.isSelectClickMap)
      },
            /**
       * 关闭弹窗
       */
      closeAlert(){
        this.showAddmodal=false;
        this.contruldress=false;
        this.center=[116.416357, 39.928353];
        this.addValue.mobile='';
        this.addValue.name='';
        this.addValue.truckNum='';
        this.addValue.cardNum='';
        this.addValue.driverNum='';
        this.isEdit=true;
        this.isSelectClickMap=false;
        if(this.isEdit){
          this.isEdit=false;
        }

      },
      async getPageList(){
        this.loading = true
        try {
          this.pageParams.startTime=this.dateValue[0];
          this.pageParams.endTime=this.dateValue[1];
          if(this.selected){
              this.pageParams.status=this.selected;
          }
          let res=await getTranList(this.pageParams);
          this.loading = false
          if(res.code==200) {
            this.infoList=res.data.list;
            this.total=res.data.total;
            // this.pageParams.total = res.rowCount
          }else {
            this.$message.error(res.message, 2)
          }
        }catch (e) {
          this.loading = false
          this.$message.error("网络错误",2);
        }
      },
      search(){
        this.pageParams.pageNum=1;
        this.pageParams.pageSize=10;
        this.getPageList()
      },
      pageChange(page,size){ //修改分页
        this.pageParams.pageSize=size
        this.pageParams.pageNum=page
        // reqParams
        this.getPageList()

      },

      changeValue(v){
        if(this.isSelectClickMap){
          this.searchAddr(this.addValue.detailAddr);
        }else{
          this.addValue.detailAddr='';
          this.$message.warn("请先选择省市区",1);
        }
      },
      toInfo(id){
            this.$router.push({
            name:'TransportInfo',
            query:{
                tansportId:id
            }
            })
      },
    },


    created(){
       this.amapManager=new VueAmap.AMapManager();
       this.getPageList()
    }
  }
</script>

<style  scoped lang="less">
  .pageInfo {
    padding-top: 24px;
    float: right;
  }
</style>