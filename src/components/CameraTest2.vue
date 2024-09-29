<template>
  <div class="container">
    <div
        id="divPlugin"
        class="plugin"
        style="width: 560px; height: 400px;margin:0 auto;"
    ></div>

    <el-button size="medium" type="danger" @click="showCamera('divPlugin')"
    >显示
    </el-button
    >
    <el-button
        id="closeBtn"
        size="medium"
        type="warning"
        @click="closeCamera()"
    >停止预览
    </el-button
    >

    <el-button size="medium">获取通道信息</el-button>
  </div>
</template>


<script>
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
  name: "CameraTest2",
  props: ['channelId'],
  data() {
    return {
      openCamera: false,
      isVisible: false,
      isLogin: 0
    };
  },
  created() {
  },
  mounted() {
    console.log("ChannelId" + this.channelId);
    // this.showCamera("divPlugin")
  },
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
            if (!this.isLogin) {
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
            if (!this.isLogin) {
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
            console.log(error)
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
      WebVideoCtrl.I_DestroyPlugin();
    },
    getAnalogChannelInfo() {
      let deviceIdentify = `${IP3}_${PORT}`;
      WebVideoCtrl.I_GetAnalogChannelInfo(deviceIdentify, {
        success: (xmlDoc) => {
          const oChannels = xmlDoc.getElementsByTagName('VideoInputChannel');
          for (let i = 0; i < oChannels.length; i++) {
            const channel = oChannels[i];
            const id = channel.getElementsByTagName('id')[0].textContent;
            let name = channel.getElementsByTagName('name')[0].textContent;

            if (name === '') {
              name = `Camera ${i < 9 ? '0' : ''}${i + 1}`;
            }
            this.channels.push({id, name, bZero: 'false'});
          }
          if (this.channels.length > 0) {
            this.selectedChannel = this.channels[0].id; // 默认选择第一个通道
          }
        },
        error:()=>{
          console.log("获取模拟通道失败")
        }
      });
    }
  },
};
</script>

<style scoped>

</style>