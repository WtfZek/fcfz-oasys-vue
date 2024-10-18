<template>
  <div class="container">
    <vue-ueditor-wrap v-model="content"
                      editor-id="editor"
                      :config="editorConfig"
                      :editorDependencies="['ueditor.config.js','ueditor.all.js']"
                      style="height:500px; "/>
  </div>
  <div>
    <img style="width: 200px" src="http://localhost:8088/file/image/20" alt="image.png"/>
    <img style="width: 200px" :src="imageUrl" alt="image21.png"/>
  </div>

  <div>
    <video v-if="videoUrl" controls style="width: 100%;">
      <source :src="videoUrl" type="video/mp4"/>
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
      // https://open-doc.modstart.com/ueditor-plus/backend.html
      serverUrl: 'api/ueditor',
      UEDITOR_HOME_URL: '/static/UEditorPlus/dist-min/',
      UEDITOR_CORS_URL: '/static/UEditorPlus/dist-min/',


      toolbars: [
        [
          "fullscreen",

          "fontfamily",
          "fontsize",
          "|",
          "bold",         // 加粗
          "italic",       // 斜体
          "underline",    // 下划线
          "strikethrough",// 删除线
          "|",
          "forecolor",    // 字体颜色
          "backcolor",    // 背景色
          "|",
          "removeformat", // 清除格式
          "formatmatch",  // 格式刷
          "autotypeset",  // 自动排版
          "|",
          "indent",
          "justifyleft",
          "justifycenter",
          "justifyright",
          "justifyjustify",
          "insertorderedlist",   // 有序列表
          "insertunorderedlist", // 无序列表
          "|",
          "undo",         // 撤销
          "redo",         // 重做
          "|",
          "print",               // 打印
          "source",              // 查看源代码
          "preview",             // 预览
          "searchreplace",       // 查询替换
          "help",                // 帮助
          "|",
        ],
        [
          "simpleupload",        // 单图上传
          "insertimage",         // 多图上传
          "imagenone",           // 图片默认
          "imageleft",           // 图片左浮动
          "imageright",          // 图片右浮动
          "imagecenter",         // 图片居中
          "|",
          "insertvideo",         // 视频
          "attachment",          // 附件
          "insertcode",          // 插入代码
          "formula",             // 公式
          "|",
          // "horizontal",          // 分隔线
          "date",                // 日期
          "time",                // 时间
          // "spechars",            // 特殊字符
          "wordimage",           // Word图片转存
          "|",
          "inserttable",         // 插入表格
          "deletetable",         // 删除表格
          "insertparagraphbeforetable",     // 表格前插入行
          "insertrow",           // 前插入行
          "deleterow",           // 删除行
          "insertcol",           // 前插入列
          "deletecol",           // 删除列
          "mergecells",          // 合并多个单元格
          "mergeright",          // 右合并单元格
          "mergedown",           // 下合并单元格
          "splittocells",        // 完全拆分单元格
          "splittorows",         // 拆分成行
          "splittocols",         // 拆分成列
          "contentimport",       // 内容导入（支持Word、Markdown）
          "|",
        ]
      ]
    }

    const imageUrl = ref('')
    const videoUrl = ref('')

    const {proxy} = getCurrentInstance();

    const imageSrc = async (fileName) => {
      let res = await proxy.$api.getResourceAsBase64(fileName);
      imageUrl.value = `data:image/png;base64,${res}`;
      // 请完善此处代码
      console.log(res)

    }

    const videoSrc = async (fileName) => {
      let res = await proxy.$api.getResourceAsBase64(fileName);
      videoUrl.value = `data:image/png;base64,${res}`;
      // 请完善此处代码
      console.log(res)

    }

    onMounted(() => {
      imageSrc("f6b82cff-4765-4c4e-9715-1d042f2b581d.png")
      videoSrc("Vite124231541545123452.mp4")
    })

    return {
      content,
      editorConfig,
      imageUrl,
      videoUrl,
      imageSrc,
      videoSrc,
    }
  }
}

</script>

<style lang="less" scoped>
.container {
  width: 100%;

  :deep(.edui-editor) {
    width: 100% !important;
  }

  :deep(.edui-editor-iframeholder) {
    width: 100% !important;
  }
}
</style>