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
                v-for="(item,index) in this.storeList"
                :value="item.warehouseId"
                :key="index"
              >
                <DropdownItem
                  :name="item"
                  v-bind:divided="index>0?true:false"
                >{{item.warehouseName}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
          <Col span="2" offset="9" style="line-height: 46px;">
            <Button type="default" @click="emptyWare">空托盘出库</Button>
          </Col>
          <Col span="3" offset="1" style="line-height: 46px;">
            <Button type="primary" @click="mentalWare">载物托盘出库</Button>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="line">
      <div class="lines">
        <div class="lineLeft">
          <span style="font-weight: 600;">出库暂停</span>
        </div>
        <div class="lineRight">
          <div style="display: inline-block;">
            <p style="font-weight: 700;font-size: 15px;">TP202012030001(托盘1)</p>
            <p style="font-size: 15px;color: #7F7F7F;">1号线--1号料架--3行2列</p>
            <p style="font-size: 15px;color: #A30014;">急停故障(DB99.DBX1500.0)</p>
          </div>

          <div style="float: right;padding-top: 20px;display: flex;width: 180px;">
            <span class="delline">删除出库队列</span>
            <span class="dellines">完成出库</span>
          </div>
        </div>
      </div>
      <div class="linging">
        <div class="lineLefts">
          <span style="font-weight: 600;color: #ffffff;">出库中</span>
        </div>
        <div class="lineRight">
          <p style="font-weight: 700;font-size: 15px;margin-top: 8px;">TP202012030002(托盘2)</p>
          <p style="font-size: 15px;color: #7F7F7F;">2号线 -- 2号料架 -- 3行2列</p>
        </div>
      </div>
      <div class="linging">
        <div class="lineLeftss">
          <span style="font-weight: 600;color: #ffffff;">出库等待</span>
        </div>
        <div class="lineRight">
          <div style="display: inline-block;">
            <p style="font-weight: 700;font-size: 15px;margin-top: 8px;">TP202012030003(托盘3)</p>
            <p style="font-size: 15px;color: #7F7F7F;">2号线 -- 2号料架 -- 3行5列</p>
          </div>
          <div style="float: right;padding-top: 20px;display: flex;width: 180px;">
            <span class="dellines" style="margin-left:100px">取消出库</span>
          </div>
        </div>
      </div>
      <div class="linging">
        <div class="lineLeftss" style="background-color: rgb(75, 121, 2);">
          <span style="font-weight: 600;color: #ffffff;">出库完成</span>
        </div>
        <div class="lineRight">
          <div style="display: inline-block;">
            <p style="font-weight: 700;font-size: 15px;margin-top: 8px;">TP202012030003(托盘3)</p>
            <p style="font-size: 15px;color: #7F7F7F;">2号线 -- 2号料架 -- 3行5列</p>
          </div>
          <div style="float: right;padding-top: 20px;display: flex;width: 180px;">
            <span class="dellines" style="margin-left:100px">解绑物料</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空托盘出库框 -->
    <Modal width="860" height="860" v-model="emptyModal">
      <p style="text-align:center;margin-top: 18px;font-size: 16px;margin-bottom: 50px;">空托盘出库</p>
      <Steps :current="current" style="width:400px;margin-left: 217px;">
        <Step title="扫描托盘"></Step>
        <Step title="出库"></Step>
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
          style="float: left;"
          v-show="current==1"
          type="default"
          @click="back"
        >&nbsp;&nbsp;上一步&nbsp;&nbsp;</Button>
        <Button v-show="current==1" type="primary" @click="next1">&nbsp;&nbsp;出库&nbsp;&nbsp;</Button>
      </div>
    </Modal>
    <!-- 载物托盘出库框 -->
    <Modal width="860" height="860" v-model="mentalModal">
      <p style="text-align:center;margin-top: 18px;font-size: 16px;margin-bottom: 50px;">载物托盘出库</p>
      <Form :label-width="80">
        <Row>
          <Col span="8">
            <FormItem label="出库托盘:">
              <Input style="width:250px" search enter-button placeholder="搜索物料或托盘信息" />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table
        ref="selection"
        :context="self"
        :columns="tableColumns"
        :data="tableData"
        stripe
        border
        @on-select="aa"
        @on-selection-change="changePallet"
        @on-select-all="selectAll"
      ></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            :total="total"
            show-sizer
            :page-size-opts="[5, 10, 30]"
            :page-size="pageSize"
            @on-change="changePage"
            @on-page-size-change="nowpage"
          ></Page>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="next2">&nbsp;&nbsp;出库&nbsp;&nbsp;</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import treeTransfer from 'el-tree-transfer'
import {
  addUsers,
  getStores,
  getOutWareListPage,
  getDisk,
  palletOutWare

} from '../../api/api';
import expandRow from './table-expand.vue';
export default {
  components: { expandRow },
  data () {
    return {

      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '托盘编码',
          align: 'center',
          key: 'palletCode'
        },
        {
          title: '料架',
          align: 'center',
          key: 'feederName'
        },
        {
          title: '库位',
          align: 'center',
          key: 'storagebinLine',
          render: (h, params) => {
            return h("div", {}, params.row.storagebinLine + '行' + params.row.storagebinRow + '列');
          }
        },

        {
          title: '传送线',
          center: 'center',
          key: 'conveyerId',
          width: 200,
          render: (h, params) => {
            return h('Select', {
              props: {
                value: '',
                transfer: true,
                // disabled: !(this.$refs.selection.objData[params.index]._isChecked)
              },
              on: {
                'on-change': (value) => {
                  console.log(params.row)
                  // console.log(params.index)
                  this.$refs.selection.objData[params.index]._isDisabled = false
                  params.row.conveyerId = value
                  this.tableData[params.index].conveyerId = value


                  // this.disk[params.index].conveyerName = value;
                }
              },
            },
              this.disk.map((obj) => {
                return h('Option', {
                  props: { value: obj.conveyerId, label: obj.conveyerName }
                });
              })
            );
          },
        }
      ],
      tableData: [

      ],
      total: 0,
      selectList: [],
      self: this,
      page: 1,
      pageSize: 10,
      start: 0,
      palletIds: '',
      storeList: [],
      warePosition: '',
      warePositions: '',
      wareId: '',
      inWareList: [],
      disk: [],
      ware: '',
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
    aa (selection, row) {

      this.palletIds = row.palletId
      // console.log(row);

    },
    changePallet (selection) {
      console.log(this.$refs.selection, selection);
      this.selectList = selection
    },
    selectAll (selection) {
      // console.log(selection);
    },
    getTableData () {
      let searchJson = {
        // conditions: '',
        palletStatus: 0,
        page: this.page,
        limit: this.pageSize
      };
      getOutWareListPage(searchJson).then((res) => {
        if (res.data.code == 0) {
          console.log(res)
          this.total = res.data.data.total;
          this.tableData = res.data.data.list;
          this.tableData.map(item => {
            item._disabled = true;
            item.conveyerId = '';
          })
        } else {
          this.$Message.error(res.data.msg);
        }

      });

    },

    changePage (index) {
      this.page = index;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },
    nowpage (index) {
      this.pageSize = index;
      this.page = 1;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    changeWare (name) {
      this.ware = name.warehouseName;
      this.wareId = name.warehouseId
      this.disk = [];
      let params = {
        conveyerType: 1,
        warehouseId: this.wareId
      }
      getDisk(params).then((res) => {
        if (res.data.code == 0) {
          this.disk = res.data.data
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    emptyWare () {
      this.current = 0;
      this.emptyModal = true

    },
    mentalWare () {
      this.$refs.selection.selectAll(false);
      this.current = 0;
      this.mentalModal = true
      let params = {
        conveyerType: 1,
        warehouseId: this.wareId
      }
      this.disk = [];
      getDisk(params).then((res) => {
        if (res.data.code == 0) {
          this.disk = res.data.data
        } else {
          this.$Message.error(res.data.msg);
        }
      });
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
      var params = []
      for (var i = 0; i < this.selectList.length; i++) {
        params[i] = {
          "conveyerId": "1346737825828753409",
          "feederId": "",
          "palletCode": "",
          "palletId": this.selectList[i].palletId,
          "palletIsbinding": 0,
          "palletIsdelete": 0,
          "palletName": "",
          "palletSpecs": "",
          "palletStatus": 0,
          "palletType": 0,
          "storagebinId": "",
          "storagebinStatus": 0,
          "warehouseId": "",
          "warehousingStatus": 0

        }
      }
      // let params = [
      //   {
      //     "conveyerId": "1346737825828753409",
      //     "feederId": "",
      //     "palletCode": "",
      //     "palletId": "1348441467724165122",
      //     "palletIsbinding": 0,
      //     "palletIsdelete": 0,
      //     "palletName": "",
      //     "palletSpecs": "",
      //     "palletStatus": 0,
      //     "palletType": 0,
      //     "storagebinId": "",
      //     "storagebinStatus": 0,
      //     "warehouseId": "",
      //     "warehousingStatus": 0
      //   }
      // ]
      console.log(params)
      palletOutWare(params).then((res) => {
        if (res.data.code == 0) {
          this.emptyModal = false
          this.current = 0
          this.$Message.success('成功进入出库队列！');
        } else {
          this.$Message.error(res.data.code);
          this.emptyModal = false
          this.current = 0

        }

      })

    },
    next2 () {
      var params = []
      for (var i = 0; i < this.selectList.length; i++) {
        params[i] = {
          "conveyerId": this.selectList[i].conveyerId,
          "feederId": "",
          "palletCode": "",
          "palletId": this.selectList[i].palletId,
          "palletIsbinding": 0,
          "palletIsdelete": 0,
          "palletName": "",
          "palletSpecs": "",
          "palletStatus": 0,
          "palletType": 0,
          "storagebinId": "",
          "storagebinStatus": 0,
          "warehouseId": "",
          "warehousingStatus": 0

        }
      }
      console.log(params)
      // let params =
      //   [{
      //     "conveyerId": this.disk[0].conveyerId,
      //     "feederId": "",
      //     "palletCode": "",
      //     "palletId": this.palletIds,
      //     "palletIsbinding": 0,
      //     "palletIsdelete": 0,
      //     "palletName": "",
      //     "palletSpecs": "",
      //     "palletStatus": 0,
      //     "palletType": 0,
      //     "storagebinId": "",
      //     "storagebinStatus": 0,
      //     "warehouseId": "",
      //     "warehousingStatus": 0
      //   }]


      // params = JSON.stringify(params)
      palletOutWare(params).then((res) => {
        if (res.data.code == 0) {
          this.mentalModal = false
          this.current = 0
          this.$Message.success('成功进入出库队列！');
        } else {
          this.$Message.error(res.data.code);
          this.mentalModal = false
          this.current = 0

        }

      })

    },
    submit () {
      console.log(111)
      this.current = 1
    }
  },
  created () {

    getStores().then((res) => {
      this.storeList = res.data.data
      this.ware = res.data.data[0].warehouseName
      this.wareId = res.data.data[0].warehouseId
      let id = this.wareId
      // inWareList(id).then(
      //   (res) => {
      //     if (res.data.code == 0) {
      //       this.inWareList = res.data.data
      //     }
      //   }
      // )

    });







  },
  mounted () {
    this.getTableData();
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.expand-row {
  margin-bottom: 16px;
}
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