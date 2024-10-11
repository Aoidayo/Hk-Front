<template>
  <div class="container">
    <div
      id="divPlugin"
      class="plugin"
      style="width: 800px; height: 600px"
    ></div>
    <el-button size="medium" type="primary" @click="cameraInit"
      >一键初始化</el-button
    >
    <el-button size="medium" type="success" @click="cameraDirectPlay"
      >一键预览</el-button
    >
    <el-button size="medium" type="warning" @click="cameraStopPlay"
      >停止预览</el-button
    >
  </div>
</template>

<script>
export default {
  name: "Camera2",
  data() {
    return {};
  },
  created() {},
  methods: {
    /**
     * 初始化摄像头
     */
    cameraInit() {
      //初始化并嵌入插件
      WebVideoCtrl.I_InitPlugin({
        bWndFull: this.bWndFull,
        iWndowType: this.iWndowType,
        cbInitPluginComplete: function () {
          WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin").then(
            () => {
              // 检查插件是否最新
              WebVideoCtrl.I_CheckPluginVersion().then((bFlag) => {
                if (bFlag) {
                  alert(
                    "检测到新的插件版本，双击开发包目录里的HCWebSDKPlugin.exe升级！"
                  );
                } else {
                  WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin").then(() => {
                    console.log("初始化成功");
                    //登录设备
                    WebVideoCtrl.I_Login(
                      "192.168.2.186",
                      1,
                      "80",
                      "admin",
                      "cumtb617",
                      {
                        success: function () {
                          console.log("登录成功");
                          //获取模拟通道
                          WebVideoCtrl.I_GetAnalogChannelInfo(
                            "192.168.2.186_80",
                            {
                              success: function () {
                                console.log("获取模拟通道成功");
                                WebVideoCtrl.I_GetDevicePort(
                                  "192.168.2.186_80"
                                ).then((oPort) => {
                                  console.log("获取端口成功");
                                });
                              },
                              error: function () {
                                console.log("获取数字通道失败");
                              },
                            }
                          );
                        },
                      }
                    );
                  });
                }
              });
            },
            () => {
              alert(
                "插件初始化失败，请确认是否已安装插件；如果未安装，请双击开发包目录里的HCWebSDKPlugin.exe安装！"
              );
            }
          );
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
  },
};
</script>

<style scoped></style>
