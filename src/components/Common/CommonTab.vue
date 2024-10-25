<template>
  <div class="tags">
    <el-button style="margin-right: 15px" size="small" closable="true" type="danger" @click="handleCloseAll(tags)">
      关闭所有标签
    </el-button>
    <el-tag
        :key="tag.name"
        v-for="(tag, index) in tags"
        :closable="tag.name !== 'index'"
        :disable-transitions="false"
        :effect="$route.name === tag.name ? 'dark' : 'plain'"
        @click="changeMenu(tag)"
        @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
  <div>
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const tags = store.state.tabsList;
    const changeMenu = (item) => {
      router.push({ name: item.name });
    };
    const handleClose = (tag, index) => {
      let length = tags.length - 1;
      // 处理vuex中的tabslist
      store.commit("closeTab", tag);
      // 做第一个判断
      if (tag.name !== route.name) {
        return;
      }

      if (index === length) {
        router.push({
          name: tags[index - 1].name,
        });
      } else {
        router.push({
          name: tags[index].name,
        });
      }
      // store.commit("selectMenu", tag);
    };
    const handleClearList = (tags) => {
      store.commit("clearTabList", tags);
      router.push({ name: "index" });
    };
    return {
      tags,
      changeMenu,
      handleClose,
      handleCloseAll: handleClearList,
    };
  },
};
</script>

<style lang="less" scoped>
.tags {
  //background-color: #eeeeee;
  padding: 20px;
  width: 100%;

  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }

  .el-tag:hover {
    transform: scale(1.05); /* 悬停时略微放大 */
  }

  .el-button:hover {
    transform: scale(1.05); /* 悬停时略微放大 */
  }
}


</style>