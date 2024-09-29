import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import router from './router'

//演示全部引入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';	// 引入ElementUI全部样式
Vue.config.productionTip = false

Vue.use(ElementUI)	// 使用ElementUI
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router:router
}).$mount('#app')
