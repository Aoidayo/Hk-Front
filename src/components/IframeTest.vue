<script>
export default {
  name: "IframeTest"
}
</script>

<template>
<div>
  <el-row>
    <el-col :span="12">
      <iframe src="http://localhost:8081/#/cameraTest2/1" id="frame1"
      ></iframe>
    </el-col>
    <el-col :span="12">
      <iframe src="http://localhost:8081/#/cameraTest2/2" id="frame2"
      ></iframe>
    </el-col>

  </el-row>

<!--  <iframe src="http://localhost:8081/#/cameraTest2/1" id="frame1"-->
<!--  ></iframe>-->

</div>



</template>

<style scoped>

</style>