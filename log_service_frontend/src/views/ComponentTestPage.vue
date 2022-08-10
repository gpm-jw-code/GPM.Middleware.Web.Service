<template>
  <div class="component-test h-100 w-100">
    <div>
      <NetworkStatusVue successColor="green" toolTipPosition="left"></NetworkStatusVue>
      <NetworkStatusVue ip="192.168.0.133" successColor="green" toolTipPosition="left"></NetworkStatusVue>
      <NetworkStatusVue
        ip="192.168.0.101"
        displayPingTime="true"
        successColor="green"
        toolTipPosition="left"
      ></NetworkStatusVue>
    </div>
  </div>
</template>

<script>
import NetworkStatusVue from '@/components/IDMS/components/NetworkStatus.vue';
export default {
  components: {
    NetworkStatusVue,
  },
}
</script>

<style>
</style>