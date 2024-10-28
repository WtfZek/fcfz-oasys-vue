<template>
  <div class="personal-info">
    <el-card shadow="hover" class="info-card">
      <div class="header">
        <el-avatar :src="userInfoData.userImageUrl" size="large" />
        <div class="header-info">
          <h3>{{ userInfoData.userName }} - {{ userInfoData.sex === "1" ? '男' : '女'}}</h3>
          <p style="margin-top: 10px">{{ userInfoData.roleName }} - {{ userInfoData.departmentName }}</p>
        </div>
      </div>
      <el-form :model="userInfoData" label-width="120px" class="info-form">
        <el-form-item label="工号">
          <el-input v-model="userInfoData.empNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userInfoData.telephone" disabled></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="userInfoData.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-tag :type="userInfoData.status === 0 ? 'success' : 'info'">
            {{ userInfoData.status === 0 ? '在职' : '离职' }}
          </el-tag>
        </el-form-item>
        <el-form-item label="入职时间">
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
import {reactive, computed, getCurrentInstance} from 'vue';
import {useRouter} from "vue-router";
import { useStore } from 'vuex'
// import { ElMessage } from 'element-plus';

export default {
  name: 'PersonalInfo',
  setup() {
    const userInfoData = reactive({
      // "userId": 8,
      // "userName": "小尹",
      // "roleName": "admin",
      // "departmentName": "综合部",
      // "userImage": "sdasdsa",
      // "empNum": "2424389790",
      // "telephone": "15791798943",
      // "email": "231231232",
      // "status": 0,
      // "sex": "0",
      // "birth": "2002-09-14",
      // "timeIn": "2024-09-02T03:07:19.000+00:00",
      // "ctTime": "2024-10-08T03:07:27.000+00:00",
      // "upTime": null
    });

    const { proxy } = getCurrentInstance();

    const getUserInfo = async () => {
      const userInfoResData = await proxy.$api.getUserInfo();
      Object.assign(userInfoData, userInfoResData);
      console.log(userInfoData.value)
    }

    // 计算属性格式化日期
    const formattedCtTime = computed(() => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(userInfoData.timeIn).toLocaleDateString(undefined, options);
    });

    const router = useRouter();

    const store = useStore();

    const handleEdit = () => {
      ElMessage({
        message: '编辑功能未实现',
        type: 'warning',
      });
    };


    const handleLogout = async () => {
      store.commit('clearToken');
      store.commit('cleanMenu');

      await proxy.$api.logout();
      router.push({
        name: 'login'
      })
      // ElMessage({
      //   message: '退出成功',
      //   type: 'success',
      // });
    };

    getUserInfo();

    return {
      userInfoData,
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
