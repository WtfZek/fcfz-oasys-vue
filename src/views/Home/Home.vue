<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="userImage">
          <img :src="userImg || defaultAvatar" @error="handleImageError" alt=""/>
          <div class="user-info">
            <p class="name">{{ userName }} - {{ userDepart }}</p>
            <!--            <p class="role">管理员</p>-->
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间:<span>{{ previousDate }}</span></p>
          <p>上次登录的地点:<span>湖北 - 武汉</span></p>
          <!--          加一个淡暗红色字备注数据不真实-->
          <p style="color: rgba(255,0,0,0.68)">注：数据仅供参考</p>
        </div>
      </el-card>
      <el-card shadow="hover" style="margin-top: 20px; ">
        <!--        <el-table :data="tableData">-->
        <!--          <el-table-column-->
        <!--              v-for="(val, key) in tableLabel"-->
        <!--              :key="key"-->
        <!--              :prop="key"-->
        <!--              :label="val"-->
        <!--          >-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->
        <!--        <ChristmasTree />-->

      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px" class="right-num">
      <div class="num">
        <el-card
            :body-style="{ display: 'flex', padding: 0 }"
            v-for="item in countData"
            :key="item.name"
            shadow="hover"
        >
          <component
              class="icons"
              :is="item.icon"
              :style="{ background: item.color }"
          ></component>
          <div class="detail">
            <p class="num">{{ item.value }} 次</p>
            <p v-if="item.name" class="txt">{{ item.name }}</p>
            <!--          加一个淡暗红色字备注数据不真实-->
            <p v-if="item.name==='审批申请数'" class="txt" style="color: rgba(255,0,0,0.68)">注：数据仅供参考</p>
          </div>
        </el-card>
      </div>
      <el-card style="height: 280px" shadow="hover">
        <p class="txt" style="color: rgba(255,0,0,0.68)">注：数据仅供参考</p>
        <div ref="echart" style="height: 280px;"></div>
        <!--          加一个淡暗红色字备注数据不真实-->
      </el-card>
      <div class="graph">
        <el-card style="height: 280px" shadow="hover">
          <p class="txt" style="color: rgba(255,0,0,0.68)">注：数据仅供参考</p>
          <div ref="userechart" style="height: 240px"></div>
          <!--          加一个淡暗红色字备注数据不真实-->
        </el-card>
        <el-card style="height: 280px" shadow="hover">
          <p class="txt" style="color: rgba(255,0,0,0.68)">注：数据仅供参考</p>
          <div ref="videoechart" style="height: 240px"></div>
          <!--          加一个淡暗红色字备注数据不真实-->
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
} from "vue";

import {useRouter} from "vue-router";
import defaultAvatar from '@/assets/images/defaultUser.png';
import ChristmasTree from '@/views/ChristmasTree.vue'

// import axios from "axios";
import * as echarts from "echarts";

export default defineComponent({
  components: {
    ChristmasTree,
  },
  setup() {
    const router = useRouter();
    const {proxy} = getCurrentInstance();
    let tableData = ref([]);
    let countData = ref([
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
    ]);

    let previousDate = ref(""); // 新增的响应式属性

    const userImg = ref(defaultAvatar);

    const userDepart = ref("");

    const userName = ref("");

    const userRole = ref("");

    const tableLabel = {
      name: "课程",
      todayBuy: "今日购买",
      monthBuy: "本月购买",
      totalBuy: "总购买",
    };
    const getTableList = async () => {
      let res = await proxy.$api.getTableData();
      tableData.value = res.tableData;
      // await axios.get("/home/getData").then((res) => {
      //   if(res.data.code == 200) {
      //     tableData.value = res.data.data.tableData;
      //   }
      //   console.log(res);
      // })
    };
    // 获取首页count数据
    const getCountData = async () => {
      let res = await proxy.$api.getCountData();
      // let reportRes = await proxy.$api.getReportCount();
      // countData.value = res.countData;
    };

    const getAttendanceCountData = async () => {
      // 传入第一个参数是今年年份的整数，第二个参数是本月月份的整数
      let attendanceRes = await proxy.$api.getAttendanceCount(new Date().getFullYear(), 0);
      let reportRes = await proxy.$api.getSelfReportCount(new Date().getFullYear(), 0);
      // 获取数组countData.value的第一个元素
      countData.value[0].value = attendanceRes.success + attendanceRes.fail;
      countData.value[0].name = countData.value[0].name + "（包含打卡失败 " + attendanceRes.fail + " 次）";
      countData.value[1].value = reportRes.daily + reportRes.weekly + reportRes.monthly;
    };

    onMounted(async () => {
      await getYesterdayDate();
      // 调用获取前一天日期的函数
      // await getTableList();
      // 获取count数据
      // await getCountData();
      await getAttendanceCountData();
      // 获取echarts表格数据
      // await getChartData();
    });

    // 关于 echarts 表格的渲染部分
    let xOptions = reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      grid: {
        left: "20%",
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
    });
    // 关于 echarts 的饼状图
    let pieOptions = reactive({
      tooltip: {
        trigger: "item",
      },
      color: [
        "#0f78f4",
        "#dd536b",
        "#9462e5",
        "#a6a6a6",
        "#e1bb22",
        "#39c362",
        "#3ed1cf",
      ],
      series: [],
    });
    let orderData = reactive({
      xData: [],
      series: [],
    });
    let userData = reactive({
      xData: [],
      series: [],
    });
    let videoData = reactive({
      series: [],
    });

    // 获取数据
    const getChartData = async () => {
      // 异步从 API 获取图表数据
      // let result = await proxy.$api.getChartData();
      // console.log(result); // 输出结果以便调试

      // 从结果中提取订单数据、用户数据和视频数据
      // let orderRes = result.orderData; // 包含折线图的数据
      // let userRes = result.userData; // 包含柱状图的数据
      // let videoRes = result.videoData; // 包含饼图的数据

      const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

      let orderRes = {
        date: ['2024.10.01', '2024.10.02', '2024.10.03', '2024.10.04', '2024.10.05', '2024.10.06', '2024.10.07'],
        data: [
          {
            "采购": getRandomInt(1000, 5000),
            "驻场": getRandomInt(1000, 5000),
            "出差": getRandomInt(1000, 5000),
            "合同": getRandomInt(1000, 5000),
            "预算": getRandomInt(1000, 5000),
            "请假": getRandomInt(1000, 5000),
          },
          {
            "采购": getRandomInt(1000, 5000),
            "驻场": getRandomInt(1000, 5000),
            "出差": getRandomInt(1000, 5000),
            "合同": getRandomInt(1000, 5000),
            "预算": getRandomInt(1000, 5000),
            "请假": getRandomInt(1000, 5000),
          },
          {
            "采购": getRandomInt(1000, 5000),
            "驻场": getRandomInt(1000, 5000),
            "出差": getRandomInt(1000, 5000),
            "合同": getRandomInt(1000, 5000),
            "预算": getRandomInt(1000, 5000),
            "请假": getRandomInt(1000, 5000),
          },
          {
            "采购": getRandomInt(1000, 5000),
            "驻场": getRandomInt(1000, 5000),
            "出差": getRandomInt(1000, 5000),
            "合同": getRandomInt(1000, 5000),
            "预算": getRandomInt(1000, 5000),
            "请假": getRandomInt(1000, 5000),
          },
          {
            "采购": getRandomInt(1000, 5000),
            "驻场": getRandomInt(1000, 5000),
            "出差": getRandomInt(1000, 5000),
            "合同": getRandomInt(1000, 5000),
            "预算": getRandomInt(1000, 5000),
            "请假": getRandomInt(1000, 5000),
          },
          {
            "采购": getRandomInt(1000, 5000),
            "驻场": getRandomInt(1000, 5000),
            "出差": getRandomInt(1000, 5000),
            "合同": getRandomInt(1000, 5000),
            "预算": getRandomInt(1000, 5000),
            "请假": getRandomInt(1000, 5000),
          },
          {
            "采购": getRandomInt(1000, 5000),
            "驻场": getRandomInt(1000, 5000),
            "出差": getRandomInt(1000, 5000),
            "合同": getRandomInt(1000, 5000),
            "预算": getRandomInt(1000, 5000),
            "请假": getRandomInt(1000, 5000),
          }
        ],
      }; // 包含折线图的数据
      let userRes = [
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
      ]; // 包含柱状图的数据
      let videoRes = [
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
      ]; // 包含饼图的数据

      console.log("orderRes, userRes, videoRes", orderRes, userRes, videoRes)

      // 准备折线图的 x 轴数据
      orderData.xData = orderRes.date; // 设置 x 轴日期数据
      const keyArray = Object.keys(orderRes.data[0]); // 从第一个数据项中提取键
      const series = []; // 初始化一个数组以保存系列数据

      // 遍历每个键以准备折线图的系列数据
      keyArray.forEach((key) => {
        series.push({
          name: key, // 设置系列名称为当前键
          data: orderRes.data.map((item) => item[key]), // 提取该系列的数据
          type: "line", // 指定该系列为折线图类型
        });
      });

      // 将准备好的系列数据赋值给 orderData
      orderData.series = series;
      xOptions.xAxis.data = orderData.xData; // 设置图表选项中的 x 轴数据
      xOptions.series = orderData.series; // 设置图表选项中的系列数据

      // 使用 ECharts 渲染折线图
      let hEcharts = echarts.init(proxy.$refs["echart"]); // 在引用的元素上初始化图表
      hEcharts.setOption(xOptions); // 设置图表选项以渲染图表

      // 准备柱状图的数据
      userData.xData = userRes.map((item) => item.date); // 映射日期以作为 x 轴数据，map 里面是循环遍历
      userData.series = [ // 创建柱状图的系列
        {
          name: "新增用户", // 第一个系列的名称
          data: userRes.map((item) => item.new), // 新增用户的数据
          type: "bar", // 指定该系列为柱状图类型
        },
        {
          name: "活跃用户", // 第二个系列的名称
          data: userRes.map((item) => item.active), // 活跃用户的数据
          type: "bar", // 指定该系列为柱状图类型
        },
      ];

      // 更新用户图表的 x 轴和系列数据
      xOptions.xAxis.data = userData.xData; // 设置用户图表的 x 轴数据
      xOptions.series = userData.series; // 设置用户图表的系列数据

      // 渲染用户柱状图
      let uEcharts = echarts.init(proxy.$refs["userechart"]); // 初始化用户图表
      uEcharts.setOption(xOptions); // 设置图表选项以渲染用户图表

      // 准备饼图的数据
      videoData.series = [ // 创建饼图的系列
        {
          data: videoRes, // 设置饼图的数据
          type: "pie", // 指定该系列为饼图类型
        },
      ];

      // 更新饼图选项的系列数据
      pieOptions.series = videoData.series;

      // 渲染饼图
      let vEcharts = echarts.init(proxy.$refs["videoechart"]); // 初始化视频图表
      vEcharts.setOption(pieOptions); // 设置图表选项以渲染饼图
    };

    const getYesterdayDate = () => {
      const today = new Date();
      today.setDate(today.getDate() - 1); // 设置日期为前一天
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      previousDate.value = today.toLocaleDateString('zh-CN', options).replace(/\//g, '-'); // 格式化日期
    };

    const toPersonalInfo = () => {
      router.push({
        name: 'personalInfo'
      })
    };

    const getUserImg = async () => {
      let userInfo = await proxy.$api.getUserInfo();
      if (userInfo) {
        console.log('userInfo.userImage', userInfo.userImage)
        userImg.value = userInfo.userImage;
        userDepart.value = userInfo.departmentName;
        userName.value = userInfo.userName;
        userRole.value = userInfo.roleName;
      } else {
        userImg.value = defaultAvatar;
      }
    }

    const handleImageError = (event) => {
      event.target.src = defaultAvatar; // 本地默认图片路径
    };

    onMounted(() => {
      getChartData();
      getYesterdayDate();
      getUserImg();
    });

    return {
      tableData, // 表格显示的数据
      tableLabel, // 表格列的标签
      countData, // 各种指标的计数数据
      previousDate, // 返回前一天的日期
      userImg,
      userDepart,
      userName,
      defaultAvatar,
      handleImageError,
      toPersonalInfo,
    };
  },
});
</script>

<style lang="less" scoped>
.home {
  margin-top: -20px;
  height: calc(100% + 10px);
  min-width: 1200px;

  .userImage {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
  }

  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;

      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }

  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }

    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }

    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .num {
        font-size: 30px;
        margin-bottom: 10px;
      }

      .txt {
        font-size: 14px;
        text-align: center;
        color: #999;
      }
    }
  }

  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .el-card {
      width: 49%;
    }
  }

  .el-card {
    z-index: 1;
    transition: transform 0.3s ease; /* 添加动画效果，使放大平滑 */
  }

  .el-card:hover {
    transform: scale(1.015) translate3d(0, 0, 0) translateZ(0); /* 只放大高度，不放大宽度 */;
  }
}
</style>
