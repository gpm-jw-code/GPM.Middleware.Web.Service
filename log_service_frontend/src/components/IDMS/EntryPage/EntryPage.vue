<template>
  <div class="h-100">
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark sticky">
      <div class="container-fluid">
        <a class="navbar-brand" style="position:relative;left:-30px">GPM</a>
        <button class="navbar-toggler" type="button" v-b-toggle="'navbar'">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbar">
          <div class="navbar-nav">
            <!-- <router-link v-for="rout in routes" :key="rout.path" :to="rout.path">{{rout.name}}</router-link> -->
          </div>
        </div>
      </div>
    </nav>

    <h1>Entry Page</h1>

    <div class="w-100 row g-1">
      <div
        class="edge-container bg-light px-1 py-1 border"
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
export default {
  components: {
    EdgeStatusVue,
  },
  mounted() {
    document.getElementById('breadcrumb').style['visibility'] = 'hidden';
    setTimeout(async () => {
      this.Edges = await GetEdgeInformation();

    }, 100);
  },
  data() {
    return {
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
}
</style>