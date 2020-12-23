<template>
  <div style="background-color:#fff;padding-top:80px">
    <div style="width:70%;padding-left: 120px;">
      <Steps :current="current" style="width:350px;margin-left: 270px;">
        <Step title="扫描托盘"></Step>
        <Step title="绑定物料"></Step>
      </Steps>
    </div>

    <input
      class="lg"
      @keyup.enter="submit"
      v-show="current==0"
      style="border-radius: 5px;border: 1px solid #dddee1;height: 90px; width: 390px;margin-left: 370px;margin-top: 100px;font-size: 18px;padding: 6px 7px;"
      placeholder="请扫描或输入托盘编码"
    />
    <div v-show="current==1" style="height:200px;margin-top:80px">
      <span style="font-size:15px;color:#7F7F7F;margin-left:284px">托盘2</span>
      <span style="font-weight: 600;font-size:15px;margin-left:2px">21205002</span>
      <AutoComplete
        style="display: inline-block;width: 300px;margin-left:100px"
        v-model="mental"
        :data="material"
        :filter-method="filterMethod"
        placeholder="请扫描或输入物料编码、名称、型号"
      ></AutoComplete>
    </div>
    <div slot="footer">
      <Button
        style="margin-top: 20%;margin-bottom: 20px;margin-left: 88%;"
        v-show="current==0"
        type="primary"
        @click="nexts"
      >&nbsp;&nbsp;下一步&nbsp;&nbsp;</Button>
      <Button
        style="margin-bottom: 15px;margin-left: 3%;margin-top: 110px;"
        v-show="current==1"
        type="default"
        @click="back"
      >&nbsp;&nbsp;上一步&nbsp;&nbsp;</Button>
      <Button
        style="margin-bottom: 15px;margin-left: 78%;margin-top: 110px;"
        v-show="current==1"
        type="primary"
        @click="nexts"
      >&nbsp;&nbsp;绑定&nbsp;&nbsp;</Button>
    </div>
  </div>
</template>
<script>
import {
  addUsers
} from '../../api/api';
export default {
  data () {
    return {
      ware: '1号仓库',
      wares: ['1号仓库', '2号仓库'],
      emptyModal: false,
      mentalModal: false,
      current: 0,
      border: '',
      material: ['小型断路器', '世达六角旋具套筒'],
      mental: '',
      warePalet: {},
      emptyPalet: {},
      ruleValidate: {
        stackWare: [
          { required: true, message: '料架和库位不能为空', trigger: 'blur' }
        ],
        transmit: [
          { required: true, message: '传送线不能为空', trigger: 'blur' }
        ],
      },
      ruleValidates: {
        stackWare: [
          { required: true, message: '料架和库位不能为空', trigger: 'blur' }
        ],
        plateState: [
          { required: true, message: '托盘状态不能为空', trigger: 'blur' }
        ],
        transmit: [
          { required: true, message: '传送线不能为空', trigger: 'blur' }
        ],
      },
      plateState: '',

    }
  },
  methods: {
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    changeWare (name) {
      this.ware = name
    },
    emptyWare () {
      this.current = 0;
      this.emptyModal = true

    },
    mentalWare () {
      this.current = 0;
      this.mentalModal = true
    },
    next () {
      if (this.current == 1) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    },
    nexts () {
      if (this.current == 1) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    },
    back () {
      this.current = 0;
    },
    back1 () {
      this.current = 1;
    },
    next1 () {
      this.emptyModal = false
      this.current = 0
    },
    next2 () {
      this.mentalModal = false
      this.current = 0
    },
    submit () {
      console.log(111)
      this.current = 1
    }
  },

  mounted () {

  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.lg:focus {
  border-color: #57a3f3 !important;
  outline: 0;
  -webkit-box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
}
.lg:hover {
  border-color: #57a3f3 !important;
}
</style>