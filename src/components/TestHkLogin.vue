<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-select v-model="selectCameraName" clearable placeholder="选择摄像头">
        <el-option
          v-for="item in cameraNameOptions"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </el-row>
    <el-row>
      <el-button @click="showCamera()">打开</el-button>
    </el-row>
    <el-dialog
      :title="selectCameraName"
      :visible.sync="cameraDialogVisible"
      width="80%"
      :before-close="handleCameraDialogClose"
    >
      <el-button
        type="primary"
        @click="changeOldWithNewChannel"
        style="margin-left: 10px"
        >切换</el-button
      >
      <HkCamera
        ref="hk"
        v-if="isCameraShow"
        :selected-camera-name="selectCameraName"
        :selectedChannels="selectedChannels"
        :is-nvr="true"
      >
      </HkCamera>
    </el-dialog>
  </div>
</template>

<script>
// import Ping from "ping.js";
import HkCamera from "@/components/HkCamera.vue";
import { Name_Ip_Dict } from "@/NVRconfig";
// import { pingIP } from "@/router/ping";
export default {
  name: "TestHkLogin",
  components: { HkCamera },
  data() {
    return {
      // 本地测试使用Camera 01
      // 扎矿使用Mc_Door_130_10_outer
      selectCameraName: "Mc_Door_130_10_outer",
      cameraDialogVisible: false,
      isCameraShow: false,
      // options 测试用
      cameraNameOptions: [],
      // 选择通道
      selectedChannels: [0],
    };
  },
  async mounted() {
    // console.log(Object.keys(Name_Ip_Dict));
    this.cameraNameOptions = Object.keys(Name_Ip_Dict);
    // var p = new Ping();
    // // You may use Promise if the browser supports ES6
    // p.ping("localhost")
    //   .then((data) => {
    //     console.log("Successful ping: " + data);
    //   })
    //   .catch((data) => {
    //     console.error("Ping failed: " + data);
    //   });
    // console.log(p);
  },
  methods: {
    async pingHost(url) {
      this.result = null; // 清空结果
      this.errorMessage = null; // 清空错误消息

      const ping = new Ping();

      try {
        // 使用 ping.js 进行 ping 测试
        const response = await ping.probe(url);

        if (response) {
          this.result = { success: true, time: response.time }; // 返回的时间
          console.log(`Ping success! Response time: ${response.time} ms`);
        } else {
          this.result = { success: false };
          console.log("Ping failed. The host is unreachable.");
        }
      } catch (error) {
        this.errorMessage = "An error occurred during the ping test.";
        console.error(error);
      }
    },
    showCamera() {
      this.cameraDialogVisible = true;
      this.isCameraShow = true;
    },
    handleCameraDialogClose() {
      // 手动触发beforedestory
      this.isCameraShow = false;
      this.cameraDialogVisible = false;
    },
    changeOldWithNewChannel() {
      console.log(this.$refs.hk);
      console.log(this.$refs.hk.changeWndShow);
      this.$refs.hk.changeWndShow(0, 0);
    },
  },
};
</script>

<style scoped></style>
