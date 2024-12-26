export default {
  getHomeData: () => {
    return {
      code: "200",
      data: {
        tableData: [
          {
            name: "采购",
            todayBuy: 500,
            monthBuy: 3500,
            totalBuy: 22000,
          },
          {
            name: "驻场",
            todayBuy: 300,
            monthBuy: 2200,
            totalBuy: 24000,
          },
          {
            name: "出差",
            todayBuy: 800,
            monthBuy: 4500,
            totalBuy: 65000,
          },
          {
            name: "合同",
            todayBuy: 1200,
            monthBuy: 6500,
            totalBuy: 45000,
          },
          {
            name: "预算",
            todayBuy: 300,
            monthBuy: 2000,
            totalBuy: 34000,
          },
          {
            name: "请假",
            todayBuy: 350,
            monthBuy: 3000,
            totalBuy: 22000,
          },
          // {
          //   name: "锤子",
          //   todayBuy: 351,
          //   monthBuy: 3001,
          //   totalBuy: 22001,
          // },
        ]
      }
    }
  },
  getCountData: () => {
    return {
      code: "200",
      data: {
        countData: [
          {
              name: "本年度打卡", // Clock-in Total Count
              value: 1234,
              icon: "SuccessFilled", // 修改为“Clock”图标
              color: "#2ec7c9",
          },
          {
            name: "提交日志总次数", // Total Logs
            value: 210,
            icon: "Edit", // 修改为“Edit”图标
            color: "#ffb980",
          },
          {
            name: "审批申请数", // Approval Requests
            value: 1234,
            icon: "DocumentChecked", // 修改为“DocumentChecked”图标
            color: "#5ab1ef",
          },
          // {
          //   name: "本月支付订单",
          //   value: 1234,
          //   icon: "SuccessFilled",
          //   color: "#2ec7c9",
          // },
          // {
          //   name: "本月收藏订单",
          //   value: 210,
          //   icon: "StarFilled",
          //   color: "#ffb980",
          // },
          // {
          //   name: "本月未支付订单",
          //   value: 1234,
          //   icon: "GoodsFilled",
          //   color: "#5ab1ef",
          // },
        ],
      }
    }
  },
  getChartData: () => {
    return {
      code: "200",
      data: {
        orderData: {
          "date": ['2024.10.01', '2024.10.02', '2024.10.03', '2024.10.04', '2024.10.05', '2024.10.06', '2024.10.07'],
          "data|7": [
            {
              "采购": "@integer(1000, 5000)",
              "驻场": "@integer(1000, 5000)",
              "出差": "@integer(1000, 5000)",
              "合同": "@integer(1000, 5000)",
              "预算": "@integer(1000, 5000)",
              "请假": "@integer(1000, 5000)",
            }
          ],
        },
        // 饼状图
        videoData: [
          {
            name: '驻场',
            value: 2999
          },
          {
            name: '出差',
            value: 5999
          },
          {
            name: '请假',
            value: 1500
          },
          {
            name: '预算',
            value: 1999
          },
          {
            name: '合同',
            value: 2200
          },
          {
            name: '采购',
            value: 4500
          }
        ],
        // 柱状图
        userData: [
          {
            date: '周一',
            new: 5,
            active: 200
          },
          {
            date: '周二',
            new: 10,
            active: 500
          },
          {
            date: '周三',
            new: 12,
            active: 550
          },
          {
            date: '周四',
            new: 60,
            active: 800
          },
          {
            date: '周五',
            new: 65,
            active: 550
          },
          {
            date: '周六',
            new: 53,
            active: 770
          },
          {
            date: '周日',
            new: 33,
            active: 170
          }
        ],
      }
    }
  },
}