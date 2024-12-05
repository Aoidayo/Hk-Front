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
  OUTER,
  OUTER_Password,
  CJ_Password,
  EV_Password,
  Name_Channel,
  Name_Ip_Dict,
} from "@/NVRconfig";
// ping

export default {
  name: "HkCamera",
  /*
   * isNvr:bool
   *   true: 使用nvr连接
   *   false: 使用ip直连
   * selectedCameraName:str
   *   只在ip直连时查表使用
   * selectedChannels:array
   *    对应通道
   * */
  props: ["selectedCameraName", "isNvr", "selectedChannels"],
  mounted() {
    console.log(this.selectedCameraName);
    // 远程启用下一行
    if (this.isNvr) {
      // #################################/ past    /#################################
      // this.getNVRip(this.selectedCameraName);
      // this.getNVRchannel();

      // #################################/ now: nvr ip    /#################################
      this.getNVRip();
      // #################################/ now: channels    /#################################
      if (!Array.isArray(this.selectedChannels)) {
        // 不为数组
        this.$message({
          message: "没有传入硬盘录像机对应通道",
          type: "warning",
        });
        // error
        throw new Error("没有传入硬盘录像机对应通道");
      }
      // check int
      // this.selectedChannels = this.selectedChannels.map((num) =>
      //   Math.floor(num)
      // );
      console.log(this.selectedChannels);
    } else {
      // ip-port
      this.getCameraIp(this.selectedCameraName);
      // 默认通道为0
      this.selectedChannel = 0;
    }

    this.showNVR();
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
      wndId2Channel: {},
    };
  },
  methods: {
    /**
     * 获取NVR的ip,ip_port,password
     */
    getNVRip() {
      this.password = OUTER_Password;
      this.destIp = OUTER;
      this.destIpPort = OUTER + "_" + this.destPort;
    },

    /**
     * ！这个不要删，先留着
     * 获取NVR的ip地址,对应username，password
     * 摄像头的通道本身通过NVRip引入的Name_Channel导入
     * @param cameraName
     */
    getNVRipEdition1(cameraName) {
      let arr = cameraName.split("_");
      if (arr[0] === "MC") {
        this.password = CJ_Password;
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
        console.log(this.selectedChannel);
      }
    },

    /**
     * 获取Camer Ip
     * 赋值username,password,destIp,destPort,destIpPort
     * @param cameraName
     */
    getCameraIp(cameraName) {
      let ip = Name_Ip_Dict[cameraName]["ip"];
      this.destIp = ip;
      this.destIpPort = `${this.destIp}_${this.destPort}`;
      this.username = Name_Ip_Dict[cameraName]["username"];
      this.password = Name_Ip_Dict[cameraName]["password"];
    },

    /**
     *  NVR初始化海康插件
     *  登录
     *  调用播放函数
     *  I_InitPlugin 初始化插件
     *  I_InsertOBJECTPlugin 嵌入播放插件
     *  I_Login 登陆设备
     *  I_GetAnalogChannelInfo 获取模拟通道
     *
     */
    showNVR() {
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
            try {
              await WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

              console.log("初始化成功");
              console.log(this.destIp, this.destPort, this.destIpPort);
            } catch (e) {
              //
              alert(
                "插件初始化失败，请确认是否安装：若未安装，请双击开发包目录里面的HcWebSDKPlugin.exe安装；" +
                  "若已经安装，请确认安装之后是否启动"
              );
              return;
            }

            const pluginUpdated = await WebVideoCtrl.I_CheckPluginVersion();
            if (pluginUpdated) {
              alert(
                "监测到新的插件版本，请双击开发包目录里面的HcWebSDKPlugin.exe升级"
              );
              return;
            }

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
            // console.error(error.errorCode);
            if (error.errorCode === 2001) {
              console.log("已经登录");
              this.cameraDirectPlay();
            }
          }
        },
      });
    },

    /**
     * 根据端口号进行实时预览
     */
    cameraDirectPlay() {
      // 实时预览
      if (this.isNvr) {
        this.changeWndNum("2")
          .then((res) => {
            // 最多同时播放四个，故修改为4
            _ = Math.max(4, this.selectedChannels.length);
            for (let i = 0; i < _; i++) {
              WebVideoCtrl.I_StartRealPlay(this.destIpPort, {
                iWndIndex: i,
                iChannelID: this.selectedChannels[i],
                iPort: RTSP_PORT,
                success: () => {
                  this.wndId2Channel[i] = this.selectedChannels[i];
                  // console.log(this.wndId2Channel);
                  console.log("预览成功");
                },
                error: () => {
                  console.log("预览失败");
                },
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
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
      }
    },

    /**
     * 指定wnd播放channel
     * 使用前提：登录，wnd中stop play
     * @param wnd
     * @param channel
     */
    cameraDirectPlayByWndAndChannel(wnd, channel) {
      return new Promise((resolve, reject) => {
        WebVideoCtrl.I_StartRealPlay(this.destIpPort, {
          iWndIndex: wnd,
          iChannelID: channel,
          iPort: RTSP_PORT,
          success: () => {
            console.log("预览成功");
            resolve();
          },
          error: () => {
            console.log("预览失败");
            reject();
          },
        });
      });
    },

    /**
     * 停止播放
     * 1. wndIndex，停止指定窗口播放的视频
     * 2. wndIndex没有传递时，ip播放
     */
    cameraStopPlay(wndIndex) {
      if (!wndIndex) {
        WebVideoCtrl.I_Stop({
          // iWndIndex:winNum,
          success: function () {
            console.log("停止播放成功");
          },
          error: function () {
            console.log("停止播放失败");
          },
        });
      } else {
        return new Promise((resolve, reject) => {
          // 必须异步
          WebVideoCtrl.I_Stop({
            iWndIndex: wndIndex,
            success: function () {
              console.log("停止播放成功");
              resolve();
            },
            error: function () {
              console.log("停止播放失败");
              reject("停止播放失败");
            },
          });
        });
      }
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
    // 修改为异步
    changeWndNum(iType) {
      return new Promise((resolve, reject) => {
        if ("1*2" === iType || "2*1" === iType) {
          WebVideoCtrl.I_ArrangeWindow(iType).then(
            () => {
              console.log("窗口分割成功！");
              resolve();
            },
            (oError) => {
              var szInfo = "窗口分割失败！";
              console.log(szInfo, oError.errorCode, oError.errorMsg);
              reject(oError);
            }
          );
        } else {
          iType = parseInt(iType, 10);
          WebVideoCtrl.I_ChangeWndNum(iType).then(
            () => {
              console.log("窗口分割成功！");
              resolve();
            },
            (oError) => {
              var szInfo = "窗口分割失败！";
              console.log(szInfo, oError.errorCode, oError.errorMsg);
              reject(oError);
            }
          );
        }
      });
    },

    /**
     *
     * @param oldChannel
     * @param newChannel
     */
    changeWndShow(oldChannel, newChannel) {
      let oldWndId =
        Object.keys(this.wndId2Channel).find(
          (key) => this.wndId2Channel[key] === oldChannel
        ) || null;
      console.log(this.wndId2Channel);
      console.log("changeWndShow:" + oldWndId);

      this.cameraStopPlay(oldWndId)
        .then((res) => {
          console.log("暂停播放成功");
          this.cameraDirectPlayByWndAndChannel(oldWndId, newChannel)
            .then((res) => {
              console.log("切换播放成功");
            })
            .catch((err) => {
              console.log("切换播放失败");
              console.log(err.message);
            });
        })
        .catch((err) => {
          console.log("暂停播放失败");
          console.log(err.message);
        });
    },
  },
};
</script>

<style scoped></style>
