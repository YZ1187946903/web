<template>
  <div>
    <div style="height: 140px;background-color: #FFFFFFFF">
      <div style="width: 10%;height: 140px;float: left">
        <a-button type="primary" :block="true" style="width: 146px;height: 140px;font-size:30px">
         K9-TMS
        </a-button>
      </div>

      <a-row style="width: 90%;height: 140px;float: left ">
        <a-col :sm="8" :md="8" style="height: 140px">
          <img :src="pay" style="margin: 55px auto 40px 90px; float: left" />
          <div style="float: left;margin: 25px auto auto 30px">
            <h2>待审核</h2>
            <div>
              <img :src="yellow"/><span
              style="display: inline;margin: 7px 0px 0px 15px">30单</span>
            </div>
    
          </div>
          <div style="width: 1px;height: 55px;background-color: #EAEAEAFF;float: right;margin: 42px 0px 43px 0px"></div>
        </a-col>
        <a-col :sm="8" :md="8" style="height: 140px">
          <img :src="receivinggoods" style="margin: 55px auto 40px 90px; float: left" />
          <div style="float: left;margin: 25px auto auto 30px">
            <h2>运输中</h2>
            <div>
              <img :src="yellow"/><span
              style="display: inline;margin: 7px 0px 0px 15px">15单</span>
            </div>
          </div>
          <div style="width: 1px;height: 55px;background-color: #EAEAEAFF;float: right;margin: 42px 0px 43px 0px"></div>
        </a-col>
        <a-col :sm="8" :md="8" style="height: 140px">
          <img :src="invoice" style="margin: 55px auto 40px 90px; float: left"/>
          <div style="float: left;margin: 25px auto auto 30px">
            <h2>已完成</h2>
            <div>
              <img :src="yellow"/><span
              style="display: inline;margin: 7px 0px 0px 15px">80单</span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div style="margin: 15px auto;height: 120px;">
      <a-row>
        <a-col :md="7" style="height:120px;background-color:#FFFFFFFF">
          <img :src="one" style="float:left;margin: 24px 0px 20px 20px"/>
          <div style="margin: 15px 0px 0px 20px ">
            <div style="float: left; margin: 1px 1px 1px 100px;">
              <h3>本月完成配送量</h3>
              <h2 style="color: #999999FF">560</h2>
            </div>

          </div>
        </a-col>
        <a-col :md="7" :push="1" style="height:120px;margin: 0px 34px;background-color:#FFFFFFFF">
          <img :src="two" style="float:left;margin: 24px 0px 20px 20px"/>
          <div style="margin: 15px 0px 0px 20px ">
            <div style="float: left; margin: 1px 1px 1px 100px;">
              <h3>本月配送商品量</h3>
              <h2 style="color: #999999FF">7890</h2>
            </div>

          </div>
        </a-col>
        <a-col :md="7" :push="2" style="height:120px;background-color:#FFFFFFFF">
          <img :src="three" style="float:left;margin: 24px 0px 20px 20px"/>
          <div style="margin: 15px 0px 0px 20px ">
            <div style="float: left; margin: 1px 1px 1px 100px;">
              <h3>本月完成单数</h3>
              <h2 style="color: #999999FF">89</h2>
            </div>

          </div>
        </a-col>
      </a-row>
    </div>
  
  </div>

</template>
<script>
  import { mixinDevice } from '@/utils/mixin'
  import deliover from '@assets/dashboard/delivergoods.png'
  import pay from '@assets/dashboard/pay.png'
  import blue from '@assets/dashboard/blue.png'
  import yellow from '@assets/dashboard/yellow.png'
  import receivinggoods from '@assets/dashboard/receivinggoods.png'
  import invoice from '@assets/dashboard/invoice.png'
  import one from '@assets/dashboard/1.png'
  import two from '@assets/dashboard/2.png'
  import three from '@assets/dashboard/3.png'
  import price from '@assets/dashboard/price.png'
  import transport from '@assets/dashboard/transport.png'

  import { mapGetters } from 'vuex'

  /**
   * 控制台

   */
  export default {
    name: 'Workspace',
    mixins: [mixinDevice],
    data() {
      return {
        deliover,
        pay,
        blue,
        yellow,
        receivinggoods,
        invoice,
        one,
        two,
        three,
        price,
        transport,
       
      }
    },
    methods: {
      ...mapGetters(['userInfo']),
    }

  }

</script>