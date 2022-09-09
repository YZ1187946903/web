<template>
  <div>
    <a-button type="primary" @click="addTranModel">
       <span>发起运单</span>
    </a-button>
    &nbsp;
    <a-button type="dashed" @click="clearTemp">
       <span>清空计划</span>
    </a-button>

    <div  style="margin: 15px 0px;">
      <a-input  placeholder="门店名称" style="width:240px;" v-model="storeName"></a-input>
      <a-input  placeholder="门店电话" style="width:240px;" v-model="storeMobile"></a-input>
      <a-button type="primary" style="margin-left: 10px;" @click="search">搜索</a-button>

    </div>
    <div>
    <a-table :columns="columns" 
    :dataSource="infoList" 
    :pagination="false"
    >
        <span slot="timeFormat" slot-scope="text, record">
             {{ record.createTime.replace("T"," ") }}
        </span>
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" >移除</a-button>
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
                  <a-button type="primary" @click="addOne(record.id)" >选择</a-button>
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
  import {getTempList,del} from '@/api/transportTemp'
  import {add} from '@/api/transport'
  import {mapGetters} from 'vuex'
  import VueAmap from 'vue-amap'
  export default {
    name: 'NeedList',
    data(){
       return{
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
         truckList:[],
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
         columns:[
           {
             title: '商品名称',
             dataIndex: 'goodsName',
           }, {
             title: '商品数量',
             dataIndex: 'goodsNum',
           }, {
             title: '需求门店',
             dataIndex: 'storeName',
           },{
             title: '商品仓库',
             dataIndex: 'warehouseName',
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
      async addTranModel(){
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

       addOne(id){
        
        let params={
          truckId:id,
          adminId:this.userInfo().id
        };
 
        add(params).then(res=>{
            if(res.code==200){
              this.$notification['success']({
                message: '提示',
                description: res.msg,
                duration: 2
              })
              this.$router.push({
                name:'NeedGoods',
              })

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

      clearTemp(){
        const params={
          adminId:this.userInfo().id
        };
        console.log(params)
          del(params).then(res=>{
            if(res.code==200){
              this.$notification['success']({
                message: '提示',
                description: res.msg,
                duration: 2
              })
              this.$router.push({
                name:'NeedGoods',
              })

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
          this.pageParams.adminId=this.userInfo().id;
          let res=await getTempList(this.pageParams);
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
    
      toTemp(){
          this.$router.push({
            name:'NeedGoodsTemp',
          })
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