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
        v-model="palletCode"
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
                <p style="font-weight: 600;">{{this.palletCode}}</p>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label=" 料架和库位:" prop="stackWare">
                <Select v-model="warePosition" style="width:200px" @on-change="choosPosition">
                  <OptionGroup
                    v-model="warePositions"
                    v-for="(item,index) in position"
                    :key="item.feederName"
                    :label="item.feederName"
                    :value="item.feederId"
                  >
                    <Option
                      v-for="item in position[index].storagebinDTOS"
                      :value="item.storagebinId"
                      :key="item.storagebinName"
                    >{{ item.storagebinName }}</Option>
                  </OptionGroup>
                </Select>
                <!-- <a style="font-weight: 600;">请选择料架和库位</a> -->
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="传送线:" prop="transmit">
                <RadioGroup v-model="disks" @on-change="choosDisk">
                  <Radio
                    v-for="(item,index) in this.disk"
                    :label="item.conveyerId"
                    :value="item.conveyerId"
                    :key="index"
                    border
                  >
                    <span>{{item.conveyerName}}</span>
                  </Radio>
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
          style="float:left"
          v-show="current==1"
          type="default"
          @click="back"
        >&nbsp;&nbsp;上一步&nbsp;&nbsp;</Button>
        <Button v-show="current==1" type="primary" @click="next1">&nbsp;&nbsp;入库&nbsp;&nbsp;</Button>
      </div>
    </Modal>
    <!-- 载物托盘入库框 -->
    <Modal width="960" height="960" v-model="mentalModal">
      <p style="text-align:center;margin-top: 18px;font-size: 16px;margin-bottom: 50px;">载物托盘入库</p>
      <Steps :current="current" style="width:450px;margin-left: 225px;">
        <Step title="扫描托盘"></Step>
        <Step title="绑定物料"></Step>
        <Step title="入库"></Step>
      </Steps>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidatess">
        <FormItem prop="palletCodes">
          <input
            v-model="palletCode"
            class="lg"
            @keyup.enter="submit"
            v-show="current==0"
            style="border-radius: 5px;border: 1px solid #dddee1;height: 90px; width: 390px;margin-left: 264px;margin-top: 70px;font-size: 18px;padding: 6px 7px;"
            placeholder="请扫描或输入托盘编码"
          />
        </FormItem>
      </Form>
      <div v-show="current==0" style="height:200px"></div>
      <div v-show="current==1" style="height:300px;margin-top:50px">
        <span style="font-size:15px;color:#7F7F7F;margin-left:195px">托盘</span>
        <span style="font-weight: 600;font-size:15px;margin-left:2px">{{this.palletCode}}</span>
        <AutoComplete
          @on-search="chooseMental"
          @on-select="addMental"
          style="display: inline-block;width: 300px;margin-left:100px"
          v-model="mental"
          :data="material"
          :filter-method="filterMethod"
          placeholder="请扫描或输入物料编码、名称、型号"
        ></AutoComplete>
        <div style="margin-top:20px">
          <el-table :data="tableData" border max-height="250">
            <el-table-column prop="index" align="center" label="行号" type="index" width="50"></el-table-column>
            <el-table-column prop="matterName" align="center" label="名称" min-width="150"></el-table-column>
            <el-table-column prop="matterCode" align="center" label="编码" width="180"></el-table-column>
            <el-table-column prop="mode" align="center" label="型号" width="180"></el-table-column>
            <el-table-column prop="matterNum" align="center" label="数量" width="180">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.matterNum"
                  :min="1"
                  size="mini"
                  controls-position="right"
                ></el-input-number>
                <!-- <input type="text" v-model="scope.row.num" class="cell-input" /> -->
              </template>
            </el-table-column>
            <el-table-column prop="unit" align="center" label="单位" width="80"></el-table-column>
            <el-table-column label="移除" width="80">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                  type="text"
                  size="small"
                >移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-show="current==2" style="margin-left:144px;margin-top:50px">
        <Form ref="warePalet" :model="warePalet" :rules="ruleValidates" :label-width="120">
          <Row>
            <Col span="20">
              <FormItem label="托盘:">
                <p style="font-weight: 600;">{{this.palletCode}}</p>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="物料:">
                <p style="font-weight: 600;">共{{this.tableData.length}}种，合计{{this.nums}}件</p>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label=" 料架和库位:" prop="stackWare">
                <Select v-model="warePosition" style="width:200px" @on-change="choosPosition">
                  <OptionGroup
                    v-model="warePositions"
                    v-for="(item,index) in position"
                    :key="item.feederName"
                    :label="item.feederName"
                    :value="item.feederId"
                  >
                    <Option
                      v-for="item in position[index].storagebinDTOS"
                      :value="item.storagebinId"
                      :key="item.storagebinName"
                    >{{ item.storagebinName }}</Option>
                  </OptionGroup>
                </Select>
                <!-- <a style="font-weight: 600;">请选择料架和库位</a> -->
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="传送线:" prop="transmit">
                <RadioGroup v-model="disks" @on-change="choosDisk">
                  <Radio
                    v-for="(item,index) in this.disk"
                    :label="item.conveyerId"
                    :value="item.conveyerId"
                    :key="index"
                    border
                  >
                    <span>{{item.conveyerName}}</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="托盘状态:" prop="plateState">
                <RadioGroup v-model="plateState">
                  <Radio label="2" border>满载</Radio>
                  <Radio label="1" border>有空余</Radio>
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
  addUsers,
  codeValid,
  getMentalList,
  matterBinding,
  getStores,
  getPosition,
  getDisk,
  palletInWare,
  inWareList
} from '../../api/api';
export default {
  data () {
    return {
      inWareList: [],
      feederId: '',
      disks: '',
      disk: '',
      warePosition: '',
      warePositions: '',
      wareId: '',
      ruleValidatess: {
        palletCodes: [
          { required: true, message: '请输入或扫描托盘编码', trigger: 'blur' }
        ]
      },
      position: [],
      storeList: [],
      nums: 0,
      tableData: [],
      palletCode: '',
      ware: '',
      wares: ['1号仓库', '2号仓库'],
      emptyModal: false,
      mentalModal: false,
      current: 0,
      border: '',
      material: [],
      mental: '',
      warePalet: {},
      formValidate: {
        palletCode: '',
      },
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
    deleteRow (index, rows) {
      rows.splice(index, 1);
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    changeWare (name) {
      this.ware = name.warehouseName;
      this.wareId = name.warehouseId
    },
    emptyWare () {
      this.current = 0;
      this.emptyModal = true
      this.palletCode = ''
      let id = this.wareId
      this.position = [];
      this.disk = [];
      getPosition(id).then((res) => {
        if (res.data.code == 0) {
          this.position = res.data.data
        } else {
          this.$Message.error(res.data.msg);
        }
      });
      let params = {
        conveyerType: 0,
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
    mentalWare () {
      this.current = 0;
      this.mentalModal = true
      this.palletCode = ''
      let id = this.wareId
      this.position = [];
      this.disk = [];
      getPosition(id).then((res) => {
        if (res.data.code == 0) {
          this.position = res.data.data
        } else {
          this.$Message.error(res.data.msg);
        }
      });
      let params = {
        conveyerType: 0,
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
    next () {
      if (this.palletCode) {
        let code = this.palletCode
        codeValid(code).then((res) => {
          if (res.data.code == 0) {
            if (this.current == 1) {
              this.current = 0;
            } else {
              this.current += 1;
            }
          } else {
            this.$Message.error(res.data.msg);
          }

        });

      } else {
        this.$Message.error('请扫描或输入托盘编码！');
      }


    },
    nexts () {
      if (this.current == 0) {
        if (this.palletCode) {
          let code = this.palletCode
          codeValid(code).then((res) => {
            if (res.data.code == 0) {
              if (this.current == 2) {
                this.current = 0;
              } else {
                this.current += 1;
              }
            } else {
              this.$Message.error(res.data.msg);
            }

          });

        } else {
          this.$Message.error('请扫描或输入托盘编码！');
        }
      } else {
        if (this.tableData.length > 0) {
          for (var i = 0; i < this.tableData.length; i++) {

            this.nums = this.tableData[i].matterNum + this.nums
          }
          console.log(this.nums)
          let params = this.tableData
          matterBinding(params).then((res) => {
            if (res.data.code == 0) {
              if (this.current == 2) {
                this.current = 0;
              } else {
                this.current += 1;
              }
            } else {
              this.$Message.error(res.data.msg);
            }



          })

        } else {
          this.$Message.error('请先选择物料进行绑定！');
        }
      }

    },
    back () {
      this.current = 0;
    },
    back1 () {
      this.current = 1;
    },
    next1 () {
      let params = {
        palletCode: this.palletCode,
        conveyerId: this.disks,
        feederId: this.feederId,
        palletStatus: 0,
        storagebinId: this.warePosition,
        warehouseId: this.wareId

      };
      palletInWare(params).then((res) => {
        if (res.data.code == 0) {
          this.emptyModal = false
          this.current = 0
          this.$Message.success('成功进入入库队列!');
        } else {
          this.$Message.error(res.data.code);
          this.emptyModal = false
          this.current = 0

        }

      })

    },
    next2 () {


      // this.$refs.warePalet.validate((valid) => {
      // if (valid) {
      let params = {
        palletCode: this.palletCode,
        conveyerId: this.disks,
        feederId: this.feederId,
        palletStatus: Number(this.plateState),
        storagebinId: this.warePosition,
        warehouseId: this.wareId

      };
      palletInWare(params).then((res) => {
        if (res.data.code == 0) {
          this.mentalModal = false
          this.current = 0
          this.$Message.success('成功进入入库队列!');
        } else {
          this.$Message.error(res.data.code);
          this.mentalModal = false
          this.current = 0

        }

      })
      // } else {
      //   this.$Message.error('表单验证失败!');
      //   this.addstores = false
      // }
      // })
    },
    submit () {
      console.log(111)
      this.current = 1
    },
    addMental (value) {
      let arr = value.split(' ')
      let code = arr[0];
      let num = 0;
      console.log(code)
      for (var i = 0; i < this.tableData.length; i++) {
        if (code == this.tableData[i].matterCode) {
          num++;
          this.tableData[i].matterNum = this.tableData[i].matterNum + 1
        }
      }
      if (num == 0) {
        let params = {
          conditions: code
        }
        if (code) {
          getMentalList(params).then((res) => {
            if (res.data.code == 0) {

              let arr = res.data.data
              this.tableData.push({
                matterName: arr[0].matterName,
                matterCode: arr[0].matterCode,
                mode: arr[0].matterMarking,
                matterNum: 1,
                untieNum: 0,
                unit: '个',
                matterId: arr[0].matterId,
                palletCode: this.palletCode
              })


            } else {
              this.$Message.error(res.data.msg);

            }
          });
        }
      }
      // this.tableData.push({
      //   name: '小型断路器',
      //   code: '01.01.001',
      //   mode: '5mm L48mm',
      //   num: 1,
      //   unit: '个'
      // })
    },
    choosDisk () {
      console.log(this.disks)
    },
    choosPosition () {
      for (var i = 0; i < this.position.length; i++) {
        for (var j = 0; j < this.position[i].storagebinDTOS.length; j++) {
          if (this.warePosition == this.position[i].storagebinDTOS[j].storagebinId) {
            this.feederId = this.position[i].storagebinDTOS[j].feederId
          }
        }
      }
    },
    chooseMental () {
      let params = {
        conditions: this.mental
      }
      if (this.mental) {
        getMentalList(params).then((res) => {
          if (res.data.code == 0) {
            let mentals = []
            let arr = res.data.data
            for (var i = 0; i < arr.length; i++) {
              mentals.push(arr[i].extendA)
            }
            this.material = mentals
          } else {
            this.$Message.error(res.data.msg);

          }
        });
      }

    }
  },
  created () {

    getStores().then((res) => {
      this.storeList = res.data.data
      this.ware = res.data.data[0].warehouseName
      this.wareId = res.data.data[0].warehouseId
      let id = this.wareId
      inWareList(id).then(
        (res) => {
          if (res.data.code == 0) {
            this.inWareList = res.data.data
          }
        }
      )
    });






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
$border-focus-color: #a7d5ec;
.cell-input {
  width: 100%;
  height: 100%;
  border: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  &:focus {
    border: 1px solid $border-focus-color;
  }
}
</style>