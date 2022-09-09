<template>
  <div>

    <div  style="margin: 15px 0px;">
      <a-input  placeholder="门店名称" style="width:240px;" v-model="storeName"></a-input>
      <a-input  placeholder="门店电话" style="width:240px;" v-model="storeMobile"></a-input>
      <a-button type="primary" style="margin-left: 10px;" @click="search">搜索</a-button>

    </div>
    <div>
    <a-table :columns="columns" :dataSource="infoList"  :pagination="false">
        <template slot="statusFormat" slot-scope="text">
            <span  v-if="text == 0" style='color: #51C758'>未审核</span>
            <span  v-if="text == 1" style='color: #3A92EA'>配送中</span>
            <span  v-if="text == 2" style='color: #F4AC3E'>已完成</span>
            <span  v-if="text == 3" style='color: #000000'>已驳回</span>
        </template>

        <span slot="timeFormat" slot-scope="text, record">
             {{ record.createTime.replace("T"," ") }}
        </span>

        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="toInfo(record.id)" >审核/详情</a-button>
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
  </div>
</template>

<script>
  import {getList} from '@/api/need'
  import add from '@/assets/yard/add.svg?inline'
  import {mapGetters} from 'vuex'
  import VueAmap from 'vue-amap'
  export default {
    name: 'NeedList',
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
           storeName:"",
           storeMobile:"",
           pageSize: 10,
           pageNum: 1,
           // total: 10
         },
         columns:[
            {
             title: '需求编号',
             dataIndex: 'id',
           },
           {
             title: '门店名称',
             dataIndex: 'storeName',
           }, {
             title: '门店电话',
             dataIndex: 'storeMobile',
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
          this.pageParams.name=this.name;
          this.pageParams.storeMobile=this.storeMobile;
          this.pageParams.truckNum=this.truckNum;
          let res=await getList(this.pageParams);
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
            name:'NeedInfo',
            query:{
                needId:id
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