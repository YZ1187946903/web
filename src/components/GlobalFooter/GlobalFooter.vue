<template>
  <div class="footer">
    <div class="links">
    </div>
 
    <div class="copyright">
      Authorized use <span>KJ0901 备案号：<a href="http://www.beian.miit.gov.cn/">陕ICP备17039646号-2</a> 增值电信业务许可证编号：陕B2-00000000 </span>
      <br/>
      <span> 客服电话：029-00000000 &nbsp;&nbsp; 客服邮箱：<a href="kefu@k9.com" style="text-decoration:underline">kefu@k9.com</a> </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
