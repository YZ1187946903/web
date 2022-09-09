<template>
  <div>
    <a-button type="primary" @click="addStore">
       <span>新增门店</span>
      <a-icon :component="add"/>
    </a-button>
    <div  style="margin: 15px 0px;">
      <a-input  placeholder="门店名称" style="width:240px;" v-model="name"></a-input>
      <a-input  placeholder="门店电话" style="width:240px;" v-model="storeMobile"></a-input>
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
          <span style="font-size: 20px;color: black">新增门店</span>
        </div>
        <a-row>
          <a-col :md="12" :sm="24"  class="modal-content-item">
            <span>门店名称</span>
            <a-input placeholder="输入门店名称" class="item-input"  v-model="addValue.yarnName"/>
          </a-col>
          <a-col :md="12" :sm="24"  class="modal-content-item">
            <span>门店电话</span>
            <a-input placeholder="输入门店电话" class="item-input" v-model="addValue.mobile"/>
          </a-col>
          <a-col :md="12" :sm="24"  class="modal-content-item">
            <span>详细地址</span>
            <div class="postio"><a-input placeholder="输入详细地址" disabled @change="changeValue" v-model="addValue.detailAddr"/></div>
            <!--<p class="lookpart">查看定位</p>-->
          </a-col>
          <a-col :md="24" :sm="24">
            <div class="amap-page-container" style="width: 100%; height: 200px;" >
              <el-amap  ref="map"  vid="amapDemo" :center="center" :amap-manager="amapManager"  :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">

                <el-amap-marker :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" vid="marker" :label="marker.label">

                </el-amap-marker>
              </el-amap>
            </div>
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
  import {getList,addInfo} from '@/api/store'
  import add from '@/assets/yard/add.svg?inline'
  import {mapGetters} from 'vuex'
  import VueAmap from 'vue-amap'
  export default {
    name: 'Store',
    data(){
       return{
         add,
         addValue:{
          detailAddr:'',
          yarnName:'',
          mobile:'',
          select: { province: '省', city: '市', area: '区' },
          lnglat:[]

         },
         showAddmodal:false,
         loadingSave:false,
         loading:false,
         infoList:[],
         name:"",
         storeMobile:"",
         total:0, //列表总条数
         pageParams:{
           name:"",
           storeMobile:"",
           pageSize: 10,
           pageNum: 1,
           // total: 10
         },
         columns:[
           {
             title: '门店名称',
             dataIndex: 'name',
           }, {
             title: '门店电话',
             dataIndex: 'storeMobile',
           }, {
             title: '门店地址',
             dataIndex: 'address',
           },
           {
             title: '创建时间',
             dataIndex: 'createTime',
             scopedSlots: { customRender: 'timeFormat' },
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
            /**
       * 关闭弹窗
       */
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
      async getStoreList(){
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
        this.getStoreList()
      },
      pageChange(page,size){ //修改分页
        this.pageParams.pageSize=size
        this.pageParams.pageNum=page
        // reqParams
        this.getStoreList()

      },
         /**
       * 保存仓库
       * */
      saveInfo(){
        let params={
          name:this.addValue.yarnName,
          mobile:this.addValue.mobile,
          address:this.addValue.detailAddr,
          lon:this.addValue.lnglat[0]?this.addValue.lnglat[0]:0,
          lat:this.addValue.lnglat[1]?this.addValue.lnglat[1]:0
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
        if(params.lat==0||params.lon==0){
          this.$notification['warning']({
            message: '提示',
            description: '请选择位置',
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
              this.getStoreList();
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
       this.getStoreList()
    }
  }
</script>

<style  scoped lang="less">
  .pageInfo {
    padding-top: 24px;
    float: right;
  }
</style>