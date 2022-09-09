<template>
  <div class="main">
    <div class="top">
      <div class="header">
        <a href="/">
          <img src="~@/assets/login/Logo1.png" class="logo" alt="logo" style="margin-top: 38px">

        </a>
      </div>
      <div class="desc">
       
      </div>
    </div>
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入账号"
          v-decorator="[
            'userName',
            {rules: [{ required: true, message: '请输入帐号' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入密码"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>


      <!-- <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="输入验证码"
          v-decorator="['vNum', {rules: [{ required: true,  message: '请输入验证码' }], validateTrigger: 'blur'}]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
       </a-input>
      </a-form-item>
      <div>       
        <div class="v_code" @click="refreshCode">
          <s-identify :identifyCode="identifyCode"></s-identify>
        </div>
        <div  class="v_text">看不清,请点击图片换一张</div>
      </div> -->
      <a-form-item>

        <router-link
          :to="{ name: 'RetrievePwd' }"
          class="forge-password"
          style="float: right"
        >忘记密码?</router-link>
      </a-form-item>

      <a-form-item style="margin-top:24px; ">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确认登录</a-button>
      </a-form-item>

    </a-form>

    <!-- <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha> -->
  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha } from '@/api/login'
import SIdentify from '@/components/Modal/identify'

export default {
  components: {
    TwoStepCaptcha,
    SIdentify
  },
  data () {
    return {
      identifyCodes: "ABCEFGHJKLMNPQRSTWXY123456789",
      identifyCode: "",
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 mobile
        loginType: 2,
        smsSendBtn: false
      }
    }
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    ...mapActions(['Login', 'Logout']),

    handleSubmit (e) {
      console.log(e)
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['userName', 'password'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          // let vCode = values.vNum
          // if(vCode.toUpperCase()!=this.identifyCode){
          //   this.requestFailed("验证码错误");
          //   setTimeout(() => {
          //     state.loginBtn = false
          //   }, 600)
          //   this.refreshCode()
          //   return
          // }
          const loginParams = {
            userName: values.userName,
            password: values.password
          }
          console.log(loginParams)
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              this.refreshCode()
              setTimeout(() => {
                state.loginBtn = false
              }, 600)
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile }).then(res => {
            setTimeout(hide, 2500)
            this.$notification['success']({
              message: '提示',
              description: '验证码获取成功，您的验证码为：' + res.result.captcha,
              duration: 8
            })
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.requestFailed(err)
          })
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },

    loginSuccess (res) {
      console.log(123123123)
      this.$router.push('/')
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: err,
        duration: 4
      })
    },
    //验证码
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
      //console.log(this.identifyCode);
    }
  }
}
</script>

<style lang="less" scoped>
  .main{
    background-color: white;
    padding: 0px 20px;
    border-radius:11px;
    width:406px;
    height:522px;
  }
  .top {
    padding-top: 10px;
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;

      .badge {
        position: absolute;
        display: inline-block;
        line-height: 1;
        vertical-align: middle;
        margin-left: -12px;
        margin-top: -10px;
        opacity: 0.8;
      }

      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
        border-style: none;
      }

      .title {
        font-size: 33px;
        color: rgba(0, 0, 0, .85);
        font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 20px;
      color: rgba(97, 163, 49, 1);
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
.user-layout-login {
  margin-top: 90px;
  padding-bottom: 5px;
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .v_code{
    display: inline-block;
    width: 115px;
  }
  .v_text{
    padding-left: 10px;
    display: inline-block;
    width: 200px;
  }

  .forge-password {
    font-size: 14px;
  color: #F16227;
  }

  button.login-button {
 /*   padding: 0 10px;
    font-size: 16px;
     width:361px;
    height:44px;
   */
    height: 40px;
    width: 100%;
    background:linear-gradient(90deg,rgba(254,133,66,1),rgba(241,97,38,1));
    border-radius:7px;
    border-color:#F16227;
  }

}
</style>
