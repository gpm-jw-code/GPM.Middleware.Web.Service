<!-- 對應IDMS上的VE閥值列表設定畫面 -->
<template>
  <div class="d-flex flex-column h-100 w-100 bg-light">
    <div class="ve-threshold-table">
      <el-table
        :data="thresholdSettings"
        :height="tableHeight"
        row-key="ModuleInfo.IP"
        @selection-change="SelectedHandle"
        :size="tableSize"
      >
        <el-table-column label="V" fixed="left" width="40" type="selection">
          <!-- <template #default="scope">
            <el-checkbox
              v-model="scope.row.selected"
              @change="SelectedHandle(scope.row.ModuleInfo.IP,scope.row.selected)"
            ></el-checkbox>
          </template>-->
        </el-table-column>
        <el-table-column label="IP" prop="ModuleInfo.IP" fixed="left" width="140"></el-table-column>
        <el-table-column label="EQ Name" prop="ModuleInfo.EqName"></el-table-column>
        <el-table-column label="UNIT Name" prop="ModuleInfo.UnitName"></el-table-column>
        <el-table-column class="px-0 py-0" label="X軸向-管制上界(UCL)" prop="ThresX.ucl" width="132">
          <template #default="scope">
            <el-input-number :step="0.01" size="small" v-model="scope.row.ThresX.ucl"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="X軸向-管制下界(LCL)" prop="ThresX.lcl" width="132">
          <template #default="scope">
            <el-input-number :step="0.01" size="small" v-model="scope.row.ThresX.lcl"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="X軸向-無動作判斷閥值" prop="ThresX.no_motion_thres" width="132">
          <template #default="scope">
            <el-input-number :step="0.01" size="small" v-model="scope.row.ThresX.no_motion_thres"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="X軸向-連結到診斷模組" prop="ThresX.linkToDignoseModule">
          <template #default="scope">
            <el-checkbox v-model="scope.row.ThresX.linkToDignoseModule"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Y軸向-管制上界(UCL)" prop="ThresY.ucl" width="132">
          <template #default="scope">
            <el-input-number :step="0.01" size="small" v-model="scope.row.ThresY.ucl"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Y軸向-管制下界(LCL)" prop="ThresY.lcl" width="132">
          <template #default="scope">
            <el-input-number :step="0.01" size="small" v-model="scope.row.ThresY.lcl"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Y軸向-無動作判斷閥值" prop="ThresY.no_motion_thres" width="132">
          <template #default="scope">
            <el-input-number :step="0.01" size="small" v-model="scope.row.ThresY.no_motion_thres"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Y軸向-連結到診斷模組" prop="ThresY.linkToDignoseModule">
          <template #default="scope">
            <el-checkbox v-model="scope.row.ThresY.linkToDignoseModule"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Z軸向-管制上界(UCL)" prop="ThresZ.ucl" width="132">
          <template #default="scope">
            <el-input-number :step="0.01" size="small" v-model="scope.row.ThresZ.ucl"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Z軸向-管制下界(LCL)" prop="ThresZ.lcl" width="132">
          <template #default="scope">
            <el-input-number :step="0.01" size="small" v-model="scope.row.ThresZ.lcl"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Z軸向-無動作判斷閥值" prop="ThresZ.no_motion_thres" width="132">
          <template #default="scope">
            <el-input-number :step="0.01" size="small" v-model="scope.row.ThresZ.no_motion_thres"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="Z軸向-連結到診斷模組" prop="ThresZ.linkToDignoseModule">
          <template #default="scope">
            <el-checkbox v-model="scope.row.ThresZ.linkToDignoseModule"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <transition name="el-zoom-in-bottom">
      <div
        v-if="show_bottom_tool"
        class="ve-threshold-all-setting d-flex flex-column bg-info border-top mx-1 px-3 py-3"
      >
        <div class="d-flex flex-row border-bottom mb-2">
          <h5>批次設定 ({{selectedRowNum}})</h5>
          <b-button class="mx-2" variant="light" size="sm" @click="SendGlobalSetting">設定</b-button>
        </div>
        <div class="d-flex flex-row">
          <div class="d-flex flex-column">
            <div class="d-flex flex-row row g-0" v-for="(obj,key) in globalSettings" :key="key">
              <span class="col-sm-2">{{key}}軸向-管制上界(UCL)</span>
              <div class="col-md-1">
                <b-form-input size="sm" type="number" :step="0.01" v-model.number="obj.ucl" />
              </div>
              <span class="col-sm-2">{{key}}軸向-管制下界(LCL)</span>
              <div class="col-md-1">
                <b-form-input size="sm" type="number" :step="0.01" v-model.number="obj.lcl" />
              </div>
              <span class="col-sm-2">{{key}}軸向-無動作判斷閥值</span>
              <div class="col-sm-1">
                <b-form-input
                  size="sm"
                  type="number"
                  :step="0.01"
                  v-model.number="obj.no_motion_thres"
                />
              </div>
              <span class="col-sm-2">{{key}}軸向-連結至診斷模組</span>
              <div class="col-md-1">
                <el-checkbox v-model="obj.linkToDignoseModule"></el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      edge_ip: '',
      ws: null,
      thresholdSettings: [],
      selectedRows: [],
      show_bottom_tool: false,
      globalSettings: {
        X: {
          ucl: -1,
          lcl: -1,
          no_motion_thres: -1,
          linkToDignoseModule: false,
        },
        Y: {
          ucl: -1,
          lcl: -1,
          no_motion_thres: -1,
          linkToDignoseModule: false,

        },
        Z: {
          ucl: -1,
          lcl: -1,
          no_motion_thres: -1,
          linkToDignoseModule: false,

        }
      },
      selectedRowNum: 0
    }
  },
  methods: {
    WsIni() {
      this.ws = new WebSocket(`ws://${this.edge_ip}:44332/VibrationEnergy/ThresholdSetting?ip=ALL&method=get`);
      this.ws.onmessage = (evt) => this.WsDataHandle(JSON.parse(evt.data));
    },
    WsDataHandle(vm) {
      this.thresholdSettings = vm;
    },
    SelectedHandle(selection) {
      // let index = this.thresholdSettings.findIndex(i => i.selected == true);
      this.selectedRows = selection;
      this.show_bottom_tool = selection.length != 0;
      this.selectedRowNum = selection.length;
      console.info(selection, this.show_bottom_tool);
    },
    InputOnChange(ele) {
      console.info(ele);
    },
    SendGlobalSetting() {
      let selectedIPList = this.selectedRows.map(i => i.ModuleInfo.IP);
      console.info(selectedIPList);
      let ws = new WebSocket(`ws://${this.edge_ip}:44332/VibrationEnergy/ThresholdSetting?method=send_json`);
      ws.onopen = () => {
        ws.send(JSON.stringify({ ipList: selectedIPList, thresholdSetting: this.globalSettings }));
      }
      ws.onmessage = (evt) => {
        var response = JSON.parse(evt.data);
        if (response.data) {
          this.ws.close();
          this.WsIni();
          this.$toast.info('OK');
        } else
          this.$toast.error(response.message);
      }
    }
  },
  mounted() {
    this.edge_ip = this.$route.params.ip;
    this.WsIni();
  },
  computed: {
    tableHeight() {
      return window.innerHeight - (this.show_bottom_tool ? 300 : 127);
    },
    tableSize() {
      return window.innerWidth < 500 ? 'small' : 'default';
    }
  },
  unmounted() {
    this.ws.close();
  }
}
</script>

<style >
.ve-threshold-all-setting {
  color: white;
  font-size: small;
  position: fixed;
  bottom: 0;
  width: 100%;
}
.ve-threshold-all-setting div div .col-md-2 {
  text-align: left;
}
</style>