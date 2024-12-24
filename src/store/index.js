import { createStore } from 'vuex';
// import Cookie from 'js-cookie'
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

        clearTabList(state, val) {
            // 收集要删除的标签名
            const namesToRemove = val
                .filter(item => item.name !== 'index')
                .map(item => item.name);

            // 遍历标签列表，反向删除匹配的标签
            namesToRemove.forEach(name => {
                const index = state.tabsList.findIndex(val => val.name === name);
                if (index !== -1) {
                    state.tabsList.splice(index, 1);
                }
            });
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
        // 动态添加路由
        addMenu(state, router) {
            const storedMenu = localStorage.getItem('menu');
            if (!storedMenu) {
                return;
            }

            const menu = JSON.parse(storedMenu);
            state.menu = menu;

            const menuArray = [];

            const buildMenuArray = (items) => {
                items.forEach(item => {
                    // 这里的路径使用了 Vite 的别名 '@' 对应的路径
                    const componentPath = `../views/${item.url}.vue`;  // 使用别名路径
                    console.log('componentPath', componentPath);

                    // 使用 import.meta.glob 动态加载组件
                    const importRoute = import.meta.glob('../views/**/*.vue');  // 使用正确的路径模式

                    console.log('importRoute', importRoute);

                    // 匹配路径，注意 importRoute 里面的路径已经不带 '/src' 了
                    const component = importRoute[componentPath];

                    console.log('component', component);

                    if (component) {
                        // 使用动态 import() 来异步加载组件
                        item.component = () => component();
                    } else {
                        console.warn(`No component found for path: ${componentPath}`);
                    }

                    menuArray.push(item);

                    // 递归处理子菜单
                    if (item.children && item.children.length > 0) {
                        buildMenuArray(item.children);
                    }
                });
            };

            buildMenuArray(menu);

            // 将构建的菜单项添加到路由中
            menuArray.forEach(item => {
                if (item.component) {
                    router.addRoute('home', {
                        path: item.path,
                        name: item.name,  // 确保指定了 name
                        component: item.component,
                        children: item.children || []
                    });
                } else {
                    console.warn(`Menu item with path "${item.path}" is missing a component.`);
                }
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
            state.token = val.tokenValue
            localStorage.setItem('tokenKey', val.tokenName);
            localStorage.setItem('tokenValue', state.token);
            // Cookie.set(val.tokenName, state.token)
        },

        // setToken(state, val) {
        //     state.token = val
        //     Cookie.set('token', val)
        // },
        clearToken(state) {
            state.token = ''
            localStorage.removeItem('tokenKey');
            localStorage.removeItem('tokenValue');
            // Cookie.remove('satoken')
        },
        getToken(state) {
            // state.token = state.token || Cookie.get('token')
            state.token = state.token || localStorage.getItem('tokenValue')
        },
        getSaToken(state) {
            // state.token = state.token || Cookie.get('satoken')
            state.token = state.token || localStorage.getItem('tokenValue')
        }
    }
})