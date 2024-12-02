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
                      :style="{ color: currentReport.reportId === personalReport.reportId ? '#6e94bd' : '#999' }">
                  {{ formatDate(personalReport.reportDate) }}
                </span>
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
                <el-divider direction="vertical" style="height: 100%"></el-divider>
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
          <el-row type="flex" justify="start" align="middle" class="shared-user-list">
            <el-form :model="currentReport">
              <el-form-item
                  label="分享人"
                  style="margin: 0; display: flex; align-items: center;"
              >
                <el-tooltip v-for="user in currentReportShareUsers" :content="user.userName" placement="top"
                            :hide-after="150">
                  <el-image
                      class="userImage"
                      :src="user.userImage || defaultAvatar"
                      @error="handleImageError"
                      :alt="user.userName"
                  />
                </el-tooltip>
                <el-tooltip :content="'添加共享人'" placement="top" :hide-after="500">
                  <!-- 添加报告分享人 -->
                  <div v-if="isUpdate || isCreate" class="userImage add-share-user-box" @click="handleAddSharer">
                    <span style="font-size: 24px; color: #999;">+</span>
                  </div>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-row>

          <el-row type="flex" justify="end">
            <el-col v-if="!isUpdate">
              <el-button type="warning" @click="handleCreateReport">新建</el-button>
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
    <img style="width: 200px" src="http://192.168.0.132:5173/res/611400b0-9354-43ed-8bbc-07fed6c04704.png"
         alt="image.png"/>
    <video controls style="width: 20%;">
      <source src="http://192.168.0.132:5173/res/6368f08c-a4c6-40f2-862b-dba9e63a74ca.mp4" type="video/mp4"/>
      您的浏览器不支持 HTML5 视频标签。
    </video>
  </div>
</template>

<script>
import {ref, reactive, computed, getCurrentInstance, onMounted} from 'vue';
import {formatDateTime, formatDate} from '@/utils/format';
import defaultAvatar from '@/assets/images/defaultUser.png';

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

    const currentReportShareUsers = ref([]);

    const editorConfig = computed(() => ({
      // 后端服务地址，后端处理参考
      serverUrl: 'http://192.168.0.132:5173/api/ueditor',
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
      pageNum: 1,
      pageSize: 30,
      total: null,
      data: formSearch,
    });

    const personalReports = ref([]);

    const createReportShareUsers = ref([]);

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
      return isCreate.value ? createReport : personalReports.value[currentActiveIndex.value] || createReport;
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
        currentReportShareUsers.value = [];
        getReportShareUserList();
        console.log(currentReport.value);
      }).catch(() => {
        // 要优化处理
        getReportShareUserList();
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
        });

        console.log("当前报告数据：", currentReport);
        //虚假的保存

        // 重置 currentReport
      }).catch(() => {
        ElMessage({
          type: 'success',
          message: '保存已取消',
        });
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

        // personalReports.value = [];
        // pageSearch.pageNum = 1;
        // getPersonalReport();
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
        // 重新获取一次个人报告
        personalReports.value = [];
        pageSearch.pageNum = 1;
        getPersonalReport();
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
      try {
        let userIds = currentReport.value.shareUserId.split(',').map(Number);
        currentReportShareUsers.value = await proxy.$api.getReportShareUserList(userIds);

        // 确保返回数据有效
        if (!Array.isArray(currentReportShareUsers.value) || currentReportShareUsers.value.length === 0) {
          console.warn("用户列表为空");
        }
      } catch (error) {
        console.error("获取用户列表失败:", error);
      }
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

    const handleImageError = (event) => {
      console.log("图片加载失败");
      event.target.src = defaultAvatar; // 本地默认图片路径
      console.log("当前图片地址：" + event.target.src);
    };

    onMounted(async () => {
      console.log("默认用户图片地址：", defaultAvatar);
      await loadScrollPage();
      await getReportShareUserList();
    });

    return {
      defaultAvatar,
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
      handleCreateReport,
      handleDeleteReport,
      handleImageError,
      formatDateTime,
      formatDate,
    }
  }
}
</script>

<style lang="less" scoped>
.my-card {
  height: 100%;
  min-width: 1200px;

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

  overflow: hidden;
  transition: transform 0.3s ease; /* 添加动画效果，使放大平滑 */
  z-index: 2;
}

.report-item:hover {
  transform: scale(1.05) translate3d(0, 0, 0) translateZ(0); /* 只放大高度，不放大宽度 */
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

.shared-user-list {
  //margin-top: 20px;
}

.userImage {
  width: 40px;
  height: 40px;
  border-radius: 10%; /* 轻度圆角 */
  margin-right: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease;
}

.userImage:hover {
  transform: scale(1.05);
}

.add-share-user-box {
  width: 40px;
  height: 40px;
  border-radius: 10%; /* 保持与图片相同的圆角 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;

  /* 常态下的虚线框 */
  border: 2px dashed #ccc;
}

.add-share-user-box:hover {
  color: #337ecc;
  border-color: #337ecc; /* 悬停时改变虚线框颜色 */
  transform: scale(1.1) translate3d(0, 0, 0) translateZ(0); /* 只放大高度，不放大宽度 */
}

.el-button {
  transition: all 0.2s ease;
}

.el-button:hover {
  transform: scale(1.1) translate3d(0, 0, 0) translateZ(0); /* 只放大高度，不放大宽度 */
}

.el-menu-scroll-item {

}

//.el-menu-item {
//  overflow: hidden;
//  transition: transform 0.3s ease; /* 添加动画效果，使放大平滑 */
//}
//.el-menu-item:hover {
//  transform: scale(1.05); /* 只放大高度，不放大宽度 */
//}
</style>
