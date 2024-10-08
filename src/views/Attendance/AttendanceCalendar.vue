<template>
  <div class="calendar-page">
    <!-- 日历组件 -->
    <el-card class="calendar-card">
      <el-calendar v-model="selectedDate" @input="onDateSelect">
        <template #date-cell="{ data }">
          <p :class="getCellClass(data.day)">
            {{ data.day.split('-').slice(1).join('-') }}
            {{ isDayChecked(data.day) ? '⭐' : '' }}
          </p>
        </template>
      </el-calendar>
    </el-card>

    <div class="attendance-records-wrapper">
      <!-- 打卡信息卡片 -->
      <el-card v-if="filteredAttendanceRecords.length > 0" v-for="record in filteredAttendanceRecords" :key="record.attendanceId" class="punch-info">
        <h3>{{ selectedDateString }} 的打卡记录</h3>
        <div class="attendance-record">
          <p><strong>签到时间:</strong> {{ formatTime(record.timeIn) }}</p>
          <p><strong>签退时间:</strong> {{ formatTime(record.timeOut) }}</p>
          <p><strong>打卡地址:</strong> {{ record.address }}</p>
          <p><strong>打卡类型:</strong> {{ record.type }}</p>
          <p><strong>打卡状态:</strong> {{ record.status }}</p>
          <el-divider></el-divider>
        </div>
      </el-card>
      <el-card v-if="filteredAttendanceRecords.length <= 0" class="punch-info">
        <h3>{{ selectedDateString }} 的打卡记录</h3>
        <div class="attendance-record">
          <p><strong>今日未打卡</strong></p>
          <el-divider></el-divider>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { formatDate, formatTime } from '@/utils/format';

export default {
  setup() {
    // 当前选中的日期
    const selectedDate = ref(new Date());

    // 模拟打卡信息
    const punchData = {
      "2024-09-01": { time: "08:45 AM", status: "已打卡" },
      "2024-09-02": { time: "09:10 AM", status: "迟到" },
      "2024-09-03": { time: "08:50 AM", status: "已打卡" },
    };

    const attendanceRecords = ref([
      {
        "attendanceId": 2,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-09T00:19:28.000+00:00",
        "timeOut": "2024-08-01T09:05:22.000+00:00",
        "date": "2024-08-16",
        "status": "打卡成功",
        "address": "429 Zhongshan 5th Rd, Zimaling Shangquan",
        "type": "上班打卡"
      },
      {
        "attendanceId": 4,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-13T00:28:08.000+00:00",
        "timeOut": "2024-09-02T09:58:04.000+00:00",
        "date": "2024-09-09",
        "status": "打卡成功",
        "address": "329 Tianbei 1st Rd, Luohu District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 7,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-09T00:48:14.000+00:00",
        "timeOut": "2024-09-18T09:22:24.000+00:00",
        "date": "2024-09-19",
        "status": "打卡成功",
        "address": "845 Sanlitun Road, Chaoyang District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 13,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-13T00:05:37.000+00:00",
        "timeOut": "2024-09-03T09:11:47.000+00:00",
        "date": "2024-09-18",
        "status": "打卡成功",
        "address": "866 Dongtai 5th St",
        "type": "上班打卡"
      },
      {
        "attendanceId": 21,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-27T00:48:37.000+00:00",
        "timeOut": "2024-09-20T09:48:35.000+00:00",
        "date": "2024-09-04",
        "status": "打卡成功",
        "address": "532 FuXingMenNei Street, XiCheng District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 23,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-01T00:41:55.000+00:00",
        "timeOut": "2024-08-15T09:05:57.000+00:00",
        "date": "2024-09-20",
        "status": "打卡成功",
        "address": "131 Hongqiao Rd., Xu Hui District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 26,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-26T00:49:12.000+00:00",
        "timeOut": "2024-08-30T09:50:12.000+00:00",
        "date": "2024-09-20",
        "status": "打卡成功",
        "address": "415 FuXingMenNei Street, XiCheng District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 32,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-09T00:43:01.000+00:00",
        "timeOut": "2024-08-28T09:51:16.000+00:00",
        "date": "2024-09-09",
        "status": "打卡成功",
        "address": "815 Yueliu Rd, Fangshan District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 41,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-19T00:49:24.000+00:00",
        "timeOut": "2024-08-06T09:27:31.000+00:00",
        "date": "2024-08-26",
        "status": "打卡成功",
        "address": "85 Shennan E Rd, Cai Wu Wei, Luohu District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 44,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-04T00:14:35.000+00:00",
        "timeOut": "2024-09-06T09:40:29.000+00:00",
        "date": "2024-09-13",
        "status": "打卡成功",
        "address": "762 68 Qinghe Middle St, Haidian District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 45,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-01T00:11:10.000+00:00",
        "timeOut": "2024-08-30T09:52:49.000+00:00",
        "date": "2024-09-20",
        "status": "打卡成功",
        "address": "443 Huaxia St, Jinghua Shangquan",
        "type": "上班打卡"
      },
      {
        "attendanceId": 50,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-12T00:30:23.000+00:00",
        "timeOut": "2024-09-06T09:02:18.000+00:00",
        "date": "2024-08-30",
        "status": "打卡成功",
        "address": "498 Jiangnan West Road, Haizhu District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 51,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-26T00:15:05.000+00:00",
        "timeOut": "2024-08-29T09:13:08.000+00:00",
        "date": "2024-09-13",
        "status": "打卡成功",
        "address": "421 FuXingMenNei Street, XiCheng District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 54,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-30T00:00:15.000+00:00",
        "timeOut": "2024-08-30T09:40:12.000+00:00",
        "date": "2024-09-20",
        "status": "打卡成功",
        "address": "No. 913, Shuangqing Rd, Chenghua District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 66,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-05T00:05:21.000+00:00",
        "timeOut": "2024-08-30T09:12:48.000+00:00",
        "date": "2024-08-05",
        "status": "打卡成功",
        "address": "544 Jiangnan West Road, Haizhu District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 68,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-03T00:31:06.000+00:00",
        "timeOut": "2024-09-18T09:56:25.000+00:00",
        "date": "2024-09-03",
        "status": "打卡成功",
        "address": "791 Yueliu Rd, Fangshan District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 71,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-08T00:11:12.000+00:00",
        "timeOut": "2024-08-05T09:58:33.000+00:00",
        "date": "2024-08-28",
        "status": "打卡成功",
        "address": "183 Kengmei 15th Alley",
        "type": "上班打卡"
      },
      {
        "attendanceId": 73,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-07T00:55:28.000+00:00",
        "timeOut": "2024-08-05T09:04:33.000+00:00",
        "date": "2024-09-20",
        "status": "打卡成功",
        "address": "676 Zhongshan 5th Rd, Zimaling Shangquan",
        "type": "上班打卡"
      },
      {
        "attendanceId": 79,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-15T00:07:04.000+00:00",
        "timeOut": "2024-09-20T09:00:40.000+00:00",
        "date": "2024-08-12",
        "status": "打卡成功",
        "address": "634 NO.6, YuShuang Road, ChengHua Distric",
        "type": "上班打卡"
      },
      {
        "attendanceId": 81,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-05T00:39:26.000+00:00",
        "timeOut": "2024-09-13T09:55:49.000+00:00",
        "date": "2024-09-06",
        "status": "打卡成功",
        "address": "892 Dong Zhi Men, Dongcheng District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 82,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-04T00:53:59.000+00:00",
        "timeOut": "2024-08-23T09:02:39.000+00:00",
        "date": "2024-09-06",
        "status": "打卡成功",
        "address": "7 East Wangfujing Street, Dongcheng District ",
        "type": "上班打卡"
      },
      {
        "attendanceId": 91,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-13T00:35:14.000+00:00",
        "timeOut": "2024-09-12T09:08:25.000+00:00",
        "date": "2024-09-20",
        "status": "打卡成功",
        "address": "867 2nd Zhongshan Road, Yuexiu District wuwuwuwuwuwuwwwwuwuuw",
        "type": "上班打卡"
      },
      {
        "attendanceId": 99,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-12T00:26:02.000+00:00",
        "timeOut": "2024-08-26T09:34:36.000+00:00",
        "date": "2024-08-30",
        "status": "打卡成功",
        "address": "475 2nd Zhongshan Road, Yuexiu District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 100,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-29T00:40:00.000+00:00",
        "timeOut": "2024-09-18T09:45:09.000+00:00",
        "date": "2024-09-13",
        "status": "打卡成功",
        "address": "734 4th Section  Renmin South Road, Jinjiang District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 105,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-23T00:07:48.000+00:00",
        "timeOut": "2024-08-12T09:54:10.000+00:00",
        "date": "2024-09-23",
        "status": "打卡成功",
        "address": "235 Jianxiang Rd, Pudong",
        "type": "上班打卡"
      },
      {
        "attendanceId": 106,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-13T00:15:48.000+00:00",
        "timeOut": "2024-09-13T09:49:53.000+00:00",
        "date": "2024-09-04",
        "status": "打卡成功",
        "address": "No.836, Dongsan Road, Erxianqiao, Chenghua District",
        "type": "上班打卡"
      },
      {
        "attendanceId": 108,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-08-19T00:50:03.000+00:00",
        "timeOut": "2024-08-30T09:03:34.000+00:00",
        "date": "2024-09-06",
        "status": "打卡成功",
        "address": "765 Jianxiang Rd, Pudong",
        "type": "上班打卡"
      },
      {
        "attendanceId": 110,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-05T00:58:41.000+00:00",
        "timeOut": "2024-08-20T09:58:10.000+00:00",
        "date": "2024-08-07",
        "status": "打卡成功",
        "address": "119 Huanqu South Street 2nd Alley",
        "type": "上班打卡"
      },
      {
        "attendanceId": 111,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-23T00:21:09.000+00:00",
        "timeOut": "2024-08-30T09:16:59.000+00:00",
        "date": "2024-08-15",
        "status": "打卡成功",
        "address": "418 East Wangfujing Street, Dongcheng District ",
        "type": "上班打卡"
      },
      {
        "attendanceId": 112,
        "attendanceUserName": "梁震南",
        "attendanceUserDepartName": "销售部",
        "timeIn": "2024-09-18T00:45:24.000+00:00",
        "timeOut": "2024-08-07T09:56:20.000+00:00",
        "date": "2024-08-26",
        "status": "打卡成功",
        "address": "540 W Ring Rd, Buji Town, Longgang",
        "type": "上班打卡"
      },
    ])

    // 选中的打卡信息
    const punchInfo = ref(null);

    // 过滤考勤记录以仅显示所选日期的记录
    const filteredAttendanceRecords = computed(() => {
      const dateString = formatDate(selectedDate.value);
      return attendanceRecords.value.filter(record => record.date === dateString);
    });

    // 日期选择事件
    const onDateSelect = (date) => {
      const dateString = date.toISOString().split("T")[0];
      punchInfo.value = punchData[dateString] || { time: "未打卡", status: "无记录" };
    };

    // 判断当前日期是否有对应的打卡记录并且打卡成功
    const isDayChecked = (day) => {
      return attendanceRecords.value.some(record =>
          record.date === day && record.status === "打卡成功"
      );
    };

    // 获取单元格的样式类，如果该日期有成功打卡记录则返回对应的类
    const getCellClass = (day) => {
      return isDayChecked(day) ? 'is-checked' : '';
    };

    // const formatDate = (date) => {
    //   const year = date.getFullYear();
    //   const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    //   const day = String(date.getDate()).padStart(2, '0');
    //   return `${year}-${month}-${day}`;
    // };
    //
    // const formatTime = (isoString) => {
    //   const date = new Date(isoString);
    //   const hours = String(date.getHours()).padStart(2, '0');
    //   const minutes = String(date.getMinutes()).padStart(2, '0');
    //   const seconds = String(date.getSeconds()).padStart(2, '0');
    //   return `${hours}:${minutes}:${seconds}`;
    // };


    return {
      selectedDate,
      punchInfo,
      filteredAttendanceRecords,
      onDateSelect,
      getCellClass,
      isDayChecked,
      formatDate,
      formatTime,
      selectedDateString: computed(() => formatDate(selectedDate.value)),
    };
  },
};
</script>

<style scoped>
.el-card {
  background-color: #fafafa;
}
.is-checked {
  color: #0fa60f;
  font-weight: bold;
}

.calendar-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.attendance-records-wrapper {
  display: flex;
  flex-wrap: wrap;            /* 允许换行 */
  justify-content: space-between;  /* 让卡片两端对齐 */
  overflow-x: auto;           /* 当卡片过多时允许横向滚动 */
  max-width: 100%;            /* 限制容器的宽度 */
}

.punch-info {
  margin-top: 20px;
  margin-right: 20px;         /* 卡片之间的间距 */
  /*flex-basis: 30%;            !* 让每个卡片占据一定宽度，保持对齐 *!*/
  min-width: 300px;           /* 保证卡片的最小宽度 */
}

.punch-info h3 {
  margin-bottom: 10px;
}

.attendance-record {

}
</style>



