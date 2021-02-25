<template>
  <div id="app">
    <!--<transition name="bounce">-->
    <router-view></router-view>
    <!--</transition>-->
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  mounted: function () {
    let beginTime = 0; //开始时间
    let differTime = 0; //时间差
    window.onunload = function () {
      differTime = new Date().getTime() - beginTime;
      if (differTime <= 5) {
        localStorage.removeItem('token');

        console.log("这是关闭");
      } else {
        console.log("这是刷新");
      }
    };

    window.onbeforeunload = function () {
      beginTime = new Date().getTime();
    };
  },
}
</script>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-out 0.2s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}

body {
  /*background-color: #324057;*/
  margin: 0px;
  padding: 0px;
  /*background: url(assets/login1.jpg) center !important;
		background-size: cover;*/
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  /*font-weight: 400;*/
  font-size: 14px !important;
  width: 100%;
  height: 100%;
  background: url(assets/login.jpg) cover;
  -webkit-font-smoothing: antialiased;

  background: url('assets/login.jpg');
  repeat: no-repeat;
  background-attachment: fixed;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='assets/login.jpg', sizingMethod='scale');
  -ms-filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='assets/login.jpg', sizingMethod='scale');
  background-size: cover;
  -moz-background-size: cover;
  -webkit-background-size: cover;
}

#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
</style>