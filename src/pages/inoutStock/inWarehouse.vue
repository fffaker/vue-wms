<template>
  <div>
    <div class="wareHead">
      <Form>
        <Row>
          <Col span="8" style="line-height: 46px;margin-left: 5px;">
            <span style="font-weight: 600;color: #333333;margin-right: 6px;">{{ware}}</span>
            <Dropdown trigger="click" @on-click="changeWare">
              <a>
                <span>[切换仓库]</span>
              </a>
              <DropdownMenu
                v-model="ware"
                slot="list"
                v-for="(item,index) in this.wares"
                :key="index"
              >
                <DropdownItem :name="item" v-bind:divided="index>0?true:false">{{item}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
          <Col span="2" offset="9" style="line-height: 46px;">
            <Button type="default" @click="emptyWare">空托盘入库</Button>
          </Col>
          <Col span="3" offset="1" style="line-height: 46px;">
            <Button type="primary" @click="mentalWare">载物托盘入库</Button>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="line">
      <div class="lines">
        <div class="lineLeft">
          <span style="font-weight: 600;">入库暂停</span>
        </div>
        <div class="lineRight">
          <div style="display: inline-block;">
            <p style="font-weight: 700;font-size: 15px;">TP202012030001(托盘1)</p>
            <p style="font-size: 15px;color: #7F7F7F;">1号线--1号料架--3行2列</p>
            <p style="font-size: 15px;color: #A30014;">急停故障(DB99.DBX1500.0)</p>
          </div>

          <div style="float: right;padding-top: 20px;display: flex;width: 180px;">
            <span class="delline">删除入库队列</span>
            <span class="dellines">完成入库</span>
          </div>
        </div>
      </div>
      <div class="linging">
        <div class="lineLefts">
          <span style="font-weight: 600;color: #ffffff;">入库中</span>
        </div>
        <div class="lineRight">
          <p style="font-weight: 700;font-size: 15px;margin-top: 8px;">TP202012030002(托盘2)</p>
          <p style="font-size: 15px;color: #7F7F7F;">2号线 -- 2号料架 -- 3行2列</p>
        </div>
      </div>
      <div class="linging">
        <div class="lineLeftss">
          <span style="font-weight: 600;color: #ffffff;">入库等待</span>
        </div>
        <div class="lineRight">
          <div style="display: inline-block;">
            <p style="font-weight: 700;font-size: 15px;margin-top: 8px;">TP202012030003(托盘3)</p>
            <p style="font-size: 15px;color: #7F7F7F;">2号线 -- 2号料架 -- 3行5列</p>
          </div>
          <div style="float: right;padding-top: 20px;display: flex;width: 180px;">
            <span class="dellines" style="margin-left:100px">取消入库</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空托盘入库框 -->
    <Modal width="860" height="860" v-model="emptyModal">
      <p style="text-align:center;margin-top: 18px;font-size: 16px;margin-bottom: 50px;">空托盘入库</p>
      <Steps :current="current" style="width:400px;margin-left: 217px;">
        <Step title="扫描托盘"></Step>
        <Step title="入库"></Step>
      </Steps>
      <input
        class="lg"
        @keyup.enter="submit"
        v-show="current==0"
        style="border-radius: 5px;border: 1px solid #dddee1;height: 90px; width: 390px;margin-left: 220px;margin-top: 70px;font-size: 18px;padding: 6px 7px;"
        placeholder="请扫描或输入托盘编码"
      />
      <div v-show="current==0" style="height:200px"></div>
      <div v-show="current==1" style="margin-left:120px;margin-top:50px">
        <Form ref="emptyPalet" :model="emptyPalet" :rules="ruleValidate" :label-width="120">
          <Row>
            <Col span="20">
              <FormItem label="托盘:">
                <p style="font-weight: 600;">TP20201205002(托盘2)</p>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label=" 料架和库位:" prop="stackWare">
                <a style="font-weight: 600;">请选择料架和库位</a>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="传送线:" prop="transmit">
                <RadioGroup v-model="border">
                  <Radio label="1号线" border></Radio>
                  <Radio label="2号线" border></Radio>
                  <Radio label="3号线" border></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="托盘状态:">
                <p style="font-weight: 600;">空盘</p>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button v-show="current==0" type="primary" @click="next">&nbsp;&nbsp;下一步&nbsp;&nbsp;</Button>
        <Button
          style="margin-right:653px"
          v-show="current==1"
          type="default"
          @click="back"
        >&nbsp;&nbsp;上一步&nbsp;&nbsp;</Button>
        <Button v-show="current==1" type="primary" @click="next1">&nbsp;&nbsp;入库&nbsp;&nbsp;</Button>
      </div>
    </Modal>
    <!-- 载物托盘入库框 -->
    <Modal width="860" height="860" v-model="mentalModal">
      <p style="text-align:center;margin-top: 18px;font-size: 16px;margin-bottom: 50px;">载物托盘入库</p>
      <Steps :current="current" style="width:450px;margin-left: 167px;">
        <Step title="扫描托盘"></Step>
        <Step title="绑定物料"></Step>
        <Step title="入库"></Step>
      </Steps>
      <input
        class="lg"
        @keyup.enter="submit"
        v-show="current==0"
        style="border-radius: 5px;border: 1px solid #dddee1;height: 90px; width: 390px;margin-left: 220px;margin-top: 70px;font-size: 18px;padding: 6px 7px;"
        placeholder="请扫描或输入托盘编码"
      />
      <div v-show="current==0" style="height:200px"></div>
      <div v-show="current==1" style="height:200px;margin-top:50px">
        <span style="font-size:15px;color:#7F7F7F;margin-left:100px">托盘2</span>
        <span style="font-weight: 600;font-size:15px;margin-left:2px">21205002</span>
        <AutoComplete
          style="display: inline-block;width: 300px;margin-left:100px"
          v-model="mental"
          :data="material"
          :filter-method="filterMethod"
          placeholder="请扫描或输入物料编码、名称、型号"
        ></AutoComplete>
      </div>
      <div v-show="current==2" style="margin-left:120px;margin-top:50px">
        <Form ref="warePalet" :model="warePalet" :rules="ruleValidates" :label-width="120">
          <Row>
            <Col span="20">
              <FormItem label="托盘:">
                <p style="font-weight: 600;">TP20201205002(托盘2)</p>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="物料:">
                <p style="font-weight: 600;">共2种，合计10件</p>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label=" 料架和库位:" prop="stackWare">
                <a style="font-weight: 600;">请选择料架和库位</a>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="传送线:" prop="transmit">
                <RadioGroup v-model="border">
                  <Radio label="1号线" border></Radio>
                  <Radio label="2号线" border></Radio>
                  <Radio label="3号线" border></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="托盘状态:" prop="plateState">
                <RadioGroup v-model="plateState">
                  <Radio label="满载" border></Radio>
                  <Radio label="有空余" border></Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button v-show="current==0" type="primary" @click="nexts">&nbsp;&nbsp;下一步&nbsp;&nbsp;</Button>
        <Button
          style="float: left;"
          v-show="current==1"
          type="default"
          @click="back"
        >&nbsp;&nbsp;上一步&nbsp;&nbsp;</Button>
        <Button v-show="current==1" type="primary" @click="nexts">&nbsp;&nbsp;绑定物料，下一步&nbsp;&nbsp;</Button>
        <Button
          style="float: left;"
          v-show="current==2"
          type="default"
          @click="back1"
        >&nbsp;&nbsp;上一步&nbsp;&nbsp;</Button>
        <Button v-show="current==2" type="primary" @click="next2">&nbsp;&nbsp;入库&nbsp;&nbsp;</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import treeTransfer from 'el-tree-transfer'
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
      if (this.current == 2) {
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
.wareHead {
  background: #ffffff;
  height: 64px;
  padding: 10px;
}
.line {
  background: #ffffff;
  height: 500px;
  margin-top: 15px;
  padding: 15px;
}
.lines {
  width: 100%;
  height: 86px;
  background-color: rgba(242, 242, 242, 1);
  position: relative;
}
.linging {
  margin-top: 10px;
  width: 100%;
  height: 86px;
  background-color: rgba(242, 242, 242, 1);
  position: relative;
}
.lineLeft {
  display: inline-block;
  width: 60px;
  height: 100%;
  background-color: rgba(163, 0, 20, 1);
  padding: 16px;
  padding-top: 21px;
}
.lineLefts {
  display: inline-block;
  width: 60px;
  height: 100%;
  background-color: rgba(245, 154, 35, 1);
  padding: 8px;
  padding-top: 32px;
}
.lineLeftss {
  display: inline-block;
  width: 60px;
  height: 100%;
  background-color: rgba(85, 85, 85, 1);
  padding: 16px;
  padding-top: 21px;
}
.lineRight {
  display: inline-block;
  height: 86px;
  position: absolute;
  padding-left: 15px;
  padding-top: 13px;
  width: 94%;
}
.delline {
  width: 100px;
  // position: absolute;
  // left: 547px;
  // top: 34px;
  color: #a30014;
  cursor: pointer;
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
}
.dellines {
  width: 100px;
  // position: absolute;
  // left: 657px;
  // top: 34px;
  color: #169bd5;
  cursor: pointer;
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  margin-left: 20px;
}
.lineLeft span {
  color: #ffffff;
}
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