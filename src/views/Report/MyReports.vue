<template>
  <el-card class="my-card">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" height="100%">
        <el-menu
            active-text-color="#ffd04b"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
        >
          <!--          <el-sub-menu v-for="reportType in reportTypes" :key="reportType.typeName" :index="reportType.typeName">-->
          <!--            <template #title>-->
          <!--              <span>{{ reportType.typeName }}</span>-->
          <!--            </template>-->
          <!--            <el-menu-item v-if="" index="reportType.index1">子项1</el-menu-item>-->
          <!--            <el-menu-item index="reportType.index2">子项2</el-menu-item>-->
          <!--          </el-sub-menu>-->

          <el-menu-item v-for="" index="reportType.index1">子项1</el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主体内容 -->
      <el-container>
        <el-header class="custom-header">日志1</el-header>
        <el-main class="right-main">
          <vue-ueditor-wrap
              v-model="content"
              editor-id="editor"
              :config="editorConfig"
              :editorDependencies="['ueditor.config.js', 'ueditor.all.js']"
          />
        </el-main>
      </el-container>
    </el-container>
  </el-card>

  <div v-if="false">
    <img style="width: 200px" src="http://localhost:5173/res/611400b0-9354-43ed-8bbc-07fed6c04704.png" alt="image.png"/>
    <video controls style="width: 20%;">
      <source src="http://localhost:5173/res/6368f08c-a4c6-40f2-862b-dba9e63a74ca.mp4" type="video/mp4"/>
      您的浏览器不支持 HTML5 视频标签。
    </video>
  </div>
</template>

<script>
import {ref, getCurrentInstance, onMounted} from 'vue';

export default {
  setup() {
    const content = ref('<p><em><span style="color: #A5A5A5;">编辑内容...</span></em></p>');
    const editorConfig = {
      // 后端服务地址，后端处理参考
      serverUrl: 'http://localhost:5173/api/ueditor',
      UEDITOR_HOME_URL: '/static/UEditorPlus/dist-min/',
      UEDITOR_CORS_URL: '/static/UEditorPlus/dist-min/',
      toolbars: [
        [
          "fullscreen",
          "fontfamily",
          "fontsize",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "|",
          "forecolor",
          "backcolor",
          "|",
          "removeformat",
          "formatmatch",
          "autotypeset",
          "|",
          "indent",
          "justifyleft",
          "justifycenter",
          "justifyright",
          "justifyjustify",
          "insertorderedlist",
          "insertunorderedlist",
          "|",
          "undo",
          "redo",
          "|",
          "print",
          "source",
          "preview",
          "searchreplace",
          "help",
          "|",
        ],
        [
          "simpleupload",
          "insertimage",
          "imagenone",
          "imageleft",
          "imageright",
          "imagecenter",
          "|",
          "insertvideo",
          "attachment",
          "insertcode",
          "formula",
          "|",
          "date",
          "time",
          "wordimage",
          "|",
          "inserttable",
          "deletetable",
          "insertparagraphbeforetable",
          "insertrow",
          "deleterow",
          "insertcol",
          "deletecol",
          "mergecells",
          "mergeright",
          "mergedown",
          "splittocells",
          "splittorows",
          "splittocols",
          "contentimport",
          "|",
        ]
      ]
    };

    const reportTypes = ref([
      {typeName: '日报'},
      {typeName: '周报'},
      {typeName: '月报'},
    ]);

    const {proxy} = getCurrentInstance();

    onMounted(() => {
    });

    return {
      content,
      editorConfig,
      reportTypes,
    }
  }
}
</script>

<style lang="less" scoped>
.my-card {
  height: 100%; /* 卡片占满视口高度 */

  //.common-layout {
  //  height: 100%;
  //}

  :deep(.el-card__body) {
    height: 100%; /* 卡片内部内容占满卡片 */
    padding: 0 !important;
    display: flex;
    flex-direction: column; /* 确保布局正确 */
  }
}

/* 主容器布局 */
.el-container {
  height: 100%;
  flex-wrap: nowrap;
}

/* 自定义 Header 居中和样式 */
.custom-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  height: 60px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #dcdfe6;
}

/* 右侧内容区域 */
.right-main {
  flex: 1; /* 占满剩余空间 */
  width: 100%;
  padding: 0;

  :deep(.edui-editor) {
    width: 100% !important;
    height: 100% !important;
  }

  :deep(.edui-editor-iframeholder) {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>