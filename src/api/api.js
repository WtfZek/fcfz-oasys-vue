/**
 * 整个项目api的管理
 * 
 */
import request from "./request"
export default {
  // home组件 左侧表格数据获取
  getTableData(params) {
    return request({
      url: '/home/getTableData',
      method: 'get',
      data: params,
      mock: true
    })
  },
  getCountData() {
    return request({
      url: '/home/getCountData',
      method: 'get',
      mock: true
    })
  },
  getChartData() {
    return request({
      url: '/home/getChartData',
      method: 'get',
      mock: true
    })
  },
  getUserData(params) {
    return request({
      url: '/user/getUser',
      method: 'get',
      // 这个mock如果是true的话 用的就是线上fastmock的数据
      mock: false,
      data: params
      // data:{total: 0,page: 1,}
    })
  },
  addUser(params) {
    return request({
      url: '/user/add',
      method: 'post',
      // 这个mock如果是true的话 用的就是线上fastmock的数据
      mock: false,
      data: params
      // data:{total: 0,page: 1,}
    })
  },
  editUser(params) {
    return request({
      url: '/user/edit',
      method: 'post',
      // 这个mock如果是true的话 用的就是线上fastmock的数据
      mock: false,
      data: params
    })
  },
  deleteUser(params) {
    return request({
        url: '/user/deleteUser',
        method: 'delete',
        // 这个mock如果是true的话 用的就是线上fastmock的数据
        mock: false,
        data: params
    })
  },
  // 根据用户的用户名不同 返回不一样的菜单列表
  getMenu() {
      return request({
          url: '/menu/getMenuTree',
          method: 'get',
          // 这个mock如果是true的话 用的就是线上fastmock的数据
          mock: false,
      })
  },

  // 登录验证逻辑
  login(params) {
    return request({
        url: '/user/login',
        method: 'post',
        mock: false,
        // params: 将 params 中所有字段作为查询参数
        params: {
            ...params
        },
    });
  },

    // 验证码校验逻辑
    getCaptcha(params) {
        return request({
            url: '/captcha/get?' + params,
            method: 'get',
            mock: false,
            // params: 将 params 中所有字段作为查询参数
        });
    },

    // 验证码校验逻辑
    validateCaptcha(params) {
        return request({
            url: '/captcha/validate',
            method: 'post',
            mock: false,
            // params: 将 params 中所有字段作为查询参数
            data: {
                ...params
      },
    });
  },

  // 获取个人信息逻辑
  getUserInfo(params) {
    return request({
        url: '/user/info',
        method: 'get',
        mock: false,
        // params: 将 params 中所有字段作为查询参数
        params: params,
    });
  },

  // 获取个人信息逻辑
  getUserList(params) {
      return request({
          url: '/user/list',
          method: 'post',
          mock: false,
          data: {
              ...params
          },
      });
  },

    // 获取个人信息逻辑
    getUserById(params) {
        return request({
            url: `/user/info/${params}`,
            method: 'get',
            mock: false,
        });
    },

    getAttendanceDataList(params) {
        return request({
            url: '/attendance/getAllAttendance',
            method: 'post',
            mock: false,
            data: {
                ...params
            },
        });
  },

  getAttendanceSelfList(params) {
      return request({
          url: '/attendance/getSelfAttendance',
          method: 'post',
          mock: false,
          data: {
              ...params
          },
      });
  },

  getResource(params) {
    return request({
      url: `file/image/${encodeURIComponent(params)}`,
      method: 'get',
      mock: false,
      responseType: 'blob'
    });

  },

  getResourceAsBase64(params) {
    return request({
      url: `/file/resource/base64/${params}`,
      method: 'get',
      mock: false,
    });
  },

  testToken() {
    return request({
      url: `file/some-endpoint`,
      method: 'get',
      mock: false,
      responseType: 'blob'
    });
  },

    getPersonalReport(params) {
        return request({
            url: `report/list-self`,
            method: 'post',
            mock: false,
            data: {
                ...params
            },
        });
    },

    getRecipientReport(params) {
        return request({
            url: `report/shareReport`,
            method: 'post',
            mock: false,
            data: {
                ...params
            },
        });
    },

    getReportShareUserList(params) {
        return request({
            url: `report/shareReportToUser`,
            method: 'post',
            mock: false,
            data: params
        });
    },

  logout() {
    return request({
      url: `user/logout`,
      method: 'get',
      mock: false,
    })
  },

  getForm(id) {
    return request({
      url: `form/${id}`,
      method: 'get',
      mock: false,
    })
  },

  addFrom(params) {
    return request({
      url: `form/add`,
      method: 'post',
      mock: false,
      data: params
    })
  },

    updateForm(params) {
        return request({
            url: `form/update`,
            method: 'post',
            mock: false,
            data: params
        })
    },

    getFormTemplate(id) {
        return request({
            url: `form/template/${id}`,
            method: 'get',
            mock: false,
        })
    },

    saveUser(params) {
        return request({
            url: `user/save`,
            method: 'post',
            mock: false,
            data: params
        })
    },

    getUeditor(params) {
        return request({
            url: `ueditor?action=` + params,
            method: 'get',
            mock: false
        })
    },

    updateReport(params) {
        return request({
            url: `report/updateReport`,
            method: 'post',
            mock: false,
            data: params
        })
    },

    updateUser(params) {
        return request({
            url: `user/updateUserInfo`,
            method: 'post',
            mock: false,
            data: params
        })
    },

    getShareUserList() {
        return request({
            url: `user/shareUserList`,
            method: 'get',
            mock: false,
        });
    },

    addReport(params) {
        return request({
            url: `report/addReport`,
            method: 'post',
            mock: false,
            data: params
        })
    },

    getAttendanceCount(year, month) {
        return request({
            url: 'attendance/getCountByMonth',
            method: 'get',
            mock: false,
            data: {
                year: year,
                month: month
            }
        })
    },

    deleteReport(reportIds) {
        return request({
            url: '/report/deleteReports',
            method: 'delete',
            mock: false,
            data: reportIds
        })
    },

    updatePassword(oldPassword, newPassword) {
        return request({
            url: `/user/updateSelfPassword?oldPassword=${oldPassword}&newPassword=${newPassword}`,
            method: 'post',
            mock: false,
        })
    },

    getSelfReportCount(year, month) {
        return request({
            url: `/report/getSelfReportCount?year=${year}&month=${month}`,
            method: 'get',
            mock: false,
        })
    },

    exportAllReport() {
        return request({
            url: `/report/downloadExcel`,
            method: 'get',
            mock: false,
            responseType: 'blob',
        })
    },

    exportAttendance(params) {
        return request({
            url: `/attendance/exportAttendance`,
            method: 'get',
            mock: false,
            responseType: 'blob',
            data: params
        })
    },
}