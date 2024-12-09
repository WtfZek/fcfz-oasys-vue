<template>
  <div class="personal-info">
    <el-card shadow="hover" class="info-card">
      <div class="header">
        <el-avatar :src="userInfoData.userImage" size="large"/>
        <div class="header-info">
          <h3 v-if="userInfoData.sex==='1'||userInfoData.sex==='2'">{{ userInfoData.userName }} -
            {{ userInfoData.sex === "1" ? '男' : '女' }}</h3>
          <h3 v-if="userInfoData.sex===1||userInfoData.sex===2">{{ userInfoData.userName }} -
            {{ userInfoData.sex === 1 ? '男' : '女' }}</h3>
          <h3 v-if="userInfoData.sex==='男'||userInfoData.sex==='女'">{{ userInfoData.userName }} - {{
              userInfoData.sex
            }}</h3>
          <p style="margin-top: 10px">{{ userInfoData.roleName }} - {{ userInfoData.departmentName }}</p>
        </div>
      </div>
      <el-form :model="userInfoData" label-width="120px" class="info-form">
        <el-form-item label="工号">
          <el-input v-model="userInfoData.empNum" :disabled="formDisabled"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userInfoData.telephone" :disabled="formDisabled"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="userInfoData.email" :disabled="formDisabled"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-if="!formDisabled" style="width: 150px" :disabled="formDisabled" v-model="userInfoData.status"
                     placeholder="请选择状态">
            <el-option
                v-for="status in formStatuses"
                :key="status.value"
                :label="status.label"
                :value="status.value"
            />
          </el-select>
          <el-tag v-if="formDisabled"
                  :type="userInfoData.status === 1 ? 'success' : (userInfoData.status === 2 ? 'primary' : 'info')">
            {{ userInfoData.status === 1 ? '在职' : (userInfoData.status === 2 ? '出差' : '离职') }}
          </el-tag>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-input v-model="formattedTimeIn" disabled></el-input> <!-- 使用计算属性 -->
        </el-form-item>
      </el-form>
      <div class="actions">
        <el-button v-if="formDisabled" type="primary" @click="handleEdit">编辑信息</el-button>
        <el-button v-if="!formDisabled" type="success" @click="handleSave">保存</el-button>
        <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {ref, reactive, computed, getCurrentInstance} from 'vue';
import {useRouter} from "vue-router";
import { useStore } from 'vuex'
// import { ElMessage } from 'element-plus';

export default {
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

    const formDisabled = ref(true);

    const formStatuses = ([
      {label: '在职', value: 1},
      {label: '出差', value: 2},
      {label: '离职', value: 0},
    ]);

    const {proxy} = getCurrentInstance();

    const getUserInfo = async () => {
      const userInfoResData = await proxy.$api.getUserInfo();
      Object.assign(userInfoData, userInfoResData);
      console.log(userInfoData.value)
    }

    // 计算属性格式化日期
    const formattedTimeIn = computed(() => {
      const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
      return new Date(userInfoData.timeIn).toLocaleDateString(undefined, options);
    });

    const router = useRouter();

    const store = useStore();

    const handleEdit = () => {
      formDisabled.value = false;
      ElMessage({
        message: '编辑功能未实现',
        type: 'warning',
      });
    };

    const handleSave = () => {
      // 提交修改
      ElMessageBox.confirm(
          '是否保存信息？',
          '保存信息',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            // type: 'info',
          }
      ).then(() => {
        // 执行保存逻辑
        let resData = proxy.$api.updateUser(userInfoData);
        if (resData) {
          ElMessage({
            type: 'success',
            message: '当前信息已保存',
          });
          formDisabled.value = true;
        } else {
        }

        //虚假的保存

        // 重置 currentReport
      }).catch(() => {
        ElMessage({
          type: 'success',
          message: '已取消保存',
        });
      })

    };

    const handleLogout = async () => {
      await proxy.$api.logout();
      store.commit('clearToken');
      store.commit('cleanMenu');

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
      formDisabled,
      formStatuses,
      userInfoData,
      formattedTimeIn, // 使用计算属性
      handleEdit,
      handleSave,
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
