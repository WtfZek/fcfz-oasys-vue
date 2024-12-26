// import Mock from 'mockjs'
export default {
  getMenu: config => {
    const { username, password } = JSON.parse(config.body)
    // 先判断用户是否存在
    // 判断账号和密码是否对应
    if (username === '2424389790' && password === '123456') {
      return {
        code: "200",
        data: [
            {
                "path": "/",
                "name": "index",
                "label": "首页",
                "icon": "House",  // 对应 Element Plus 的 House 图标
                "url": "Home/Home",
                "children": []
            },
            {
                "path": "/enterprise",
              "name": "enterpriseManagement",
              "label": "企业管理",
              "icon": "Suitcase",  // 对应 Suitcase 图标
              "url": "Enterprise/Management",
              "children": [
                {
                  "path": "/enterprise/user-management",
                  "name": "userManagement",
                  "label": "用户管理",
                  "icon": "User",  // 对应 User 图标
                  "url": "Enterprise/UserManagement",
                  "children": []
                },
                {
                  "path": "/enterprise/department-management",
                  "name": "departmentManagement",
                  "label": "部门管理",
                  "icon": "OfficeBuilding",  // 对应 OfficeBuilding 图标
                  "url": "Enterprise/DepartmentManagement",
                  "children": []
                },
                {
                    "path": "/enterprise/post-management",
                    "name": "postManagement",
                    "label": "职位管理",
                    "icon": "Management",  // 对应 Management 图标
                    "url": "Enterprise/PostManagement",
                    "children": []
                },
                  {
                      "path": "/enterprise/role-management",
                      "name": "roleManagement",
                      "label": "角色管理",
                      "icon": "Key",  // 对应 Key 图标
                      "url": "Enterprise/RoleManagement",
                      "children": []
                  }
              ]
            },
            {
              "path": "/attendance",
              "name": "attendanceManagement",
              "label": "考勤管理",
              "icon": "Tools",  // 对应 Tools 图标
              "url": "Attendance/Management",
              "children": [
                {
                  "path": "/attendance/punch-management",
                  "name": "punchManagement",
                  "label": "打卡管理",
                  "icon": "DocumentChecked",  // 对应 DocumentChecked 图标
                  "url": "Attendance/AttendanceManagement",
                  "children": [
                  ]
                },
                  {
                      "path": "/attendance/punch-calendar",
                      "name": "attendanceCalendar",
                      "label": "打卡日历",
                      "icon": "Calendar",  // 对应 DocumentChecked 图标
                      "url": "Attendance/AttendanceCalendar",
                      "children": [],
                  },
                {
                  "path": "/attendance/statistics",
                  "name": "attendanceStatistics",
                  "label": "统计信息",
                  "icon": "PieChart",  // 对应 PieChart 图标
                  "url": "Attendance/AttendanceStatistics",
                  "children": [
                      {
                          "path": "/attendance/statistics-stage",
                          "name": "stageVisualization",
                          "label": "考勤阶段可视化信息",
                          "icon": "TrendCharts",  // 对应 Calendar 图标
                          "url": "Attendance/Statistics/StageVisualization",
                          "children": []
                      },
                      {
                          "path": "/attendance/statistics-summary",
                          "name": "attendanceSummary",
                          "label": "考勤统计大屏汇总",
                          "icon": "Monitor",  // 对应 Monitor 图标
                          "url": "Attendance/Statistics/Summary",
                          "children": []
                      }
                  ]
                }
              ]
            },
            {
              "path": "/report",
              "name": "reportManagement",
              "label": "日志管理",
              "icon": "Document",  // 对应 Document 图标
              "url": "Report/Management",
              "children": [
                {
                  "path": "/report/info",
                  "name": "reportInfo",
                  "label": "日志信息",
                  "icon": "Files",  // 对应 Files 图标
                  "url": "Report/ReportInfo",
                  "children": []
                },
                {
                  "path": "/report/my-reports",
                  "name": "myReports",
                  "label": "我的日志",
                  "icon": "Notebook",  // 对应 Notebook 图标
                  "url": "Report/MyReports",
                  "children": []
                }
              ]
            },
            {
              "path": "/approval",
              "name": "oaApproval",
              "label": "流程审批",
              "icon": "Check",  // 对应 Check 图标
              "url": "OA/Approval",
              "children": [
                {
                  "path": "/approval/management",
                  "name": "approvalManagement",
                  "label": "审批管理",
                  "icon": "Files",  // 对应 Files 图标
                  "url": "Approval/ApprovalManagement",
                  "children": []
                },
                {
                  "path": "/approval/my-application",
                  "name": "myApplication",
                  "label": "我的申请",
                  "icon": "DocumentAdd",  // 对应 DocumentAdd 图标
                  "url": "Approval/MyApplication",
                  "children": []
                },
                {
                  "path": "/approval/pending-list",
                  "name": "pendingList",
                  "label": "待审列表",
                  "icon": "DocumentChecked",  // 对应 DocumentChecked 图标
                  "url": "Approval/PendingList",
                  "children": []
                }
              ]
            }
          ],
          msg: '获取成功'
      }
    } else if (username === '20221107040' && password === '123456') {
      return {
        code: "200",
        data: {
          menu: [
            {
              "path": "/",
              "name": "index",
              "label": "首页",
              "icon": "House",  // 对应 Element Plus 的 House 图标
              "url": "Home/Home",
              "children": []
            },
            {
              "path": "/enterprise",
              "name": "enterpriseManagement",
              "label": "企业管理",
              "icon": "Suitcase",  // 对应 Suitcase 图标
              "url": "Enterprise/Management",
              "children": [
                {
                  "path": "/enterprise/user-management",
                  "name": "userManagement",
                  "label": "用户管理",
                  "icon": "User",  // 对应 User 图标
                  "url": "Enterprise/UserManagement",
                  "children": []
                },
                {
                  "path": "/enterprise/department-management",
                  "name": "departmentManagement",
                  "label": "部门管理",
                  "icon": "OfficeBuilding",  // 对应 OfficeBuilding 图标
                  "url": "Enterprise/DepartmentManagement",
                  "children": []
                },
                  {
                      "path": "/enterprise/post-management",
                      "name": "postManagement",
                      "label": "职位管理",
                      "icon": "Management",  // 对应 Management 图标
                      "url": "Enterprise/PostManagement",
                      "children": []
                  },
                  {
                      "path": "/enterprise/role-management",
                      "name": "permissionManagement",
                      "label": "角色管理",
                      "icon": "Key",  // 对应 Key 图标
                      "url": "Enterprise/RoleManagement",
                      "children": []
                  }
              ]
            },
            {
              "path": "/attendance",
              "name": "attendanceManagement",
              "label": "考勤管理",
              "icon": "Tools",  // 对应 Tools 图标
              "url": "Attendance/Management",
              "children": [
                {
                  "path": "/attendance/punch-management",
                  "name": "punchManagement",
                  "label": "打卡管理",
                  "icon": "DocumentChecked",  // 对应 DocumentChecked 图标
                  "url": "Attendance/AttendanceManagement",
                  "children": []
                },
                {
                  "path": "/attendance/message/calendar",
                  "name": "attendanceCalendar",
                  "label": "打卡日历",
                  "icon": "Calendar",  // 对应 DocumentChecked 图标
                  "url": "Attendance/AttendanceCalendar",
                  "children": [],
                },
                {
                  "path": "/attendance/statistics",
                  "name": "attendanceStatistics",
                  "label": "统计信息",
                  "icon": "PieChart",  // 对应 PieChart 图标
                  "url": "Attendance/AttendanceStatistics",
                  "children": [
                    {
                      "path": "/attendance/statistics/annual",
                      "name": "annualVisualization",
                      "label": "考勤年度可视化信息",
                      "icon": "Calendar",  // 对应 Calendar 图标
                      "url": "Attendance/Statistics/AnnualVisualization",
                      "children": []
                    },
                    {
                      "path": "/attendance/statistics/quarterly",
                      "name": "quarterlyVisualization",
                      "label": "考勤季度可视化",
                      "icon": "BarChart",  // 对应 BarChart 图标
                      "url": "Attendance/Statistics/QuarterlyVisualization",
                      "children": []
                    },
                    {
                      "path": "/attendance/statistics/monthly",
                      "name": "monthlyVisualization",
                      "label": "考勤月度可视化",
                      "icon": "Clock",  // 对应 Clock 图标
                      "url": "Attendance/Statistics/MonthlyVisualization",
                      "children": []
                    },
                    {
                      "path": "/attendance/statistics/weekly",
                      "name": "weeklyVisualization",
                      "label": "考勤周可视化",
                      "icon": "ChartBar",  // 对应 ChartBar 图标
                      "url": "Attendance/Statistics/WeeklyVisualization",
                      "children": []
                    },
                    {
                      "path": "/attendance/statistics/summary",
                      "name": "attendanceSummary",
                      "label": "考勤统计大屏汇总",
                      "icon": "Monitor",  // 对应 Monitor 图标
                      "url": "Attendance/Statistics/Summary",
                      "children": []
                    }
                  ]
                }
              ]
            },
            {
              "path": "/report",
              "name": "reportManagement",
              "label": "日志管理",
              "icon": "Document",  // 对应 Document 图标
              "url": "Report/Management",
              "children": [
                {
                  "path": "/report/info",
                  "name": "reportInfo",
                  "label": "日志信息",
                  "icon": "Files",  // 对应 Files 图标
                  "url": "Report/ReportInfo",
                  "children": []
                },
                {
                  "path": "/report/my-reports",
                  "name": "myReports",
                  "label": "我的日志",
                  "icon": "Notebook",  // 对应 Notebook 图标
                  "url": "Report/MyReports",
                  "children": []
                }
              ]
            },
            {
              "path": "/approval",
              "name": "oaApproval",
              "label": "流程审批",
              "icon": "Check",  // 对应 Check 图标
              "url": "OA/Approval",
              "children": [
                {
                  "path": "/approval/management",
                  "name": "approvalManagement",
                  "label": "审批管理",
                  "icon": "Files",  // 对应 Files 图标
                  "url": "Approval/ApprovalManagement",
                  "children": []
                },
                {
                  "path": "/approval/my-application",
                  "name": "myApplication",
                  "label": "我的申请",
                  "icon": "DocumentAdd",  // 对应 DocumentAdd 图标
                  "url": "Approval/MyApplication",
                  "children": []
                },
                {
                  "path": "/approval/pending-list",
                  "name": "pendingList",
                  "label": "待审列表",
                  "icon": "DocumentChecked",  // 对应 DocumentChecked 图标
                  "url": "Approval/PendingList",
                  "children": []
                },
                {
                  "path": "/approval/flow-definition",
                  "name": "flowDefinition",
                  "label": "流程定义",
                  "icon": "EditPen",  // 对应 FlowChart 图标
                  "url": "Approval/FlowDefinition",
                  "children": []
                }
              ]
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