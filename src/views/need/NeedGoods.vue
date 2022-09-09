<template>
  <div>
    <a-button type="primary" @click="addTemp">
       <span>加入运输计划</span>
    </a-button>
    &nbsp;
    <a-button type="dashed" @click="toTemp">
       <span>查看运输计划</span>
    </a-button>

    <div  style="margin: 15px 0px;">
      <a-input  placeholder="门店名称" style="width:240px;" v-model="storeName"></a-input>
      <a-input  placeholder="门店电话" style="width:240px;" v-model="storeMobile"></a-input>
      <a-button type="primary" style="margin-left: 10px;" @click="search">搜索</a-button>

    </div>
    <div>
    <a-table :columns="columns" 
    :dataSource="infoList" 
    :rowKey="record=>record.id"  
    :pagination="false" 
    :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
    
    >
        <span slot="timeFormat" slot-scope="text, record">
             {{ record.createTime.replace("T"," ") }}
        </span>
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="addOne(record.id)" >加入计划</a-button>
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
  import {getList} from '@/api/needGoods'
  import {add} from '@/api/transportTemp'
  import {mapGetters} from 'vuex'
  import VueAmap from 'vue-amap'
  export default {
    name: 'NeedList',
    data(){
       return{
         selectedRowKeys:[],
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
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
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
      addOne(id){
        let params={
          ids:id,
          adminId:this.userInfo().id
        };
         
        add(params).then(res=>{
            if(res.code==200){
              this.$notification['success']({
                message: '提示',
                description: res.msg,
                duration: 2
              })
              this.getPageList()
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
      addTemp(){
          if(this.selectedRowKeys.length==0){
              this.$message.error("请选择至少一个",2);
              return;
          }
        let s = this.selectedRowKeys.toString();
        console.log(s)
        let params={
          ids:s,
          adminId:this.userInfo().id
        };
        //判断是不是在编辑，编辑的话提交数据到编辑接口，新增的话提交数据到新增接口
        add(params).then(res=>{
            if(res.code==200){
              this.$notification['success']({
                message: '提示',
                description: res.msg,
                duration: 2
              })
              this.getPageList()
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