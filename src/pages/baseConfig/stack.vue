<template>
  <div>
    <Form :label-width="80" style="margin-top:20px;margin-bottom:20px">
      <Row>
        <Col span="8">
          <FormItem label="所属仓库:">
            <Select>
              <Option value="所有">全部</Option>
              <Option value="1号仓库">1号仓库</Option>
              <Option value="2号仓库">2号仓库</Option>
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
        ref="store"
        :model="store"
        :rules="ruleValidate"
        :label-width="100"
      >
        <Row>
          <Col span="18">
            <FormItem label="所属仓库：" prop="type">
              <Select v-model="store.type">
                <Option value="1号仓库">1号仓库</Option>
                <Option value="2号仓库">2号仓库</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="料架名称：" prop="name">
              <Input v-model="store.name" placeholder="请输入料架名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="行数：" prop="name">
              <Input placeholder="请输入料架行数"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="列数：" prop="name">
              <Input placeholder="请输入料架列数"></Input>
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
                placeholder="请输入备注"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button v-if="title=='编辑角色'" style="margin-right:500px" type="error" @click="delet">删除</Button>
        <Button type="text">取消</Button>
        <Button type="primary">保存</Button>
      </div>
    </Modal>
    <!-- 删除确认框 -->
    <Modal v-model="delModal" title="确认删除">
      <p>确认删除该XXX？</p>
      <div slot="footer">
        <Button type="error">确认删除</Button>
        <Button type="primary">取消</Button>
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
  addUsers
} from '../../api/api';
export default {
  data () {
    return {
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
          key: 'matter_extend',
          align: 'center',
          sortable: true
        },
        {
          title: '所属仓库',
          key: 'matter_name',
          align: 'center',
          sortable: false

        },
        {
          title: '料架名称',
          align: 'center',
          key: 'matter_code',
          width: 100
        },
        {
          title: '行数',
          align: 'center',
          key: 'matter_marking'
        },
        {
          title: '列数',
          align: 'center',
          key: 'matter_type'
        },
        {
          title: '备注',
          align: 'center',
          key: 'matter_unit'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
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
                    this.title = '编辑角色'
                    this.addstores = true;

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
        matter_name: '',
        matter_type: '',
        start: this.start,
        limit: this.pageSize
      };
      getMentalListPage(searchJson).then((res) => {

        console.log(res)
        this.total = res.data.total;
        this.tableData = res.data.data;

      });

    },
    changePage (index) {
      this.page = index;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },
    addstore () {
      this.title = '新建角色'
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
  }
}
</script>