<template>
  <div class="h-100 fade-in" v-loading="loading" v-bind:class="ColorMode">
    <div class="mb-2 pb-2 border-bottom w-100 d-flex flex-row">
      <div class="px-1">
        <el-radio-group v-model="display_mode">
          <el-radio-button size="small" label="dashboard">
            <el-icon>
              <Grid />
            </el-icon>
          </el-radio-button>
          <el-radio-button size="small" label="list">
            <el-icon>
              <Expand />
            </el-icon>
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="flex-fill text-end px-3">
        <el-switch
          v-model="dark_mode"
          active-text="Dark"
          active-color="grey"
          inactive-text="Light"
          inactive-color="rgb(13, 110, 253)"
          @change="SaveDarkModeToLocal"
        ></el-switch>
      </div>
    </div>
    <!-- <LandingViewVue></LandingViewVue> -->
    <div v-show="display_mode=='list'">
      <el-table :data="Edges">
        <!-- <el-table-column label="Edge 名稱" prop="Name"></el-table-column>
        <el-table-column label="Edge IP" prop="EdgeIP"></el-table-column>
        <el-table-column label="Edge IDMS 狀態" prop="EdgeIP"></el-table-column>
        <el-table-column label="Edge IP" prop="EdgeIP"></el-table-column>-->
        <EdgeStatusVue
          v-for="edge in Edges"
          :key="edge.EdgeIP"
          :Mode="display_mode"
          :ColorMode="ColorMode"
          :EdgeProp="edge"
        ></EdgeStatusVue>
      </el-table>
    </div>
    <div v-show="display_mode=='dashboard'" class="w-100 row g-0 mx-0 my-0">
      <div
        class="edge-container px-1 py-1 my-1"
        v-bind:class="[Edges.length==1?' col-lg-12':' col-lg-6',ColorMode]"
        v-for="edge in Edges"
        :key="edge.EdgeIP"
      >
        <EdgeStatusVue :Mode="display_mode" :ColorMode="ColorMode" :EdgeProp="edge"></EdgeStatusVue>
      </div>
    </div>
  </div>
</template>

<script>
// import LandingViewVue from './LandingView.vue';
import EdgeStatusVue from './components/EdgeStatus.vue';
import { GetEdgeInformation } from '@/APIHelpers/DatabaseServerAPI'
export default {

  components: {
    EdgeStatusVue,
  },
  mounted() {
    console.info('mounted ebtg');
    this.dark_mode = localStorage.getItem('entry-page-dark-mode') == 'true';

    this.Initialize();
  },
  methods: {
    Initialize() {
      this.Edges = [];
      setTimeout(async () => {
        this.Edges = await GetEdgeInformation();
        this.loading = false;
      }, 100);
    },
    SaveDarkModeToLocal() {
      localStorage.setItem('entry-page-dark-mode', this.dark_mode);
    }
  },
  computed: {
    ColorMode() {
      return this.dark_mode ? 'bg-dark' : 'bg-light';
    }
  },
  data() {
    return {
      dark_mode: true,
      display_mode: 'dashboard',
      loading: true,
      Edges: [
        // {
        //   Name: 'Line-1',
        //   EdgeIP: "127.0.0.1",
        //   SensorNum: 10,
        //   Status: 'Offline'
        // },
        // {
        //   Name: 'Line-2',
        //   EdgeIP: "127.0.0.2",
        //   SensorNum: 20,
        //   Status: 'Online'
        // }, {
        //   Name: 'Line-3',
        //   EdgeIP: "127.0.0.3",
        //   SensorNum: 30,
        //   Status: 'Offline'
        // }
      ]
    }
  },

}
</script>

<style>
.edge-container {
  height: 50%;
  border-radius: 10px;
  box-shadow: 5px 5px 23px 1px rgba(0, 0, 0, 0.452);
}
</style>