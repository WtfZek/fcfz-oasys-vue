<template>
  <el-menu-item
      v-if="!item.children || item.children.length === 0"
      :index="item.path"
      :key="item.path"
      @click="clickMenu(item)"
  >
    <component class="icons" :is="item.icon"></component>
    <span>{{ item.label }}</span>
  </el-menu-item>

  <el-sub-menu v-else :index="item.path" :key="item.path">
    <template #title>
      <component class="icons" :is="item.icon"></component>
      <span>{{ item.label }}</span>
    </template>

    <aside-menu-item
        v-for="(child, index) in item.children"
        :key="`${child.path}-${index}`"
        :item="child"
    />
  </el-sub-menu>
</template>

<script>
import {useRoute} from 'vue-router';
import {useStore} from 'vuex';
import router from "../../router/index.js";

export default {
  name: 'AsideMenuItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup({item}) {
    const route = useRoute();
    const store = useStore();

    const clickMenu = (item) => {
      if (!item.name) return;
      router.push({name: item.name}).catch(console.error);
      store.commit("selectMenu", item);
    };

    return {
      item,
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
