<template>
  <div class="fade-out fade-in h-100 w-100 bg-light landing-view" sticky>
    <div class="gpm-text w-100">GPM</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true
    }
  },
  mounted() {
    document.getElementById('breadcrumb').style['visibility'] = 'hidden';
    setTimeout(() => {
      this.show = false;
      document.getElementById('breadcrumb').style['visibility'] = 'visible';
    }, 1000);
  }
}
</script>

<style>
.landing-view {
  color: white;
  /* background-image: url("@/assets/IDMS.png");
  background-repeat: no-repeat;
  background-position: center;
  background-blend-mode: normal; */
  z-index: 3002;
  position: fixed;
  top: 0;
  left: 0;
}
.landing-view div {
  position: fixed;
  top: 30vmin;
  font-size: 8rem;
  font-weight: bolder;
}
.gpm-text {
  color: rgba(27, 42, 160, 0.1);
  -webkit-animation: jump;
  animation: jump;
  animation-iteration-count: 1;
  animation-duration: 900ms;
  animation-fill-mode: forwards;
  text-shadow: rgba(255, 255, 255, 0.582) 5px 5px 4px;
}

@keyframes jump {
  from {
    top: 30vmin;
    color: rgba(27, 42, 160, 0.1);
  }
  to {
    top: 35vmin;
    color: rgb(37, 49, 221, 1);
  }
}
</style>