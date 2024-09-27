<template>
  <div class="personal-info">
    <el-card shadow="hover" class="info-card">
      <div class="header">
        <el-avatar :src="userData.userImageUrl" size="large" />
        <div class="header-info">
          <h3>{{ userData.userName }}</h3>
          <p>{{ userData.roleName }} - {{ userData.departmentName }}</p>
        </div>
      </div>
      <el-form :model="userData" label-width="120px" class="info-form">
        <el-form-item label="工号">
          <el-input v-model="userData.empNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userData.telephone" disabled></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="userData.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-tag :type="userData.status === 0 ? 'success' : 'warning'">
            {{ userData.status === 0 ? '在职' : '离职' }}
          </el-tag>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="formattedCtTime" disabled></el-input> <!-- 使用计算属性 -->
        </el-form-item>
      </el-form>
      <div class="actions">
        <el-button type="primary" @click="handleEdit">编辑信息</el-button>
        <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';
// import { ElMessage } from 'element-plus';

export default {
  name: 'PersonalInfo',
  setup() {
    const userData = reactive({
      userId: 2,
      userName: '萧璐',
      roleName: 'admin',
      departmentName: '人事部',
      userImageUrl: 'https://via.placeholder.com/150', // 默认头像或图片路径
      empNum: '0640707652',
      telephone: '155-6121-6220',
      email: 'luxiao@qq.com',
      status: 0,
      ctTime: '2024-09-10T03:07:21.000+00:00',
    });

    // 计算属性格式化日期
    const formattedCtTime = computed(() => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(userData.ctTime).toLocaleDateString(undefined, options);
    });

    const handleEdit = () => {
      ElMessage({
        message: '编辑功能未实现',
        type: 'warning',
      });
    };

    const handleLogout = () => {
      ElMessage({
        message: '退出成功',
        type: 'success',
      });
    };

    return {
      userData,
      formattedCtTime, // 使用计算属性
      handleEdit,
      handleLogout,
    };
  },
};
</script>

<style lang="less" scoped>
.personal-info {
  //display: flex;
  //justify-content: flex-start; /* 靠左对齐 */
  //align-items: flex-start; /* 靠上对齐 */
}

.info-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px; /* 设置最小高度，使得按钮区位于底部 */
  min-width: 800px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-info {
  margin-left: 20px;
  h3 {
    margin: 0;
    font-size: 1.5em;
    font-weight: bold;
  }
  p {
    margin: 0;
    color: #888;
  }
}

.info-form {
  flex-grow: 1;
  margin-top: 20px;
}

.el-input {
  margin-right: 100px;
}

.actions {
  margin-top: 20px;
  text-align: right;

  /* 让按钮区域始终贴底部 */
  display: flex;
  justify-content: flex-end;
}
</style>
