<template>
  <el-aside :style="{ width: $store.state.isCollapse ? '64px' : 'auto', minWidth: $store.state.isCollapse ? '64px' : '180px' }">
    <el-menu
        class="el-menu-vertical-demo"
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        :collapse="$store.state.isCollapse"
        :collapse-transition="false"
        :popper-offset="0"
    >
      <h3 v-show="!$store.state.isCollapse">富辰方舟 OA 系统</h3>
      <h3 v-show="$store.state.isCollapse"> O A </h3>
      <aside-menu-item v-for="item in $store.state.menu" :key="item.path" :item="item" />
    </el-menu>
  </el-aside>
</template>

<script>
import { defineComponent, ref } from 'vue';
import AsideMenuItem from './Menu/AsideMenuItem.vue';

export default defineComponent({
  components: {
    AsideMenuItem,
  },
  setup() {
    const list = ref([]);

    return {
      // list,
    };
  },
});

</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
  h3 {
    line-height: 60px;
    color: #ffd04b;
    text-align: center;
  }
}

</style>说