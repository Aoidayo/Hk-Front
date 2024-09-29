<template>
  <div class="container" >
    <div class="cameras" style="display: flex">

<!--      <div id="divPlugin2" class="plugin" style="width: 800px;height: 600px;"></div>-->

    </div>

    <el-button size="medium" type="danger" @click="showCamera">显示摄像头</el-button>
    <el-button size="medium" type="primary" @click="cameraInit">一键播放</el-button>
<!--    <el-button size="medium" type="success" @click="cameraDirectPlay">一键预览</el-button>-->
    <el-button id="closeBtn" size="medium" type="warning" @click="cameraStopPlay">停止预览</el-button>

    <el-dialog title="摄像头画面" :visible.sync="openCamera" append-to-body destroy-on-close width="600px" :before-close="closeCamera">
<!--      <div v-if="isVisible">-->
        <div v-if="isVisible" id="divPlugin" class="plugin" style="width: 560px;height: 400px;"></div>
<!--      </div>-->
    </el-dialog>
  </div>

</template>

<script>

export default {
  name: "index",
  data() {
    return {
      openCamera:false,
      isVisible:false,
      ip1:'192.168.2.186',
      port:'80'
    }
  },
  created() {
  },
  methods: {
    closeCamera(){
      console.log("closeCamera")
      this.cameraStopPlay()
      this.closeCameraWin()
      this.isVisible = false
      this.openCamera = false
    },
    showCamera(){
      this.openCamera = true
      this.isVisible = true
      this.cameraInit()
    },
    /**
     * 初始化摄像头
     */
    cameraInit() {
      const username = 'admin';
      const password = 'cumtb617';
      const deviceIdentify = `${this.ip1}_${this.port}`;

      // 初始化并嵌入插件
      WebVideoCtrl.I_InitPlugin({
        bWndFull: this.bWndFull,
        iWndowType: 1,
        cbInitPluginComplete: async () => {
          try {
            await WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            const pluginUpdated = await WebVideoCtrl.I_CheckPluginVersion();

            if (pluginUpdated) {
              alert("检测到新的插件版本，双击开发包目录里的HCWebSDKPlugin.exe升级！");
              return;
            }

            console.log("初始化成功");
            console.log(IP1, PORT, deviceIdentify);

            // 登录设备
            await WebVideoCtrl.I_Login(IP1, 1, PORT, 'admin', 'cumtb617');
            console.log("登录成功");

            // 获取模拟通道信息
            console.log("尝试获取模拟通道信息");
            await WebVideoCtrl.I_GetAnalogChannelInfo(deviceIdentify, {
              success: () => {
                console.log("获取模拟通道成功")
                },
              error:()=>{
                console.log("获取模拟通道失败")
              }
            })

            //获取端口并进行实时预览
            const oPort = await WebVideoCtrl.I_GetDevicePort(deviceIdentify);
            const iRtspPort = oPort.iRtspPort;
            console.log("获取端口成功", iRtspPort);

            // 实时预览
            await WebVideoCtrl.I_StartRealPlay(deviceIdentify, { bZeroChannel: false, iPort: iRtspPort });
            console.log("预览成功");

          } catch (error) {
            console.error("操作失败", error);
            if (error.message.includes('登录')) {
              console.log("登录失败");
            } else if (error.message.includes('模拟通道')) {
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
      WebVideoCtrl.I_StartRealPlay('192.168.2.186_80', {
        bZeroChannel: false,
        iPort: '554',
        success: function () {
          console.log('预览成功')
        },
        error: function (status) {
          console.log('预览失败！');
        }
      })
    },
    /**
     * 停止播放
     */
    cameraStopPlay() {
      WebVideoCtrl.I_Stop({
        success: function () {
          console.log("停止播放成功")
        },
        error: function () {
          console.log("停止播放失败")
        }
      })
    },
    closeCameraWin(){
      WebVideoCtrl.I_Logout('192.168.2.186_80')
      console.log("已经登出")
      WebVideoCtrl.I_Restart('192.168.2.186_80')
      console.log("重启")
      location.reload();
    }
  }
}
</script>

<style scoped>

</style>
