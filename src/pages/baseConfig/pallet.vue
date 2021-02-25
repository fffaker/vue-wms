

<template>
  <div>
    <div id="prints" style="display:none">
      <div style="width:182px">
        <p style="text-align: center;color:#000000" v-text="this.palletName"></p>
        <svg id="prt" />
      </div>
    </div>
    <div id="print" style="display:none">
      <div v-for="item of this.materials" :key="item.value" style="width:182px">
        <p style="text-align: center;">{{item.name}}</p>
        <svg v-bind:id="'qq'+item.name" />
      </div>
    </div>
    <Form :label-width="100">
      <Row>
        <Col span="8">
          <FormItem label="托盘信息：">
            <Input v-model="palletInfo" placeholder="搜索托盘编码、名称"></Input>
          </FormItem>
        </Col>
        <Col span="8" offset="1">
          <FormItem label="托盘类型：">
            <Select v-model="type">
              <Option value="1">平托盘</Option>
              <Option value="2">柱式托盘</Option>
              <Option value="3">箱式托盘</Option>
              <Option value="4">轮式托盘</Option>
              <Option value="5">专用托盘</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row style="margin-bottom:20px">
      <Col span="3">
        <Button type="primary" @click="addstore">新建托盘</Button>
      </Col>
      <Col span="5">
        <Button type="primary" @click="mutiPrint">批量打印标签</Button>
      </Col>
      <Col span="2" offset="12">
        <Button type="primary" @click="reset">重&nbsp;&nbsp;&nbsp;置</Button>
      </Col>
      <Col span="2">
        <Button type="primary" @click="searchPallet">查&nbsp;&nbsp;&nbsp;询</Button>
      </Col>
    </Row>
    <div>
      <Table :context="self" :height="400" :data="tableData" :columns="tableColumns" stripe border></Table>
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
    <!-- 新增模态框 -->
    <Modal
      v-model="addpallet"
      width="760"
      :title="title"
      :mask-closable="false"
      @on-cancel="addpallet=false;"
      @on-ok="this.addPallets"
    >
      <Form
        style="margin-left:100px"
        ref="pallet"
        :model="pallet"
        :rules="ruleValidate"
        :label-width="100"
      >
        <Row>
          <Col span="18">
            <FormItem label="托盘编码：" prop="code">
              <Input v-model="pallet.code" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="托盘名称：" prop="name">
              <Input v-model="pallet.name" placeholder="请输入托盘名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="18">
            <FormItem label="托盘类型：" prop="type">
              <Select v-model="pallet.type">
                <Option value="1">平托盘</Option>
                <Option value="2">柱式托盘</Option>
                <Option value="3">箱式托盘</Option>
                <Option value="4">轮式托盘</Option>
                <Option value="5">专用托盘</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="18">
            <FormItem label="托盘规格：">
              <Input
                v-model="pallet.size"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                placeholder="请输入托盘规格"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button v-if="title=='编辑托盘'" style="margin-right:500px" type="error" @click="delet">删除</Button>
        <Button type="text" @click="this.cancel">取消</Button>
        <Button @click="this.addPallets" type="primary">保存</Button>
      </div>
    </Modal>

    <!-- 删除确认框 -->
    <Modal v-model="delModal" title="确认删除">
      <p>确认删除该此条托盘信息？</p>
      <div slot="footer">
        <Button @click="delConfirm" type="error">确认删除</Button>
        <Button type="primary" @click="delModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import jsbarcode from 'jsbarcode'
import Vue from 'vue'
import printTemplate from 'print-template'
import treeTransfer from 'el-tree-transfer'
import { getLodop } from "../../tools/lodop";
import {
  getUserListPage,
  getMentalListPage,
  removeUser,
  editUser,
  addUsers,
  getPalletListPage,
  getPalletCode,
  addPallet,
  editPallet,
  delPallet
} from '../../api/api';
export default {
  data () {
    return {
      palletId: '',
      url: '',
      type: '',
      palletInfo: '',
      defaultProps: { label: "name", children: "children" },
      title: '',
      titles: ["待选菜单", "已选菜单"],
      mode: "transfer",
      self: this,
      addpallet: false,
      addMaterials: false,
      delModal: false,
      tableData: [],
      materials: [{ name: '托盘1', value: '12345678' }, { name: "小型断路器5mm", value: '44554455' }],
      palletName: '',
      palletCode: '',
      pallet: {
        code: '',
        name: '',
        type: '',
        size: '',


      },

      ruleValidate: {
        name: [
          { required: true, message: '请输入托盘名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入托盘类型', trigger: 'blur' }
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
          title: '托盘编码',
          key: 'palletCode',
          align: 'center',
          sortable: false

        },
        {
          title: '托盘名称',
          align: 'center',
          key: 'palletName',
          width: 100
        },
        {
          title: '托盘类型',
          align: 'center',
          key: 'palletType',
          render: (h, params) => {
            return h("div", {}, params.row.palletType == 1 ? "平托盘" : params.row.palletType == 2 ? "柱式托盘" : params.row.palletType == 3 ? "箱式托盘" : params.row.palletType == 4 ? "轮式托盘" : params.row.palletType == 5 ? "专用托盘" : '');
          }
        },
        {
          title: '托盘规格',
          align: 'center',
          key: 'palletSpecs'
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
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$refs.pallet.resetFields()
                    this.title = '编辑托盘'
                    this.addpallet = true;
                    this.pallet.code = params.row.palletCode
                    this.pallet.name = params.row.palletName
                    this.pallet.type = String(params.row.palletType)
                    this.pallet.size = params.row.palletSpecs
                    this.palletId = params.row.palletId

                  }
                }
              }, '编辑'), h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',

                },
                style: { marginLeft: '10px' },
                on: {
                  click: () => {
                    // this.printpage();
                    // this.getPrint()

                    this.palletName = params.row.palletName
                    this.palletCode = params.row.palletCode
                    console.log(this.palletName)
                    Vue.nextTick(() => {
                      jsbarcode(
                        '#prt',
                        this.palletCode,
                        { marginRight: 8, height: 50 } // 右边距
                      )
                      this.printpage()
                    })

                  }
                }
              }, '打印')
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
    printCode () {
      let template = new printTemplate()
      // console.log(template)
      // 模板数据
      let yto = {
        name: 'yto',       // 模板名称
        unit: 'mm',       // 尺寸 默认mm    mm / px
        size: [70, 45], // 模板大小  宽 76mm / 高130mm
        fixed: [          // 固定内容 比如：线条 、logo 广告、固定字体 
          // 个人觉得 制作一个透明的底图 不需要一条线一条线设置
          { type: 'line', x: 0, y: 0, length: 70, orientation: 'l' },
          // { type: 'line', x: 2, y: 12, orientation: 'p', length: 116 },
          // { type: 'line', x: 74, y: 12, orientation: 'p', length: 116 },
          // { type: 'line', x: 2, y: 27, length: 72 },
          // { type: 'line', x: 2, y: 35, length: 72 },
          // { type: 'line', x: 2, y: 41, length: 52 },
          // { type: 'line', x: 54, y: 35, orientation: 'p', length: 32 },
          // { type: 'line', x: 54, y: 49, length: 20 },
          // { type: 'line', x: 2, y: 59, length: 72 },
          // { type: 'line', x: 2, y: 67, length: 72 },
          // { type: 'line', x: 2, y: 77, length: 72 },
          // { type: 'line', x: 2, y: 110, length: 72 },
          // { type: 'line', x: 2, y: 128, length: 72 },
          // { type: 'text', fontSize: 3.8, fontWeight: 700, x: 66, y: 2, default: '货到\n付款' },   // 固定文字   \n 换行  也可以设置 maxWidth:3.8*2  自动换行             
        ],
        data: {                    // 动态数据
          name: { type: 'text', x: 30, y: 26, fontSize: 3.5 },
          code: { type: 'barcode', x: 15, y: 5, format: 'CODE128A', width: 4, margin: 0, fontSize: 3.3, fontOptions: 'bold', displayValue: true, height: 13 },

        }

      }

      // 添加模板 
      template.push(yto)

      // 传入数据 
      let data = [{ name: '托盘1', code: '1000111' }, { name: '托盘2', code: '1000112' }]

      // 打印 
      template.print('yto', data).then(pdf => {
        // 返回 jspdf
        // blob 地址
        // if (pdf) { alert(1) } else {
        //   alert(2)
        // }
        let uri = pdf.output('bloburi', { filename: '打印文件' });
        console.log(pdf)
        let xx = pdf.createImageInfo()
        console.log(xx)
        this.url = uri;
        // var iframe = document.createElement('iframe');
        // iframe.src = uri;
        // document.body.appendChild(iframe);
        // 下载保存
        // pdf.save('打印文件');

      })

    },
    reset () {
      this.palletInfo = '';
      this.type = ''
      // 创建打印模板 
      // this.getPrint()



    },
    delet () {
      this.delModal = true;
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    getTableData () {
      let searchJson = {
        conditions: this.palletInfo,
        palletType: this.type,
        page: this.page,
        limit: this.pageSize
      };
      getPalletListPage(searchJson).then((res) => {
        if (res.data.code == 0) {
          console.log(res)
          this.total = res.data.data.total;
          this.tableData = res.data.data.list;
        } else {
          this.$Message.error(res.data.msg);
        }


      });
    },
    searchPallet () {
      this.getTableData();
    },
    delConfirm () {
      let id = this.palletId
      delPallet(id).then((res) => {
        if (res.data.code == 0) {
          this.$Message.success('删除成功!');
          this.addpallet = false
          this.delModal = false
          this.getTableData()

        } else {
          this.$Message.error(res.data.msg);
          this.addpallet = false
          this.delModal = false
        }


      });

    },


    addPallets () {

      this.$refs.pallet.validate((valid) => {
        if (valid) {
          let params = {
            palletCode: this.pallet.code,
            palletName: this.pallet.name,
            palletType: this.pallet.type,
            palletSpecs: this.pallet.size

          };
          if (this.title == '编辑托盘') {
            params.palletId = this.palletId
            editPallet(params).then((res) => {
              if (res.data.code == 0) {
                this.$Message.success('编辑成功!');
                this.addpallet = false
                this.getTableData()

              } else {
                this.$Message.error(res.data.msg);
                this.addpallet = false
              }

            });
          } else {

            addPallet(params).then((res) => {
              if (res.data.code == 0) {
                this.$Message.success('新增成功!');
                this.addpallet = false
                this.getTableData()

              } else {
                this.$Message.error(res.data.msg);
                this.addpallet = false
              }

            });
          }
        } else {
          this.$Message.error('表单验证失败!');
          this.addpallet = false
        }
      })
    },
    changePage (index) {
      this.page = index;
      this.start = (index - 1) * this.pageSize;
      this.getTableData();
    },
    addstore () {
      this.$refs.pallet.resetFields()
      this.title = '新建托盘'
      this.addpallet = true;
      getPalletCode().then((res) => {

        console.log(res)
        this.pallet.code = res.data.data;


      });


    },
    cancel () {
      this.addpallet = false
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
    mutiPrint () {
      var newstr = document.getElementById('print').innerHTML;
      var oldstr = document.body.innerHTML;
      document.body.innerHTML = newstr;
      window.print();
      document.body.innerHTML = oldstr;
      window.location.reload();
    },
    printpage () {
      var newstr = document.getElementById('prints').innerHTML;
      var oldstr = document.body.innerHTML;
      document.body.innerHTML = newstr;
      window.print();
      document.body.innerHTML = oldstr;
      window.location.reload();
      // return false;
    },
    getPrint () {

      let LODOP = getLodop();
      for (let i = 0; i < this.materials.length; i++) {
        //打印初始化，
        LODOP.PRINT_INIT("");
        LODOP.SET_PRINT_STYLE("FontSize", 11);//打印区域的字体大小
        LODOP.SET_PRINT_PAGESIZE(1, '70mm', '45mm', "");//打印区域的整体尺寸
        //设置打印模式PRINT_NOCOLLATE非逐份打印
        // LODOP.SET_PRINT_STYLEA(2, "FontSize", 11);
        // LODOP.SET_PRINT_STYLEA(2, "FontColor", 0);
        LODOP.ADD_PRINT_BARCODE(50, 50, '45mm', '10mm', "128Auto", this.materials[i]);
        LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='1.jpg' style='z-index: -1'/>");
        LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW", 0);
        LODOP.SET_SHOW_MODE("BKIMG_PRINT", 0);
        // LODOP.SET_SHOW_MODE("BKIMG_LEFT", 1);
        // LODOP.SET_SHOW_MODE("BKIMG_TOP", 1);
        // LODOP.SET_SHOW_MODE("LANGUAGE", 0);


        // LODOP.PRINT("");
        LODOP.PREVIEW();
      }
    },

  },

  components: { treeTransfer },
  mounted () {
    this.getTableData();
    for (let item of this.materials) {
      jsbarcode(
        '#qq' + item.name,
        item.value,
        { marginRight: 8, height: 50 } // 右边距
      )
    }
  },
  created () {
    // this.printCode()

    // 不要在create时调用jsbarcode库，此时相关DOM还未加载。
  },
}
</script>