<template>

  <div>
    <div style="width:30%;margin-bottom:20px;">
        <h2>商家信息</h2>  
        <a-row>
          
          <a-col :md="24" :sm="24"   >
            <span>需求编号</span>
            <a-input placeholder="输入商品名称" readonly class="item-input" v-model="info.id" />
          </a-col>
          <a-col :md="24" :sm="24"  >
            <span>商家名称</span>
            <a-input placeholder="输入商品编号" readonly class="item-input" v-model="info.storeName"/>
          </a-col>
          <a-col :md="24" :sm="24" >
            <span>商家电话</span>
            <div class="postio"><a-input placeholder="商品库存" readonly  v-model="info.storeMobile"/></div>
          </a-col>
        </a-row>
    </div>

    <a-button type="primary" @click="addStore" :disabled="disabledInfo" >
       <span>需求审核</span>
    </a-button>

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
          <span style="font-size: 20px;color: black">审核</span>
        </div>
        <a-row>
          <a-col :md="24" :sm="24"  class="modal-content-item">
            <a-radio-group default-value="1" v-model="check.status" button-style="solid">
                <a-radio-button value="1">
                审核通过
                </a-radio-button>
                <a-radio-button value="3">
                审核驳回
                </a-radio-button>
            </a-radio-group>
          </a-col>
          <br/><br/><br/>
          <a-col :md="24" :sm="24"  class="modal-content-item" v-if="check.status==3">
            <span>驳回原因</span>
            <a-input placeholder="输入驳回原因" class="item-input" v-model="check.rejectInfo"/>
          </a-col>
        </a-row>
        <br/><br/>
        <div class="modal-content-bottom">
          <a-button type="primary" :loading="loadingSave" @click="checkInfo">提交</a-button>
          <a-button style="margin-left: 10px" @click="closeAlert">返回</a-button>
        </div>
      </a-modal>
    </div>
    <!-- -->

  </div>

 

</template>

<script>
  import {getListByNeed} from '@/api/needGoods'
  import {getInfo,checkNeed} from '@/api/need'
  import add from '@/assets/yard/add.svg?inline'
  import {mapGetters} from 'vuex'
  import VueAmap from 'vue-amap'
  export default {
    name: 'Goods',
    data(){
       return{
         disabledInfo:false,
         add,
         addValue:{
          goodsName:'',
          goodsNum:'',
          goodsStock:''
         },
         check:{
             rejectInfo:"",
             status:"1"
         },
         info:{
            id:"",
            storeName:"",
            storeMobile:""
         },
         upGoodsId:'',
         upGoodsStock:'',
         showAddStModal:false,
         showAddmodal:false,
         loadingSave:false,
         loading:false,
         infoList:[],
         goodsName:"",
         goodsNum:"",
         imageUrl: '',
         total:0, //列表总条数
         pageParams:{
           goodsName:"",
           goodsNum:"",
           warehouseId:"",
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
           }, 
           {
             title: '创建时间',
             dataIndex: 'createTime',
             scopedSlots: { customRender: 'timeFormat' },
           },
          {
             title: '修改时间',
             dataIndex: 'updateTime',
             scopedSlots: { customRender: 'timeFormat' },
           },
         ],
          marker:
          {
            position: [108.95355,34.263977],
            events: {
              click: () => {

              },
              dragend: (e) => {

              }
            },
            visible: true,
            draggable: false,
            label:{
              content:'西安',
              offset:[0,30]
            },

          },
        amapManager:{},
        isSelectClickMap:false,
        zoom: 12,
        center:[108.95355,34.263977],
        events: {
          init: (o) => {

          },
          'moveend': () => {
          },
          'zoomchange': () => {
          },
          'click': (e) => {
       
              // 这里通过高德 SDK 完成。
              var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
              });
              var that=this;
              that.addValue.lnglat=[e.lnglat.lng ,e.lnglat.lat];
              this.marker.position=[e.lnglat.lng ,e.lnglat.lat];
              geocoder.getAddress([e.lnglat.lng ,e.lnglat.lat], function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  if (result && result.regeocode) {
                    // console.log(result)
                    if(result.regeocode.addressComponent.province != ""){
                      that.addValue.select.province = result.regeocode.addressComponent.province;
                    }
                    if(result.regeocode.addressComponent.city != ""){
                      that.addValue.select.city = result.regeocode.addressComponent.city;
                    }
                    if(result.regeocode.addressComponent.district != ""){
                      that.addValue.select.area = result.regeocode.addressComponent.district;
                    }

                    // that.addValue.select.province = result.regeocode.addressComponent.province;
                    // that.addValue.select.city = result.regeocode.addressComponent.city;
                    // that.addValue.select.area = result.regeocode.addressComponent.district;

                    that.addValue.detailAddr = result.regeocode.addressComponent.township+ result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber;
                    that.marker.label={
                      content : result.regeocode.addressComponent.township+ result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber,
                      offset:[0,-28]
                    }//;
                  }
                }
              });

          }
        },
        plugin: [],
        autoOptions:{
          city: '全国',
          citylimit:true
        }    


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
      addStore(){
        this.showAddmodal=true
        this.isSelectClickMap=false;
        console.log( this.isSelectClickMap)

      },
      upStock(id){
        this.showAddStModal=true
        this.upGoodsId = id
      },
      saveStock(){
        let params={
          id:this.upGoodsId,
          goodsStock:this.upGoodsStock
        };
        // console.log(params)
        if(params.goodsStock.length<=0){
          this.$notification['warning']({
            message: '提示',
            description: '添加库存不能为空',
            duration: 2
          })
          return;
        }
        this.loadingSave=true;
        //判断是不是在编辑，编辑的话提交数据到编辑接口，新增的话提交数据到新增接口
        addStock(params).then(res=>{
            if(res.code==200){
              this.$notification['success']({
                message: '提示',
                description: res.msg,
                duration: 2
              })
              this.closAddSt();
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
      
            /**
       * 关闭弹窗
       */
      closAddSt(){
          this.showAddStModal=false;
      },
      closeAlert(){
        this.showAddmodal=false;
        this.contruldress=false;
        this.center=[116.416357, 39.928353];
        this.addValue.detailAddr='';
        this.addValue.select.area='';
        this.addValue.lnglat=[];
        this.addValue.select.city='';
        this.addValue.select.province='';
        this.addValue.mobile='';
        this.addValue.yarnName='';
        this.isEdit=true;
        this.isSelectClickMap=false;
        if(this.isEdit){
          this.isEdit=false;
        }

      },
      async getPageInfo(){
        this.loading = true
        try {
          this.pageParams.id = this.$route.query.needId;
          let res=await getInfo(this.pageParams);
          this.loading = false
          if(res.code==200) {
            this.info=res.data;
            if(this.info.status!=0){
                this.disabledInfo=true;
            }
            // this.pageParams.total = res.rowCount
          }else {
            this.$message.error(res.message, 2)
          }
        }catch (e) {
          this.loading = false
          this.$message.error("网络错误",2);
        }
      },
      async getPageList(){
        this.loading = true
        try {
          this.pageParams.needId = this.$route.query.needId;
          let res=await getListByNeed(this.pageParams);
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
     
      checkInfo(){
        let params={
          status:this.check.status,
          rejectInfo:this.check.rejectInfo,
          id:this.$route.query.needId
        };
        // console.log(params)
        if(params.status==3&&params.rejectInfo.length<=0){
          this.$notification['warning']({
            message: '提示',
            description: '驳回原因不能为空',
            duration: 2
          })
          return;
        }
        this.loadingSave=true;
        //判断是不是在编辑，编辑的话提交数据到编辑接口，新增的话提交数据到新增接口
        checkNeed(params).then(res=>{
            if(res.code==200){
              this.$notification['success']({
                message: '提示',
                description: res.msg,
                duration: 2
              })
                this.$router.push({
                    name:'NeedList',
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
      //图片上传
        handleChange(info) {
            console.log(info)
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                this.getBase64(info.file.originFileObj, imageUrl => {
                this.imageUrl = info.file.response.data;
                this.loading = false;
                });
            }
        },
        getBase64(img, callback) {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result));
            reader.readAsDataURL(img);
        },
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('请上传一个jpg或png图片!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('I图片不能大于2MB!');
            }
            return isJpgOrPng && isLt2M;
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
       this.getPageInfo()
    }
  }
</script>

<style  scoped lang="less">
  .pageInfo {
    padding-top: 24px;
    float: right;
  }
</style>