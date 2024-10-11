<template>
  <div class="container">
    <div
      id="divPlugin"
      class="plugin"
      style="width: 1000px; height: 700px; margin: 0 auto"
    ></div>
    <el-row style="margin: 10px auto">
      <el-select
        style="margin: 0 10px; max-height: 30px"
        v-model="selectedChannel"
        :popper-append-to-body="true"
      >
        <el-option
          v-for="channel in channels"
          :key="channel.id"
          :value="channel.id"
          :label="channel.name"
        >
          {{ channel.name }}
        </el-option>
      </el-select>
      <el-button size="medium" type="danger" @click="showDVR()"
        >连接录像机</el-button
      >
      <el-button size="medium" type="success" @click="cameraDirectPlay"
        >一键预览</el-button
      >
      <el-button
        id="closeBtn"
        size="medium"
        type="warning"
        @click="cameraStopPlay()"
        >停止预览</el-button
      >
      <el-button size="medium" type="danger" @click="getAnalogChannelInfo"
        >获取模拟通道信息</el-button
      >

      <el-button size="medium" type="danger" @click="getDigitalChannelInfo"
        >获取数字通道信息</el-button
      >
      <el-button type="primary" @click="changeWndNum('3')">窗口分割</el-button>
    </el-row>
  </div>
</template>

<script>
import {
  DestIP,
  DestPort,
  DestIp_Port,
  LOGIN_PROTO,
  RTSP_PORT,
  USERNAME,
  PASSWORD,
} from "@/NVRconfig";
// const IP1 = '192.168.2.186';
// const DVRIP = '172.16.20.144';
// const PORT = '80';
// const DVRIP_PORT = "172.16.20.144_80";
// const IP1_PORT = "192.168.2.186_80";
// // 协议号，http协议，1表示http协议 2表示https协议
// const LOGIN_PROTO = 1
// // rtsp端口号，默认是554
// const RTSP_PORT = 554

export default {
  name: "CameraTest",
  data() {
    return {
      openCamera: false,
      channels: [
        { id: 1, name: "test" },
        { id: 1, name: "test" },
        { id: 1, name: "test" },
        { id: 1, name: "test" },
        { id: 1, name: "test" },
        { id: 1, name: "test" },
        { id: 1, name: "test" },
      ],
      selectedChannel: null,
    };
  },
  created() {},
  methods: {
    /**
     *  DVR初始化
     *  I_InitPlugin 初始化插件
     *  I_InsertOBJECTPlugin 嵌入播放插件
     *  I_Login 登陆设备
     *  I_GetAnalogChannelInfo 获取模拟通道
     *
     */
    showDVR() {
      WebVideoCtrl.I_InitPlugin({
        bWndFull: true,
        iWndowType: 1,
        cbSelWnd: function (xmlDoc) {
          let g_iWndIndex = parseInt(
            xmlDoc.getElementsByTagName("SelectWnd")[0].textContent,
            10
          );
          var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
          console.log(szInfo);
        },
        cbInitPluginComplete: async () => {
          try {
            await WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

            console.log("初始化成功");
            console.log(DestIP, DestPort, DestIp_Port);

            // 登录设备
            await WebVideoCtrl.I_Login(
              DestIP,
              LOGIN_PROTO,
              DestPort,
              USERNAME,
              PASSWORD,
              {
                success: () => {
                  console.log("登录成功");
                  WebVideoCtrl.I_GetAnalogChannelInfo(DestIp_Port, {
                    /**
                     * 获取模拟通道后回调
                     * @param xmlDoc 返回的XML内容
                     * oChannels是模拟通道信息数组
                     * 遍历通道数组，获取channel的id,name，push到channels中保存
                     * 默认选择第一个通道
                     */
                    success: (xmlDoc) => {
                      const oChannels =
                        xmlDoc.getElementsByTagName("VideoInputChannel");
                      for (let i = 0; i < oChannels.length; i++) {
                        const channel = oChannels[i];
                        const id =
                          channel.getElementsByTagName("id")[0].textContent;
                        let name =
                          channel.getElementsByTagName("name")[0].textContent;
                        if (name === "") {
                          name = `Camera ${i < 9 ? "0" : ""}${i + 1}`;
                        }

                        this.channels.push({ id, name, bZero: "false" });
                      }
                      if (this.channels.length > 0) {
                        this.selectedChannel = this.channels[0].id; // 默认选择第一个通道
                      }
                    },
                    error: () => {
                      console.log("获取模拟通道失败");
                    },
                  });

                  console.log("尝试获取数字通道信息");
                  WebVideoCtrl.I_GetDigitalChannelInfo(DestIp_Port, {
                    success: (xmlDoc) => {
                      console.log("获取数字通道成功");
                      const oChannels = xmlDoc.getElementsByTagName(
                        "InputProxyChannelStatus"
                      );
                      console.log(oChannels);
                      for (let i = 0; i < oChannels.length; i++) {
                        const channel = oChannels[i];
                        const id =
                          channel.getElementsByTagName("id")[0].textContent;
                        let name =
                          channel.getElementsByTagName("name")[0].textContent;
                        console.log(id, name);

                        if (name === "") {
                          name = `Camera ${i < 9 ? "0" : ""}${i + 1}`;
                        }
                        this.channels.push({ id, name, bZero: "false" });
                      }
                      if (this.channels.length > 0) {
                        this.selectedChannel = this.channels[0].id; // 默认选择第一个通道
                      }
                    },
                    error: () => {
                      console.log("获取数字通道失败");
                    },
                  });
                },
                error: () => {
                  console.log("登录失败");
                },
              }
            );
          } catch (error) {
            console.error("出现异常", error);
          }
        },
      });
    },

    /**
     * 根据端口号进行实时预览
     */
    cameraDirectPlay() {
      // 实时预览
      WebVideoCtrl.I_StartRealPlay(DestIp_Port, {
        // iWndIndex:1,
        iChannelID: this.selectedChannel,
        iPort: RTSP_PORT,
        success: () => {
          console.log("预览成功");
        },
        error: () => {
          console.log("预览失败");
        },
      });
    },
    /**
     * 停止播放
     */
    cameraStopPlay() {
      WebVideoCtrl.I_Stop({
        // iWndIndex:winNum,
        success: function () {
          console.log("停止播放成功");
        },
        error: function () {
          console.log("停止播放失败");
        },
      });
    },
    /**
     * 登出并销毁插件
     */
    closeCameraWin() {
      WebVideoCtrl.I_Logout(DestIp_Port);
      console.log("已经登出");
      WebVideoCtrl.I_DestroyPlugin();
      // location.reload() 刷新页面
    },
    /**
     * 关闭dialog，
     */
    closeCamera() {
      this.cameraStopPlay();
      this.closeCameraWin();
      this.openCamera = false;
    },
    /**
     * 显示摄像头
     */
    showCamera() {
      this.openCamera = true;
      this.cameraInit();
    },
    /**
     * 初始化摄像头并预览
     */
    cameraInit() {
      // 初始化并嵌入插件
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

            // 登录设备
            await WebVideoCtrl.I_Login(
              DestIP,
              1,
              DestPort,
              "admin",
              "cumtb617",
              {
                success: () => {
                  console.log("登录成功");
                },
                error: () => {
                  console.log("登录失败");
                },
              }
            );

            // 获取模拟通道信息
            console.log("尝试获取模拟通道信息");
            await WebVideoCtrl.I_GetAnalogChannelInfo(DestIp_Port, {
              success: () => {
                console.log("获取模拟通道成功");
              },
              error: () => {
                console.log("获取模拟通道失败");
              },
            });

            //获取端口并进行实时预览
            // const oPort = await WebVideoCtrl.I_GetDevicePort(IP_PORT);
            // const iRtspPort = oPort.iRtspPort;
            // console.log("获取端口成功", iRtspPort);

            // 实时预览
            await WebVideoCtrl.I_StartRealPlay(DestIp_Port, {
              iWndIndex: 1,
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
     * 模拟通道
     */
    getAnalogChannelInfo() {
      WebVideoCtrl.I_GetAnalogChannelInfo(DestIp_Port, {
        /**
         * 获取模拟通道后回调
         * @param xmlDoc 返回的XML内容
         * oChannels是模拟通道信息数组
         * 遍历通道数组，获取channel的id,name，push到channels中保存
         * 默认选择第一个通道
         */
        success: (xmlDoc) => {
          const oChannels = xmlDoc.getElementsByTagName("VideoInputChannel");
          for (let i = 0; i < oChannels.length; i++) {
            const channel = oChannels[i];
            const id = channel.getElementsByTagName("id")[0].textContent;
            let name = channel.getElementsByTagName("name")[0].textContent;
            if (name === "") {
              name = `Camera ${i < 9 ? "0" : ""}${i + 1}`;
            }
            console.log(id, " ", name);
            // this.channels.push({id, name, bZero: 'false'});
          }
          // if (this.channels.length > 0) {
          //   this.selectedChannel = this.channels[0].id; // 默认选择第一个通道
          // }
        },
        error: () => {
          console.log("获取模拟通道失败");
        },
      });
    },

    /**
     * 数字通道
     */
    getDigitalChannelInfo() {
      WebVideoCtrl.I_GetDigitalChannelInfo(DestIp_Port, {
        success: (xmlDoc) => {
          console.log("获取数字通道成功");
          const oChannels = xmlDoc.getElementsByTagName(
            "InputProxyChannelStatus"
          );
          console.log(oChannels);
          for (let i = 0; i < oChannels.length; i++) {
            const channel = oChannels[i];
            const id = channel.getElementsByTagName("id")[0].textContent;
            let name = channel.getElementsByTagName("name")[0].textContent;
            console.log(id, name);

            if (name === "") {
              name = `Camera ${i < 9 ? "0" : ""}${i + 1}`;
            }
            // this.channels.push({id, name, bZero: 'false'});
          }
          // if (this.channels.length > 0) {
          //   this.selectedChannel = this.channels[0].id; // 默认选择第一个通道
          // }
        },
        error: () => {
          console.log("获取数字通道失败");
        },
      });
    },
    changeWndNum(iType) {
      if ("1*2" === iType || "2*1" === iType) {
        WebVideoCtrl.I_ArrangeWindow(iType).then(
          () => {
            console.log("窗口分割成功！");
          },
          (oError) => {
            var szInfo = "窗口分割失败！";
            console.log(szInfo, oError.errorCode, oError.errorMsg);
          }
        );
      } else {
        iType = parseInt(iType, 10);
        WebVideoCtrl.I_ChangeWndNum(iType).then(
          () => {
            console.log("窗口分割成功！");
          },
          (oError) => {
            var szInfo = "窗口分割失败！";
            console.log(szInfo, oError.errorCode, oError.errorMsg);
          }
        );
      }
    },
  },
};
</script>

<style scoped></style>
