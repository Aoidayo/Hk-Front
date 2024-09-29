import VueRouter from 'vue-router'			// 引入VueRouter
import CameraTest1 from "@/components/CameraTest1.vue";
import CameraTest2 from "@/components/CameraTest2.vue";
import IframeTest from "@/components/IframeTest.vue";
import CameraTest from "@/components/CameraTest.vue";

// 创建router实例对象，去管理一组一组的路由规则
const router = new VueRouter({
    routes:[
        {
          path:'/',
          component:CameraTest
        },
        {
            path:'/cameraTest1',
            component:CameraTest1
        },
        {
            path:'/cameraTest2/:channelId',
            component:CameraTest2
        },
        {
            path:'/iframeTest',
            component:IframeTest
        }
    ]
})

//暴露router
export default router