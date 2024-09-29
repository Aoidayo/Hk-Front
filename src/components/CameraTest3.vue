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
const deviceIdentify = `${IP3}_${PORT}`;
export default {
  name: "CameraTest3",
  data() {
    return {
      ip:'192.168.2.186',
      port:'80',
      username:'admin',
      password:'cumtb617'
    };
  },
  created() {
  },
  async mounted() {
    const deviceIdentify = `${this.ip}_${this.port}`;
    this.cameraInit('divPlugin', this.ip, this.port, this.username, this.password, this.password);
    this.getAnalogChannelInfo(deviceIdentify)
    await this.startRealPlay(deviceIdentify)
  },
  methods: {
    /**
     * 初始化divPlugin
     * divId: divplugin
     *  插件限制只能初始化一个
     */
    async cameraInit(divId,ip,port,username,password){
      //   初始化嵌入插件
      const deviceIdentify = `${ip}_${port}`;
      WebVideoCtrl.I_InitPlugin({
        bWndFull: true,
        iWndowType: 1,
        cbInitPluginComplete: async () => {
          try {
            await WebVideoCtrl.I_InsertOBJECTPlugin(divId);
            console.log("初始化成功");
            console.log(ip, port, deviceIdentify);

            // 登录设备
            if (!this.isLogin) {
              // 1: http
              await WebVideoCtrl.I_Login(ip, 1, port, username, password, {
                success: () => {
                  console.log("登录成功");
                  this.isLogin = 1
                },
                error: () => {
                  console.log("登录失败");
                },
              });
            }
          } catch (error) {
            console.log(error)
          }
        },
      });
    },
    /**
     * 获取模拟通道信息
     * @param deviceIdentify
     * @returns {Promise<void>}
     */
    async getAnalogChannelInfo(deviceIdentify){
      console.log("尝试获取模拟通道信息");
      await WebVideoCtrl.I_GetAnalogChannelInfo(deviceIdentify, {
        success: () => {
          console.log("获取模拟通道成功");
        },
        error: () => {
          console.log("获取模拟通道失败");
        },
      });
    },
    /**
     * 开始与狼
     * @param deviceIdentify
     * @returns {Promise<void>}
     */
    async startRealPlay(deviceIdentify){
      // 实时预览
      await WebVideoCtrl.I_StartRealPlay(deviceIdentify, {
        bZeroChannel: false,
        iPort: 554,
      });
      console.log("预览成功");
    }
  }
};
</script>

<style scoped>

</style>