<template >
  <div id="database-setting" class="d-flex flex-column w-100 h-100 mx-0 my-0 px-0">
    <div class="w-100"></div>
    <div class="w-100 flex-fill">
      <h5>IDMS DATABASE</h5>
      <div class="d-flex flex-row">
        <div class="property-name">IDMS Database</div>
        <el-select class="w-100" v-model="IDMSDBNAME">
          <el-option v-for="db in DataBaseList" :key="db" :label="db" :value="db"></el-option>
        </el-select>
      </div>
      <el-divider></el-divider>
      <h5>DB BASIC</h5>
      <div class="d-flex flex-row">
        <div class="property-name">HOST</div>
        <el-input class="w-100" v-model="Host"></el-input>
      </div>
      <div class="d-flex flex-row">
        <div class="property-name">PORT</div>
        <el-input class="w-100" v-model="Port"></el-input>
      </div>
      <div class="d-flex flex-row">
        <div class="property-name">User Name</div>
        <el-input class="w-100" v-model="UserName"></el-input>
      </div>
      <div class="d-flex flex-row">
        <div class="property-name">Password</div>
        <el-input show-password class="w-100" v-model="Password"></el-input>
      </div>
      <el-divider></el-divider>
      <h5>連線測試</h5>
      <div class="d-flex">
        <b-button variant="light">TEST</b-button>
      </div>
    </div>
    <div class="w-100 bg-dark" style="height:1px"></div>
  </div>
</template>
<script>
import { GetDatabaseList } from '@/APIHelpers/DatabaseServerAPI';

export default {
  data() {
    return {
      IDMSDBNAME: '',
      Host: '127.0.0.1',
      Port: '5432',
      UserName: 'postgres',
      Password: 'changeme',
      DataBaseList: []
    }
  },
  mounted() {
    setTimeout(async () => {
      this.DataBaseList = await GetDatabaseList();
    }, 12);
  }
}
</script>
<style >
#database-setting h5 {
  text-align: left;
  margin-bottom: 20px;
}
#database-setting .property-name {
  width: 200px;
  margin: 0;
  text-align: left;
}
</style>