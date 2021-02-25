<template>
  <div>
    <div>
      <Tabs :animated="false" @on-click="switchWare(name)" v-model="name">
        <TabPane label="入库记录" name="0">
          <Form :label-width="80">
            <Row>
              <Col span="6">
                <FormItem label="入库信息">
                  <Input v-model="info" placeholder="搜索托盘编码、物料名称或编码"></Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="入库仓库">
                  <Select :transfer="true" v-model="storeBelonging">
                    <Option value="0">所有仓库</Option>
                    <Option
                      v-for="item in storeList"
                      :value="item.warehouseId"
                      :key="item.warehouseName"
                      :label="item.warehouseName"
                    ></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="入库日期">
                  <DatePicker
                    format="yyyy-MM-dd"
                    @on-change="wareDate"
                    type="daterange"
                    transfer
                    placeholder="请选择日期范围"
                    style="width: 200px"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="2">
                <Button type="primary" @click="reset">重&nbsp;&nbsp;&nbsp;置</Button>
              </Col>
              <Col span="2">
                <Button type="primary" @click="serchWare">查&nbsp;&nbsp;&nbsp;询</Button>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane label="出库记录" name="1">
          <Form :label-width="80">
            <Row>
              <Col span="6">
                <FormItem label="出库信息">
                  <Input v-model="info" placeholder="搜索仓库名称、备注"></Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="出库仓库">
                  <Select :transfer="true" v-model="storeBelonging">
                    <Option value="0">所有仓库</Option>
                    <Option
                      v-for="item in storeList"
                      :value="item.warehouseId"
                      :key="item.warehouseName"
                      :label="item.warehouseName"
                    ></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="出库日期">
                  <DatePicker type="daterange" transfer placeholder="请选择日期范围" style="width: 200px"></DatePicker>
                </FormItem>
              </Col>
              <Col span="2">
                <Button type="primary" @click="reset">重&nbsp;&nbsp;&nbsp;置</Button>
              </Col>
              <Col span="2">
                <Button type="primary" @click="serchWare">查&nbsp;&nbsp;&nbsp;询</Button>
              </Col>
            </Row>
          </Form>
        </TabPane>
      </Tabs>
    </div>

    <Table
      :height="400"
      :data="tableData"
      :columns="this.id==0?tableColumns:tableColumn"
      stripe
      border
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
  </div>
</template>
<script>
import {
  getUserListPage,
  getMentalListPage,
  removeUser,
  editUser,
  addUsers,
  getRecordListPage,
  getStores
} from '../../api/api';
export default {
  data () {
    return {
      startTime: '',
      endTime: '',
      dateRange: [],
      storeBelonging: '',
      storeList: [],
      info: '',
      name: '0',
      id: 0,
      tableData: [],
      total: 0,
      page: 1,
      tableColumns: [
        {
          title: '托盘编码',
          key: 'palletCode',
          align: 'center',


        },
        {
          title: '物料名称',
          key: 'matterName',
          align: 'center',


        },
        {
          title: '物料编码',
          align: 'center',
          key: 'matterCode',
          width: 100
        },
        {
          title: '物料型号',
          align: 'center',
          key: 'matterMarking'
        },
        {
          title: '入库数量',
          align: 'center',
          key: 'matterNum'
        },
        {
          title: '单位',
          align: 'center',
          key: 'matterUnit'
        },
        {
          title: '仓库',
          align: 'center',
          key: 'warehouseName'
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
          title: '入库时间',
          align: 'center',
          key: 'warehousingTime'
        },
        {
          title: '操作人',
          align: 'center',
          key: 'createUser'
        },


      ],
      tableColumn: [
        {
          title: '托盘编码',
          key: 'palletCode',
          align: 'center',


        },
        {
          title: '物料名称',
          key: 'matterName',
          align: 'center',


        },
        {
          title: '物料编码',
          align: 'center',
          key: 'matterCode',
          width: 100
        },
        {
          title: '物料型号',
          align: 'center',
          key: 'matterMarking'
        },
        {
          title: '出库数量',
          align: 'center',
          key: 'matterNum'
        },
        {
          title: '单位',
          align: 'center',
          key: 'matterUnit'
        },
        {
          title: '仓库',
          align: 'center',
          key: 'warehouseName'
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
          title: '出库时间',
          align: 'center',
          key: 'warehousingTime'
        },
        {
          title: '操作人',
          align: 'center',
          key: 'createUser'
        },


      ],
      pageSize: 10,
      start: 0,


    }
  },
  methods: {

    getTableData () {
      let searchJson = {
        conditions: this.info,
        warehouseId: this.storeBelonging == '0' ? '' : this.storeBelonging,
        startTime: this.startTime,
        endTime: this.endTime,
        warehousingType: this.id,
        page: this.page,
        limit: this.pageSize
      };
      getRecordListPage(searchJson).then((res) => {
        if (res.data.code == 0) {
          console.log(res)
          this.total = res.data.data.total;
          this.tableData = res.data.data.list;
        } else {
          this.$Message.error(res.data.msg);
        }


      });

    },
    serchWare () {
      this.getTableData()
    },
    changePage (index) {
      this.page = index;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },
    wareDate (e) {

      console.log(e)
      this.startTime = e[0]
      this.endTime = e[1]
    },


    nowpage (index) {
      this.pageSize = index;
      this.page = 1;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },
    switchWare (name) {
      this.id = Number(name);
      this.storeBelonging = ''
      this.info = ''
      this.startTime = ''
      this.endTime = ''
      this.getTableData();
    },
    reset () {
      this.storeBelonging = ''
      this.info = ''
      this.startTime = ''
      this.endTime = ''

    },
    getStore () {
      getStores().then((res) => {
        this.storeList = res.data.data
        console.log(res)
      });
    },



  },
  mounted () {
    this.getTableData();
  },
  created () {
    this.getStore();
  }
}
</script>