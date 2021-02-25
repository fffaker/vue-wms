<template>
  <div>
    <Form :label-width="80" style="margin-top:20px;margin-bottom:20px">
      <Row>
        <Col span="8">
          <FormItem label="所属仓库:">
            <Select v-model="storeBelonging" @on-change="selectStore">
              <Option value="0">所有仓库</Option>
              <Option
                v-for="item in storeList"
                :value="item.warehouseName"
                :key="item.warehouseName"
                :label="item.warehouseName"
              ></Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row style="margin-bottom:20px">
      <Col span="5">
        <Button type="primary" @click="addstore">新建传送线</Button>
      </Col>
      <!-- <Col span="2" offset="15">
        <Button type="primary" @click="reset">重&nbsp;&nbsp;&nbsp;置</Button>
      </Col>-->
      <!-- <Col span="2" offset="17">
        <Button type="primary">查&nbsp;&nbsp;&nbsp;询</Button>
      </Col>-->
    </Row>
    <Table :context="self" :height="400" :data="tableData" :columns="tableColumns" stripe border></Table>
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
    <!-- 新增模态框 -->
    <Modal
      v-model="adddisks"
      width="760"
      :title="title"
      :mask-closable="false"
      @on-cancel="adddisks=false;"
    >
      <Form
        style="margin-left:100px"
        ref="disk"
        :model="disk"
        :rules="ruleValidate"
        :label-width="120"
      >
        <!-- <p style="margin-left:-100px">基础信息</p> -->
        <Row>
          <Col span="18">
            <FormItem label="所属仓库：" prop="storeBelonging">
              <Select v-model="disk.storeBelonging">
                <Option
                  v-for="item in storeList"
                  :value="item.warehouseId"
                  :key="item.warehouseName"
                  :label="item.warehouseName"
                ></Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="传送线名称：" prop="name">
              <Input v-model="disk.name" placeholder="请输入传送线名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="编号：" prop="code">
              <Input v-model="disk.code" placeholder="请输入编号"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="用途：" prop="type">
              <RadioGroup v-model="disk.type">
                <Radio label="可出入库" border></Radio>
                <Radio label="仅入库" border></Radio>
                <Radio label="仅出库" border></Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button v-if="title=='编辑传送线'" style="margin-right:500px" type="error" @click="delet">删除</Button>
        <Button type="text" @click="adddisks = false">取消</Button>
        <Button type="primary" @click="addDisks">保存</Button>
      </div>
    </Modal>

    <!-- 删除确认框 -->
    <Modal v-model="delModal" title="确认删除">
      <p>确认删除该该条传送线？</p>
      <div slot="footer">
        <Button type="error" @click="delConfirm">确认删除</Button>
        <Button type="primary" @click="delModal=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import treeTransfer from 'el-tree-transfer'
import {
  getUserListPage,
  getMentalListPage,
  removeUser,
  editUser,
  addUsers,
  getStores,
  getDiskListPage,
  addDisk,
  editDisk,
  delDisk
} from '../../api/api';
export default {
  data () {
    return {
      id: '',
      storeList: [],
      storeBelonging: '',
      defaultProps: { label: "name", children: "children" },
      title: '',
      titles: ["待选菜单", "已选菜单"],
      mode: "transfer",
      self: this,
      adddisks: false,
      addMaterials: false,
      delModal: false,
      tableData: [],
      storeInfo: '',
      disk: {
        storeBelonging: '',
        name: '',
        code: '',
        type: '',

      },

      ruleValidate: {
        name: [
          { required: true, message: '请输入传送线名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入用途', trigger: 'blur' }
        ],
        storeBelonging: [
          { required: true, message: '请输入所属仓库', trigger: 'blur' }
        ],
      },

      total: 0,
      page: 1,
      tableColumns: [
        {
          title: '行号',
          key: '',
          align: 'center',
          type: 'index',
          // sortable: true,
          width: 70

        },
        {
          title: '所属仓库',
          key: 'warehouseName',
          align: 'center',
          width: 150

        },
        {
          title: '名称',
          align: 'center',
          key: 'conveyerName',
          width: 250
        },
        {
          title: '编号',
          align: 'center',
          key: 'conveyerCode',
          width: 200
        },
        {
          title: '用途',
          align: 'center',
          key: 'conveyerType',
          render: (h, params) => {
            return h("div", {}, params.row.conveyerType == 1 ? "可出入库" : params.row.conveyerType == 2 ? "仅入库" : params.row.conveyerType == 3 ? "仅出库" : '');
          }
          // width: 100
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.title = '编辑传送线'
                    this.adddisks = true;
                    this.$refs.disk.resetFields()
                    this.disk.storeBelonging = params.row.warehouseId
                    this.disk.name = params.row.conveyerName
                    this.disk.code = params.row.conveyerCode
                    this.disk.type = params.row.conveyerType == '1' ? '可出入库' : params.row.conveyerType == '2' ? '仅入库' : params.row.conveyerType == '3' ? '仅出库' : ''
                    this.id = params.row.conveyerId
                  }
                }
              }, '编辑')
            ]);
          }
        }
      ],
      pageSize: 10,
      start: 0,
      toData: []
    }
  },
  methods: {
    delConfirm () {
      let id = this.id
      delDisk(id).then((res) => {
        if (res.data.code == 0) {
          this.$Message.success('删除成功!');
          this.adddisks = false
          this.delModal = false
          this.getTableData()

        } else {


          this.adddisks = false
          this.delModal = false
          this.$Message.error(res.data.msg);
        }


      });

    },
    addDisks () {

      this.$refs.disk.validate((valid) => {
        if (valid) {
          // alert(1)
          let params = {
            warehouseId: this.disk.storeBelonging,
            conveyerName: this.disk.name,
            conveyerCode: this.disk.code,
            conveyerType: this.disk.type == '可出入库' ? '1' : this.disk.type == '仅入库' ? '2' : this.disk.type == '仅出库' ? '3' : '',

          };
          if (this.title == '编辑传送线') {
            params.conveyerId = this.id
            editDisk(params).then((res) => {
              if (res.data.code == 0) {
                this.$Message.success('编辑成功!');
                this.adddisks = false
                this.getTableData()

              } else {
                this.$Message.error(res.data.msg);
                this.adddisks = false
              }

            });
          } else {
            // alert(1)
            addDisk(params).then((res) => {
              if (res.data.code == 0) {
                this.$Message.success('新增成功!');
                this.adddisks = false
                this.getTableData()

              } else {
                this.$Message.error(res.data.msg);
                this.adddisks = false
              }

            });
          }
        } else {
          this.$Message.error('表单验证失败!');
          this.adddisks = false
        }
      })
    },
    getStore () {
      getStores().then((res) => {
        this.storeList = res.data.data
        console.log(res)
      });
    },
    delet () {
      this.delModal = true;
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    selectStore () {
      console.log(this.storeBelonging)
      this.getTableData();
    },
    getTableData () {
      let searchJson = {
        warehouseName: this.storeBelonging == '0' ? '' : this.storeBelonging,
        page: this.page,
        limit: this.pageSize
      };
      getDiskListPage(searchJson).then((res) => {
        if (res.data.code == 0) {
          console.log(res)
          this.total = res.data.data.total;
          this.tableData = res.data.data.list;
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
    addstore () {
      this.title = '新建传送线'
      this.adddisks = true;
      this.$refs.disk.resetFields()

    },







    nowpage (index) {
      this.pageSize = index;
      this.page = 1;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },

  },

  components: { treeTransfer },
  mounted () {
    this.getTableData();
  },
  created () {
    this.getStore();
  }
}
</script>