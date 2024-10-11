<template>
  <div>
    <el-row>
      <el-button @click="showCamera()">打开</el-button>
    </el-row>
    <el-dialog
      :title="selectCameraName"
      :visible.sync="cameraDialogVisible"
      width="80%"
      :before-close="handleCameraDialogClose"
    >
      <HkCamera v-if="isCameraShow" :selected-camera-name="selectCameraName">
      </HkCamera>
    </el-dialog>
  </div>
</template>

<script>
import HkCamera from "@/components/HkCamera.vue";
export default {
  name: "TestHkLogin",
  components: { HkCamera },
  data() {
    return {
      selectCameraName: "Camera 01",
      cameraDialogVisible: false,
      isCameraShow: false,
    };
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
