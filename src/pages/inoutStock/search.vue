<template>
  <div>
    <Form :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="仓库">
            <Select v-model="scan.store">
              <Option value="1号仓库">1号仓库</Option>
              <Option value="2号仓库">2号仓库</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="物料信息">
            <Input v-model="scan.mental" placeholder="搜索物料名称、编码、型号"></Input>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="物料类型" prop="type">
            <treeselect
              v-model="scan.type"
              :multiple="false"
              :show-count="true"
              :options="options"
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row style="margin-bottom:20px">
      <!-- <Col span="5">
        <Button type="primary" @click="addstore">重置</Button>
      </Col>-->
      <Col span="2" offset="18">
        <Button type="primary" @click="reset">重&nbsp;&nbsp;&nbsp;置</Button>
      </Col>
      <Col span="2">
        <Button type="primary">查&nbsp;&nbsp;&nbsp;询</Button>
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
        <p style="margin-left:-100px">基础信息</p>
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
            <FormItem label="仓库管理员：" prop="admin">
              <Select v-model="store.manger">
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
            <FormItem label="角色描述：">
              <Input
                v-model="store.textarea"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                placeholder="请输入角色描述"
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
// import treeTransfer from 'el-tree-transfer'
import Treeselect from '@riophae/vue-treeselect'
import {
  getUserListPage,
  getMentalListPage,
  removeUser,
  editUser,
  addUsers
} from '../../api/api';
export default {
  components: { Treeselect },
  name: 'component-tree',
  data () {
    return {
      defaultProps: { label: "name", children: "children" },
      title: '',
      options: [{
        id: 'a',
        label: 'a',
        children: [{
          id: 'aa',
          label: 'aa',
        }, {
          id: 'ab',
          label: 'ab',
        }],
      }, {
        id: 'b',
        label: 'b',
      }, {
        id: 'c',
        label: 'c',
      }],
      titles: ["待选菜单", "已选菜单"],
      mode: "transfer",
      self: this,
      addstores: false,
      addMaterials: false,
      delModal: false,
      tableData: [],
      storeInfo: '',
      scan: {
        store: '',
        mental: '',
        type: null
      },
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
          title: '名称',
          key: 'matter_name',
          align: 'center',
          sortable: false

        },
        {
          title: '编码',
          align: 'center',
          key: 'matter_code',
          width: 100
        },
        {
          title: '型号',
          align: 'center',
          key: 'matter_marking'
        },
        {
          title: '类型',
          align: 'center',
          key: 'matter_type'
        },
        {
          title: '单位',
          align: 'center',
          key: 'matter_unit'
        },
        {
          title: '品牌',
          align: 'center',
          key: 'matter_brand'
        },
        // {
        //   title: '性别',
        //   key: 'sex',
        //   align: 'center',
        //   // render: function (row, column, index) {
        //   //   return row.sex == 0 ? '男' : '女';
        //   // }
        // },
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

      fromData: [

        {
          id: 1,
          pid: 0,
          name: "系统管理",
          children: [
            {
              id: 1.1,
              pid: 1,
              name: "组织人员",
              children: [],
            },
            {
              id: 1.2,
              pid: 1,
              name: "角色管理",
              children: [],
            },

          ],
        },
        {
          id: 2,
          pid: 0,
          name: "基础配置",
          children: [
            {
              id: 2.1,
              pid: 2,
              name: "仓库管理",
              // disabled: true,
              children: [],
            },
            {
              id: 2.2,
              pid: 2,
              name: "料架管理",
              children: [],
            },
            {
              id: 2.3,
              pid: 2,
              name: "托盘管理",
              children: [],
            },
            {
              id: 2.4,
              pid: 2,
              name: "组盘管理",
              children: [],
            },
            {
              id: 2.5,
              pid: 2,
              name: "物料管理",
              children: [],
            },
          ],
        },

      ],

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
    show (index) {
      this.$Modal.info({
        title: '用户信息',
        content: `姓名：${this.tableData[index].name}<br>年龄：${this.tableData[index].age}<br>地址：${this.tableData[index].addr}`
      })
    },
    remove (index) {
      let self = this;
      this.$Modal.confirm({
        title: '用户信息',
        content: `是否删除此记录`,
        onOk: function () {
          this.$Loading.start();
          let para = { id: index }
          removeUser(para).then((res) => {
            self.mockTableData();
          });
        }
      })
    },
    changePage (index) {
      this.page = index;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },
    reset () {
      this.scan.mental = ''
      this.scan.type = null
      this.scan.store = ''

    },
    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList

    changeMode () {

      if (this.mode == "transfer") {

        this.mode = "addressList";

      } else {

        this.mode = "transfer";

      }

    },

    // 监听穿梭框组件添加

    add (fromData, toData, obj) {

      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象

      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表

      console.log("fromData:", fromData);

      console.log("toData:", toData);

      console.log("obj:", obj);

    },

    // 监听穿梭框组件移除

    remove (fromData, toData, obj) {

      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象

      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表

      console.log("fromData:", fromData);

      console.log("toData:", toData);

      console.log("obj:", obj);

    },
    nowpage (index) {
      this.pageSize = index;
      this.page = 1;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },

  },

  // components: { treeTransfer },
  mounted () {
    this.getTableData();
  }
}
</script>