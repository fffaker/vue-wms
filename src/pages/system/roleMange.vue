<template>
  <div>
    <Form :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="角色信息">
            <Input v-model="roleInfo" placeholder="搜索角色名称、描述"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row style="margin-bottom:20px">
      <Col span="5">
        <Button type="primary" @click="addRole">新建角色</Button>
      </Col>
      <!-- <Col span="2" offset="15">
        <Button type="primary" @click="reset">重&nbsp;&nbsp;&nbsp;置</Button>
      </Col>-->
      <Col span="2" offset="17">
        <Button type="primary">查&nbsp;&nbsp;&nbsp;询</Button>
      </Col>
    </Row>
    <Table :context="self" :data="tableData" :columns="tableColumns" stripe border></Table>
    <!-- 新增模态框 -->
    <Modal
      v-model="addRoles"
      width="760"
      :title="title"
      :mask-closable="false"
      @on-cancel="addRoles=false;"
    >
      <Form ref="role" :model="role" :rules="ruleValidate" :label-width="100">
        <p>基础信息</p>
        <Row style="margin-left:100px">
          <Col span="18">
            <FormItem label="角色名称：" prop="name">
              <Input v-model="role.name" placeholder="请输入角色名称"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row style="margin-left:100px">
          <Col span="18">
            <FormItem label="角色描述：">
              <Input
                v-model="role.textarea"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                placeholder="请输入角色描述"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <p style="margin-top:10px">菜单权限</p>
      <div>
        <tree-transfer
          :title="titles"
          :from_data="fromData"
          :to_data="toData"
          :defaultProps="defaultProps"
          @addBtn="add"
          @removeBtn="remove"
          :mode="mode"
          height="340px"
          filter
          openAll
        ></tree-transfer>
      </div>
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
import treeTransfer from 'el-tree-transfer'
import {
  getRoleListPage,
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
      addRoles: false,
      addMaterials: false,
      delModal: false,
      tableData: [],
      roleInfo: '',

      role: {
        textarea: '',
        name: '',


      },

      ruleValidate: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
      },

      total: 0,
      page: 1,
      pageSize: 5,
      start: 0,
      tableColumns: [
        {
          title: '角色名称',
          key: 'xt_role_name',
          align: 'center',

        },
        {
          title: '角色描述',
          align: 'center',
          key: 'xt_role_desc',
          width: 300
        },
        {
          title: '拥有菜单数',
          align: 'center',
          key: 'xt_role_type'
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
                    this.addRoles = true;


                  }
                }
              }, '编辑')
            ]);
          }
        }
      ],
      mode: "transfer", // transfer addressList

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
        xt_role_name: '',
        xt_role_isdelete: '',
        start: this.start,
        limit: this.pageSize
      };
      getRoleListPage(searchJson).then((res) => {

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
            self.getTableData();
          });
        }
      })
    },
    changePage (index) {
      // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
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
    addRole () {
      this.$refs.role.resetFields();
      this.title = '新建角色'
      this.addRoles = true;

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

    }

  },
  components: { treeTransfer },
  mounted () {
    this.getTableData();
  }
}
</script>