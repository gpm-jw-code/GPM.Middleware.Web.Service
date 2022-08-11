<template>
  <div class="h-100 fade-in" v-loading="loading">
    <!-- <h1>EDGES</h1> -->
    <div class="w-100 row g-2">
      <div
        class="edge-container bg-light px-1 py-1"
        v-bind:class="Edges.length==1?' col-md-12':' col-md-6'"
        v-for="edge in Edges"
        :key="edge.EdgeIP"
      >
        <EdgeStatusVue :EdgeProp="edge"></EdgeStatusVue>
      </div>
    </div>
  </div>
</template>

<script>
import EdgeStatusVue from './components/EdgeStatus.vue';
import { GetEdgeInformation } from '@/APIHelpers/DatabaseServerAPI'
import { watch } from 'vue';
import { useRoute } from 'vue-router';
export default {
  components: {
    EdgeStatusVue,
  },
  mounted() {
    console.info('mounted ebtg');
    this.Initialize();
  },
  methods: {
    Initialize() {
      this.Edges = [];
      setTimeout(async () => {
        this.Edges = await GetEdgeInformation();
        this.loading = false;
      }, 100);
    }
  },
  data() {
    return {
      loading: true,
      Edges: [
        {
          Name: 'Line-1',
          EdgeIP: "127.0.0.1",
          SensorNum: 10,
          Status: 'Offline'
        },
        {
          Name: 'Line-2',
          EdgeIP: "127.0.0.2",
          SensorNum: 20,
          Status: 'Online'
        }, {
          Name: 'Line-3',
          EdgeIP: "127.0.0.3",
          SensorNum: 30,
          Status: 'Offline'
        }
      ]
    }
  },

}
</script>

<style>
.edge-container {
  height: 50%;
  box-shadow: 5px 5px 23px 1px rgba(0, 0, 0, 0.452);
}
</style>