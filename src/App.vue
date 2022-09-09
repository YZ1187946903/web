<template lang="pug">

  a-locale-provider(:locale="locale")
    div#app
      router-view

</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import bootstarp from '@/core/bootstrap'
export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {
    bootstarp()
  }
}
</script>
<style>
  #app {
    height: 100%;
  }
</style>
