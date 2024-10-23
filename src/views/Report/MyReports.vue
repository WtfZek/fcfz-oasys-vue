<template>
  <el-card class="my-card">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside v-if="!isUpdate&&!isCreate" width="240px" height="100%" style="border-right: 1px solid #dcdfe6;">
        <el-menu
            active-text-color="#337ecc"
            class="el-menu-vertical-demo"
            :default-active="'0'"
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
          <div v-if="!isCreate" style="width: 100%; display: flex; justify-content: center; align-items: center;">
            <el-text tag="b" size="large">
              {{ currentReport.reportName }}
            </el-text>
          </div>
          <div v-if="isCreate">
            <el-form :inline="true" ref="reportForm">
              <el-form-item label="标题" prop="reportName" style="margin: 0">
                <el-input v-model="currentReport.reportName" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-divider></el-divider>
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
            <el-col v-if="!isUpdate">
              <el-button type="warning" @click="handleNewReport">新建</el-button>
              <el-button type="primary" @click="handleToUpdate">编辑</el-button>
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
import {ref, watch, computed, getCurrentInstance, onMounted} from 'vue';

export default {
  setup() {
    const currentContent = ref('<p><em><span style="color: #A5A5A5;">编辑内容...</span></em></p>');

    const isUpdate = ref(false);

    const isCreate = ref(false);

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

    const editorConfig = computed(() => ({
      // 后端服务地址，后端处理参考
      serverUrl: 'http://localhost:5173/api/ueditor',
      UEDITOR_HOME_URL: '/static/UEditorPlus/dist-min/',
      UEDITOR_CORS_URL: '/static/UEditorPlus/dist-min/',
      toolbars: isUpdate.value ? toolbarsForUpdate : [],
      readonly: !isUpdate.value,
      wordCount: isUpdate.value, // 默认为 true，表示启用字数统计
    }));

    const reportTypes = ref([
      {typeName: '日报'},
      {typeName: '周报'},
      {typeName: '月报'},
    ]);

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
        "content": "<p>工作日报测试</p>",
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": [
          "75a89e0e-5319-494c-b47a-f412e40f8b44video/mp4",
          "4d294298-b9eb-4454-b0d4-8211cd30c817image/png",
          "6368f08c-a4c6-40f2-862b-dba9e63a74cavideo/mp4",
          "972f83d4-8c35-41a7-bfcb-f982386c5473video/mp4",
          "b46e0371-1774-4265-8333-962677d7bfd1image/png",
          "09696339-23d5-4ea9-8a47-13663ac48bd8image/png",
          "594524bb-363b-411f-9e0e-fdcb6fa74628image/png",
          "611400b0-9354-43ed-8bbc-07fed6c04704image/png",
          "45f4e6c8-de2e-4bce-a6bc-cba957994af7video/mp4",
          "563ecfc6-9cbd-4c13-80c1-3c362dfbef98video/mp4",
          "ed44e502-c2b9-4411-9cbd-c142c0a60cbaapplication/msword",
          "22fa04f2-8848-4b80-817c-d343aca7f999image/png",
          "b09699e9-6a4d-41c6-afed-e17f51294c42image/png",
          "fb1722bf-8e6b-4ade-8904-0e10396269bfimage/png",
          "96031b23-1e21-4012-9ee2-221a10b61de8image/png",
          "1e2a43d1-139e-4870-bf5c-711708460023image/png",
          "a6dc4ccc-9911-4649-9b01-c97f3774595eimage/png"
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
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      },
      {
        "reportId": 11,
        "reportUserId": 8,
        "reportName": "出差周报出差周报出差周报出差周报出差周报出差周报出差周",
        "type": "月报",
        "reportDate": "2024-10-05",
        "upDate": null,
        "ctDate": "2024-10-06T07:24:43.000+00:00",
        "filePath": null,
        "content": "<p>IomBo5G8Avepc1TLR3z3eKLApMfa9W</p>",
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
        "userName": "小尹",
        "departName": "综合部",
        "fileUrls": []
      }
    ]);

    const currentReport = ref(personalReports.value[0]);

    const {proxy} = getCurrentInstance();

    const handleCreateReport = () => {
      isCreate.value = true;
      currentReport.value = {
        reportName: "",
        type: "",
        reportDate: "",
        upDate: null,
        ctDate: "",
        filePath: "",
        content: "",
        userName: "",
        departName: "",
      };

      isUpdate.value = true;
    };

    // 编写点击修改时的方法
    const handleToUpdate = () => {
      isUpdate.value = true;
      // updateEditorConfig();
    };

    const handleSaveUpdate = () => {
      // 提交修改
    };

    const handleSubmitUpdate = () => {
      handleSaveUpdate();
      handleCancelUpdate();
    };

    const handleCancelUpdate = () => {
      isUpdate.value = false;
      isCreate.value = false;
      currentReport.value = personalReports.value[0];
      // updateEditorConfig();
    };

    // 获取选中的菜单项对应的报告
    const handleSelectUpdate = (index) => {
      console.log(index);
      currentReport.value = personalReports.value[index];
    };

    // 获取个人日报的请求方法
    const getPersonalReport = async () => {
      let res = await proxy.$api.getPersonalReport();

      // 保持 userDataTest 的数据不变
      pageSearch.total = res.total;
      pageSearch.pageSize = res.size;
      pageSearch.pageNum = res.current;

      // 创建一个新的数据集合，不直接修改返回数据
      list.value = res.records.map((item) => {
        let newItem = {...item}; // 克隆一份数据
        newItem.timeIn = newItem.ctDate ? formatTime(newItem.ctDate) : '-'; // 格式化创建时间
        newItem.timeOut = newItem.upDate ? formatTime(newItem.upDate) : '-'; // 格式化创建时间
        newItem.status = newItem.status || '' ? newItem.status : '暂无'; // 格式化创建时间
        return newItem; // 返回新的对象
      });
    };

    onMounted(() => {
    });

    return {
      currentContent,
      editorConfig,
      reportTypes,
      isUpdate,
      personalReports,
      currentReport,
      isCreate,
      handleToUpdate,
      handleCancelUpdate,
      handleSelectUpdate,
      handleSubmitUpdate,
      handleSaveUpdate,
      handleNewReport: handleCreateReport
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
  justify-content: flex-end;
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

</style>
