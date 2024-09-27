<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/images/user.png" alt="" />
          <div class="user-info">
            <p class="name">Admin</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间:<span>2022-7-11</span></p>
          <p>上次登录的地点:<span>北京</span></p>
        </div>
      </el-card>
      <el-card shadow="hover" style="margin-top: 20px" height="450px">
        <el-table :data="tableData">
          <el-table-column
              v-for="(val, key) in tableLabel"
              :key="key"
              :prop="key"
              :label="val"
          >
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px" class="right-num">
      <div class="num">
        <el-card
            :body-style="{ display: 'flex', padding: 0 }"
            v-for="item in countData"
            :key="item.name"
        >
          <component
              class="icons"
              :is="item.icon"
              :style="{ background: item.color }"
          ></component>
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card style="height: 280px">
        <div ref="echart" style="height: 280px"></div>
      </el-card>
      <div class="graph">
        <el-card style="height: 260px">
          <div ref="userechart" style="height: 240px"></div>
        </el-card>
        <el-card style="height: 260px">
          <div ref="videoechart" style="height: 240px"></div>
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
// import axios from "axios";
import * as echarts from "echarts";
export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    let tableData = ref([]);
    let countData = ref([]);

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
      countData.value = res.countData;
    };
    onMounted(() => {
      getTableList();
      // 获取count数据
      getCountData();
      // 获取echarts表格数据
      getChartData();

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
      let result = await proxy.$api.getChartData();
      // console.log(result); // 输出结果以便调试

      // 从结果中提取订单数据、用户数据和视频数据
      let orderRes = result.orderData; // 包含折线图的数据
      let userRes = result.userData; // 包含柱状图的数据
      let videoRes = result.videoData; // 包含饼图的数据

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

    return {
      tableData, // 表格显示的数据
      tableLabel, // 表格列的标签
      countData, // 各种指标的计数数据
    };
  },
});
</script>

<style lang="less" scoped>
.home {
  margin-top: -20px;
  .user {
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
      width: 48%;
    }
  }
}
</style>
