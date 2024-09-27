// `routers` 是路由配置数组，定义了路由路径和它们对应的组件。
// 第一个对象代表根路径 `/`，加载 `Main.vue` 组件，且定义了子路由，`home` 路由对应 `Home.vue` 组件。

import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/home',
        component: () => import('../views/Main.vue'),
        name: 'home',
        redirect: '/index',
        children: [
          {
            path: '/index',
            name: 'index',
            component: () => import('../views/Home/Home.vue')
          },
          {
            path: '/personal-info',
            name: 'personalInfo',
            component: () => import('../views/Self/PersonalInfo.vue')
          },
        ],
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    }
]

const  router = createRouter({
    history: createWebHashHistory(),
    // `history` 属性指定路由模式，这里使用的是 `createWebHashHistory`，即基于 URL hash（#）的模式，适用于不需要服务器端配置的 SPA 应用。

    routes
    // `routes` 属性中传递的是路由配置数组 `routes`，定义了路由路径与组件的映射关系。
})

export default router
// 导出 `router` 实例，供整个应用使用。通过在主应用文件中引入这个路由器实例，可以管理应用的路由行为。