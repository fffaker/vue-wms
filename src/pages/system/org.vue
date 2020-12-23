<template>
  <div style="display:flex">
    <div style="display:inlin-block;width:24%;background:#fff">
      <!-- <div>
        <Button type="primary" style="margin-left: 20px;" @click="addRole">新建类型</Button>
        <Button type="primary" style="margin-left: 20px;" @click="addRole">编辑类型</Button>
      </div>-->
      <div style="padding-top: 30px;">
        <div v-loading="isLoading" class="comp-tree">
          <el-button class="comp-tr-top" type="primary" size="small" @click="handleAddTop">添加顶级节点</el-button>
          <!-- tree -->
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          <el-tree
            ref="SlotTree"
            :data="setTree"
            :filter-node-method="filterNode"
            :props="defaultProps"
            :expand-on-click-node="false"
            highlight-current
            :node-key="NODE_KEY"
          >
            <div class="comp-tr-node" slot-scope="{ node, data }">
              <!-- 编辑状态 -->
              <template v-if="node.isEdit">
                <el-input
                  v-model="data.name"
                  autofocus
                  size="mini"
                  :ref="'slotTreeInput'+data[NODE_KEY]"
                  @blur.stop="handleInput(node, data)"
                  @keyup.enter.native="handleInput(node, data)"
                ></el-input>
              </template>
              <!-- 非编辑状态 -->
              <template v-else>
                <!-- 名称： 新增节点增加class（is-new） -->
                <span
                  :class="[data[NODE_KEY] < NODE_ID_START ? 'is-new' : '', 'comp-tr-node--name']"
                >{{ node.label }}</span>

                <!-- 按钮 -->
                <span class="comp-tr-node--btns">
                  <!-- 新增 -->
                  <el-button
                    icon="el-icon-plus"
                    size="mini"
                    circle
                    type="primary"
                    @click="handleAdd(node, data)"
                  ></el-button>

                  <!-- 编辑 -->
                  <el-button
                    icon="el-icon-edit"
                    size="mini"
                    circle
                    type="info"
                    @click="handleEdit(node, data)"
                  ></el-button>

                  <!-- 删除 -->
                  <el-button
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    type="danger"
                    @click="handleDelete(node, data)"
                  ></el-button>
                </span>
              </template>
            </div>
          </el-tree>
        </div>
      </div>
    </div>
    <div style="display:inlin-block;width:73%;background:#fff;margin-left: 10px;padding-top: 30px;">
      <Form :label-width="100">
        <Row>
          <Col span="8">
            <FormItem label="人员信息：">
              <Input v-model="meInfo" placeholder="搜索人员姓名、账号"></Input>
            </FormItem>
          </Col>
          <Col span="2" offset="1">
            <Button type="primary" @click="search">查&nbsp;&nbsp;&nbsp;询</Button>
          </Col>
          <Col span="5">
            <Button type="primary" @click="editPersons">添加人员</Button>
          </Col>
        </Row>
      </Form>
      <!-- <Row style="margin-bottom:20px">
        
        <Col span="2" offset="14">
          <Button type="primary" @click="reset">重&nbsp;&nbsp;&nbsp;置</Button>
        </Col>
      </Row>-->
      <div style="padding:10px">
        <Table
          :context="self"
          :height="400"
          :data="tableData"
          :columns="tableColumns"
          stripe
          border
        ></Table>
      </div>

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
    <!-- 新增模态框 -->
    <Modal
      v-model="addPerson"
      width="560"
      title="添加人员"
      :mask-closable="false"
      @on-cancel="addPerson=false;"
    >
      <Form ref="person" :model="person" :rules="ruleValidate" :label-width="100">
        <Row>
          <Col span="14">
            <FormItem label="账号：" prop="account">
              <Input v-model="person.account" placeholder="请输入账号"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <p style="margin-left: 20px;margin-top: 7px;">默认密码：888888</p>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="姓名：" prop="name">
              <Input v-model="person.name" placeholder="请输入姓名"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="角色：" prop="role">
              <Select v-model="person.role">
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
          <Col span="20">
            <FormItem label="所属组织：" prop="orz">
              <treeselect
                v-model="person.orz"
                :multiple="false"
                :show-count="true"
                :options="options"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <!-- <Button style="margin-right:300px" type="error" @click="delet">删除</Button> -->
        <Button type="text">取消</Button>
        <Button type="primary" @click="addPeople">保存</Button>
      </div>
    </Modal>
    <!-- 编辑模态框 -->
    <Modal
      v-model="editPerson"
      width="560"
      title="编辑人员"
      :mask-closable="false"
      @on-cancel="editPerson=false;"
    >
      <Form ref="persons" :model="persons" :rules="ruleValidates" :label-width="100">
        <Row>
          <Col span="20">
            <FormItem label="姓名：" prop="name">
              <Input v-model="persons.name" placeholder="请输入姓名"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="14">
            <FormItem label="账号：" prop="account">
              <Input v-model="persons.account" placeholder="请输入账号"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <p
              style="cursor: pointer;color: rgb(43, 133, 228);margin-left: 20px;margin-top: 7px;"
            >重置密码</p>
          </Col>
        </Row>

        <Row>
          <Col span="20">
            <FormItem label="角色：" prop="role">
              <Select v-model="persons.role">
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
          <Col span="20">
            <FormItem label="所属组织：" prop="orz">
              <treeselect
                v-model="persons.orz"
                :multiple="false"
                :show-count="true"
                :options="options"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="状态：">
              <Button :type="buttonType()" @click="changeState">正常</Button>
              <Button :type="buttonTypes()" @click="changeStates">停用</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button style="margin-right:300px" type="error" @click="delet">删除</Button>
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
import {
  getUserListPage,
  removeUser,
  editUser,
  getOrgTree,

} from '../../api/api';
import Treeselect from '@riophae/vue-treeselect'
// import the styles
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  watch: {
    filterText (val) {
      this.$refs.SlotTree.filter(val);
    }
  },
  components: { Treeselect },
  name: 'component-tree',
  // watch: {
  //   filterText (val) {
  //     this.$refs.tree.filter(val);
  //   }
  // },
  data () {
    return {
      isable: true,
      filterText: '',
      isLoading: false,// 是否加载
      // setTree: [],// tree数据
      NODE_KEY: 'id',// id对应字段
      MAX_LEVEL: 3,// 设定最大层级
      NODE_ID_START: 0,// 新增节点id，逐次递减
      startId: null,
      defaultProps: {// 默认设置
        children: 'children',
        label: 'name'
      },
      initParam: {// 新增参数
        name: '新增节点',
        pid: 0,
        children: []
      },
      setTree: [{
        id: 1,
        name: '生产部',
        children: [{
          id: 4,
          name: '车间',
          children: [{
            id: 9,
            name: '车间1'
          }, {
            id: 10,
            name: '车间2'
          }]
        }]
      }, {
        id: 2,
        name: '采购部',
        children: [{
          id: 5,
          name: '采购组1'
        }, {
          id: 6,
          name: '采购组2'
        }]
      }, {
        id: 3,
        name: '销售部',
        children: [{
          id: 7,
          name: '市场部'
        }, {
          id: 8,
          name: '分销部',
          children: [{
            id: 11,
            name: '分销组1'
          }, {
            id: 12,
            name: '分销组2'
          }, {
            id: 13,
            name: '分销组3'
          }]
        }]
      }],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
      options: [{
        id: 1,
        label: '生产部',
        children: [{
          id: 4,
          label: '车间',
          children: [{
            id: 9,
            label: '车间1'
          }, {
            id: 10,
            label: '车间2'
          }]
        }]
      }, {
        id: 2,
        label: '采购部',
        children: [{
          id: 5,
          label: '采购组1'
        }, {
          id: 6,
          label: '采购组2'
        }]
      }, {
        id: 3,
        label: '销售部',
        children: [{
          id: 7,
          label: '市场部'
        }, {
          id: 8,
          label: '分销部',
          children: [{
            id: 11,
            label: '分销组1'
          }, {
            id: 12,
            label: '分销组2'
          }, {
            id: 13,
            label: '分销组3'
          }]
        }]
      }],
      self: this,
      pageSize: 10,
      start: 0,
      addPerson: false,
      editPerson: false,
      delModal: false,
      tableData: [],
      meInfo: '',
      meType: null,
      person: {
        account: '',
        orz: null,
        role: '',
        name: '',
        roleData: ['个', '台', '张', '盒', '台', '千克', '平方米', '片'],
      },
      persons: {
        account: '',
        orz: null,
        role: '',
        name: '',
        roleData: ['个', '台', '张', '盒', '台', '千克', '平方米', '片'],

      },
      ruleValidate: {
        role: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        orz: [
          { required: true, message: '所属组织不能为空', trigger: 'blur' }
        ]
      },
      ruleValidates: {
        role: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        orz: [
          { required: true, message: '所属组织不能为空', trigger: 'blur' }
        ]
      },
      total: 0,
      page: 1,
      tableColumns: [
        {
          title: '姓名',
          key: 'xt_userinfo_realName',
          align: 'center',

        },
        {
          title: '账号',
          key: 'xt_userinfo_name',
          align: 'center',
          sortable: false

        },
        {
          title: '角色',
          align: 'center',
          key: 'xt_role_name',
          width: 100
        },
        {
          title: '所属组织',
          align: 'center',
          key: 'xt_departinfo_name'
        },
        {
          title: '状态',
          align: 'center',
          key: 'xt_userinfo_state'
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
                    this.editPerson = true;

                  }
                }
              }, '编辑')
            ]);
          }
        }
      ]
    }
  },
  methods: {
    addPeople () {
      console.log(this.person.name, this.person.role, this.person.account, this.person.orz)
    },
    getTree () {
      let searchJson = {
        id: '',
      };
      getOrgTree(searchJson).then((res) => {

        console.log(res)

      });
    },
    reset () {
      this.meInfo = '';
      this.meType = null
    },
    delet () {
      this.delModal = true;
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    search () {
      this.getTableData();
    },
    getTableData () {
      let searchJson = {
        searchJson: { xt_userinfo_realName: this.meInfo },
        xt_departinfo_id: '',
        xt_departinfo_name: '',
        xt_post_name: '',
        xt_userinfo_isDelete: '',
        xt_userinfo_name: '',
        xt_userinfo_realName: this.meInfo,
        xt_userinfo_state: '0',
        start: this.start,
        limit: this.pageSize
      };
      getUserListPage(searchJson).then((res) => {

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
          // removeUser(para).then((res) => {
          //   self.mockTableData();
          // });
        }
      })
    },
    changePage (index) {
      // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
      console.log('mjq');
      this.page = index;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },
    nowpage (index) {
      this.pageSize = index;
      this.page = 1;
      this.start = (this.page - 1) * this.pageSize;
      this.getTableData();
    },
    editPersons () {
      this.$refs.person.resetFields();
      this.addPerson = true;
      this.unit = '个'
    },
    //tree
    handleDragStart (node, ev) {
      console.log('drag start', node);
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label);
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label);
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType);
    },
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner';
      } else {
        return true;
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleDelete (_node, _data) {// 删除节点
      console.log(_node, _data)
      // 判断是否存在子节点
      if (_data.children && _data.children.length !== 0) {
        this.$message.error("此节点有子级，不可删除！")
        return false;
      } else {
        // 删除操作
        let DeletOprate = () => {
          this.$nextTick(() => {
            if (this.$refs.SlotTree) {
              this.$refs.SlotTree.remove(_data)
              this.$message.success("删除成功！")
            }
          })
        }
        // 二次确认
        let ConfirmFun = () => {
          this.$confirm("是否删除此节点？", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            DeletOprate()
          }).catch(() => { })
        }
        // 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
        _data[this.NODE_KEY] < this.NODE_ID_START ? DeletOprate() : ConfirmFun()
      }
    },
    handleInput (_node, _data) {// 修改节点
      console.log(_node, _data)
      // 退出编辑状态
      if (_node.isEdit) {
        this.$set(_node, 'isEdit', false)
      }
    },
    handleEdit (_node, _data) {// 编辑节点
      console.log(_node, _data)
      // 设置编辑状态
      if (!_node.isEdit) {
        this.$set(_node, 'isEdit', true)
      }
      // 输入框聚焦
      this.$nextTick(() => {
        if (this.$refs['slotTreeInput' + _data[this.NODE_KEY]]) {
          this.$refs['slotTreeInput' + _data[this.NODE_KEY]].$refs.input.focus()
        }
      })
    },
    handleAdd (_node, _data) {// 新增节点
      console.log(_node, _data)
      // 判断层级
      if (_node.level >= this.MAX_LEVEL) {
        this.$message.warning("当前已达到" + this.MAX_LEVEL + "级，无法新增！")
        return false;
      }
      // 参数修改
      let obj = JSON.parse(JSON.stringify(this.initParam));// copy参数
      obj.pid = _data[this.NODE_KEY];// 父id
      obj[this.NODE_KEY] = --this.startId;// 节点id：逐次递减id
      // 判断字段是否存在
      if (!_data.children) {
        this.$set(_data, 'children', [])
      }
      // 新增数据
      _data.children.push(obj)
      // 展开节点
      if (!_node.expanded) {
        _node.expanded = true
      }
    },
    handleAddTop () {// 添加顶部节点
      let obj = JSON.parse(JSON.stringify(this.initParam));// copy参数
      obj[this.NODE_KEY] = --this.startId;// 节点id：逐次递减id
      this.setTree.push(obj)
    },
    // filterNode (value, data) {
    //   if (!value) return true;
    //   return data.label.indexOf(value) !== -1;
    // },
    buttonType () {
      if (this.isable) {
        return 'primary'
      } else {
        return 'default'
      }
    },
    changeState () {
      this.isable = true

    },
    changeStates () {
      this.isable = false
    },
    buttonTypes () {
      if (this.isable) {
        return 'default'
      } else {
        return 'primary'
      }
    }

  },
  created () {
    // 初始值
    this.startId = this.NODE_ID_START;
    this.getTree()
  },
  mounted () {
    this.getTableData();
  }
}
</script>
<style lang="scss">
.primary {
  background-color: aqua;
}
/* common */
// 显示按钮
.show-btns {
  opacity: 1;
}
/* common end */
.comp-tree {
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  padding: 2em;
  overflow: auto;
  // 顶部按钮
  .comp-tr-top {
    width: 100px;
    margin-bottom: 2em;
  }
  // 自定义节点
  .comp-tr-node {
    // label
    .comp-tr-node--name {
      display: inline-block;
      line-height: 40px;
      min-height: 40px;
      // 新增
      &.is-new {
        font-weight: bold;
      }
    }
    // button
    .comp-tr-node--btns {
      margin-left: 10px;
      opacity: 0;
      transition: opacity 0.1s;
      .el-button {
        transform: scale(0.8); // 缩小按钮
        & + .el-button {
          margin-left: -1px;
        }
      }
    }
  }
  // 高亮显示按钮
  .is-current {
    & > .el-tree-node__content {
      background-color: #99c4f0 !important;
      .comp-tr-node--btns {
        @extend .show-btns;
      }
    }
  }
  // 悬浮显示按钮
  .el-tree-node__content {
    &:hover {
      .comp-tr-node--btns {
        @extend .show-btns;
      }
    }
  }
}
</style>