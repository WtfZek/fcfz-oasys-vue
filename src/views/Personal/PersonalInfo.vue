<template>
  <div class="info-container">

    <div class="personal-info">
      <el-card shadow="hover" class="info-card">
        <div class="header">
          <el-upload
              class="userImage-upload"
              :action="uploadUrl"
              :http-request="customHttpRequest"
              name="file"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="uploadHeaders"
          >
            <img class="userImage" :src="userInfoData.userImage || defaultAvatar" alt=""/>
          </el-upload>
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
          <el-form-item label="姓名">
            <el-input v-model="userInfoData.userName" :disabled="formDisabled"></el-input>
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="userInfoData.empNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="userInfoData.telephone" :disabled="formDisabled"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="userInfoData.email" :disabled="formDisabled"></el-input>
          </el-form-item>
          <el-form-item label="身份证">
            <el-input v-model="userInfoData.birthdayNum" disabled></el-input>
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
          <el-button type="warning" @click="handleToUpdatePassword">更改密码</el-button>
          <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
        </div>
      </el-card>
    </div>
    <div class="update-password" v-if="!updatePasswordFormDisabled">
      <el-card shadow="hover" class="info-card">
        <div class="header">
          <div class="header-info">
            <h3>修改密码</h3>
          </div>
        </div>
        <el-form :model="updatePassword" ref="updatePasswordRef" label-width="120px" class="info-form"
                 style="width: 100%">
          <el-form-item prop="oldPassword" rules="[{ required: true, message: '请输入旧密码', trigger: 'blur' }]" label="旧密码">
            <el-input v-model="updatePassword.oldPassword" :disabled="updatePasswordFormDisabled"></el-input>
          </el-form-item>
          <el-form-item prop="newPassword" rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]" label="新密码">
            <el-input v-model="updatePassword.newPassword" :disabled="updatePasswordFormDisabled"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword"
                        rules="[{ required: true, message: '请再次输入密码', trigger: 'blur' },{ validator: validatePass}]"
                        label="确认密码">
            <el-input v-model="updatePassword.confirmPassword" :disabled="updatePasswordFormDisabled"></el-input>
          </el-form-item>
          <div class="actions">
            <el-button type="success" @click="handleSaveUpdatePass">提交</el-button>
            <el-button type="danger" @click="handleUpdatePasswordCancel">关闭</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import {ref, reactive, computed, getCurrentInstance} from 'vue';
import {useRouter} from "vue-router";
import {useStore} from 'vuex'
import defaultAvatar from '@/assets/images/defaultUser.png';
import store from "@/store";

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

    const updatePasswordFormDisabled = ref(true);

    const updatePasswordRef = reactive({});

    const formDisabled = ref(true);

    const uploadUrl = "http://8.129.26.229/api/user/updateAvatar";

    const getToken = () => {
      const token = localStorage.getItem('tokenValue');
      if (token) {
        // 这里可以添加 token 格式验证和过期检查逻辑
        console.log("token", token)
        return token;
      }
      console.log("token", token)
      return ''; // 返回空字符串作为默认值
    };

    const uploadHeaders = reactive({
      "satoken": getToken(), // uuid 形式,  // 这里设置上传接口需要的认证头信息
    });

    const updatePassword = reactive({
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,
    });

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
      ).then(async () => {
        // 执行保存逻辑
        userInfoData.birthdayNum = null;
        let resData = await proxy.$api.updateUser(userInfoData);
        if (resData) {
          await getUserInfo();
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
        formDisabled.value = true;
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

    const handleImageError = (event) => {
      event.target.src = defaultAvatar; // 本地默认图片路径
    };

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== updatePassword.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    const handleSaveUpdatePass = async () => {
      // 校验
      proxy.$refs.updatePasswordRef.validate(async (valid) => {
        if (valid) {
          if (updatePassword.newPassword === updatePassword.confirmPassword) {
            try {
              await proxy.$api.updatePassword(updatePassword.oldPassword, updatePassword.newPassword);
              ElMessage({
                showClose: true,
                message: "密码修改成功",
                type: "success",
              });
              updatePassword.oldPassword = null;
              updatePassword.newPassword = null;
              updatePassword.confirmPassword = null;
              updatePasswordFormDisabled.value = true;
            } catch (error) {
              ElMessage({
                showClose: true,
                message: "密码修改失败",
                type: "error",
              });
            }
          } else {
            ElMessage({
              showClose: true,
              message: "两次输入密码不一致",
              type: "error",
            });
          }

        } else {
          ElMessage({
            showClose: true,
            message: "请输入正确的内容",
            type: "error",
          });
        }
      });
    };

    const handleUpdatePasswordCancel = () => {
      updatePassword.oldPassword = null;
      updatePassword.newPassword = null;
      updatePassword.confirmPassword = null;
      updatePasswordFormDisabled.value = true;
    };

    const handleToUpdatePassword = () => {
      if (updatePasswordFormDisabled) {
        updatePasswordFormDisabled.value = false;
      } else if (!updatePasswordFormDisabled) {
        handleUpdatePasswordCancel();
      }
    }

    const uploadAvatar = () => {

    }

    const handleAvatarSuccess = (response, file) => {
      // 上传成功的回调
      console.log("上传成功", response);
      getUserInfo();
    };

    const beforeAvatarUpload = (file) => {
      console.log("file:" + file);
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 或者 PNG 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过 5MB!");
      }
      return isJPG && isLt5M;
    };

    const customHttpRequest = ({file, onProgress, onSuccess, onError}) => {
      const formData = new FormData();
      formData.append('file', file);
      const xhr = new XMLHttpRequest();

      // 设置上传进度监听
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          onProgress({percent: (event.loaded / event.total) * 100}, file);
        }
      });

      // 设置上传完成后的处理
      xhr.onload = () => {
        if (xhr.status === 200) {
          onSuccess(xhr.responseText, file);
        } else {
          onError(new Error('上传失败'));
        }
      };

      // 设置上传失败后的处理
      xhr.onerror = () => {
        onError(new Error('上传失败'));
      };

      // 发送请求
      xhr.open('POST', uploadUrl, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');  // 设置自定义请求头
      let token = getToken();
      xhr.setRequestHeader('Satoken', token);
      xhr.send(formData);
    }

    getUserInfo();

    return {
      formDisabled,
      formStatuses,
      userInfoData,
      formattedTimeIn, // 使用计算属性
      defaultAvatar,
      updatePassword,
      uploadUrl,
      uploadHeaders,
      handleImageError,
      handleEdit,
      handleSave,
      handleLogout,
      updatePasswordRef,
      updatePasswordFormDisabled,
      validatePass,
      handleSaveUpdatePass,
      handleUpdatePasswordCancel,
      handleToUpdatePassword,
      handleAvatarSuccess,
      beforeAvatarUpload,
      customHttpRequest,
    };
  },
};
</script>

<style lang="less" scoped>
.info-container {
  height: 100%;
}
.personal-info {
  margin-bottom: 20px;
  //display: flex;
  //justify-content: flex-start; /* 靠左对齐 */
  //align-items: flex-start; /* 靠上对齐 */
}
.update-password {

  margin-bottom: 20px;
}

.info-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 300px; /* 设置最小高度，使得按钮区位于底部 */
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

.userImage {
  display: flex;
  align-items: center;
  //padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
  //margin-bottom: 20px;

  width: 60px;
  height: 60px;
  border-radius: 50%;

}
</style>
