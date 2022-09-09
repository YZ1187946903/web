<template>
  <div>
    <a-button type="primary" disabled>
       <span>添加车辆</span>
      <a-icon :component="add"/>
    </a-button>
    <div  style="margin: 15px 0px;">
      <a-input  placeholder="车牌号" style="width:240px;" v-model="truckNum"></a-input>
      <a-input  placeholder="司机名称" style="width:240px;" v-model="name"></a-input>
      <a-input  placeholder="司机电话" style="width:240px;" v-model="mobile"></a-input>
      <a-button type="primary" style="margin-left: 10px;" @click="search">搜索</a-button>

    </div>
    <div>
    <a-table :columns="columns" :dataSource="infoList"  :pagination="false">
        <span slot="timeFormat" slot-scope="text, record">
             {{ record.createTime.replace("T"," ") }}
        </span>
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="setDriver(record.id)" >更换司机</a-button>
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
  import {getList} from '@/api/truck'
  import add from '@/assets/yard/add.svg?inline'
  import {mapGetters} from 'vuex'
  import VueAmap from 'vue-amap'
  export default {
    name: 'Truck',
    data(){
       return{
         add,
         addValue:{
          name:'',
          mobile:'',
          cardNum:'',
          driverNum:''
         },
         showAddmodal:false,
         loadingSave:false,
         loading:false,
         infoList:[],
         truckNum:"",
         name:"",
         mobile:"",
         total:0, //列表总条数
         pageParams:{
           truckNum:"",
           name:"",
           mobile:"",
           pageSize: 10,
           pageNum: 1,
           // total: 10
         },
         columns:[
           {
             title: '车牌号',
             dataIndex: 'truckNum',
           }, {
             title: '司机名称',
             dataIndex: 'driverName',
           }, {
             title: '电话',
             dataIndex: 'driverMobile',
           },{
             title: '车辆类型',
             dataIndex: 'truckType',
           },
           {
             title: '创建时间',
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
      setDriver(id){
            this.$router.push({
            name:'SetDriver',
            query:{
                truckId:id
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