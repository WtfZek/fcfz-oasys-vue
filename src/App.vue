<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const locale = zhCn
// 这一部分放在 登录页面做了
// import { useStore } from "vuex";
// import { useRouter } from "vue-router";
// const store = useStore();
// const router = useRouter();
// store.commit("addMenu", router);
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<style>
#app {
  height: 100%;
}
</style>
