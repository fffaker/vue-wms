<template>
  <div>
    <Tabs :animated="false">
      <TabPane label="立库一">
        <div style="margin-bottom:10px">
          <span>1号料架</span>
          <!-- <div style="float: right;">
            <div
              style="float: left;display:inline-block;width: 20px;height: 20px;background-color: rgba(109, 0, 14, 1);"
            ></div>
            <span style="float: left;margin-left: 5px;margin-right: 35px;">满载</span>
            <div
              style="float: left;display:inline-block;width: 20px;height: 20px;background-color: rgba(75, 121, 2, 1);"
            ></div>
            <span style="float: left;margin-left: 5px;margin-right: 35px;">有空余</span>
            <div
              style="float: left;display:inline-block;width: 20px;height: 20px;box-sizing: border-box;border-width: 1px;border-style: solid;border-color:#e1e2e5;"
            ></div>
            <span style="float: left;margin-left: 5px;margin-right: 135px;">无托盘</span>
          </div>-->
        </div>
        <div class="t1" style="width:1106px;height:auto" @click="wareDetail">
          <div>
            <div>1-1</div>
            <span style="margin-left: 16px;font-size: 13px;color:rgb(170, 170, 170)">机器人本体及配套</span>
          </div>
          <div>
            <div>1-2</div>
            <span style="margin-left: 16px;font-size: 13px;color:rgb(170, 170, 170)">机器人本体及配套</span>
          </div>
          <div>
            <div>1-3</div>
            <span style="margin-left: 16px;font-size: 13px;color:rgb(170, 170, 170)">机器人本体及配套</span>
          </div>
          <div>
            <div>1-4</div>
            <span style="margin-left: 16px;font-size: 13px;color:rgb(170, 170, 170)">机器人本体及配套</span>
          </div>
          <div>1-5</div>
          <div>1-6</div>
          <div>1-7</div>
          <div>1-8</div>
          <div>2-1</div>
          <div>2-2</div>
          <div>2-3</div>
          <div>2-4</div>
          <div>2-5</div>
          <div>2-6</div>
          <div>2-7</div>
          <div>2-8</div>
          <div>3-1</div>
        </div>
      </TabPane>
      <TabPane label="立库二">
        <div style="margin-bottom:10px">
          <span>1号料架</span>
          <div style="float: right;">
            <div
              style="float: left;display:inline-block;width: 20px;height: 20px;background-color: rgba(109, 0, 14, 1);"
            ></div>
            <span style="float: left;margin-left: 5px;margin-right: 35px;">满载</span>
            <div
              style="float: left;display:inline-block;width: 20px;height: 20px;background-color: rgba(75, 121, 2, 1);"
            ></div>
            <span style="float: left;margin-left: 5px;margin-right: 35px;">有空余</span>
            <div
              style="float: left;display:inline-block;width: 20px;height: 20px;box-sizing: border-box;border-width: 1px;border-style: solid;border-color:#e1e2e5;"
            ></div>
            <span style="float: left;margin-left: 5px;margin-right: 135px;">无托盘</span>
          </div>
        </div>
        <div class="t1" style="width:1106px;height:auto" @click="wareDetail">
          <div style="background:rgba(109, 0, 14, 1);color:#fff">
            <div>1-1</div>
            <span style="margin-left: 25px;font-size: 13px;">机器人工作站</span>
          </div>
          <div>
            <div>1-2</div>
            <span style="margin-left: 16px;font-size: 13px;color:rgb(170, 170, 170)">机器人本体及配套</span>
          </div>
          <div style="background:rgba(75, 121, 2, 1);color:#fff">
            <div>1-3</div>
            <span style="margin-left: 16px;font-size: 13px;">机器人本体及配套</span>
          </div>
          <div>
            <div>1-4</div>
            <span style="margin-left: 16px;font-size: 13px;color:rgb(170, 170, 170)">机器人本体及配套</span>
          </div>
          <div>1-5</div>
          <div>1-6</div>
          <div>1-7</div>
          <div>1-8</div>
          <div>2-1</div>
          <div>2-2</div>
          <div>2-3</div>
          <div>2-4</div>
          <div>2-5</div>
          <div>2-6</div>
          <div>2-7</div>
          <div>2-8</div>
          <div>3-1</div>
        </div>
      </TabPane>
    </Tabs>
    <Drawer title="编辑库位" v-model="drawer" width="420" :mask-closable="false" :styles="styles">
      <!-- <div class="list">
        <p style="margin-left: 10px;">物料清单</p>
        <div
          style="background-color: rgba(242, 242, 242, 1);font-weight: 700;margin: 10px;padding: 20px;color: #333333;"
        >
          <p>小型断路器 * 10个</p>
          <p>世达六角旋具套筒 * 20个</p>
        </div>
      </div>-->
      <div class="info" style="margin-top: 10px;">
        <div style="padding: 20px;padding-left:40px">
          <p style="margin-top:20px">
            仓库:
            <span style="font-weight: 700;margin-left: 15px;color: #333333;">立库1</span>
          </p>

          <p style="margin-top:20px">
            料架:
            <span style="font-weight: 700;margin-left: 15px;color: #333333;">1号料架</span>
          </p>
          <p style="margin-top:20px">
            库位:
            <span style="font-weight: 700;margin-left: 15px;color: #333333;">1行1列</span>
          </p>
          <Form :label-width="89" style="margin-top:20px">
            <FormItem label="可存放物料:">
              <treeselect
                placeholder="请选择"
                v-model="material"
                :multiple="false"
                :show-count="true"
                :options="options"
              />
            </FormItem>
          </Form>
        </div>
      </div>
    </Drawer>
  </div>
</template>
<script>
import {
  addUsers
} from '../../api/api';
import Treeselect from '@riophae/vue-treeselect'
export default {
  components: { Treeselect },
  name: 'component-tree',
  data () {
    return {
      drawer: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
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
      defaultProps: {// 默认设置
        children: 'children',
        label: 'name'
      },
      material: null


    }
  },
  methods: {
    wareDetail () {
      this.drawer = true
    }
  },

  mounted () {

  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.t1 > div {
  margin-right: -1px;
  float: left;
  width: 138px;
  height: 66px;
  border: 1px solid #e1e2e5;
  cursor: pointer;
  // margin-bottom: -1px;
}
</style>