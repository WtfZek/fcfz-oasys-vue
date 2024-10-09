import { createStore } from 'vuex';
import Cookie from 'js-cookie'
export default createStore({
    state: {
        isCollapse: false,
        currentMenu: null,
        tabsList: [
            {
                path: '/',
                name: 'index',
                label: '首页',
                icon: 'House'
            }
        ],  // 添加 tabsList 初始化
        menu: [],
    },
    mutations: {
        /**
         * 切换侧边栏的折叠状态。
         * @param {Object} state - Vuex 的状态。
         * @param {Boolean} payload - 当前折叠状态（可选）。
         */
        updateIsCollapse(state, payload) {
            // 将 isCollapse 状态切换为其相反值。
            state.isCollapse = !state.isCollapse;
        },

        /**
         * 选择一个菜单项并更新当前菜单状态。
         * 如果选择的菜单是 'home'，则将 currentMenu 重置为 null。
         * 如果不是，则将 currentMenu 设置为所选值，并在 tabsList 中添加它（如果尚不存在）。
         * @param {Object} state - Vuex 的状态。
         * @param {Object} val - 选择的菜单项。
         */
        selectMenu(state, val) {
            if (val.name === 'index') {
                // 如果选择的是 'index'，则重置当前菜单为 null。
                state.currentMenu = null;
            } else {
                // 将当前菜单设置为所选项。
                state.currentMenu = val;
            }
            // 检查菜单项是否已经存在于 tabsList 中。
            let result = state.tabsList.findIndex(item => item.name === val.name);
            // 如果未找到，则将该项添加到 tabsList 中。
            if (result === -1) {
                state.tabsList.push(val);
            }
        },

        /**
         * 关闭特定的标签页，依据提供的菜单项。
         * @param {Object} state - Vuex 的状态。
         * @param {Object} val - 要关闭的菜单项。
         */
        closeTab(state, val) {
            // 查找菜单项在 tabsList 中的索引。
            let res = state.tabsList.findIndex(item => item.name === val.name);
            // 从 tabsList 中移除该项。
            state.tabsList.splice(res, 1);
        },

        /**
         * 设置菜单并将其存储在 localStorage 中。
         * @param {Object} state - Vuex 的状态。
         * @param {Array} val - 要设置的菜单数组。
         */
        setMenu(state, val) {
            // 将菜单设置到状态中。
            state.menu = val;
            // 将菜单保存到 localStorage 中以便于持久化。
            localStorage.setItem('menu', JSON.stringify(val));
        },

        /**
         * 添加菜单到路由中。即用菜单数据解析、构建动态路由。
         * 如果 localStorage 中没有存储菜单，则直接返回。
         * 否则，从 localStorage 中读取菜单，并动态添加路由。
         * @param {Object} state - Vuex 的状态。
         * @param {Object} router - Vue Router 实例。
         */
        addMenu(state, router) {
            // 如果 localStorage 中没有菜单，则直接返回。
            if (!localStorage.getItem('menu')) {
                return;
            }
            // 从 localStorage 中解析出菜单。
            const menu = JSON.parse(localStorage.getItem('menu'));
            state.menu = menu;

            const menuArray = [];

            // 递归构建路由组件
            const buildMenuArray = (items) => {
                items.forEach(item => {
                    let url = `../views/${item.url}.vue`;
                    item.component = () => import(url);
                    menuArray.push(item);

                    // 如果有子菜单，递归处理
                    if (item.children && item.children.length > 0) {
                        buildMenuArray(item.children);
                    }
                });
            };

            // 开始构建菜单数组
            buildMenuArray(menu);

            // 将构建的菜单项添加到路由中。
            menuArray.forEach(item => {
                router.addRoute('home', item);
            });
        },


        /**
         * 清空菜单并移除 localStorage 中的菜单数据。
         * @param {Object} state - Vuex 的状态。
         */
        cleanMenu(state) {
            // 清空状态中的菜单。
            state.menu = [];
            // 从 localStorage 中移除菜单。
            localStorage.removeItem('menu');
        },

        setToken(state, val) {
            state.token = val
            Cookie.set('token', val)
        },
        clearToken(state) {
            state.token = ''
            Cookie.remove('token')
        },
        getToken(state) {
            state.token = state.token || Cookie.get('token')
        }
    }
})