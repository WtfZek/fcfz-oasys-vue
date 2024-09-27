<template>
  <el-aside :style="{ width: $store.state.isCollapse ? '64px' : 'auto', minWidth: $store.state.isCollapse ? '64px' : '200px' }">
    <el-menu
        class="el-menu-vertical-demo"
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        :collapse="$store.state.isCollapse"
        :collapse-transition="false"
        popper-offset="0"
    >
      <h3 v-show="!$store.state.isCollapse">我的 OA 系统</h3>
      <h3 v-show="$store.state.isCollapse"> O A </h3>
      <menu-item v-for="item in $store.state.menu" :key="item.path" :item="item" />
    </el-menu>
  </el-aside>
</template>

<script>
import { defineComponent, ref } from 'vue';
import MenuItem from './Menu/AsideMenuItem.vue';

export default defineComponent({
  components: {
    MenuItem,
  },
  setup() {
    const list = ref([
      {
        "path": "/",
        "name": "index",
        "label": "首页",
        "icon": "House",  // 对应 Element Plus 的 House 图标
        "url": "Home/Home",
        "children": [],
      },
      {
        "path": "/dept",
        "name": "enterpriseManagement",
        "label": "企业管理",
        "icon": "Suitcase",  // 对应 Suitcase 图标
        "url": "Dept/Department",
        "children": [
          {
            "path": "/dept/user-management",
            "name": "userManagement",
            "label": "用户管理",
            "icon": "User",  // 对应 User 图标
            "url": "user-management",
            "children": [],
          },
          {
            "path": "/dept/department",
            "name": "departmentManagement",
            "label": "部门管理",
            "icon": "OfficeBuilding",  // 对应 OfficeBuilding 图标
            "url": "Dept/Department",
            "children": [],
          },
          {
            "path": "/dept/role",
            "name": "roleManagement",
            "label": "职位管理",
            "icon": "Management",  // 对应 Management 图标
            "url": "Dept/Role",
            "children": [],
          }
        ]
      },
      {
        "path": "/check",
        "name": "attendanceInformation",
        "label": "考勤信息",
        "icon": "Timer",  // 对应 Timer 图标
        "url": "Check/Information",
        "children": [
          {
            "path": "/check/message",
            "name": "punchInInfo",
            "label": "打卡信息",
            "icon": "DocumentChecked",  // 对应 DocumentChecked 图标
            "url": "Check/Message",
            "children": [
              {
                "path": "/check/message/echart",
                "name": "visualization",
                "label": "可视化界面",
                "icon": "DataAnalysis",  // 对应 DataAnalysis 图标
                "url": "Check/Message/Echart",
                "children": [
                  {
                    "path": "/check/message/echart/unitfx",
                    "name": "unitfx",
                    "label": "单元分析",
                    "icon": "PieChart",  // 对应 PieChart 图标
                    "url": "Check/Message/Echart/Unitfx",
                    "children": [
                      {
                        "path": "/check/message/echart/unitfx/test1",
                        "name": "test1",
                        "label": "测试测试测试测试1",
                        "icon": "DataBoard",  // 对应 DataBoard 图标
                        "url": "Check/Message/Echart/Unitfx/Test1",
                        "children": [],
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "path": "/check/controller",
            "name": "attendanceManagement",
            "label": "考勤管理",
            "icon": "Tools",  // 对应 Tools 图标
            "url": "Check/Controller",
            "children": [],
          }
        ]
      },
      {
        "path": "/oaflow",
        "name": "oaApproval",
        "label": "OA审批",
        "icon": "Check",  // 对应 Check 图标
        "url": "OA/Approval",
        "children": [],
      },
      {
        "path": "/people",
        "name": "employeeInfo",
        "label": "员工信息",
        "icon": "User",  // 对应 User 图标
        "url": "Employee/Info",
        "children": [],
      },
      {
        "path": "/other",
        "name": "other",
        "label": "其他",
        "icon": "Location",  // 对应 Location 图标
        "url": "Other/Other",
        "children": [],
      }
    ]);

    return {
      list,
    };
  },
});

</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
  h3 {
    line-height: 60px;
    color: #fff;
    text-align: center;
  }
}

</style>