<template>
  <div>
    <div class="card" style="width:100%;">
      <div class="card-body">
        <h5 class="card-title">SYSTEM OPERATION</h5>
        <el-divider></el-divider>
        <div>
          <!-- <count-to :startVal="0" :endVal="2017" :duration="4000"></count-to> -->
          <div class="btn">
            <b-button class="w-100 my-1 bg-primary">Restart</b-button>
          </div>
          <div class="btn">
            <b-button class="w-100 my-1 bg-danger">Shut Down</b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  components: {
  },
  data() {
    return {
    }
  },
}
</script>

<style scoped>
.btn {
  width: 220px;
}
</style>