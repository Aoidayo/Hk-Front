import VueRouter from "vue-router"; // 引入VueRouter
import CameraTest from "@/components/CameraTest.vue";
import TestHkLogin from "@/components/TestHkLogin.vue";

// 创建router实例对象，去管理一组一组的路由规则
const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: CameraTest,
    },
    {
      path: "/TestHkLogin",
      component: TestHkLogin,
    },
  ],
});

//暴露router
export default router;
