<template>
  <div class="view">
    <h4>Edge 狀態</h4>
    <el-table
      row-class-name="tableRow"
      :row-style="rowStyle"
      :cell-style="rowStyle"
      :header-cell-style="headerStyle"
      @expand-change="ExpandHandle"
      :data="EdgesInfo"
      size="large"
      row-key="IP"
      height="300"
      style="width:100%;background-color: #1e1e1e;"
      highlight-current-row
    >
      <el-table-column sortable fixed="left" label="IP" prop="EdgeIP"></el-table-column>
      <el-table-column sortable fixed="left" label="名稱" prop="Name"></el-table-column>
      <el-table-column sortable label="已連接模組數" prop="SensorNum"></el-table-column>
      <el-table-column sortable label="資料庫使用" prop="DbDickUsage"></el-table-column>

      <el-table-column sortable label="更新時間" prop="HSCharingDataUpdateTime">
        <template #default="scope">{{GetTime(scope.row.EdgeIP,scope.column.property)}}</template>
      </el-table-column>

      <el-table-column sortable label="更新時間" prop="DignoseDataUpdateTime">
        <template #default="scope">{{GetTime(scope.row.EdgeIP,scope.column.property)}}</template>
      </el-table-column>

      <el-table-column sortable label="更新時間" prop="AIHCharingDataUpdateTime">
        <template #default="scope">{{GetTime(scope.row.EdgeIP,scope.column.property)}}</template>
      </el-table-column>

      <el-table-column sortable label="更新時間" prop="AIDCharingDataUpdateTime">
        <template #default="scope">{{GetTime(scope.row.EdgeIP,scope.column.property)}}</template>
      </el-table-column>

      <el-table-column sortable label="更新時間" prop="VEWithChartingUpdataTime">
        <template #default="scope">{{GetTime(scope.row.EdgeIP,scope.column.property)}}</template>
      </el-table-column>

      <el-table-column sortable label="更新時間" prop="VEWithoutChartingUpdataTime">
        <template #default="scope">{{GetTime(scope.row.EdgeIP,scope.column.property)}}</template>
      </el-table-column>

      <el-table-column sortable fixed="right" label="狀態" prop="Status">
        <template #default="scope">
          <el-tag
            effect="dark"
            :type="scope.row.Status=='Offline'?'danger':'success'"
          >{{scope.row.Status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetEdgeWSDataRevState, GetEdgeInformation } from '@/APIHelpers/DatabaseServerAPI';
import moment from 'moment';
export default {
  data() {
    return {
      count: 0,
      EdgesInfo: [],
      EdgeWSDataRevState: {},
      rowStyle: {
        backgroundColor: 'black',
        color: 'white'
      },
      headerStyle: {
        backgroundColor: 'rgb(38, 38, 38)',
        color: 'white'
      }
    }
  },
  mounted() {

    setInterval(async () => {
      this.EdgesInfo = await GetEdgeInformation();
      this.EdgeWSDataRevState = await GetEdgeWSDataRevState();
      this.count += 1;
    }, 1000);

  },
  methods: {
    ExpandHandle(rowData, rows = []) {
      if (rows.length == 0)
        return;
    },
    GetTime(ip, property) {
      var t = this.EdgeWSDataRevState[ip];
      return t == undefined ? "??" : moment(t[property]).format('HH:mm:ss');
    }
  },

  created() {


  }
}
</script>

<style>
.tableRow {
  background-color: black;
}
</style>