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
      <HkCamera
        v-if="isCameraShow"
        :selected-camera-name="selectCameraName"
        :is-nvr="false"
      >
      </HkCamera>
    </el-dialog>
  </div>
</template>

<script>
import HkCamera from "@/components/HkCamera.vue";
import { Name_Ip_Dict } from "@/NVRconfig";
export default {
  name: "TestHkLogin",
  components: { HkCamera },
  data() {
    return {
      // 本地测试使用Camera 01
      // 扎矿使用Mc_Door_130_10_outer
      selectCameraName: "MC_Door_130_10_outer",
      cameraDialogVisible: false,
      isCameraShow: false,
      // options 测试用
      cameraNameOptions: [],
    };
  },
  mounted() {
    // console.log(Object.keys(Name_Ip_Dict));
    this.cameraNameOptions = Object.keys(Name_Ip_Dict);
  },
  methods: {
    showCamera() {
      this.cameraDialogVisible = true;
      this.isCameraShow = true;
    },
    handleCameraDialogClose() {
      // 手动触发beforedestory
      this.isCameraShow = false;
      this.cameraDialogVisible = false;
    },
  },
};
</script>

<style scoped></style>
