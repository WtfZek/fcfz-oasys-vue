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
      <!-- 打卡信息卡片 - 使用表单展示 -->
      <el-form v-if="filteredAttendanceRecords.length > 0" v-for="record in filteredAttendanceRecords" :key="record.attendanceId" class="punch-info">
        <el-card>
          <div class="attendance-record">
            <el-form-item label="签到时间">
<!--              <el-input v-model="record.timeIn" :disabled="true" />-->
              <el-text size="default">{{ record.timeIn }}</el-text>
            </el-form-item>
            <el-form-item label="签退时间">
              <el-text size="default">{{ record.timeOut }}</el-text>
            </el-form-item>
            <el-form-item label="打卡地址">
              <el-text size="default">{{ record.address }}</el-text>
            </el-form-item>
            <el-form-item label="打卡类型">
              <el-text size="default">{{ record.type }}</el-text>
            </el-form-item>
            <el-form-item label="打卡状态">
              <el-tag
                  :type="record.status === '打卡成功' ? 'primary' : 'danger'"
                  disable-transitions
              >{{ record.status }}</el-tag>
            </el-form-item>
            <el-divider></el-divider>
          </div>
        </el-card>
      </el-form>

      <el-card v-if="filteredAttendanceRecords.length <= 0" class="punch-info">
        <div class="attendance-record">
          <p><strong>今日未打卡</strong></p>
          <el-divider></el-divider>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {ref, computed, onMounted, getCurrentInstance} from "vue";
import {formatDate, formatTime} from '@/utils/format';

export default {
  setup() {

    const {proxy} = getCurrentInstance();
    // 当前选中的日期
    const selectedDate = ref(new Date());

    // 模拟打卡信息
    const punchData = ref();

    const userAttendanceRecords = ref([]);

    // 选中的打卡信息
    // const punchInfo = ref(null);

    // 过滤考勤记录以仅显示所选日期的记录
    const filteredAttendanceRecords = computed(() => {
      const dateString = formatDate(selectedDate.value);
      return userAttendanceRecords.value.filter(record => record.date === dateString);
    });

    // 日期选择事件
    // const onDateSelect = (date) => {
    //   const dateString = date.toISOString().split("T")[0];
    //   punchInfo.value = punchData[dateString] || { time: "未打卡", status: "无记录" };
    // };

    // 判断当前日期是否有对应的打卡记录并且打卡成功
    const isDayChecked = (day) => {
      return userAttendanceRecords.value.some(record =>
          record.date === day
      );
    };

    // 获取单元格的样式类，如果该日期有成功打卡记录则返回对应的类
    const getCellClass = (day) => {
      return isDayChecked(day) ? 'is-checked' : '';
    };

    const getAttendanceSelfList = async () => {

      let res = await proxy.$api.getAttendanceSelfList();

      console.log(res.records);

      // 创建一个新的数据集合，不直接修改返回数据
      userAttendanceRecords.value = res.records.map((item) => {
        let newItem = {...item}; // 克隆一份数据
        newItem.timeIn = newItem.timeIn ? formatTime(newItem.timeIn) : '-'; // 格式化创建时间
        newItem.timeOut = newItem.timeOut ? formatTime(newItem.timeOut) : '-'; // 格式化创建时间
        return newItem; // 返回新的对象
      });
    };
    const changePage = (page) => {
      // console.log(page);
      pageSearch.pageNum = page;
      getAttendanceDataList(pageSearch);
    };

    onMounted(() => {
      getAttendanceSelfList();
    });

    return {
      selectedDate,
      // punchInfo,
      filteredAttendanceRecords,
      // onDateSelect,
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
  /*padding: 20px;*/
}

.attendance-records-wrapper {
  display: flex;
  flex-wrap: wrap;            /* 允许换行 */
  justify-content: center;  /* 让卡片两端对齐 */
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



