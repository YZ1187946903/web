<template>
  <div>
    <a-button type="primary" @click="addInfoTo">
       <span>添加司机</span>
      <a-icon :component="add"/>
    </a-button>
    <div  style="margin: 15px 0px;">
      <a-input  placeholder="司机名称" style="width:240px;" v-model="name"></a-input>
      <a-input  placeholder="司机电话" style="width:240px;" v-model="mobile"></a-input>
      <a-button type="primary" style="margin-left: 10px;" @click="search">搜索</a-button>

    </div>
    <div>
    <a-table :columns="columns" :dataSource="infoList"  :pagination="false">
        <span slot="timeFormat" slot-scope="text, record">
             {{ record.createTime.replace("T"," ") }}
        </span>
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
          <span style="font-size: 20px;color: black">添加司机</span>
        </div>
        <a-row>
          <a-col :md="12" :sm="24"  class="modal-content-item">
            <span>司机名称</span>
            <a-input placeholder="输入司机名称" class="item-input"  v-model="addValue.name"/>
          </a-col>
          <a-col :md="12" :sm="24"  class="modal-content-item">
            <span>司机电话</span>
            <a-input placeholder="输入司机电话" class="item-input" v-model="addValue.mobile"/>
          </a-col>
          <a-col :md="12" :sm="24"  class="modal-content-item">
            <span>身份证号</span>
            <a-input placeholder="输入身份证号" class="item-input" v-model="addValue.cardNum"/>
          </a-col>
          <a-col :md="12" :sm="24"  class="modal-content-item">
            <span>驾驶证号</span>
            <a-input placeholder="输入驾驶证号" class="item-input" v-model="addValue.driverNum"/>
          </a-col>

        </a-row>


        <div class="modal-content-bottom">
          <a-button type="primary" :loading="loadingSave" @click="saveInfo">保存</a-button>
          <a-button style="margin-left: 10px" @click="closeAlert">返回</a-button>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
  import {getList,addInfo} from '@/api/driver'
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
         name:"",
         mobile:"",
         total:0, //列表总条数
         pageParams:{
           name:"",
           mobile:"",
           pageSize: 10,
           pageNum: 1,
           // total: 10
         },
         columns:[
           {
             title: '司机名称',
             dataIndex: 'name',
           }, {
             title: '身份证号',
             dataIndex: 'cardNum',
           }, {
             title: '电话',
             dataIndex: 'mobile',
           },
           {
             title: '创建时间',
             dataIndex: 'createTime',
             scopedSlots: { customRender: 'timeFormat' },
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
         /**
       * 保存
       * */
      saveInfo(){
        let params={
          name:this.addValue.name,
          mobile:this.addValue.mobile,
          cardNum:this.addValue.cardNum,
          driverNum:this.addValue.driverNum,  
        };
        // console.log(params)
        if(params.name.length<=0){
          this.$notification['warning']({
            message: '提示',
            description: '名称不能为空',
            duration: 2
          })
          return;
        }
        if(params.mobile.length<=10){
          this.$notification['warning']({
            message: '提示',
            description: '电话号码格式不正确',
            duration: 2
          })
          return;
        }
        if(params.cardNum.length<=10){
          this.$notification['warning']({
            message: '提示',
            description: '身份证格式不正确',
            duration: 2
          })
          return;
        }
        if(params.driverNum.length<=10){
          this.$notification['warning']({
            message: '提示',
            description: '身份证格式不正确',
            duration: 2
          })
          return;
        }

        this.loadingSave=true;
        //判断是不是在编辑，编辑的话提交数据到编辑接口，新增的话提交数据到新增接口
        addInfo(params).then(res=>{
            if(res.code==200){
              this.$notification['success']({
                message: '提示',
                description: res.msg,
                duration: 2
              })

              this.closeAlert();
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
      changeValue(v){
        if(this.isSelectClickMap){
          this.searchAddr(this.addValue.detailAddr);
        }else{
          this.addValue.detailAddr='';
          this.$message.warn("请先选择省市区",1);
        }
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