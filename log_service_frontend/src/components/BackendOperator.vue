<template >
  <div>???</div>
</template>
<script>
import axios from 'axios'
export default {
  mounted() {
    axios.defaults.baseURL = "";
    axios.post('api/Opt/CloseServeice');
  },
}
</script>
<style >
</style>