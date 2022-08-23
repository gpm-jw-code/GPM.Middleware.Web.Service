<template>
  <div class="fade-in bg-light h-100" style="z-index:3006">
    <el-affix :offset="56">
      <div class="d-flex flex-row justify-content-start px-2 py-2" sticky>
        <el-radio-group v-model="display">
          <el-radio-button size="small" label="Dashboard" @click="$router.push({name:'Dashboard'})"></el-radio-button>
          <el-radio-button
            size="small"
            label="閥值設定"
            @click="$router.push({name:'ThresholdSetting'})"
          ></el-radio-button>
        </el-radio-group>
      </div>
    </el-affix>
    <keep-alive>
      <DashboardViewVue v-if="display=='Dashboard'"></DashboardViewVue>
      <ThresholdSettingVue v-else></ThresholdSettingVue>
    </keep-alive>
    <!-- vue3.0配置 Component是固定寫法-->
  </div>
</template>

<script>
import DashboardViewVue from './DashboardView.vue';
import ThresholdSettingVue from './ThresholdSetting.vue';
export default {
  components: {
    DashboardViewVue, ThresholdSettingVue
  },
  data() {
    return {
      display: 'Dashboard'
    }
  },
  mounted() {
  }
}
</script>

<style>
</style>