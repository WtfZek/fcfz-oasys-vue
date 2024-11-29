<template>
  <div class="background"> <!-- 添加背景容器 -->
    <el-form :model="formData" :rules="rules" ref="formRef" class="form-container">
      <h3>富辰方舟 OA 系统欢迎您！</h3>
      <h3 v-if="isLogin">请登录</h3>
      <h3 v-else>请注册</h3>

      <el-form-item prop="empNum">
        <el-input
            type="input"
            placeholder="请输入账号"
            v-model="formData.empNum"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
            type="password"
            placeholder="请输入密码"
            v-model="formData.password"
        >
        </el-input>
      </el-form-item>

      <!-- 注册时额外的输入项 -->
      <el-form-item v-if="!isLogin" prop="confirmPassword">
        <el-input
            type="password"
            placeholder="请确认密码"
            v-model="formData.confirmPassword"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="captcha">
        <el-input
            type="input"
            placeholder="请输入验证码"
            v-model="formData.captcha"
            class="captcha-input"
        >
        </el-input>
        <img class="captcha" :src="captchaUrl" alt="验证码" @click="refreshCaptcha"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit"> {{ isLogin ? '登录' : '注册' }} </el-button>
        <el-button type="text" @click="toggleForm"> {{ isLogin ? '去注册' : '去登录' }} </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref } from "vue-demi";
import { getCurrentInstance } from "vue-demi";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const formRef = ref(null); // 用于表单引用
    const formData = reactive({
      empNum: "2424389790",
      password: "123456",
      device: "PC",
      confirmPassword: "", // 注册时需要确认密码
      captcha: "", // 验证码
    });
    const isLogin = ref(true); // 控制当前显示的表单
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const router = useRouter();
    const captchaUrl = ref(""); // 用于存储验证码URL

    const rules = {
      empNum: [
        { required: true, message: "请输入账号", trigger: "blur" },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
      ],
      confirmPassword: [
        {
          required: isLogin.value,
          message: "请确认密码",
          trigger: "blur"
        },
        {
          validator: (rule, value, callback) => {
            if (isLogin.value) {
              callback(); // 登录状态下不校验密码一致性
            } else if (!value) {
              callback(new Error("请二次确认密码"));
            } else if (value !== formData.password) {
              callback(new Error("两次密码输入不一致"));
            } else {
              callback();
            }
          },
          trigger: "blur",
        }
      ],
      captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
    };

    const handleSubmit = async () => {
      // 手动触发校验
      const valid = await formRef.value.validate();
      if (valid) {
        try {
          const captchaResponseData = await proxy.$api.validateCaptcha({
            captcha: formData.captcha,
          });

          if (!captchaResponseData) { // 验证码校验失败
            ElMessage.error("验证码无效，请重新输入。");
            await refreshCaptcha(); // 刷新验证码
            return;
          }

          if (isLogin.value) {
            // 正常登录逻辑
            const loginResponseData = await proxy.$api.login(formData);

            // 假设登录响应中包含 tokenName 和 tokenValue
            const tokenName = loginResponseData.tokenName;
            const tokenValue = loginResponseData.tokenValue;

            // // 将 token 信息存入 localStorage
            // store.commit('setToken', tokenName, tokenValue)

            const res = await proxy.$api.getMenu({
              username: formData.empNum,
              password: formData.password
            });

            store.commit("setMenu", res.menu);
            store.commit("addMenu", router);
            store.commit('setToken', {tokenName, tokenValue});
            await router.push({name: "index"});
            ElMessage.success("登录成功！");
          } else {
            // 注册逻辑
            const res = await proxy.$api.register(formData); // 假设有一个注册的 API
            if (res.success) {
              ElMessage.success("注册成功，请登录！");
              toggleForm(); // 注册成功后切换到登录表单
            } else {
              ElMessage.error(res.message || "注册失败，请重试。");
            }
          }
        } catch (error) {
          // 捕获并处理 API 调用错误
          ElMessage.error(error.message || "操作失败，请重试。");
        }
      } else {
        ElMessage.error("校验失败！");
      }
    };

    const toggleForm = () => {
      isLogin.value = !isLogin.value; // 切换表单
      // 清空输入框
      formData.password = "";
      formData.confirmPassword = "";
    };

    const refreshCaptcha = async () => {
      captchaUrl.value = `api/captcha/get?${new Date().getTime()}`;
      formData.captcha = ""; // 清空验证码输入框
      console.log(captchaUrl)
    };

    // 在组件加载时获取验证码
    refreshCaptcha();

    return {
      formData,
      isLogin, // 返回状态变量
      rules,   // 返回校验规则
      formRef, // 返回表单引用
      captchaUrl,
      handleSubmit,
      toggleForm,
      refreshCaptcha,
    };
  },
};
</script>

<style lang="less" scoped>
.background {
  background: linear-gradient(to bottom, #289eea, #add8e6); /* 从上到下的渐变背景 */
  height: 100vh; /* 让背景覆盖整个视口 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.form-container {
  width: 500px;
  background-color: #eeeeee; /* 保持表单背景为白色 */
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #505450;
}

:deep(.el-form-item__content) {
  justify-content: center;
}

//.captcha-item {
//  display: flex;
//  align-items: center; /* 垂直居中对齐 */
//}

.captcha-input {
  flex: 1; /* 让输入框占据剩余空间 */
  margin-right: 10px; /* 输入框和验证码图片之间的间距 */
}

.captcha {
  height: 40px; /* 统一高度 */
  cursor: pointer;
}
</style>
