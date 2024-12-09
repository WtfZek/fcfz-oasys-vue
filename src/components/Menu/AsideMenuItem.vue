<template>
  <!-- 最外层菜单项 -->
  <el-menu-item
      v-if="!item.children || item.children.length === 0"
      :index="item.path"
      :key="item.path"
      @click="clickMenu(item)"
  >
    <div class="menu-item-badge">
      <component class="icons" :is="item.icon"></component>
      <!-- 仅最外层菜单根据折叠状态隐藏 -->
      <span v-if="!isRoot || !$store.state.isCollapse">{{ item.label }}</span>
    </div>
  </el-menu-item>

  <!-- 最外层子菜单 -->
  <el-sub-menu v-else :index="item.path" :key="item.path">
    <template #title>
      <div class="menu-item-badge">
        <component class="icons" :is="item.icon"></component>
        <!-- 仅最外层菜单根据折叠状态隐藏 -->
        <span v-if="!isRoot || !$store.state.isCollapse">{{ item.label }}</span>
      </div>
    </template>

    <!-- 子菜单项 -->
    <aside-menu-item
        v-for="(child, index) in item.children"
        :key="`${child.path}-${index}`"
        :item="child"
        :is-root="false"
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
    isRoot: {
      type: Boolean,
      default: true, // 默认是根菜单
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

.menu-item-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  /*z-index: 1;*/
  /*transition: all 0.3s ease-in-out;*/
}

.sub-menu-item-badge {
  /*z-index: 1;*/
  /*transition: all 0.2s ease;*/
}

.sub-menu-item-badge:hover {
  /*transform: scale(1.1) translate3d(0, 0, 0) translateZ(0); !* 只放大高度，不放大宽度 *!;*/
}

.menu-item-badge:hover {
  /*transform: scale(1.1) translate3d(0, 0, 0) translateZ(0); !* 只放大高度，不放大宽度 *!;*/
}
</style>
