<template>
  <el-card class="my-card">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside
          v-infinite-scroll="loadScrollPage"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
          v-if="!isUpdate&&!isCreate"
          width="240px" height="100%"
          style="border-right: 1px solid #dcdfe6;">
        <el-menu
            active-text-color="#337ecc"
            class="el-menu-vertical-demo"
            :default-active="currentActiveIndex.toString()"
        >
          <!--          <el-sub-menu v-for="reportType in reportTypes" :key="reportType.typeName" :index="reportType.typeName">-->
          <!--            <template #title>-->
          <!--              <span>{{ reportType.typeName }}</span>-->
          <!--            </template>-->
          <!--            <el-menu-item v-if="" index="reportType.index1">子项1</el-menu-item>-->
          <!--            <el-menu-item index="reportType.index2">子项2</el-menu-item>-->
          <!--          </el-sub-menu>-->
          <el-menu-item
              v-for="(personalReport, index) in personalReports"
              :key="personalReport.reportId"
              :index="index.toString()"
              @click="handleSelectUpdate(index)"
          >
            <template #title>
              <div class="report-item">
                <span class="report-name">{{ personalReport.reportName }}</span>
                <span class="report-date"
                      :style="{ color: currentReport.reportId === personalReport.reportId ? '#6e94bd' : '#999' }">{{
                    personalReport.reportDate
                  }}</span>
              </div>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主体内容 -->
      <el-container>
        <el-header class="custom-header">
          <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
            <b v-if="!isCreate && !isUpdate" style="font-size: 18px; margin-right: 10px">
              {{ currentReport.reportName }}
            </b>
            <el-form :inline="true" ref="reportForm">
              <el-form-item v-if="isCreate || isUpdate" label="报告标题" prop="reportName" style="margin: 10px">
                <el-input v-model="currentReport.reportName" style="width: 300px;">placeholder="请输入标题"></el-input>
                <el-divider direction="vertical"></el-divider>
              </el-form-item>
              <el-form-item label="报告类型" prop="reportType" style="margin: 10px">
                <el-input :disabled="!isCreate && !isUpdate" v-model="currentReport.type" style="width: 80px;">
                  placeholder="请选择报告类型">
                </el-input>
              </el-form-item>
              <el-form-item label="报告日期" prop="reportDate" style="margin: 10px">
                <!--                <el-input v-model="currentReport.reportDate" style="width: 200px;">placeholder="请选择报告类型"></el-input>-->
                <el-date-picker :disabled="!isCreate && !isUpdate" v-model="currentReport.reportDate" type="date"
                                placeholder="请选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="编辑日期" prop="reportDateTime" style="margin: 10px">
                <el-text>{{
                    formatDateTime(currentReport.upDate ? currentReport.upDate : currentReport.ctDate)
                  }}
                </el-text>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="!isCreate" class="r-content">
            <el-dropdown>
              <span class="el-dropdown-link">

              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click=""></el-dropdown-item>
                  <!--                  这里添加以下搜索功能的表单-->
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="right-main">
          <vue-ueditor-wrap v-if="isUpdate"
                            v-model="currentReport.content"
                            editor-id="editor"
                            :config="editorConfig"
                            :editorDependencies="['ueditor.config.js','ueditor.all.js']"
                            style="height:100%; "/>
          <!--          用v-if强制重新加载或者说渲染，没有办法-->
          <vue-ueditor-wrap v-if="!isUpdate"
                            v-model="currentReport.content"
                            editor-id="readonly_editor"
                            :config="editorConfig"
                            :editorDependencies="['ueditor.config.js','ueditor.all.js']"
                            height="100%"/>
        </el-main>

        <el-footer class="bottom-footer">
          <el-row type="flex" justify="end">
            <img v-for="user in currentReportShareUsers" class="user" :src="user.userImage" alt=""/>
          </el-row>
          <el-row type="flex" justify="end">
            <el-col v-if="!isUpdate">
              <el-button type="warning" @click="handleNewReport">新建</el-button>
              <el-button type="primary" @click="handleToUpdate">编辑</el-button>
              <el-button type="danger" @click="handleDeleteReport">删除</el-button>
            </el-col>
            <el-col v-if="isUpdate || isCreate">
              <el-button type="success" @click="handleSaveUpdate">保存</el-button>
              <el-button type="primary" @click="handleSubmitUpdate">提交</el-button>
              <el-button type="danger" @click="handleCancelUpdate">取消</el-button>
            </el-col>
          </el-row>
        </el-footer>

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
import {ref, reactive, computed, getCurrentInstance, onMounted} from 'vue';
import {formatDateTime} from '@/utils/format';

export default {
  setup() {
    const currentContent = ref('<p><em><span style="color: #A5A5A5;">编辑内容...</span></em></p>');

    const isUpdate = ref(false);

    const isCreate = ref(false);

    const loading = ref(false); // 是否正在加载

    const allLoaded = ref(false); // 是否加载完所有数据

    const dialogVisible = ref(false);

    const currentActiveIndex = ref(0); // 当前选中的菜单项索引

    let toolbarsForUpdate = [
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
    ];

    const currentReportShareUsers = ref([
      {
        "userId": 1,
        "userName": "梁震南",
        "departmentName": "销售部",
        "roleName": "boss",
        "userImage": "1yeWOPS3Kd"
      },
      {
        "userId": 2,
        "userName": "萧璐",
        "departmentName": "人事部",
        "roleName": "admin",
        "userImage": "q8fX9ms3FS"
      },
      {
        "userId": 3,
        "userName": "何子异",
        "departmentName": "综合部",
        "roleName": "admin",
        "userImage": "3StKs8VbER"
      }
    ]);

    const editorConfig = computed(() => ({
      // 后端服务地址，后端处理参考
      serverUrl: 'http://localhost:5173/api/ueditor',
      UEDITOR_HOME_URL: '/static/UEditorPlus/dist-min/',
      UEDITOR_CORS_URL: '/static/UEditorPlus/dist-min/',
      toolbars: isUpdate.value ? toolbarsForUpdate : [],
      readonly: !isUpdate.value,
      wordCount: isUpdate.value, // 默认为 true，表示启用字数统计
    }));

    // const reportTypes = ref([
    //   {typeName: '日报'},
    //   {typeName: '周报'},
    //   {typeName: '月报'},
    // ]);

    const formSearch = reactive({
      reportId: null,
      reportName: null,
      type: null,
      reportDate: null,
      content: null,
      reportUserId: null,
      userName: null,
      departNam: null,
    });
    const pageSearch = reactive({
      pageNum: 2,
      pageSize: 30,
      total: null,
      data: formSearch,
    });

    const personalReports = ref([
      {
        "reportId": 1,
        "reportUserId": 8,
        "reportName": "工作日报",
        "type": "日报",
        "reportDate": "2024-10-17",
        "upDate": null,
        "ctDate": "2024-10-17T01:09:17.000+00:00",
        "filePath": null,
        "content": "<p cid=\"n0\" mdtype=\"paragraph\" class=\"md-focus-p\" style=\"box-sizing: border-box; orphans: 4; margin-block: 1rem; margin-top: 30px; margin-bottom: 0.8em; width: inherit; position: relative; color: rgb(51, 51, 51); font-family: &quot;Open Sans&quot;, &quot;Clear Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; white-space: pre-wrap;\">\r\n    <span class=\"md-line md-end-block md-focus\" cid=\"n2\" mdtype=\"line\" style=\"box-sizing: border-box; display: block;\"><span md-inline=\"plain\" class=\"md-expand\" style=\"box-sizing: border-box;\">上午用前端对接后端获取个人日志的功能接口，下午美化“我的日志”</span></span>\r\n</p>\r\n<ul class=\"ul-list list-paddingleft-2\" cid=\"n3\" mdtype=\"list\" data-mark=\"-\" style=\"box-sizing: border-box; margin-top: 0.8em; margin-bottom: 0.8em; padding-left: 30px; position: relative; color: rgb(51, 51, 51); font-family: &quot;Open Sans&quot;, &quot;Clear Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 16px; white-space: pre-wrap;\">\r\n    <li>\r\n        <p cid=\"n5\" mdtype=\"paragraph\" style=\"box-sizing: border-box; orphans: 4; margin-block: 1rem; margin-top: 0px; margin-bottom: 0.5rem; width: inherit; position: relative;\">\r\n            <span class=\"md-line md-end-block\" cid=\"n6\" mdtype=\"line\" style=\"box-sizing: border-box; display: block;\"><span md-inline=\"plain\" style=\"box-sizing: border-box;\">在前端创建变量接收并处理后端获取到的个人日志数据列表</span></span>\r\n        </p>\r\n    </li>\r\n    <li>\r\n        <p cid=\"n8\" mdtype=\"paragraph\" style=\"box-sizing: border-box; orphans: 4; margin-block: 1rem; margin-top: 0px; margin-bottom: 0.5rem; width: inherit; position: relative;\">\r\n            <span class=\"md-line md-end-block\" cid=\"n9\" mdtype=\"line\" style=\"box-sizing: border-box; display: block;\"><span md-inline=\"plain\" style=\"box-sizing: border-box;\">采用了左侧边展示我的日志简略列表，右侧展示日志内容和编辑内容，头部展示日志标题</span></span>\r\n        </p>\r\n    </li>\r\n    <li>\r\n        <p cid=\"n11\" mdtype=\"paragraph\" style=\"box-sizing: border-box; orphans: 4; margin-block: 1rem; margin-top: 0px; margin-bottom: 0.5rem; width: inherit; position: relative;\">\r\n            <span class=\"md-line md-end-block\" cid=\"n12\" mdtype=\"line\" style=\"box-sizing: border-box; display: block;\"><span md-inline=\"plain\" style=\"box-sizing: border-box;\">初步添加了新增日志，修改日志，和删除与取消修改等功能</span></span>\r\n        </p>\r\n    </li>\r\n    <li>\r\n        <p cid=\"n14\" mdtype=\"paragraph\" style=\"box-sizing: border-box; orphans: 4; margin-block: 1rem; margin-top: 0px; margin-bottom: 0.5rem; width: inherit; position: relative;\">\r\n            <span class=\"md-line md-end-block\" cid=\"n15\" mdtype=\"line\" style=\"box-sizing: border-box; display: block;\"><span md-inline=\"plain\" style=\"box-sizing: border-box;\">日志的增删改尚未完善至提交给后端的部分，今天进展至前端暂存</span></span>\r\n        </p>\r\n    </li>\r\n    <li>\r\n        <p cid=\"n17\" mdtype=\"paragraph\" style=\"box-sizing: border-box; orphans: 4; margin-block: 1rem; margin-top: 0px; margin-bottom: 0.5rem; width: inherit; position: relative;\">\r\n            <span class=\"md-line md-end-block\" cid=\"n18\" mdtype=\"line\" style=\"box-sizing: border-box; display: block;\"><span md-inline=\"plain\" style=\"box-sizing: border-box;\">初步测试了日志的附件的下载功能，在阅读模式下点击即可下载</span></span>\r\n        </p>\r\n    </li>\r\n</ul>\r\n<p>\r\n    <br/>\r\n</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": [
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/75a89e0e-5319-494c-b47a-f412e40f8b44_Vite + Vue 和另外 34 个页面 - 用户配置 1 - Microsoft​ Edge 2024-10-15 11-03-59.mp4",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/4d294298-b9eb-4454-b0d4-8211cd30c817_无标题.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/6368f08c-a4c6-40f2-862b-dba9e63a74ca.mp4",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/972f83d4-8c35-41a7-bfcb-f982386c5473.mp4",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/b46e0371-1774-4265-8333-962677d7bfd1.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/09696339-23d5-4ea9-8a47-13663ac48bd8.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/594524bb-363b-411f-9e0e-fdcb6fa74628.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/611400b0-9354-43ed-8bbc-07fed6c04704.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/45f4e6c8-de2e-4bce-a6bc-cba957994af7.mp4",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/563ecfc6-9cbd-4c13-80c1-3c362dfbef98.mp4",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/ed44e502-c2b9-4411-9cbd-c142c0a60cba.doc",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/22fa04f2-8848-4b80-817c-d343aca7f999.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/b09699e9-6a4d-41c6-afed-e17f51294c42.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/fb1722bf-8e6b-4ade-8904-0e10396269bf.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/96031b23-1e21-4012-9ee2-221a10b61de8.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/1e2a43d1-139e-4870-bf5c-711708460023.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/a6dc4ccc-9911-4649-9b01-c97f3774595e.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/2ea0af97-fc38-4986-a5c0-4945b3ea3a7a.doc",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/dc8b6f55-bcda-47bf-b9c6-4c82097f626a.mp4",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/a0e1d983-074b-4ff7-9387-8bb13ab45993.doc",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/2dca33e2-312f-4310-8392-aba3f22bf844.doc",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/7df19ae8-46cf-4aa7-8239-b9420dc4d6d9.doc",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/1c0dfefc-c7db-4967-9f98-0bfaa97fc03b.doc",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/0a0c136d-9858-48f8-80b5-112a931e0dee.mp4",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/83f71596-8ab1-4f3d-b303-a46143795ff7.mp4",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/62149baf-554a-4a93-a311-5e45279ad9bf.png",
          "https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/e778befe-dffb-493f-9631-857b80dd378b.doc"
        ]
      },
      {
        "reportId": 3,
        "reportUserId": 8,
        "reportName": "培训日报",
        "type": "月报",
        "reportDate": "2024-10-17",
        "upDate": null,
        "ctDate": "2024-10-20T05:00:35.000+00:00",
        "filePath": null,
        "content": "<p>9bjJWMUhN7CBCg67D7h1mBp1XZm8IV</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 4,
        "reportUserId": 8,
        "reportName": "出差周报",
        "type": "月报",
        "reportDate": "2024-10-20",
        "upDate": null,
        "ctDate": "2024-10-01T02:18:21.000+00:00",
        "filePath": null,
        "content": "<p>ITGFjJTEbs3HXoa81wwDIvBbYUmuW2</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 6,
        "reportUserId": 8,
        "reportName": "出差周报",
        "type": "日报",
        "reportDate": "2024-10-26",
        "upDate": null,
        "ctDate": "2024-10-06T04:16:25.000+00:00",
        "filePath": null,
        "content": "<p>eb2AAoYZGV8PwPDxzEnMJ7Xx59bCb1</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 8,
        "reportUserId": 8,
        "reportName": "培训周报",
        "type": "周报",
        "reportDate": "2024-10-02",
        "upDate": null,
        "ctDate": "2024-10-03T01:24:32.000+00:00",
        "filePath": null,
        "content": "<p>yjeTZMpbUEnBYbefQ4mkcKwstynbwr</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 9,
        "reportUserId": 8,
        "reportName": "培训周报",
        "type": "日报",
        "reportDate": "2024-10-23",
        "upDate": null,
        "ctDate": "2024-10-27T04:48:07.000+00:00",
        "filePath": null,
        "content": "<p>y3Eg1ZItJdjmtXuqa1R7gdBuQNT03I</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 10,
        "reportUserId": 8,
        "reportName": "培训月报",
        "type": "周报",
        "reportDate": "2024-10-08",
        "upDate": null,
        "ctDate": "2024-10-22T08:53:06.000+00:00",
        "filePath": null,
        "content": "<p>UG54Y9Aa23UoTV3iXIJNiGk6EMNNKL</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 11,
        "reportUserId": 8,
        "reportName": "出差周报",
        "type": "月报",
        "reportDate": "2024-10-05",
        "upDate": null,
        "ctDate": "2024-10-06T07:24:43.000+00:00",
        "filePath": null,
        "content": "<p>IomBo5G8Avepc1TLR3z3eKLApMfa9W</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 15,
        "reportUserId": 8,
        "reportName": "培训日报",
        "type": "日报",
        "reportDate": "2024-10-26",
        "upDate": null,
        "ctDate": "2024-10-04T07:28:16.000+00:00",
        "filePath": null,
        "content": "<p>wuEjWIryD20YyQxuI2ha7DiD32HLlX</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 18,
        "reportUserId": 8,
        "reportName": "培训月报",
        "type": "月报",
        "reportDate": "2024-10-16",
        "upDate": null,
        "ctDate": "2024-10-11T01:10:00.000+00:00",
        "filePath": null,
        "content": "<p>icw9SvdK6ZmpDyLVhmhXfFElV2EDEM</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 19,
        "reportUserId": 8,
        "reportName": "培训周报",
        "type": "日报",
        "reportDate": "2024-10-27",
        "upDate": null,
        "ctDate": "2024-10-02T03:27:21.000+00:00",
        "filePath": null,
        "content": "<p>rhoLtCd5O9QFccHK8MEfmlAZAh0DSv</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 21,
        "reportUserId": 8,
        "reportName": "出差周报",
        "type": "日报",
        "reportDate": "2024-10-05",
        "upDate": null,
        "ctDate": "2024-10-05T06:59:46.000+00:00",
        "filePath": null,
        "content": "<p>Ay7nTpVJXekfXnFl2Qn9Wy4dhWxSGC</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 22,
        "reportUserId": 8,
        "reportName": "出差周报",
        "type": "周报",
        "reportDate": "2024-10-10",
        "upDate": null,
        "ctDate": "2024-10-06T07:51:09.000+00:00",
        "filePath": null,
        "content": "<p>HOHCDR00GEBstflFycBWNjaVzaRa9X</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 24,
        "reportUserId": 8,
        "reportName": "出差周报",
        "type": "月报",
        "reportDate": "2024-10-07",
        "upDate": null,
        "ctDate": "2024-10-03T02:15:06.000+00:00",
        "filePath": null,
        "content": "<p>ohAjyQv4xUAly6KDXQsw8cz3Mg1zcZ</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 28,
        "reportUserId": 8,
        "reportName": "培训月报",
        "type": "周报",
        "reportDate": "2024-10-28",
        "upDate": null,
        "ctDate": "2024-10-07T04:01:04.000+00:00",
        "filePath": null,
        "content": "<p>W9jJvGFNJu69UJoq81YiFJ8mC52hLN</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 30,
        "reportUserId": 8,
        "reportName": "工作周报",
        "type": "月报",
        "reportDate": "2024-10-01",
        "upDate": null,
        "ctDate": "2024-10-13T02:19:55.000+00:00",
        "filePath": null,
        "content": "<p>qFWXJ1F35M8e2BSeTbuBurJpa15mdh</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 34,
        "reportUserId": 8,
        "reportName": "培训日报",
        "type": "月报",
        "reportDate": "2024-10-13",
        "upDate": null,
        "ctDate": "2024-10-18T02:28:32.000+00:00",
        "filePath": null,
        "content": "<p>1Fw2fp6Qd4qBoXimYaiRzGSBhVmHaV</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 35,
        "reportUserId": 8,
        "reportName": "培训日报",
        "type": "月报",
        "reportDate": "2024-10-06",
        "upDate": null,
        "ctDate": "2024-10-23T03:18:49.000+00:00",
        "filePath": null,
        "content": "<p>3jP367xQEMuwcrq4greTQkzxtbZL9u</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 36,
        "reportUserId": 8,
        "reportName": "培训周报",
        "type": "月报",
        "reportDate": "2024-10-07",
        "upDate": null,
        "ctDate": "2024-10-30T01:05:17.000+00:00",
        "filePath": null,
        "content": "<p>y6Nq0MlAKvFJlaUFGlbZMwRMh1MlZD</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 37,
        "reportUserId": 8,
        "reportName": "工作周报",
        "type": "月报",
        "reportDate": "2024-10-28",
        "upDate": null,
        "ctDate": "2024-10-25T06:42:53.000+00:00",
        "filePath": null,
        "content": "<p>ItlwCYR7V5Nb5onCgEMLhznWLYOI3K</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 38,
        "reportUserId": 8,
        "reportName": "培训周报",
        "type": "周报",
        "reportDate": "2024-10-22",
        "upDate": null,
        "ctDate": "2024-10-07T09:42:02.000+00:00",
        "filePath": null,
        "content": "<p>s9Vi79OcrA1TOHKiAyIaCljOGVAUZ2</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 39,
        "reportUserId": 8,
        "reportName": "培训月报",
        "type": "月报",
        "reportDate": "2024-10-05",
        "upDate": null,
        "ctDate": "2024-10-26T05:03:50.000+00:00",
        "filePath": null,
        "content": "<p>ZiUmU9z45DoiHOYyYr9qy0hazg8oz1</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 40,
        "reportUserId": 8,
        "reportName": "培训月报",
        "type": "日报",
        "reportDate": "2024-10-07",
        "upDate": null,
        "ctDate": "2024-10-23T04:33:16.000+00:00",
        "filePath": null,
        "content": "<p>ftrPtw6oBT4iVuquDpePXfs3AtRhJr</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 41,
        "reportUserId": 8,
        "reportName": "工作日报",
        "type": "月报",
        "reportDate": "2024-10-15",
        "upDate": null,
        "ctDate": "2024-10-06T05:11:34.000+00:00",
        "filePath": null,
        "content": "<p>mHXnxyYLVDjtkub5HzkKP4GjQFERM0</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 43,
        "reportUserId": 8,
        "reportName": "培训周报",
        "type": "日报",
        "reportDate": "2024-10-24",
        "upDate": null,
        "ctDate": "2024-10-29T02:45:47.000+00:00",
        "filePath": null,
        "content": "<p>IFwqmdqb8PYKuOV6aV3P0ta1pkMh5K</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 44,
        "reportUserId": 8,
        "reportName": "出差周报",
        "type": "日报",
        "reportDate": "2024-10-18",
        "upDate": null,
        "ctDate": "2024-10-14T05:57:57.000+00:00",
        "filePath": null,
        "content": "<p>VUaUGWeYaG99STiuuTLy94xTmgWuoK</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 45,
        "reportUserId": 8,
        "reportName": "培训日报",
        "type": "日报",
        "reportDate": "2024-10-28",
        "upDate": null,
        "ctDate": "2024-10-31T03:07:55.000+00:00",
        "filePath": null,
        "content": "<p>CQrtnO3x2ct3Kbe5gl5wGAn71anHp6</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 46,
        "reportUserId": 8,
        "reportName": "培训周报",
        "type": "月报",
        "reportDate": "2024-10-22",
        "upDate": null,
        "ctDate": "2024-10-11T09:36:39.000+00:00",
        "filePath": null,
        "content": "<p>W7f8yiedGMsi2UldUo1xVnJiYVXq7r</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 48,
        "reportUserId": 8,
        "reportName": "工作月报",
        "type": "月报",
        "reportDate": "2024-10-18",
        "upDate": null,
        "ctDate": "2024-10-18T09:22:14.000+00:00",
        "filePath": null,
        "content": "<p>gcpqFe7FXhe99wdq0J52Y4VnVAIi6o</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 49,
        "reportUserId": 8,
        "reportName": "培训日报",
        "type": "周报",
        "reportDate": "2024-10-20",
        "upDate": null,
        "ctDate": "2024-10-09T09:09:07.000+00:00",
        "filePath": null,
        "content": "<p>ttPMzNN6Qg7c2FRipBHF9mA9Mz8etd</p>",
        "shareUserId": "1,7,8",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      }
    ]);

    const createReport = reactive({
      reportId: null,
      reportUserId: null,
      reportName: null,
      type: null,
      reportDate: null,
      upDate: null,
      ctDate: null,
      filePath: null,
      content: null,
      userName: null,
      departName: null,
      fileUrls: null
    });

    const currentReport = computed(() => {
      // 如果不是在新建的情况下，返回当前选中的条目，否则返回空
      if (!isCreate.value) {
        return personalReports.value[currentActiveIndex.value] || null; // 处理越界情况
      } else {
        return createReport;
      }
    });

    const {proxy} = getCurrentInstance();

    const handleCreateReport = () => {
      ElMessageBox.confirm(
          '确认前往新建报告？',
          '新建报告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            // type: 'info',
          }
      ).then(() => {
        ElMessage({
          type: 'success',
          message: '新建成功',
        })

        // 在此处向personalReports.value添加一条数据
        isCreate.value = true;
        isUpdate.value = true;
        console.log(currentReport.value);
      })
          .catch(() => {
            ElMessage({
              type: 'success',
              message: '新建已取消',
            })
          })
    };

    // 编写点击修改时的方法
    const handleToUpdate = () => {
      ElMessageBox.confirm(
          '是否对当前报告进行编辑？',
          '编辑报告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            // type: 'info',
          }
      ).then(() => {

        isUpdate.value = true;
        isCreate.value = false;
      }).catch(() => {
        ElMessage({
          type: 'success',
          message: '编辑已取消',
        })
      })
    };

    const handleSaveUpdate = () => {
      // 提交修改
      ElMessageBox.confirm(
          '是否保存当前报告？',
          '保存报告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            // type: 'info',
          }
      ).then(() => {
        // 执行保存逻辑

        ElMessage({
          type: 'success',
          message: '当前报告已保存',
        })

        console.log(currentReport.value);
        // 重置 currentReport
      }).catch(() => {
        ElMessage({
          type: 'success',
          message: '保存已取消',
        })
      })
    };

    const handleSubmitUpdate = () => {

      // 提交修改
      ElMessageBox.confirm(
          '是否提交当前报告？',
          '提交报告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            // type: 'info',
          }
      ).then(() => {
        // 执行保存逻辑

        ElMessage({
          type: 'success',
          message: '当前报告已提交',
        })

        isUpdate.value = false;
        isCreate.value = false;
        // 重置 currentReport
      }).catch(() => {
        ElMessage({
          type: 'success',
          message: '提交已取消',
        })
      })
    };

    const handleCancelUpdate = () => {
      ElMessageBox.confirm(
          '请确认取消编辑？当前的修改将不被保存',
          '取消编辑',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'error',
          }
      ).then(() => {
        ElMessage({
          type: 'success',
          message: '编辑已取消',
        })

        dialogVisible.value = false; // 关闭弹窗
        isUpdate.value = false;
        isCreate.value = false;
        // 重置 currentReport
      }).catch(() => {
        // ElMessage({
        //   type: 'success',
        //   message: '已取消',
        // })
      })
    };

    const handleDeleteReport = () => {
      ElMessageBox.confirm(
          '请确认删除当前报告？',
          '删除报告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'error',
          }
      ).then(() => {
        // 重新获取一次个人报告

        ElMessage({
          type: 'success',
          message: '报告已删除',
        })

        isUpdate.value = false;
        isCreate.value = false;
        // 重置 currentReport
        currentActiveIndex.value = currentActiveIndex.value > 0 ? currentActiveIndex.value - 1 : 0;
      }).catch(() => {
        ElMessage({
          type: 'success',
          message: '删除已取消',
        })
      })
    };

    // 获取选中的菜单项对应的报告
    const handleSelectUpdate = (index) => {
      console.log(index);
      currentActiveIndex.value = index;
      getReportShareUserList();
    };

    const getReportShareUserList = async () => {
      // 将字符串转换为数组
      let userIds = currentReport.value.shareUserId.split(',').map(Number);

      console.log(userIds);
      // 调用 API，传递数组作为参数
      currentReportShareUsers.value = await proxy.$api.getReportShareUserList([1, 7, 8]);

      console.log(currentReportShareUsers.value);
    }


    // 获取个人日报的请求方法
    const getPersonalReport = async () => {
      let res = await proxy.$api.getPersonalReport(pageSearch);

      // 保持 userDataTest 的数据不变
      pageSearch.total = res.total;
      pageSearch.pageSize = res.size;
      pageSearch.pageNum = res.current;

      // 创建一个新的数据集合，不直接修改返回数据
      return res.records.map((item) => {
        let newItem = {...item}; // 克隆一份数据
        // newItem.timeIn = newItem.ctDate ? formatTime(newItem.ctDate) : '-'; // 格式化创建时间
        // newItem.timeOut = newItem.upDate ? formatTime(newItem.upDate) : '-'; // 格式化创建时间
        return newItem; // 返回新的对象
      });
    };

    // 滚动加载更多数据
    const loadScrollPage = async () => {
      if (loading.value || allLoaded.value) return;

      loading.value = true;
      pageSearch.pageNum += 1;
      console.log("当前加载的页：" + pageSearch.pageNum);

      // 获取新数据并追加到显示列表中
      const newReports = await getPersonalReport();

      if (newReports.length > 0) {
        personalReports.value = [...personalReports.value, ...newReports];
        // ElMessage.success(`成功加载 ${newReports.length} 条新数据`);
      } else {
        allLoaded.value = true; // 标记所有数据已加载完
        ElMessage.warning('所有报告已加载');
      }

      loading.value = false;
    };

    onMounted(async () => {
      // personalReports.value = await getPersonalReport();
    });

    return {
      currentContent,
      editorConfig,
      // reportTypes,
      isUpdate,
      personalReports,
      currentReport,
      isCreate,
      loading,
      allLoaded,
      dialogVisible,
      currentActiveIndex,
      currentReportShareUsers,
      loadScrollPage,
      handleToUpdate,
      handleCancelUpdate,
      handleSelectUpdate,
      handleSubmitUpdate,
      handleSaveUpdate,
      handleNewReport: handleCreateReport,
      handleDeleteReport,
      formatDateTime,
    }
  }
}
</script>

<style lang="less" scoped>
.my-card {
  height: 100%;

  :deep(.el-card__body) {
    height: 100%;
    padding: 0 !important;
    display: flex;
    flex-direction: column;
  }
}

.el-menu {
  border-right: none;
}

.el-container {
  height: 100%;
  flex-wrap: nowrap;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #dcdfe6;
}


.right-main {
  width: 100%;
  height: calc(100% - 230px);
  //height: 100%;
  padding: 0;
  :deep(#editor.edui-default) {
    height: 100% !important;
  }

  :deep(#readonly_editor.edui-default) {
    height: 100% !important;
  }

  :deep(.edui-editor-iframeholder) {
    width: 100% !important;
  }

  :deep(.edui-editor) {
    width: 100% !important;
    height: 100% !important;
  }
}

.bottom-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px; /* 根据需要设置右边距 */
  background-color: #f5f5f5; /* 可选的背景颜色 */
  border-top: 1px solid #dcdfe6; /* 可选的上边框 */
}

.report-item {
  display: flex; /* 使用 Flexbox */
  justify-content: space-between; /* 使内容分布在两边 */
  align-items: center; /* 垂直居中对齐 */
  width: 100%; /* 宽度占满父容器 */
}

.report-name {
  display: block; /* 确保占据整行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出隐藏 */
  text-overflow: ellipsis; /* 溢出文本显示省略号 */
}

.report-date {
  margin-left: 10px; /* 可选的左边距 */
  color: #999; /* 可选的文本颜色 */
  font-size: 12px; /* 可选的字体大小 */
}

.r-content {
  //width: 60px;
}

.user {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

</style>
