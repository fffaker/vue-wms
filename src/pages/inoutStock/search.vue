<template>
  <div>
    <Form :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="仓库">
            <Select v-model="storeBelonging">
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
          <FormItem label="物料信息">
            <Input v-model="scan.mental" placeholder="搜索物料名称、编码、型号"></Input>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="物料类型" prop="type">
            <treeselect
              @select="selectType"
              placeholder="请选择"
              prop="type"
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
        <Button type="primary" @click="searchInfo">查&nbsp;&nbsp;&nbsp;询</Button>
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
      <Form ref="store" :model="store" :rules="ruleValidate" :label-width="100">
        <div>
          <p>1号仓库</p>
          <Table :columns="columns1" :data="data1" border height="400"></Table>
        </div>
      </Form>
      <div slot="footer"></div>
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
  addUsers,
  getStorageListPage,
  getStores,
  getMentalTree,
  getMentalPage
} from '../../api/api';
export default {
  components: { Treeselect },
  name: 'component-tree',
  data () {
    return {
      id: '',
      storeList: [],
      storeBelonging: '',
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
      columns1: [
        {
          title: '料架名称',
          key: 'feederName'
        },
        {
          title: '库位',
          key: 'storagebinLine',
          render: (h, params) => {
            return h("div", {}, params.row.storagebinRow == null ? '' : (params.row.storagebinLine + '行' + params.row.storagebinRow + '列'));
          }

        },
        {
          title: '托盘编号',
          key: 'pallerCode'
        },
        {
          title: '数量',
          key: 'matterNum'
        },
        {
          title: '入库时间',
          key: 'warehousingTime'
        },


      ],
      data1: [
        {
          name: '一号料架',
          sit: '2行4列',
          code: 'TP20201209001',
          num: '180',
          time: '2020-12-08 10:23',

        },
        {
          name: '一号料架',
          sit: '2行5列',
          code: 'TP20201209002',
          num: '210',
          time: '2020-12-09 10:23',

        },
        {
          name: '小计',
          sit: '',
          code: '',
          num: '390',
          time: '',
        }

        // },{
        //   name: '一号料架',
        //   sit: '2行4列',
        //   code: 'TP20201209001',
        //   num: '180',
        //   time: '2020-12-08 10:23',

        // },
      ],

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
          title: '物料名称',
          key: 'matterName',
          align: 'center',
          sortable: false

        },
        {
          title: '物料编码',
          align: 'center',
          key: 'matterCode',
          width: 100
        },
        {
          title: '型号',
          align: 'center',
          key: 'matterMarking'
        },
        {
          title: '物料类型',
          align: 'center',
          key: 'matterType'
        },
        {
          title: '库存数量',
          align: 'center',
          key: 'matterNum'
        },
        {
          title: '单位',
          align: 'center',
          key: 'matterUnit'
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
          align: 'center',
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
                    let id = params.row.matterId
                    getMentalPage(id).then((res) => {
                      this.data1 = res.data.data[0].mrList
                      console.log(this.data1)


                    });
                    this.title = '库存分布(' + params.row.matterName + ')'
                    this.addstores = true;

                  }
                }
              }, '分布')
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
        conditions: this.scan.mental,
        warehouseId: this.storeBelonging == '0' ? '' : this.storeBelonging,
        mattertypeId: this.scan.type,
        page: this.page,
        limit: this.pageSize
      };
      getStorageListPage(searchJson).then((res) => {
        if (res.data.code == 0) {
          console.log(res)
          this.total = res.data.data.total;
          this.tableData = res.data.data.list;
        } else {
          this.$Message.error(res.data.msg);
        }

      });

    },
    searchInfo () {
      this.getTableData()
    },
    selectType (node, instanceId) {
      console.log(node.id)
      this.scan.type = node.id

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
      this.storeBelonging = ''
      this.scan.type = null
      this.scan.mental = ''

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
    getStore () {
      getStores().then((res) => {
        this.storeList = res.data.data
        console.log(res)
      });
    },
    getTree () {
      getMentalTree().then((res) => {
        let str = JSON.stringify(res.data.data);
        let reg = new RegExp('mattertypeName', 'g');
        let newStr = str.replace(reg, 'label');
        let a = JSON.parse(newStr)

        this.options = a
        // alert(JSON.stringify(this.options))




      });
    },

  },

  // components: { treeTransfer },
  mounted () {
    this.getTableData();
  },
  created () {
    this.getStore();
    this.getTree();
  }
}

</script>