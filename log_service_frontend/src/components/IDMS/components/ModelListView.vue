<template>
  <el-drawer v-model="show" direction="rtl" size="70%" :title="`模型列表 : ${EQ}/${UNIT}(${IP})`">
    <div class="d-flex">
      <div class="d-flex justify-content-start">
        <el-button dark @click="Fetch()">重新整理</el-button>
      </div>
      <div class="d-flex justify-content-flex-end ip-select">
        <el-select v-model="IP" @change="Fetch()">
          <el-option
            v-for="item in module_infos"
            :key="item.IP"
            :label="`${item.EQ}/${item.UNIT}(${item.IP})`"
            :value="item.IP"
          ></el-option>
        </el-select>
      </div>
    </div>
    <el-table :data="modelData" v-loading="loading">
      <el-table-column prop="Recipe_ID" label="模型名稱" fixed="left" width="160px"></el-table-column>
      <el-table-column prop="Model_Start_Time" label="開始時間"></el-table-column>
      <el-table-column prop="Model_End_Time" label="結束時間"></el-table-column>
      <el-table-column prop="Comment" label="Comment"></el-table-column>
      <el-table-column prop="Enabled" label="狀態">
        <template #default="scope">
          <el-tag
            effect="dark"
            style="width:70px"
            :type="scope.row.Enabled?'success':'danger'"
          >{{scope.row.Enabled?'啟用':'停用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="160px">
        <template #default="scope">
          <el-button
            :type="scope.row.Enabled?'danger':'success'"
            plain
            @click="ModelEnableHandle( scope.row.Recipe_ID,!scope.row.Enabled)"
          >{{scope.row.Enabled?'停用':'啟用'}}</el-button>
          <el-button type="danger" plain @click="ModelDeleteHandle( scope.row.Recipe_ID)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<script>
import { GetModelList, GetModuleInfos, DeleteModel, SetModelEnable } from '@/APIHelpers/IDMSAPIs'
export default {
  data() {
    return {
      show: false,
      IP: "",
      EQ: "",
      UNIT: "",
      modelData: [],
      loading: false,
      module_infos: []
    }
  },
  methods: {
    ShowModelList(ip) {
      this.show = true;
      this.IP = ip;
      this.Fetch();
    },
    async UpdateModuleInfos() {
      this.module_infos = await GetModuleInfos();

    },
    async Fetch() {
      this.loading = true;
      var ret = await GetModelList(this.IP);
      console.info('Fetch Models', ret);
      this.EQ = ret.EQ;
      this.UNIT = ret.UNIT;
      this.modelData = ret.modelData;
      this.loading = false;
    },
    async ModelDeleteHandle(modelName = "") {
      var res = await DeleteModel(this.IP, modelName);
      if (res.success) {
        this.Fetch();
      }
    },
    async ModelEnableHandle(modelName = "", enable = false) {
      var res = await SetModelEnable(this.IP, modelName, enable);
      if (res.success) {
        this.Fetch();
      }
    }
  },
  mounted() {
    this.UpdateModuleInfos();
  }
}
</script>

<style   >
.ip-select .el-popper {
  width: 250px;
}
</style>