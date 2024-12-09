<template>
  <el-header>
    <div class="l-content">
      <el-button type="info" size="small" plain @click="handleCollapse">
        <el-icon :size="15">
          <ArrowLeft v-show="!$store.state.isCollapse" />
          <ArrowRight v-show="$store.state.isCollapse" />
        </el-icon>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <!-- 首页是一定存在的所以直接写死 -->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

        <!--        <el-breadcrumb-item @click="navigateToCurrent" v-if="current"> {{-->
        <el-breadcrumb-item :to="current.path" v-if="current"> {{
            current.label
          }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link" @click="toPersonalInfo">
          <el-avatar class="userImage" :src="userImg" size="default"/>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toPersonalInfo">个人中心</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import {ref, onMounted, computed, defineComponent, getCurrentInstance} from "vue";
import {useRouter} from "vue-router";
import {useStore} from 'vuex'
import defaultAvatar from '@/assets/images/defaultUser.png';

export default defineComponent({
  setup() {
    const getImagSrc = (user) => {
      return new URL(`../assets/images/${user}.png`, import.meta.url).href;
    };

    const router = useRouter();
    const toPersonalInfo = () => {
      router.push({
        name: 'personalInfo'
      })
    };

    const store = useStore();
    const handleCollapse = () => {
      store.commit('updateIsCollapse');
    };

    const current = computed(() => {
      return store.state.currentMenu;
    });

    const userImg = ref(defaultAvatar);

    const {proxy} = getCurrentInstance();

    const getUserImg = async () => {
      let userInfo = await proxy.$api.getUserInfo();
      if (userInfo) {
        console.log('userInfo.userImage', userInfo.userImage)
        userImg.value = userInfo.userImage;
      } else {
        userImg.value = defaultAvatar;
      }
    }

    const logout = async () => {
      await proxy.$api.logout();
      store.commit('clearToken');
      store.commit('cleanMenu');
      await router.push({
        name: 'login'
      })
    };

    onMounted(() => {
      getUserImg();
    })

    return {
      userImg,
      getUserImg,
      getImagSrc,
      toPersonalInfo,
      handleCollapse,
      logout,
      current,
    };
  }
})
</script>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #333;
}

.r-content {
  .userImage {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .userImage:hover {
    transform: scale(1.05); /* 悬停时略微放大 */
  }
}
.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }

  .el-button:hover {
    transform: scale(1.1); /* 悬停时略微放大 */
  }

  h3 {
    color: #fff;
  }
}
// .bread /deep/ span {
//   color: #fff !important;
//   cursor: pointer !important;
// }
:deep(.bread span) { // 样式穿透
  color: #fff !important;
  cursor: pointer !important;
}
</style>
