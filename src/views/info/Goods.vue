<template>
  <div>
    <a-button type="primary" @click="addStore">
       <span>添加商品</span>
      <a-icon :component="add"/>
    </a-button>
    <div  style="margin: 15px 0px;">
      <a-input  placeholder="商品名称" style="width:240px;" v-model="goodsName"></a-input>
      <a-input  placeholder="商品编号" style="width:240px;" v-model="goodsNum"></a-input>
      <a-button type="primary" style="margin-left: 10px;" @click="search">搜索</a-button>
    </div>
    <div>
    <a-table :columns="columns" :dataSource="infoList"  :pagination="false">
        <span slot="timeFormat" slot-scope="text, record">
             {{ record.createTime.replace("T"," ") }}
        </span>
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="upStock(record.id)" >库存添加</a-button>
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
          <span style="font-size: 20px;color: black">添加商品</span>
        </div>
        <a-row>
          <a-col :md="24" :sm="24"  class="modal-content-item">
            <span>商品名称</span>
            <a-input placeholder="输入商品名称" class="item-input"  v-model="addValue.goodsName"/>
          </a-col>
          <a-col :md="24" :sm="24"  class="modal-content-item">
            <span>商品编号</span>
            <a-input placeholder="输入商品编号" class="item-input" v-model="addValue.goodsNum"/>
          </a-col>
          <a-col :md="24" :sm="24"  class="modal-content-item">
            <span>商品库存</span>
            <div class="postio"><a-input placeholder="商品库存"  v-model="addValue.goodsStock"/></div>
            <!--<p class="lookpart">查看定位</p>-->
          </a-col>
            <!-- <a-upload
                name="file"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                action="http://127.0.0.1:8082/file/upload"
                :before-upload="beforeUpload"
                @change="handleChange"
            >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                    Upload
                </div>
                </div>
            </a-upload> -->
        </a-row>

        <div class="modal-content-bottom">
          <a-button type="primary" :loading="loadingSave" @click="saveInfo">保存</a-button>
          <a-button style="margin-left: 10px" @click="closeAlert">返回</a-button>
        </div>
      </a-modal>
    </div>
    <!-- -->
    <div  v-show="showAddStModal">
      <a-modal
        title=""
        v-model="showAddStModal"
        width="600px"
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
          <span style="font-size: 20px;color: black">添加库存</span>
        </div>
        <a-row>
          <a-col :md="24" :sm="24"  class="modal-content-item">
            <span>商品库存</span>
            <div class="postio"><a-input placeholder="商品库存"  v-model="upGoodsStock"/></div>
            <!--<p class="lookpart">查看定位</p>-->
          </a-col>
        </a-row>

        <div class="modal-content-bottom">
          <a-button type="primary" :loading="loadingSave" @click="saveStock">保存</a-button>
          <a-button style="margin-left: 10px" @click="closeAlert">返回</a-button>
        </div>
      </a-modal>
    </div>
  </div>



</template>

<script>
  import {getList,addInfo,addStock} from '@/api/goods'
  import add from '@/assets/yard/add.svg?inline'
  import {mapGetters} from 'vuex'
  import VueAmap from 'vue-amap'
  export default {
    name: 'Goods',
    data(){
       return{
         add,
         addValue:{
          goodsName:'',
          goodsNum:'',
          goodsStock:''
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
             title: '商品编号',
             dataIndex: 'goodsNum',
           }, {
             title: '商品库存',
             dataIndex: 'goodsStock',
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
           {
                title: '操作',
                scopedSlots: { customRender: 'operation' }
            }
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
        this.isEdit=true;
        this.isSelectClickMap=false;
        if(this.isEdit){
          this.isEdit=false;
        }

      },
      async getPageList(){
        this.loading = true
        try {
          this.pageParams.goodsName=this.goodsName;
          this.pageParams.warehouseId = this.$route.params.warehouseId;
          this.pageParams.goodsNum=this.goodsNum;
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
       * 保存仓库
       * */
      saveInfo(){
        let params={
          goodsName:this.addValue.goodsName,
          goodsNum:this.addValue.goodsNum,
          goodsStock:this.addValue.goodsStock,
          imgUrl:this.imageUrl,
          warehouseId:this.$route.params.warehouseId
        };
        // console.log(params)
        if(params.goodsName.length<=0){
          this.$notification['warning']({
            message: '提示',
            description: '名称不能为空',
            duration: 2
          })
          return;
        }
        if(params.goodsNum.length<=5){
          this.$notification['warning']({
            message: '提示',
            description: '编号格式不正确(5-10位)',
            duration: 2
          })
          return;
        }
        if(params.goodsStock.length<=0){
          this.$notification['warning']({
            message: '提示',
            description: '库存必须填写',
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
    }
  }
</script>

<style  scoped lang="less">
  .pageInfo {
    padding-top: 24px;
    float: right;
  }
</style>