<template>
  <el-drawer v-model="show" direction="rtl" size="70%" :title="`模型列表 : ${EQ}/${UNIT}(${IP})`">
    <template #header="{  titleId  }">
      <div :id="titleId" style="margin-top:85px">
        <h2>模型列表</h2>
      </div>
    </template>
    <div class="d-flex flex-row border-bottom pb-2 mb-3">
      <div class="flex-fill text-start">
        <el-button dark @click="Fetch()">重新整理</el-button>
      </div>
      <div class="ip-select d-flex flex-row" style="width:370px">
        <div class="py-1" style="width:25%">選擇模組</div>
        <el-select class="w-100" v-model="IP" @change="Fetch()">
          <el-option
            v-for="item in module_infos"
            :key="item.IP"
            :label="`${item.EqName}/${item.UnitName}(${item.IP})`"
            :value="item.IP"
          ></el-option>
        </el-select>
      </div>
    </div>
    <el-table :data="modelData" v-loading="loading">
      <el-table-column prop="Recipe_ID" label="模型名稱" fixed="left" width="160px" sortable></el-table-column>
      <el-table-column prop="Model_Start_Time" label="開始時間" sortable></el-table-column>
      <el-table-column prop="Model_End_Time" label="結束時間"></el-table-column>
      <el-table-column prop="Comment" label="Comment"></el-table-column>
      <el-table-column prop="Enabled" label="狀態" sortable>
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
      module_infos: [],
      edgeIP: '12.2.2.2'
    }
  },
  methods: {
    ShowModelList(edgeIP, ip) {
      this.show = true;
      this.edgeIP = edgeIP;
      this.IP = ip;
      this.UpdateModuleInfos(edgeIP);
      this.Fetch();
    },
    async UpdateModuleInfos(edgeIP) {
      this.edgeIP = edgeIP;
      this.module_infos = await GetModuleInfos(this.edgeIP);

    },
    async Fetch() {
      this.loading = true;
      var ret = await GetModelList(this.edgeIP, this.IP);
      console.info('Fetch Models', ret);
      this.EQ = ret.EQ;
      this.UNIT = ret.UNIT;
      this.modelData = ret.modelData;
      this.loading = false;
    },
    async ModelDeleteHandle(modelName = "") {
      var res = await DeleteModel(this.edgeIP, this.IP, modelName);
      if (res.success) {
        this.Fetch();
      }
    },
    async ModelEnableHandle(modelName = "", enable = false) {
      var res = await SetModelEnable(this.edgeIP, this.IP, modelName, enable);
      if (res.success) {
        this.Fetch();
      }
    }
  },
  mounted() {
  }
}
</script>

<style   >
.ip-select .el-popper {
  width: 250px;
}
</style>