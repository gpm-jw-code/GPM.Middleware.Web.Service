<template>
  <div>
    <ManagerOperatesVue @OnModuleAdd="ModuleAddingHandle"></ManagerOperatesVue>
    <el-divider></el-divider>
    <table class="table my_table">
      <thead>
        <tr>
          <th class="alway-show-col" scope="col" width="5%">#</th>
          <th class="alway-show-col" scope="col">IP</th>
          <th class="alway-show-col" scope="col">PORT</th>
          <th class="alway-show-col" scope="col" width="10%">量測範圍</th>
          <th class="alway-show-col" scope="col" width="20%">更新時間</th>
          <th class="alway-show-col" scope="col" width="20%">狀態</th>
          <th class="opt-region-div" scope="col" width="5%"></th>
          <th class="opt-region-div" scope="col" width="5%"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="ModuleList.length==0">
          <td colspan="7" style="color:grey">Empty</td>
        </tr>
        <ModuleState
          v-else
          v-for="info in ModuleList"
          :key="info.endPoint"
          :moduleInfo="info"
          @OnModuleRemove="ModuleRemovedHandle"
        ></ModuleState>
      </tbody>
    </table>
  </div>
</template>
<script>
import ModuleState from './components/ModuleState.vue'
import ManagerOperatesVue from './components/ManagerOperates.vue'
import { GetModuleList } from '@/APIHelpers/BackendAPIs.js'
export default {
  data() {
    return {
      ModuleList: [],
    }
  },
  components: {
    ModuleState,
    ManagerOperatesVue
  },
  computed: {
    TotalModuleNum() {
      return this.ModuleList.length;
    }
  },
  methods: {
    async ModuleAddingHandle(d) {
      console.info('??', d);
      this.ModuleList = await GetModuleList();
    },
    async ModuleRemovedHandle() {
      this.ModuleList = await GetModuleList();
    }
  },
  async mounted() {
    this.ModuleList = await GetModuleList();
  }
}
</script>
<style >
.my_table {
  background-color: dark;
}
.no-module-view {
  width: 100%;
  background-color: orange;
}
</style>