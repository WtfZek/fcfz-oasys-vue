<template>
<!--  <div>-->
    <el-menu-item v-if="!item.children || item.children.length === 0" :index="item.path" :key="item.path" @click="clickMenu(item)">
      <component class="icons" :is="item.icon"></component>
      <span>{{ item.label }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="item.path" :key="item.path">
      <template #title>
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </template>
<!--      <el-menu-item-group>-->
        <aside-menu-item v-for="child in item.children" :key="child.path" :item="child" />
<!--      </el-menu-item-group>-->
    </el-sub-menu>
<!--  </div>-->
</template>

<script>
import { useRoute } from 'vue-router';

import { useStore } from 'vuex'
import router from "../../router/index.js";

export default {
  name: 'AsideMenuItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // 直接使用props，不进行解构
    const route = useRoute();

    const store = useStore();
    const clickMenu = (item) => {
      router.push({
        name: item.name,
      })
      store.commit("selectMenu", item);
    }
    // 返回模板中需要使用的值
    return {
      props,  // 将整个props返回
      route,
      clickMenu,
    };
  },
};
</script>

<style scoped>
.icons {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
</style>
