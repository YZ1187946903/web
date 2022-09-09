<template>
  <div id="yarn">
    <div class="modal" v-show="isShowModal" >
      <a-spin tip="加载中...">
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin/>
      </a-spin>
    </div>

    <a-button type="primary" @click="addYard">
      <span>新增仓库</span>
      <a-icon :component="add"/>
    </a-button>
    <div v-show="pageData.length===0&&!isShowModal" style="margin-top: 20px"><h2>暂无数据</h2></div>
    <a-row>
      <a-col
        :md="7"
        style="height: 300px"
        :sm="24"
        class="col"
        v-for="(item,index) in pageData"
        :key="index"
        :offset="index%3===0?0:isMin">
        <a-card>
              <a-button type="primary" @click="manageGoods(item.id)" class="action">
                <span>商品管理</span>
                <a-icon :component="edit"/>
              </a-button>
          <p>仓库名称：
            <span class="item-value">{{ item.name }}</span>
          </p>
          <p>仓库电话：
            <span class="item-value">{{ item.wareMobile}}</span></p>
          <p>详细地址：
            <span class="item-value">{{ (item.address)}}</span>
          </p>
        </a-card>
      </a-col>

    </a-row>
    <div class="footer" v-show="pageData.length!==0">
      <a-pagination showQuickJumper :pageSize.sync="pageParams.limit" :total="pageParams.total" @change="changePage"
                    :showTotal="showTotal"/>
    </div>
    <div id="show-notify">

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
          <span style="font-size: 20px;color: black">{{isEdit?"编辑仓库":"新增仓库"}}</span>
        </div>
        <a-row>
          <a-col :md="12" :sm="24"  class="modal-content-item">
            <span>仓库名称</span>
            <a-input placeholder="输入仓库名称" class="item-input"  v-model="addValue.yarnName"/>
          </a-col>
          <a-col :md="12" :sm="24"  class="modal-content-item">
            <span>联系方式</span>
            <a-input placeholder="输入仓库电话" class="item-input" v-model="addValue.mobile"/>
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
  import { mixinDevice } from '@/utils/mixin'
  import del from '@/assets/yard/del.svg?inline'
  import edit from '@/assets/yard/edit.svg?inline'
  import add from '@/assets/yard/add.svg?inline'
  import close from '@/assets/yard/closeWin.svg?inline'
  import { mapGetters } from 'vuex'
  import { addInfo,getList} from '@/api/warehouse'
  import {Distpicker}from '@/components'
  import VueAmap from 'vue-amap'
  export default {
    name: 'Warehouse',
    mixins: [mixinDevice],
    data () {
      return {
        msg: '仓库管理',
        showAddmodal:false,
        contruldress:false,
        del,
        edit,
        add,
        close,
        loadingSave:false,
        slotStyle: {
          padding: '2px 8px',
          background: '#eee',
          color: '#333',
          border: '1px solid #aaa'
        },
        isEdit:false,
        tmpId:'',
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

          }
        ,

        addValue:{
          detailAddr:'',
          yarnName:'',
          mobile:'',
          select: { province: '省', city: '市', area: '区' },
          lnglat:[]

        },
        pageParams: {
          limit: 9,
          page: 1,
          total: 10
        },
        pageData: [],
        isShowModal: false,
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


    computed: {
      isMin () {
        if (this.isMobile()) {
          return 0
        }
        return 1
      }
    },
    watch:{
      showAddmodal(newVal,oldVal){

        if(!newVal){
          this.closeAlert();
        }
      }
    },
    components: {
      Distpicker
    },

    methods: {
      ...mapGetters(['userInfo']),
      /**
       * 保存仓库
       * */
      saveInfo(){
        let params={
          name:this.addValue.yarnName,
          wareMobile:this.addValue.mobile,
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
        if(params.wareMobile.length<=10){
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
              this.getData();
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
      manageGoods(id){
        this.$router.push({
          name:'Goods',
          params:{
            warehouseId:id
          }
        })
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
      /**
       * 省市区发生改变时
       * */
      changeValue(v){
        if(this.isSelectClickMap){
          this.searchAddr(this.addValue.detailAddr);
        }else{
          this.addValue.detailAddr='';
          this.$message.warn("请先选择省市区",1);
        }
      },
      /**
       * 选择城市
       * */
      selectCity(c){
        if(c.province){
          let city=c.province.value+c.city.value+c.area.value;
          this.addValue.select.province=c.province.value;
          this.addValue.select.city=c.city.value;
          this.addValue.select.area=c.area.value;
          this.searchAddr(city);
          this.isSelectClickMap=true;
        }else{
          /**
           * 如果是市就把他锁定只能在本地搜索
           */
          if(c.value.endsWith("市")){
            this.autoOptions.city=c.code;
          }

          this.searchAddr(c.value);
          this.isSelectClickMap=false;
        }

      },
      /**
       * 改变页码
       * */
      changePage (val) {
        if (val > 0) {
          this.pageParams.page = val;
          this.getData()
        }
      },
   
      /**
       * 显示条数
       * @param total
       * @param range
       * @returns {string}
       */
      showTotal (total, range) {
        return `共${total} 条`
      },
      /**
       * 获取数据
       * @returns {Promise<void>}
       */
      async getData () {
        this.isShowModal = true
        try {
          const res = await getList(this.pageParams)
          this.isShowModal = false
          if (res.code === 200) {
            this.pageData = res.data.list
            this.pageParams.total = res.data.total
          } else {

            this.$message.error(res.msg, 2)
          }
        } catch (e) {
          this.isShowModal = false
          this.$message.error('网络错误', 2)
        }
      }
    },
    created () {

      this.amapManager=new VueAmap.AMapManager();
      this.getData();
    }
  }
</script>

<style scoped lang="less">
  .col {
    margin-top: 10px;
  }

  .modal-content-bottom{
    text-align: center;
    margin-top: 20px;
    padding: 10px;
  }
  .modal-header-content{
    span{
      border-bottom: 10px solid rgba(241, 97, 38, 1);
      box-sizing: border-box;
    }

  }
  .modal-content-item{
    margin-top: 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    span{
      margin-right: 10px;
      width: 15%;
      float: left;
    }
    .item-input{
      width: 80%;
      /*margin-top: 5px;*/
    }

  }
  .amap-demo {
    height: 200px;
    margin-top: 20px;
  }
  #yarn {
    padding: 10px;
    background-color: white;
  }

  .action {
    background-color:rgba(241, 97, 38, 1);
    width: 80px;
    height: 30px;
    line-height: 30px;
    vertical-align: center;

    position: absolute;
    right: 0px;
    top: 0px;
    border-bottom-left-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
  .modal-header{
    float: right;
  }
  .footer {
    text-align: right;

    margin-top: 20px;
  }
  .input-inline{
    width: 23%;font-size: 12px;
    color: rgba(241, 97, 38, 1);
    height: 32px;
    border: 1px solid #d9d9d9;
    vertical-align: center;
    border-left: 0px;
    cursor: pointer;
    border-radius: 4px;
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;

    margin-top: 5px;
  }
  .item-value {
    color: rgb(46, 46, 46);
  }
  .postio{
    width: 80%;
  }
  .modal {
    margin: 200px auto;
    height: 130px;
    width: 130px;
    z-index: 10;
    left: 0px;
    right: 0px;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
    text-align: center;
    vertical-align: center;
    line-height: 130px;

  }
</style>
