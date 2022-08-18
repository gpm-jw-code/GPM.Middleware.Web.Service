<template>
  <el-drawer v-model="show" direction="btt" size="30%">
    <div class="w-100 d-flex flex-column release-content">
      <div>
        <h3 class>{{ website_ver }} 版本說明</h3>
      </div>
      <div class="note" v-for="(i,index) in releaseList" :key="index">[{{index+1}}] {{ i }}</div>
    </div>
  </el-drawer>
</template>

<script>
import { GetWebSiteVersion } from '@/APIHelpers/DatabaseServerAPI.js'
export default {
  data() {
    return {
      show: false,
      website_ver: '',
      releaseList: [
        'UI優化', '支援多模組遠端訓練', 'Alarm Form事件同步與查詢', 'Bug 修復'
      ]
    }
  },

  mounted() {
    setTimeout(async () => {
      var old_ver = localStorage.getItem('idms_website_version');
      GetWebSiteVersion().then(version => {
        this.website_ver = version;
        this.show = old_ver != this.website_ver;
        localStorage.setItem('idms_website_version', this.website_ver)
      }).catch(e => {
        console.info('無法fetch網頁版本資訊');
        return;
      });

    }, 3000)
  }

}
</script>

<style>
.release-content div {
  text-align: left;
}
.release-content .note {
  font-size: 22px;
}
</style>