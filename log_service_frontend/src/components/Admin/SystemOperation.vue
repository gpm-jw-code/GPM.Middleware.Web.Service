<template>
  <div>
    <div class="card" style="width:100%;">
      <div class="card-body">
        <h5 class="card-title">SYSTEM OPERATION</h5>
        <el-divider></el-divider>
        <div class="d-flex justify-content-center">
          <count-to :startVal="0" :endVal="2017" :duration="4000"></count-to>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
import { CountTo } from "vue3-count-to";
export default {
  components: {
    CountTo,
  },
  data() {
    return {
    }
  },
}
</script>

<style scoped>
</style>