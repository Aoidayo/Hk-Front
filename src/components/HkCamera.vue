<template>
  <div class="container">
    <div
      id="divPlugin"
      class="plugin"
      style="width: 70vw; height: 70vh; margin: 0 auto"
    ></div>
  </div>
</template>

<script>
//引入预置 ip channel name
import {
  DestIP,
  DestPort,
  DestIp_Port,
  LOGIN_PROTO,
  RTSP_PORT,
  USERNAME,
  PASSWORD,
  CJ130,
  CJ108,
  EV,
  EV_Password,
  Name_Channel,
} from "@/NVRconfig";
export default {
  name: "HkCamera",
  props: ["selectedCameraName"],
  mounted() {
    console.log(this.selectedCameraName);
    // 远程启用
    // this.getNVRip()
    this.getNVRchannel();

    this.showDVR();
  },
  beforeDestroy() {
    this.closeCamera();
  },
  data() {
    return {
      selectedChannel: null,
      destIp: DestIP,
      destPort: DestPort,
      destIpPort: DestIp_Port,
      username: USERNAME,
      password: PASSWORD,
    };
  },
  methods: {
    /**
     * 获取NVR的ip地址,对应username，password
     * 摄像头的通道本身通过NVRip引入的Name_Channel导入
     * @param cameraName
     */
    getNVRip(cameraName) {
      let arr = cameraName.split("_");
      if (arr[0] === "MC") {
        if (arr[1] === "Door") {
          // MC_Door_108_8
          if (arr[2] === "108") {
            this.destIp = CJ108;
            this.destIpPort = this.destIp + "_" + this.destPort;
          } else if (arr[2] === "130") {
            this.destIp = CJ130;
            this.destIpPort = this.destIp + "_" + this.destPort;
          }
        } else if (arr[1] === "Out") {
          //
        }
      } else if (arr[0] === "EV") {
        //EV_Door_3
        this.destIp = EV;
        this.password = EV_Password;
      } else {
        // 抛出异常
        throw new Error("传入车间名称错误");
      }
    },

    /**
     * 获取props传过来的摄像头名字对应通道
     * 没有 报错
     */
    getNVRchannel() {
      if (Name_Channel[this.selectedCameraName] == null) {
        this.$message("没有获取到摄像头对应的通道");
        throw Error("没有获取到摄像头对应的通道");
      } else {
        this.selectedChannel = Name_Channel[this.selectedCameraName];
      }
    },
    /**
     *  DVR初始化海康插件
     *  登录
     *  调用播放函数
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
            console.log(this.destIp, this.destPort, this.destIpPort);

            // 登录设备
            await WebVideoCtrl.I_Login(
              this.destIp,
              LOGIN_PROTO,
              this.destPort,
              this.username,
              this.password,
              {
                success: () => {
                  console.log("登录成功");
                  this.cameraDirectPlay();
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
      WebVideoCtrl.I_StartRealPlay(this.destIpPort, {
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
      WebVideoCtrl.I_Logout(this.destIpPort);
      console.log("已经登出");
      WebVideoCtrl.I_DestroyPlugin();
      console.log("已经销毁");
      // location.reload() 刷新页面
    },
    /**
     * 停止播放，登出，销毁plugin
     */
    closeCamera() {
      WebVideoCtrl.I_Stop({
        // iWndIndex:winNum,
        success: function () {
          console.log("停止播放成功");
          WebVideoCtrl.I_Logout(this.destIpPort);
          console.log("已经登出");
          WebVideoCtrl.I_DestroyPlugin();
          console.log("已经销毁");
        },
        error: function () {
          console.log("停止播放失败");
        },
      });
    },
    /**
     * 显示摄像头
     */
    // showCamera() {
    //   this.openCamera = true;
    //   this.cameraInit();
    // },
    /**
     * 模拟通道
     */
    getAnalogChannelInfo() {
      WebVideoCtrl.I_GetAnalogChannelInfo(this.destIpPort, {
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
      WebVideoCtrl.I_GetDigitalChannelInfo(this.destIpPort, {
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
    // 多分屏，此版本不用
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
