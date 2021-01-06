<template>
  <div style="display:flex;">
    <div style="display:inlin-block;width:24%;background:#fff">
      <!-- <div>
        <Button type="primary" style="margin-left: 20px;" @click="addRole">新建类型</Button>
        <Button type="primary" style="margin-left: 20px;" @click="addRole">编辑类型</Button>
      </div>-->
      <div style="padding-top: 30px;">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="width: 195px;margin-left: 12px;"
        ></el-input>
        <div v-loading="isLoading" class="comp-tree">
          <!-- <el-button class="comp-tr-top" type="primary" size="small" @click="handleAddTop">添加顶级节点</el-button> -->
          <!-- tree -->

          <el-tree
            ref="SlotTree"
            class="filter-tree"
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
      <Form :label-width="80">
        <Row>
          <Col span="8">
            <FormItem label="物料信息">
              <Input v-model="meInfo" placeholder="搜索物料编码、名称、型号"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row style="margin-bottom:20px">
        <Col span="3" offset="1">
          <Button type="primary" @click="addMaterialss">新建物料</Button>
        </Col>
        <Col span="3">
          <Button type="primary" @click="uploadMaterial">导入物料</Button>
        </Col>
        <Col span="2" offset="14">
          <Button type="primary">查&nbsp;&nbsp;&nbsp;询</Button>
        </Col>
        <!-- <Col span="2" offset="14">
          <Button type="primary" @click="reset">重&nbsp;&nbsp;&nbsp;置</Button>
        </Col>-->
      </Row>
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
    <!-- 导入模态框 -->
    <Modal v-model="upLoad" width="560" title="导入物料">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </Modal>
    <!-- 新增模态框 -->
    <Modal
      v-model="addMaterial"
      width="560"
      title="新建物料"
      :mask-closable="false"
      @on-cancel="addMaterial=false;"
    >
      <Form ref="material" :model="material" :rules="ruleValidate" :label-width="100">
        <Row>
          <Col span="20">
            <FormItem label="类型" prop="type">
              <treeselect
                prop="type"
                v-model="material.type"
                :multiple="false"
                :show-count="true"
                :options="options"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="编码" prop="code">
              <Input v-model="material.code" placeholder="请输入编码"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="名称" prop="name">
              <Input v-model="material.name" placeholder="请输入名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="型号">
              <Input v-model="material.mode" placeholder="请输入型号"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="20">
            <FormItem label="单位" prop="unit">
              <AutoComplete
                v-model="material.unit"
                :data="material.unitData"
                :filter-method="filterMethod"
                placeholder="请输入或选择单位"
              ></AutoComplete>
              <!-- <Select v-model="material.unit">
                <Option value="个">个</Option>
                <Option value="台">台</Option>
                <Option value="张">张</Option>
                <Option value="盒">盒</Option>
                <Option value="千克">千克</Option>
                <Option value="平方米">平方米</Option>
                <Option value="片">片</Option>
              </Select>-->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="品牌">
              <Input v-model="material.brand" placeholder="请输入品牌"></Input>
              <!-- <AutoComplete
                v-model="material.brand"
                :data="material.mockData"
                :filter-method="filterMethod"
                placeholder="请输入或选择品牌"
              ></AutoComplete>-->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="扩展信息">
              <Input
                v-model="material.textarea"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                placeholder="请输入扩展信息"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <!-- 编辑模态框 -->
    <Modal
      v-model="addMaterials"
      width="560"
      title="编辑物料"
      :mask-closable="false"
      @on-cancel="addMaterials=false;"
    >
      <Form ref="materials" :model="materials" :rules="ruleValidates" :label-width="100">
        <Row>
          <Col span="20">
            <FormItem label="类型" prop="type">
              <treeselect
                v-model="materials.meType"
                :multiple="false"
                :show-count="true"
                :options="options"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="编码" prop="code">
              <Input v-model="materials.code"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="名称" prop="name">
              <Input v-model="materials.name" placeholder="请输入名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="型号">
              <Input v-model="materials.mode" placeholder="请输入型号"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="单位" prop="unit">
              <AutoComplete
                v-model="materials.unit"
                :data="materials.unitData"
                :filter-method="filterMethod"
                placeholder="请输入或选择单位"
              ></AutoComplete>
              <!-- <Select v-model="materials.unit">
                <Option value="个">个</Option>
                <Option value="台">台</Option>
                <Option value="张">张</Option>
                <Option value="盒">盒</Option>
                <Option value="千克">千克</Option>
                <Option value="平方米">平方米</Option>
                <Option value="片">片</Option>
              </Select>-->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="品牌">
              <Input v-model="materials.brand" placeholder="请输入品牌"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="扩展信息">
              <Input
                v-model="materials.textarea"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                placeholder="请输入扩展信息"
              ></Input>
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
  getMentalListPage
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
      fileList: [],
      filterText: '',
      upLoad: false,
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
        id: 0, name: '物料类型', children: [{
          id: 1,
          name: '一级 1',
          children: [{
            id: 4,
            name: '二级 1-1',
            children: [{
              id: 9,
              name: '三级 1-1-1'
            }, {
              id: 10,
              name: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          name: '一级 2',
          children: [{
            id: 5,
            name: '二级 2-1'
          }, {
            id: 6,
            name: '二级 2-2'
          }]
        }, {
          id: 3,
          name: '一级 3',
          children: [{
            id: 7,
            name: '二级 3-1'
          }, {
            id: 8,
            name: '二级 3-2',
            children: [{
              id: 11,
              name: '三级 3-2-1'
            }, {
              id: 12,
              name: '三级 3-2-2'
            }, {
              id: 13,
              name: '三级 3-2-3'
            }]
          }]
        }]
      }

      ],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
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
      self: this,
      pageSize: 10,
      start: 0,

      addMaterial: false,
      addMaterials: false,
      delModal: false,
      tableData: [],
      meInfo: '',
      meType: null,
      material: {
        type: null,
        code: '',
        mode: '',
        unit: '',
        brand: '',
        textarea: '',
        name: '',
        unitData: ['个', '台', '张', '盒', '千克', '平方米', '片'],
        // mockData: ['仿威图', '施耐德', '西门子', '明纬', '华为'],
      },
      materials: {
        type: null,
        code: '',
        mode: '',
        unit: '',
        brand: '',
        textarea: '',
        name: '',
        unitData: ['个', '台', '张', '盒', '千克', '平方米', '片'],
        // mockData: ['仿威图', '施耐德', '西门子', '明纬', '华为'],

      },
      ruleValidate: {
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入物料名称', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '单位不能为空', trigger: 'change' }
        ]
      },
      ruleValidates: {
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入物料名称', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '单位不能为空', trigger: 'change' }
        ]
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
                    this.addMaterials = true;

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
    //上传
    submitUpload () {
      this.$refs.upload.submit();
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
    },
    uploadMaterial () {
      this.upLoad = true
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
          // removeUser(para).then((res) => {
          //   self.mockTableData();
          // });
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
    addMaterialss () {
      this.$refs.material.resetFields();
      this.addMaterial = true;
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
    // filterNode (value, data) {
    //   if (!value) return true;
    //   return data.label.indexOf(value) !== -1;
    // },
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
    filterNode (value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }

  },
  created () {
    // 初始值
    this.startId = this.NODE_ID_START
  },
  mounted () {
    this.getTableData();
  }
}
</script>
<style lang="scss">
/* common */
// 显示按钮
// .layout-content {
//   background: #f5f7f9!important;
// }
.show-btns {
  opacity: 1;
}
/* common end */
.comp-tree {
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  padding: 2em;
  padding-left: 5px !important;
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