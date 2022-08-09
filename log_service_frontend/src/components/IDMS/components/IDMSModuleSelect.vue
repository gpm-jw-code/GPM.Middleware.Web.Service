<template>
  <div class="d-flex flex-column justify-content-start">
    <el-select v-model="IP" @change="ChangeSelectHandle">
      <el-option
        v-for="item in module_infos"
        :key="item.IP"
        :label="`${item.EQ}/${item.UNIT}(${item.IP})`"
        :value="item.IP"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { GetModuleInfos } from '@/APIHelpers/IDMSAPIs'

export default {
  data() {
    return {
      module_infos: [],
      IP: undefined
    }
  },
  methods: {
    async UpdateModuleInfos() {
      this.module_infos = await GetModuleInfos();
    },
    ChangeSelectHandle(ip) {
      //alert(module)
      console.info('changed>', ip);
      this.$emit('changed', this.module_infos.find(m => m.IP == ip))
    }
  },
  mounted() {
    this.UpdateModuleInfos();
  }
}
</script>

<style>
</style>