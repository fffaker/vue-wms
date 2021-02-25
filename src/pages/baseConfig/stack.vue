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
        <Button type="primary" @click="addstore">新建料架</Button>
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
      v-model="addstores"
      width="760"
      :title="title"
      :mask-closable="false"
      @on-cancel="addstores=false;"
    >
      <Form
        style="margin-left:100px"
        ref="stack"
        :model="stack"
        :rules="ruleValidate"
        :label-width="100"
      >
        <Row>
          <Col span="18">
            <FormItem label="所属仓库：" prop="storeBelonging">
              <Select v-model="stack.storeBelonging">
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
            <FormItem label="料架名称：" prop="name">
              <Input v-model="stack.name" placeholder="请输入料架名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="行数：" prop="line">
              <Input v-model="stack.line" placeholder="请输入料架行数"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="列数：" prop="row">
              <Input v-model="stack.row" placeholder="请输入料架列数"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="备注：">
              <Input
                v-model="stack.textarea"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                placeholder="请输入备注"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button v-if="title=='编辑料架'" style="margin-right:500px" type="error" @click="delet">删除</Button>
        <Button type="text" @click="addstores = false">取消</Button>
        <Button type="primary" @click="addStacks">保存</Button>
      </div>
    </Modal>
    <!-- 删除确认框 -->
    <Modal v-model="delModal" title="确认删除">
      <p>确认删除该料架？</p>
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
  getStackListPage,
  getStores,
  addStack,
  editStack,
  delStack
} from '../../api/api';
export default {
  data () {
    return {
      id: '',
      storeBelonging: '',
      storeList: [],
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
      stack: {
        storeBelonging: '',
        textarea: '',
        name: '',
        row: '',
        line: '',
      },
      ruleValidate: {
        storeBelonging: [
          { required: true, message: '请输入所属仓库', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入料架名称', trigger: 'blur' }
        ],
        line: [
          { required: true, message: '请输入行数', trigger: 'blur' }
        ],
        row: [
          { required: true, message: '请输入列数', trigger: 'blur' }
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
          sortable: false
        },
        {
          title: '料架名称',
          align: 'center',
          key: 'feederName',
          width: 100
        },
        {
          title: '行数',
          align: 'center',
          key: 'feederLine'
        },
        {
          title: '列数',
          align: 'center',
          key: 'feederRow'
        },
        {
          title: '备注',
          align: 'center',
          key: 'feederNote'
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
                    this.$refs.stack.resetFields()
                    this.title = '编辑料架'
                    this.addstores = true;
                    this.stack.storeBelonging = params.row.warehouseId
                    this.stack.name = params.row.feederName
                    this.stack.line = String(params.row.feederLine)
                    this.stack.row = String(params.row.feederRow)
                    this.id = params.row.feederId


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
    getStore () {
      getStores().then((res) => {
        this.storeList = res.data.data
        console.log(res)
      });
    },
    delConfirm () {
      let id = this.id
      delStack(id).then((res) => {
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
    addStacks () {

      this.$refs.stack.validate((valid) => {
        if (valid) {
          let params = {
            warehouseId: this.stack.storeBelonging,
            feederName: this.stack.name,
            feederLine: this.stack.line,
            feederRow: this.stack.row,
            feederNote: this.stack.textarea

          };
          if (this.title == '编辑料架') {
            params.feederId = this.id
            editStack(params).then((res) => {
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

            addStack(params).then((res) => {
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
    },
    selectStore () {
      console.log(this.storeBelonging)
      this.getTableData();
    },

    delet () {
      this.delModal = true;
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    getTableData () {
      let searchJson = {
        warehouseName: this.storeBelonging == '0' ? '' : this.storeBelonging,
        page: this.page,
        limit: this.pageSize
      };
      getStackListPage(searchJson).then((res) => {
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
      this.$refs.stack.resetFields()
      this.title = '新建料架'
      this.addstores = true;

    },
    nowpage (index) {
      this.pageSize = index;
      this.page = 1;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
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