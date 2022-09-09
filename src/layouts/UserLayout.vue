<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">

      <route-view></route-view>

      <div class="footer">
        <!--        <div class="links">-->
        <!--          <a href="_self">帮助</a>-->
        <!--          <a href="_self">隐私</a>-->
        <!--          <a href="_self">条款</a>-->
        <!--        </div>-->
        <div class="copyright" v-if="this.device!==this.deviceType">
          授权使用 <span>KJ0901 备案号：<a href="http://www.beian.miit.gov.cn/">陕ICP备123009206号-1</a>  </span> <br/><br/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'
import { DEVICE_TYPE } from '@/utils/device'

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {
      deviceType: DEVICE_TYPE.MOBILE
    }
  },
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
  #userLayout.user-layout-wrapper {
    height: 100%;
    line-height: 100%;


    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
         
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      background: url('~@assets/login/bg.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;

      a {
        text-decoration: none;
      }

      .main {
        min-width: 260px;
        width: 368px;
        box-shadow: 5px 5px 5px #888888;
      
      }

      .footer {
        width: 100%;
        padding: 0 16px;
        margin: 20px 0 24px;
        text-align: center;
      

        .links {
          margin-bottom: 8px;
          font-size: 14px;

          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;

            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }

        .copyright {
          color: rgba(255, 255, 255, 1);
          font-size: 12px;
        }
      }
    }
  }
</style>
