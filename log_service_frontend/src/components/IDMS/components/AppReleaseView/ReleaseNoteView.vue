<template>
  <el-drawer v-model="show" direction="btt" size="50%">
    <div class="w-100 d-flex flex-column release-content">
      <div class="note" v-html="release_note_md"></div>
      <!-- <div class="note" v-for="(i,index) in releaseList" :key="index">[{{index+1}}] {{ i }}</div> -->
    </div>
  </el-drawer>
</template>

<script>
import { GetWebSiteVersion, GetReleaseNoteMD } from '@/APIHelpers/DatabaseServerAPI.js';
import { marked } from 'marked';
export default {
  data() {
    return {
      show: false,
      website_ver: '',
      release_note_md: ''
    }
  },
  mounted() {
    setTimeout(async () => {
      var old_ver = localStorage.getItem('idms_website_version');
      var releaseMD = await GetReleaseNoteMD();
      if (releaseMD) {
        this.release_note_md = marked(releaseMD);
      }
      GetWebSiteVersion().then(version => {
        this.website_ver = version;
        this.show = old_ver != this.website_ver;
        // this.show = true;
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