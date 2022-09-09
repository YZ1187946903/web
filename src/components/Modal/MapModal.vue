<template>
  <div class="mapmodal">
    <a-modal
      title=""
      v-model="showMapModal"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      width="800px"
      style="top: 40px;"
    >
      <div class="modal-header" @click="closeAlert">
        <a-icon :component="close" style="font-size: 22px"/>
      </div>
      <br>
      <div class="modal-header-content">
        <span style="font-size: 20px;color: black">查看轨迹</span>
      </div>
      <div class="modal-content" style="height: 400px;margin-top: 30px">
        <el-amap vid="amapDemo" :center="center" :amap-manager="amapManager" :zoom="zoom" :events="events"
                 class="amap-demo">
          <el-amap-polyline :editable="polyline.editable" :path="polyline.path"
                            :events="polyline.events"></el-amap-polyline>
          <el-amap-marker  :offset="[-26, -13]" ref="marker"
                          :position="position" vid="index"></el-amap-marker>
        </el-amap>


      </div>
      <div style="padding: 20px;text-align: center">
        <a-button type="primary" @click="playAnim">播放</a-button>
        <a-button @click="pauseAnim" style="background-color: #ffd030;color: white">暂停</a-button>
        <a-button style="background-color: #a0d911;color: white" @click="resumeAnim">继续</a-button>
        <a-button style="background-color: red;color: white" @click="stopAnim">停止</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import close from '@/assets/yard/closeWin.svg?inline'
import VueAMap from 'vue-amap'
import { getRoad } from '@api/invoice_manage'

let amapManager = new VueAMap.AMapManager()
let lineAttr = [[121.5389385, 31.21515044], [121.5389385, 31.29615044], [121.5273285, 31.21515044]]
export default {
  name: 'MapModal.vue',
  data () {
    return {
      record: '',
      showMapModal: false,
      close,
      zoom: 7,
      center: [121.5389385, 31.21515044],
      position: [121.5389385, 31.21515044],
      amapManager,

      events: {
        init (o) {

        }
      },
      polyline: {
        path: lineAttr,
        events: {
          click (e) {
            alert('click polyline')
          },
          end: (e) => {
            let newPath = e.target.getPath().map(point => [point.lng, point.lat])

          }
        },
        editable: false
      }
    }
  },
  methods: {
    lookGuiJi (id) {

      getRoad({ transportId: id }).then(res => {
        if (res.code == 200) {
          this.polyline.path = []
          let paths = []
          if (res.data.length > 0) {
            res.data.forEach(e => {
              paths.push([e.lon, e.lat])
            })
            this.center = paths[Math.floor(paths.length / 2)]
            lineAttr = paths
            this.position = paths[0]
            this.polyline.path = paths
            this.zoom = 7
            this.showMapModal = true
          } else {
            this.$message.warning('暂时无法获取此车辆轨迹', 2)
          }
        } else {
          this.$message.warning('暂时无法获取此车辆轨迹', 2)
        }
      }).catch(e => {
        this.$message.error('网络错误', 2)
      })
    },
    closeAlert () {
      this.showMapModal = false
    },
    /**
     * 播放动画
     */
    playAnim () {
      this.$refs.marker.$$getInstance().moveAlong(lineAttr, 20000)
    },
    /**
     * 暂停动画
     */
    pauseAnim () {
      this.$refs.marker.$$getInstance().pauseMove()
    },
    /**
     * 继续播放
     */
    resumeAnim () {
      this.$refs.marker.$$getInstance().resumeMove()
    },
    /**
     * 停止播放
     */
    stopAnim () {
      this.$refs.marker.$$getInstance().stopMove()
    },
    init () {
      this.record = ''
      this.showMapModal = false
      this.close = close
      this.zoom = 7
      this.center = [121.5389385, 31.21515044]
      this.position = [121.5389385, 31.21515044]
      this.amapManager = amapManager,

        this.events = {
          init (o) {

          }
        },
        this.polyline = {
          path: lineAttr,
          events: {
            click (e) {
              alert('click polyline')
            },
            end: (e) => {
              let newPath = e.target.getPath().map(point => [point.lng, point.lat])

            }
          },
          editable: false
        }
    }
  },
  created () {
this.init();
  }
}
</script>

<style scoped lang="less">
  .amap-demo {
    height: 400px;
  }

  .modal-header {
    float: right;
  }

  .modal-header-content {
    span {
      border-bottom: 10px solid rgba(140, 200, 144, 1);
      box-sizing: border-box;
    }

  }
</style>