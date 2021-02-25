<template>
  <div>
    <Form :label-width="80" style="margin-top:20px;margin-bottom:20px">
      <Row>
        <Col span="8">
          <FormItem label="仓库信息:">
            <Input v-model="storeInfo" placeholder="搜索仓库名称、备注"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row style="margin-bottom:20px">
      <Col span="5">
        <Button type="primary" @click="addstore">新建仓库</Button>
      </Col>
      <!-- <Col span="2" offset="15">
        <Button type="primary" @click="reset">重&nbsp;&nbsp;&nbsp;置</Button>
      </Col>-->
      <Col span="2" offset="17">
        <Button type="primary" @click="searchStore">查&nbsp;&nbsp;&nbsp;询</Button>
      </Col>
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
      v-model="addstores"
      width="760"
      :title="title"
      :mask-closable="false"
      @on-cancel="addstores=false;"
    >
      <Form
        style="margin-left:100px"
        ref="store"
        :model="store"
        :rules="ruleValidate"
        :label-width="100"
      >
        <!-- <p style="margin-left:-100px">基础信息</p> -->
        <Row>
          <Col span="18">
            <FormItem label="仓库名称：" prop="name">
              <Input v-model="store.name" placeholder="请输入仓库名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="仓库类型：" prop="type">
              <Select v-model="store.type">
                <Option value="1">自动仓库</Option>
                <Option value="2">半自动仓库</Option>
                <Option value="3">普通仓库</Option>
                <Option value="4">虚拟仓库</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="仓库管理员：" prop="admin">
              <Select v-model="store.admin">
                <Option value="总经理">总经理</Option>
                <Option value="副总经理">副总经理</Option>
                <Option value="车间主任">车间主任</Option>
                <Option value="采购">采购</Option>
                <Option value="工人">工人</Option>
                <Option value="财务">财务</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="备注：">
              <Input
                v-model="store.textarea"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                placeholder="请输入"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button v-if="title=='编辑仓库'" style="margin-right:500px" type="error" @click="delet">删除</Button>
        <Button type="text " @click="addstores = false">取消</Button>
        <Button type="primary" @click="addStores">保存</Button>
      </div>
    </Modal>
    <!-- 删除确认框 -->
    <Modal v-model="delModal" title="确认删除">
      <p>确认删除该仓库？</p>
      <div slot="footer">
        <Button type="error" @click="delConfirm">确认删除</Button>
        <Button type="primary" @click="delModal = false">取消</Button>
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
  getStoreListPage,
  addStore,
  editStore,
  delStore
} from '../../api/api';
export default {
  data () {
    return {
      id: '',
      defaultProps: { label: "name", children: "children" },
      title: '',
      titles: ["待选菜单", "已选菜单"],
      mode: "transfer",
      self: this,
      addstores: false,
      addMaterials: false,
      delModal: false,
      tableData: [],
      storeInfo: '',
      store: {
        textarea: '',
        name: '',
        type: '',
        admin: '',
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入仓库类型', trigger: 'blur' }
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
          title: '仓库名称',
          key: 'warehouseName',
          align: 'center',
          sortable: false

        },
        {
          title: '仓库类型',
          align: 'center',
          key: 'warehouseType',
          width: 120,
          render: (h, params) => {
            return h("div", {}, params.row.warehouseType == 1 ? "自动仓库" : params.row.warehouseType == 2 ? "半自动仓库" : params.row.warehouseType == 3 ? "普通仓库" : params.row.warehouseType == 4 ? "虚拟仓库" : '');
          }
        },
        {
          title: '仓库管理员',
          align: 'center',
          key: 'warehouseAdmin'
        },
        {
          title: '备注',
          align: 'center',
          key: 'warehouseRemark'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$refs.store.resetFields()
                    this.title = '编辑仓库'
                    this.addstores = true;
                    this.store.admin = params.row.warehouseAdmin
                    this.store.name = params.row.warehouseName
                    this.store.type = String(params.row.warehouseType)
                    this.store.textarea = params.row.warehouseRemark
                    this.id = params.row.warehouseId

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

    delet () {
      this.delModal = true;
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    getTableData () {
      let searchJson = {
        conditions: this.storeInfo,
        page: this.page,
        limit: this.pageSize
      };
      getStoreListPage(searchJson).then((res) => {
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
      this.$refs.store.resetFields()
      this.title = '新建仓库'
      this.addstores = true;

    },
    nowpage (index) {
      this.pageSize = index;
      this.page = 1;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },
    searchStore () {
      this.getTableData();
    },
    delConfirm () {
      let id = this.id
      delStore(id).then((res) => {
        if (res.data.code == 0) {
          this.$Message.success('删除成功!');
          this.addstores = false
          this.delModal = false
          this.getTableData()

        } else {


          this.addstores = false
          this.delModal = false
          this.$Message.error(res.data.msg);
        }


      });

    },
    addStores () {

      this.$refs.store.validate((valid) => {
        if (valid) {
          let params = {
            warehouseAdmin: this.store.admin,
            warehouseType: this.store.type,
            warehouseName: this.store.name,
            warehouseRemark: this.store.textarea

          };
          if (this.title == '编辑仓库') {
            params.warehouseId = this.id
            editStore(params).then((res) => {
              if (res.data.code == 0) {
                this.$Message.success('编辑成功!');
                this.addstores = false
                this.getTableData()

              } else {
                this.$Message.error(res.data.msg);
                this.addstores = false
              }

            });
          } else {
            addStore(params).then((res) => {
              if (res.data.code == 0) {
                this.$Message.success('新增成功!');
                this.addstores = false
                this.getTableData()

              } else {
                this.$Message.error(res.data.msg);
                this.addstores = false
              }

            });
          }
        } else {
          this.$Message.error('表单验证失败!');
          this.addstores = false
        }
      })
    }

  },


  mounted () {
    this.getTableData();
  }
}
</script>