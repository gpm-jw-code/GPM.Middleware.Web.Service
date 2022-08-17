<template>
  <div class="fade-in bg-light h-100" style="z-index:3006">
    <el-affix :offset="75">
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

    <!-- vue3.0配置 Component是固定寫法-->
    <router-view v-slot="{ Component }">
      <!-- <keep-alive>
        <component :is="Component" />
      </keep-alive>-->
      <component :is="Component" />
    </router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      display: 'Dashboard'
    }
  },
  mounted() {
    setTimeout(() => {
      this.$router.push({ name: 'Dashboard' });
    }, 10)
  }
}
</script>

<style>
</style>