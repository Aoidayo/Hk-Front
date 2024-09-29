<template>
  <div class="container">
    <div class="cameras" style="display: flex">
      <!--      <div id="divPlugin2" class="plugin" style="width: 800px;height: 600px;"></div>-->
      <div
        id="divPlugin1"
        class="plugin"
        style="width: 560px; height: 400px"
      ></div>
    </div>

    <CameraTest2></CameraTest2>

    <el-button size="medium" type="danger" @click="showCamera('divPlugin1')"
      >显示摄像头</el-button
    >

    <el-button size="medium" type="danger" @click="showDVR"
      >连接录像机</el-button
    >
    <el-button size="medium" type="primary" @click="cameraInit"
      >一键播放</el-button
    >
    <!--    <el-button size="medium" type="success" @click="cameraDirectPlay">一键预览</el-button>-->
    <el-button
      id="closeBtn"
      size="medium"
      type="warning"
      @click="cameraStopPlay"
      >停止预览</el-button
    >

    <!--    <el-dialog title="摄像头画面" :visible.sync="openCamera" append-to-body destroy-on-close width="600px" :before-close="closeCamera">-->
    <!--&lt;!&ndash;      <div v-if="isVisible">&ndash;&gt;-->
    <!--        <div v-if="isVisible" id="divPlugin" class="plugin" style="width: 560px;height: 400px;"></div>-->
    <!--&lt;!&ndash;      </div>&ndash;&gt;-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import CameraTest2 from "@/components/CameraTest2.vue";
const DVRIP = '172.16.20.144';
const PORT = '80'
const DVRIP_PORT = "172.16.20.144_80";
// 协议号，http协议，1表示http协议 2表示https协议
const LOGIN_PROTO = 1
// rtsp端口号，默认是554
const RTSP_PORT = 554
const USERNAME = "admin";
// const PASSWORD = "Wxb108@130";
const IP3 = '192.168.2.186'
const PASSWORD = 'cumtb617'
export default {
  name: "CameraTest1",
  components: {CameraTest2},
  data() {
    return {
      openCamera: false,
      isVisible: false,
      isLogin:1
    };
  },
  created() {},
  methods: {
    closeCamera() {
      console.log("closeCamera");
      this.cameraStopPlay();
      this.closeCameraWin();
      this.isVisible = false;
      this.openCamera = false;
    },
    showCamera(divId) {
      this.openCamera = true;
      this.isVisible = true;
      this.cameraInit(divId);
    },
    showDVR(channelNum) {
      WebVideoCtrl.I_InitPlugin({
        bWndFull: this.bWndFull,
        iWndowType: 1,
        cbInitPluginComplete: async () => {
          try {
            await WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            // const pluginUpdated = await WebVideoCtrl.I_CheckPluginVersion();
            //
            // if (pluginUpdated) {
            //   alert("检测到新的插件版本，双击开发包目录里的HCWebSDKPlugin.exe升级！");
            //   return;
            // }

            console.log("初始化成功");
            console.log(DVRIP, PORT, DVRIP_PORT);

            // 登录设备
            if(!this.isLogin){
              await WebVideoCtrl.I_Login(
                  DVRIP,
                  LOGIN_PROTO,
                  PORT,
                  USERNAME,
                  PASSWORD,
                  {
                    success: () => {
                      console.log("登录成功");
                      this.isLogin = 1
                    },
                    error: () => {
                      console.log("登录失败");
                    },
                  }
              );
            }


            // 获取数字通道信息
            console.log("尝试获取模拟通道信息");
            await WebVideoCtrl.I_GetDigitalChannelInfo(DVRIP_PORT, {
              success: () => {
                console.log("获取数字通道成功");
              },
              error: () => {
                console.log("获取数字通道失败");
              },
            });

            //获取端口并进行实时预览
            // const oPort = await WebVideoCtrl.I_GetDevicePort(deviceIdentify);
            // const iRtspPort = oPort.iRtspPort;
            // console.log("获取端口成功", iRtspPort);

            // 实时预览
            await WebVideoCtrl.I_StartRealPlay(DVRIP_PORT, {
              iChannelID: channelNum,
              iPort: RTSP_PORT,
              success: () => {
                console.log("预览成功");
              },
              error: () => {
                console.log("预览失败");
              },
            });
            // console.log("预览成功");
          } catch (error) {
            console.error("出现异常", error);
            // if (error.message.includes('登录')) {
            //   console.log("登录失败");
            // } else if (error.message.includes('模拟通道')) {
            //   console.log("获取模拟通道失败");
            // } else {
            //   console.log("预览失败");
            // }
          }
        },
      });
    },
    /**
     * 初始化摄像头
     */
    cameraInit(divId) {
      const username = "admin";
      const password = 'cumtb617';
      const deviceIdentify = `${IP3}_${PORT}`;

      // 初始化并嵌入插件
      WebVideoCtrl.I_InitPlugin({
        bWndFull: this.bWndFull,
        iWndowType: 1,
        cbInitPluginComplete: async () => {
          try {
            await WebVideoCtrl.I_InsertOBJECTPlugin(divId);
            // const pluginUpdated = await WebVideoCtrl.I_CheckPluginVersion();
            //
            // if (pluginUpdated) {
            //   alert("检测到新的插件版本，双击开发包目录里的HCWebSDKPlugin.exe升级！");
            //   return;
            // }

            console.log("初始化成功");
            console.log(IP3, PORT, deviceIdentify);

            // 登录设备
            if(!this.isLogin){
              await WebVideoCtrl.I_Login(IP3, 1, PORT, "admin", "cumtb617", {
                success: () => {
                  console.log("登录成功");
                  this.isLogin = 1
                },
                error: () => {
                  console.log("登录失败");
                },
              });
            }


            // 获取模拟通道信息
            console.log("尝试获取模拟通道信息");
            await WebVideoCtrl.I_GetAnalogChannelInfo(deviceIdentify, {
              success: () => {
                console.log("获取模拟通道成功");
              },
              error: () => {
                console.log("获取模拟通道失败");
              },
            });

            //获取端口并进行实时预览
            // const oPort = await WebVideoCtrl.I_GetDevicePort(deviceIdentify);
            // const iRtspPort = oPort.iRtspPort;
            // console.log("获取端口成功", iRtspPort);

            // 实时预览
            await WebVideoCtrl.I_StartRealPlay(deviceIdentify, {
              bZeroChannel: false,
              iPort: 554,
            });
            console.log("预览成功");
          } catch (error) {
            console.error("操作失败", error);
            if (error.message.includes("登录")) {
              console.log("登录失败");
            } else if (error.message.includes("模拟通道")) {
              console.log("获取模拟通道失败");
            } else {
              console.log("预览失败");
            }
          }
        },
      });
    },

    /**
     * 播放方法
     */
    cameraDirectPlay() {
      //播放画面
      WebVideoCtrl.I_StartRealPlay("192.168.2.186_80", {
        bZeroChannel: false,
        iPort: "554",
        success: function () {
          console.log("预览成功");
        },
        error: function (status) {
          console.log("预览失败！");
        },
      });
    },
    /**
     * 停止播放
     */
    cameraStopPlay() {
      WebVideoCtrl.I_Stop({
        success: function () {
          console.log("停止播放成功");
        },
        error: function () {
          console.log("停止播放失败");
        },
      });
    },
    closeCameraWin() {
      let deviceIdentify = `${IP3}_${PORT}`;
      WebVideoCtrl.I_Logout(deviceIdentify);
      console.log("已经登出");
      // WebVideoCtrl.I_Restart('192.168.2.186_80')
      // console.log("重启")
      WebVideoCtrl.I_DestroyPlugin();
      // location.reload();
    },
  },
};
</script>

<style scoped></style>
