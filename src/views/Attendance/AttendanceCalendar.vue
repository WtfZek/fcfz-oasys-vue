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

    <!-- 打卡信息卡片 -->
    <el-card v-if="filteredAttendanceRecords.length > 0" class="punch-info">
      <h3>{{ selectedDateString }} 的打卡记录</h3>
      <div v-for="record in filteredAttendanceRecords" :key="record.attendanceId" class="attendance-record">
        <p><strong>姓名:</strong> {{ record.attendanceUserName }}</p>
        <p><strong>部门:</strong> {{ record.attendanceUserDepartName }}</p>
        <p><strong>打卡时间:</strong> {{ formatTime(record.timeIn) }}</p>
        <p><strong>打卡状态:</strong> {{ record.status }}</p>
        <p><strong>打卡地址:</strong> {{ record.address }}</p>
        <p><strong>打卡类型:</strong> {{ record.type }}</p>
        <el-divider></el-divider>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, computed } from "vue";

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
        attendanceId: 2,
        attendanceUserName: "梁震南",
        attendanceUserDepartName: "销售部",
        timeIn: "2024-08-09T00:19:28.000+00:00",
        timeOut: "2024-08-01T09:05:22.000+00:00",
        date: "2024-08-16",
        status: "打卡成功",
        address: "429 Zhongshan 5th Rd, Zimaling Shangquan",
        type: "上班打卡",
      },
      {
        attendanceId: 4,
        attendanceUserName: "梁震南",
        attendanceUserDepartName: "销售部",
        timeIn: "2024-08-13T00:28:08.000+00:00",
        timeOut: "2024-09-02T09:58:04.000+00:00",
        date: "2024-09-09",
        status: "打卡成功",
        address: "329 Tianbei 1st Rd, Luohu District",
        type: "上班打卡",
      },
      {
        attendanceId: 7,
        attendanceUserName: "梁震南",
        attendanceUserDepartName: "销售部",
        timeIn: "2024-08-09T00:48:14.000+00:00",
        timeOut: "2024-09-18T09:22:24.000+00:00",
        date: "2024-09-19",
        status: "打卡成功",
        address: "845 Sanlitun Road, Chaoyang District",
        type: "上班打卡",
      },
      {
        attendanceId: 13,
        attendanceUserName: "梁震南",
        attendanceUserDepartName: "销售部",
        timeIn: "2024-09-13T00:05:37.000+00:00",
        timeOut: "2024-09-03T09:11:47.000+00:00",
        date: "2024-09-18",
        status: "打卡成功",
        address: "866 Dongtai 5th St",
        type: "上班打卡",
      },
      {
        attendanceId: 21,
        attendanceUserName: "梁震南",
        attendanceUserDepartName: "销售部",
        timeIn: "2024-08-27T00:48:37.000+00:00",
        timeOut: "2024-09-20T09:48:35.000+00:00",
        date: "2024-09-04",
        status: "打卡成功",
        address: "532 FuXingMenNei Street, XiCheng District",
        type: "上班打卡",
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

    return {
      selectedDate,
      punchInfo,
      filteredAttendanceRecords,
      onDateSelect,
      getCellClass,
      isDayChecked,
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

.punch-info {
  margin-top: 20px;
  width: 300px;
}

.punch-info h3 {
  margin-bottom: 10px;
}
</style>
