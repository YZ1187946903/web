<template>
  <div class="user-wrapper">
    <div class="content-box">

      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <span style="margin-right: 10px">{{ nickname() }}</span>
          <a-avatar v-if="avatar().trim().length>0" class="avatar" size="small" :src="avatar()"/>
          <a-avatar v-else class="avatar" size="small" :src="logo"/>

        </span>
        <a-menu slot="overlay" style="float: right" >


          <a-menu-item key="0">
            <a href="javascript:;" >

              <span style="margin-left: 20px">{{userInfo().mobile}}</span>
            </a>
          </a-menu-item>
          <a-menu-item key="2" @click="showPassword(true)">
            <a href="javascript:;">
              <a-icon type="lock" />
              <span style="margin-left: 10px">修改登录密码</span>
            </a>
          </a-menu-item>
          <a-menu-item key="3" @click="showOpinion(true)">
            <a href="javascript:;" >
              <a-icon type="solution" />
              <span style="margin-left: 10px">意见反馈</span>
            </a>
          </a-menu-item>
          <a-menu-item key="4">
            <a href="javascript:;" @click="showCustomerService(true)">
              <a-icon type="message" />
              <span style="margin-left: 10px">客服信息</span>
            </a>
          </a-menu-item>
          <a-menu-item key="5" @click="$router.push({name:'About'})">
            <a href="javascript:;" >
              <a-icon type="team" />
              <span style="margin-left: 10px">关于我们</span>
            </a>
          </a-menu-item>
          <a-menu-item key="6">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span style="margin-left: 10px">退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <span class="action" @click="handlerWeak">
        <a-icon type="eye" style="font-size: 20px"/>
      </span>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import logo from '@/assets/logo.png'
import {updateColorWeak} from '@/components/SettingDrawer/settingConfig'
export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  created () {
    console.log(this.avatar().length)
  },
  data () {
    return {
      logo
    }
  },
  methods: {
    ...mapActions(['Logout','showPayPwd','showPassword','showOpinion','showCustomerService']),
    ...mapGetters(['nickname', 'avatar', 'weak',"userInfo","showEditPassword"]),
    handlerWeak () {
      const isWeak = this.weak()
      this.$store.dispatch('ToggleWeak', !isWeak)
      updateColorWeak(!isWeak)



      if (!isWeak) {
        document.body.classList.add('colorWeak')
        this.$message.info('护眼模式已开启', 1)
      } else {
        document.body.classList.remove('colorWeak')
        this.$message.info('护眼模式已关闭', 1)
      }
    },
    handleLogout () {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that.Logout({}).then(() => {
            window.location.reload()
          }).catch(err => {
            console.log(err)
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
