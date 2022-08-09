<template>
  <el-drawer v-model="Show" direction="rtl" size="50%">
    <div class="d-flex flex-column" style="height:40%">
      <div class="flex-fill d-flex flex-row">
        <div style="width:120px">
          <el-steps :active="1" direction="vertical">
            <el-step title="Step 1" description="選擇模組" />
            <el-step title="Step 2" description="為模型命名" />
            <el-step title="Step 3" description="設定訓練時間" />
            <el-step title="Step 4" description="開始!" />
          </el-steps>
        </div>
        <div class="training-content flex-fill d-flex flex-column justify-content-start">
          <div class="step-content d-flex flex-column justify-content-start">
            <IDMSModuleSelectVue @changed="ModuleChangeHandle"></IDMSModuleSelectVue>
          </div>
          <div class="step-content d-flex flex-column justify-content-start">
            <el-input></el-input>
          </div>
          <div class="step-content d-flex flex-column justify-content-start">
            <el-input-number class="w-100"></el-input-number>
          </div>
          <div class="step-content-end d-flex flex-column justify-content-start">
            <el-button>START</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import IDMSModuleSelectVue from '../IDMSModuleSelect.vue'
export default {
  data() {
    return {
      Show: true
    }
  },
  components: {
    IDMSModuleSelectVue,
  },
  mounted() {

  },
  methods: {
    ModuleChangeHandle(v) {
      console.info('hi', v)
    },
    ShowUp() {
      console.info('Show!!');
      this.Show = true;
    }
  }
}
</script>

<style>
.training-content .step-content {
  height: 33%;
}
</style>