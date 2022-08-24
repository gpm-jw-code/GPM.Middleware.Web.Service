<template>
  <div class="view">
    <h1>OVERVIEW</h1>
    <div class="border-bottom">{{count}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.count += 1;
    }, 1000);
  }
}
</script>

<style scoped>
</style>