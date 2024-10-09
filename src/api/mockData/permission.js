import Mock from 'mockjs'
export default {
  getMenu: config => {
    const { username, password } = JSON.parse(config.body)
    // 先判断用户是否存在
    // 判断账号和密码是否对应
    if (username === 'admin' && password === 'admin') {
      return {
        code: 200,
        data: {
          menu: [
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
                  "url": "User/UserManagement",
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
              "name": "attendanceManagement",
              "label": "考勤管理",
              "icon": "Tools",  // 对应 Tools 图标
              "url": "Check",
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
                      "children": [],
                    },
                    {
                      "path": "/check/message/calendar",
                      "name": "checkCalendar",
                      "label": "打卡日历",
                      "icon": "Calendar",  // 对应 DocumentChecked 图标
                      "url": "Attendance/AttendanceCalendar",
                      "children": [],
                    }
                  ]
                },
                {
                  "path": "/check/info",
                  "name": "attendanceInformation",
                  "label": "考勤信息",
                  "icon": "Timer",  // 对应 Timer 图标
                  "url": "Check/Info",
                  "children": [],
                },
              ]
            },
            {
              "path": "/unitfx",
              "name": "unitfx",
              "label": "单元分析",
              "icon": "PieChart",  // 对应 PieChart 图标
              "url": "Unitfx",
              "children": [
                {
                  "path": "/unitfx/test1",
                  "name": "test1",
                  "label": "测试测试测试测试1",
                  "icon": "DataBoard",  // 对应 DataBoard 图标
                  "url": "Unitfx/Test1",
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
          ],
          token:
              Mock.Random.guid(),
              // "",
          message: '获取成功'
        }
      }
    } else if (username === 'xiaoxiao' && password === 'xiaoxiao') {
      return {
        code: 200,
        data: {
          menu: [
            {
              "path": "/check",
              "name": "attendanceInformation",
              "label": "考勤信息",
              "icon": "Timer",
              "url": "Check/Information",
              "children": [
                {
                  "path": "/check/message",
                  "name": "punchInInfo",
                  "label": "打卡信息",
                  "icon": "DocumentChecked",
                  "url": "Check/Message",
                  "children": []
                }
              ]
            },
            {
              "path": "/oaflow",
              "name": "oaApproval",
              "label": "OA审批",
              "icon": "Check",
              "url": "OA/Approval",
              "children": []
            },
            {
              "path": "/people",
              "name": "employeeInfo",
              "label": "员工信息",
              "icon": "User",
              "url": "Employee/Info",
              "children": []
            },
            {
              "path": "/other",
              "name": "other",
              "label": "其他",
              "icon": "Location",
              "url": "Other/Other",
              "children": []
            }
          ],
          token: Mock.Random.guid(),
          message: '获取成功'
        }
      }
    } else {
      return {
        code: -999,
        data: {
          message: '密码错误'
        }
      }
    }

  }
}