import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import './assets/less/index.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store/index.js'
import './api/mock.js'
import api from './api/api'
// 引入 Element Plus 的中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {ElConfigProvider} from 'element-plus' // 按需引入 ElConfigProvider

import VueUeditorWrap from 'vue-ueditor-wrap';

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// app.use(ElementPlus)

app.config.globalProperties.$api = api
store.commit("addMenu", router);

function checkRouter(path) {
    let hasCheck = router.getRoutes().filter(route => route.path == path).length
    if (hasCheck) {
        return true
    } else {
        return false
    }
}

router.beforeEach((to, from, next) => {
    store.commit('getSaToken')
    const token = store.state.token
    console.log('token', token)
    if (!token && to.name !== 'login') {
        next({name: 'login'})
    } else if (!checkRouter(to.path)) {
        next({name: 'index'})
    } else {
        next()
    }
})
app.use(router).use(store).use(VueUeditorWrap)
app.mount('#app')

app.component('ElConfigProvider', ElConfigProvider)

