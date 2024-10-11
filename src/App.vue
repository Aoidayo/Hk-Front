<template>
  <div id="app">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/>
      -->
    <!--    <CameraTest1></CameraTest1>-->
    <!--    <RouterLink to="/cameraTest2/1">跳转1</RouterLink>-->
    <!--    &nbsp;-->
    <!--    <RouterLink to="/cameraTest2/2">跳转2</RouterLink>-->
    <RouterView></RouterView>
  </div>
</template>

<script>
// import CameraTest from "./components/CameraTest.vue";
// import CameraTest1 from "@/components/CameraTest1.vue";

export default {
  name: "App",
  components: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
