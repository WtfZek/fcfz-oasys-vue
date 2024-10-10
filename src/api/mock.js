import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'
import permissionApi from './mockData/permission'
import config from '../config';

// 判断当前环境是否为test
if (config.env === 'development') {
    // 拦截请求
    Mock.mock('/home/getTableData', 'get', homeApi.getHomeData);
    Mock.mock('/home/getCountData', 'get', homeApi.getCountData);
    Mock.mock('/home/getChartData', 'get', homeApi.getChartData());

    // 本地获取user的数据，正则表达式写法
    // Mock.mock(/user\/getUser/, 'get', userApi.getUserList);
    Mock.mock(/user\/add/, 'post', userApi.createUser);
    Mock.mock(/user\/edit/, 'post', userApi.updateUser);
    Mock.mock(/user\/delete/, 'get', userApi.deleteUser);

    // 获取权限菜单
    Mock.mock(/permission\/getMenu/, 'post', permissionApi.getMenu);

    console.log('Mock.js 拦截已启用');
} else {
    console.log('非 development 环境，Mock.js 拦截未启用');
}
