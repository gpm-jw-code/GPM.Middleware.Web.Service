<template >
  <div id="database-setting" class="d-flex flex-column w-100 h-100 mx-0 my-0 px-0">
    <div class="w-100"></div>
    <div class="w-100 flex-fill">
      <el-tabs v-model="tab">
        <el-tab-pane label="Database" name="Database">
          <h5>IDMS DATABASE</h5>
          <div class="d-flex flex-row">
            <div class="property-name">IDMS Database</div>
            <el-select class="w-100" v-model="IDMSDBNAME">
              <el-option v-for="db in DataBaseList" :key="db" :label="db" :value="db"></el-option>
            </el-select>
          </div>
          <el-divider></el-divider>
          <h5>DB BASIC</h5>
          <div class="d-flex flex-row">
            <div class="property-name">HOST</div>
            <el-input class="w-100" v-model="Host"></el-input>
          </div>
          <div class="d-flex flex-row">
            <div class="property-name">PORT</div>
            <el-input class="w-100" v-model="Port"></el-input>
          </div>
          <div class="d-flex flex-row">
            <div class="property-name">User Name</div>
            <el-input class="w-100" v-model="UserName"></el-input>
          </div>
          <div class="d-flex flex-row">
            <div class="property-name">Password</div>
            <el-input show-password class="w-100" v-model="Password"></el-input>
          </div>
          <el-divider></el-divider>
          <h5>連線測試</h5>
          <div class="d-flex">
            <b-button variant="light">TEST</b-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="圖表選項" name="Charting">
          <h5>Colors</h5>
          <div class="d-flex flex-row" v-for="p in Properties" :key="p.label">
            <div class="property-name">{{p.label}}</div>
            <el-color-picker show-alpha v-model="p.charting.color" />
          </div>

          <el-divider></el-divider>
          <h5>Axes</h5>
          <div class="d-flex flex-row mb-2" v-for="p in Properties" :key="p.label">
            <div class="d-flex w-100">
              <div class="property-name" v-text="p.label"></div>
              <div class="mx-2">最大值</div>
              <el-input-number size="small" precision="2" v-model="p.Axes.y.max"></el-input-number>
              <div class="mx-2">最小值</div>
              <el-input-number size="small" precision="2" v-model="p.Axes.y.min"></el-input-number>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="w-100 bg-dark" style="height:1px"></div>
  </div>
</template>
<script>

class Property {
  constructor(label) {
    this.label = label
  }
  label = '';
  charting = {
    color: 'rgba(0, 38, 255, 1)'
  }
  Axes = {
    y: {
      max: -1,
      min: -1
    },
    x: {
      max: -1,
      min: -1
    }
  }
}

import { GetDatabaseList } from '@/APIHelpers/DatabaseServerAPI';

export default {
  data() {
    return {
      IDMSDBNAME: '',
      Host: '127.0.0.1',
      Port: '5432',
      UserName: 'postgres',
      Password: 'changeme',
      DataBaseList: [],
      tab: 'Charting',
      Properties: [
        new Property("Health Score"),
        new Property("Health Score(WMA)"),
        new Property("Alert Index"),
        new Property("振動能量"),
        new Property("Raw Data"),
      ],
      max_label: '最大值',
      min_label: '最大值'
    }
  },
  mounted() {
    setTimeout(async () => {
      this.DataBaseList = await GetDatabaseList();
    }, 12);
  }
}
</script>
<style >
#database-setting h5 {
  text-align: left;
  margin-bottom: 20px;
}
#database-setting .property-name {
  width: 200px;
  margin: 0;
  text-align: left;
}
</style>