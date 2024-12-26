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
            <el-form :inline="true" ref="reportFormRef">
              <el-form-item v-if="isCreate || isUpdate" label="报告标题" prop="reportName" style="margin: 10px">
                <el-input v-model="currentReport.reportName" style="width: 300px;">placeholder="请输入标题"></el-input>
                <el-divider direction="vertical" style="height: 100%"></el-divider>
              </el-form-item>
              <el-form-item
                  label="报告类型"
                  prop="type"
                  style="margin: 10px;"
              >
                <el-select :disabled="!isCreate && !isUpdate" v-model="currentReport.type" placeholder="请选择报告类型"
                           style="width: 160px;">
                  <el-option label="月报" value="月报"/>
                  <el-option label="日报" value="日报"/>
                  <el-option label="周报" value="周报"/>
                </el-select>
              </el-form-item>
              <el-form-item label="报告日期" prop="reportDate" style="margin: 10px">
                <!--                <el-input v-model="currentReport.reportDate" style="width: 200px;">placeholder="请选择报告类型"></el-input>-->
                <el-date-picker :disabled="!isCreate && !isUpdate" v-model="currentReport.reportDate" type="date"
                                value-format="YYYY-MM-DD" placeholder="请选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item v-if="isUpdate && !isCreate" label="编辑日期" prop="reportDate"
                            style="margin: 10px">
                <el-text>{{
                    formatDateTime(currentReport.upDate ? currentReport.upDate : currentReport.ctDate)
                  }}
                </el-text>
              </el-form-item>
            </el-form>
          </div>
        </el-header>

        <el-main class="right-main">
          <vue-ueditor-wrap v-if="isUpdate || isCreate"
                            v-model="currentReport.content"
                            editor-id="editor"
                            :config="editorConfig"
                            :editorDependencies="['ueditor.config.js','ueditor.all.js']"
                            style="height:100%; "/>
          <!--          用v-if强制重新加载或者说渲染，没有办法-->
          <vue-ueditor-wrap v-if="!isUpdate && !isCreate"
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
                  style="margin: 0; display: flex; align-items: center; position: relative"
              >
                <el-tooltip v-if="currentReportShareUsers.length <= 0" :content="'无分享人'" placement="top"
                            :hide-after="500">
                  <!-- 添加报告分享人 -->
                  <div v-if="isUpdate && !isCreate" class="userImage no-share-user-box">
                    <span style="font-size: 16px; color: #999;">无</span>
                  </div>
                  <div v-if="!isUpdate && !isCreate" class="userImage no-share-user-text">
                    <span style="font-size: 16px; color: #999;">无</span>
                  </div>
                </el-tooltip>
                <el-tooltip v-for="user in currentReportShareUsers" :content="user.userName" placement="top"
                            :hide-after="150">
                  <div
                      class="userImage"
                      @mouseenter="user.showDeleteIcon = true"
                      @mouseleave="user.showDeleteIcon = false">
                    <img
                        class="userImage"
                        :src="user.userImage || defaultAvatar"
                        @error="handleImageError"
                        :alt="user.userName"
                    />
                    <div v-if="user.showDeleteIcon && isCreate" class="delete-icon" @click="handleRemoveUser(user)">
                      <el-icon>
                        <CircleCloseFilled/>
                      </el-icon>
                    </div>
                  </div>
                </el-tooltip>
                <el-tooltip v-if="!isUpdate && isCreate" :content="'添加共享人'" placement="top" :hide-after="500">
                  <!-- 添加报告分享人 -->
                  <div v-if="!isUpdate && isCreate" class="userImage add-share-user-box" @click="handleAddSharer()">
                    <span style="font-size: 24px; color: #999;">+</span>
                  </div>
                </el-tooltip>

              </el-form-item>
            </el-form>
          </el-row>

          <el-row type="flex" justify="end">
            <el-col v-if="!isUpdate&&!isCreate">
              <el-button type="warning" @click="handleCreateReport">新建</el-button>
              <el-button type="primary" @click="handleToUpdate">编辑</el-button>
              <el-button type="danger" @click="handleDeleteReport">删除</el-button>
            </el-col>
            <el-col v-if="isUpdate || isCreate">
              <!--              <el-button type="success" @click="handleSaveUpdate">保存</el-button>-->
              <el-button type="primary" @click="handleSubmitUpdate">提交</el-button>
              <el-button type="danger" @click="handleCancelUpdate">取消</el-button>
            </el-col>
          </el-row>
        </el-footer>

      </el-container>
    </el-container>
  </el-card>

  <el-dialog v-model="dialogVisible" title="选择分享人" style="min-width: 900px">


    <el-select v-model="submitReport.userIDS"
               clearable
               @clear="multiSelectUser.checkAll = false"
               multiple
               filterable
               collapse-tags
               :max-collapse-tags="10"
               placeholder="选择用户"
               :append-to="'.select-options'">
      <template #header>
        <el-checkbox
            v-model="multiSelectUser.checkAll"
            :indeterminate="multiSelectUser.indeterminate"
            @change="handleCheckAll"
        >
          全部
        </el-checkbox>
      </template>
      <div>
        <el-option ref="selectRef" style="margin: 10px; height: 50px" v-for="user in shareUsers" :key="user.userId"
                   :label="user.userName" :value="user.userId">
        <span style="float: left">
  <!--                        用户头像-->
          <img class="userImage" @error="handleImageError" :src="user.userImage || defaultAvatar"/>
        </span>
          <span style="margin: 10px;"> {{ user.userName }} - {{ user.roleName }} </span>
        </el-option>
      </div>
    </el-select>

    <!--    填充一些空白-->
    <div style="height: 380px"></div>


    <span style="color: rgba(243,54,19,0.87); font-size: 14px; margin: 10px">* 单击上方多选框选择用户</span>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSelectShareUserSubmit">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>


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
import {ref, reactive, computed, nextTick, getCurrentInstance, onMounted, watch} from 'vue';
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

    const {proxy} = getCurrentInstance();

    const token = localStorage.getItem('tokenValue');

    const editorConfig = computed(() => ({
      // 后端服务地址，后端处理参考
      serverUrl: '/api/ueditor',
      UEDITOR_HOME_URL: '/static/UEditorPlus/dist-min/',
      UEDITOR_CORS_URL: '/static/UEditorPlus/dist-min/',
      toolbars: isUpdate.value || isCreate.value ? toolbarsForUpdate : [],
      readonly: !isUpdate.value && !isCreate.value,
      wordCount: isUpdate.value, // 默认为 true，表示启用字数统计
      serverHeaders: {
        'Satoken': token
      }
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

    let createReport = reactive({
      reportId: null,
      reportUserId: null,
      reportName: null,
      type: null,
      reportDate: null,
      filePath: null,
      content: null,
      userName: null,
      departName: null,
    });

    const currentReport = computed(() => {
      // 如果不是在新建的情况下，返回当前选中的条目，否则返回空
      return isCreate.value ? createReport : personalReports.value[currentActiveIndex.value] || createReport;
    });

    const submitReport = reactive({
      "reportId": null,
      "reportName": null,
      "type": null,
      "reportDate": null,
      "filePath": [
        null
      ],
      "content": null,
      "reportUserId": null,
      "userName": null,
      "departName": null,
      "userIDS": [],
      "share": null,
      "params": {
        "property1": {},
        "property2": {}
      }
    });

    // 对多选框的控制
    const multiSelectUser = reactive({
      checkAll: false,           // 全选框是否被选中
      indeterminate: false,      // 用于控制是否显示不确定状态
    });

    const shareUsers = ref([]);

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
        allLoaded.value = false;
        isCreate.value = true;
        isUpdate.value = false;
        personalReports.value = [];
        pageSearch.pageNum = 1;
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

        allLoaded.value = false;
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
      ).then(async () => {
        // 执行保存逻辑
        if (resData) {

        } else {
          ElMessage({
            type: 'success',
            message: '当前报告已保存',
          });
        }


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

    const handleSubmitUpdate = async () => {
      // 提交修改
      ElMessageBox.confirm(
          '是否提交当前报告？',
          '提交报告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            // type: 'info',
          }
      ).then(async () => { // 改为 async，确保异步代码的执行顺序
        try {
          // 执行保存逻辑，等待 API 请求结果
          console.log("currentReport", currentReport)
          // 将currentReport拷贝到submitReport
          submitReport.reportId = currentReport.value.reportId;
          submitReport.reportName = currentReport.value.reportName;
          submitReport.type = currentReport.value.type;
          submitReport.reportDate = currentReport.value.reportDate;
          submitReport.filePath = (currentReport.value.filePath ? (currentReport.value.filePath.match(/\d+/g) || []) : []).map(Number);
          submitReport.content = currentReport.value.content;
          submitReport.reportUserId = currentReport.value.reportUserId;
          submitReport.userName = currentReport.value.userName;
          submitReport.departName = currentReport.value.departName;
          // submitReport.userIDS = currentReport.value.userIDS;
          // Object.assign(submitReport, currentReport.value);
          console.log("submitReport", submitReport)
          let resData
          if (isUpdate.value === true) {
            resData = await proxy.$api.updateReport(submitReport); // 使用 await 等待异步请求完成
          } else if (isCreate.value === true) {
            resData = await proxy.$api.addReport(submitReport); // 使用 await 等待异步请求完成
          }

          console.log("resData", resData);

          if (resData) {
            // 提交成功
            // 清空数据

            // 清空或重置其他变量和状态
            createReport = {
              reportId: null,
              reportUserId: null,
              reportName: null,
              type: null,
              reportDate: null,
              filePath: null,
              content: null,
              userName: null,
              departName: null,
            }
            personalReports.value = [];
            console.log("personalReports 应为空", personalReports.value)
            pageSearch.pageNum = 1;
            await loadScrollPage();
            allLoaded.value = false;
            isUpdate.value = false;
            isCreate.value = false;
            // await getReportShareUserList();
            // await getShareUserList();
            ElMessage({
              type: 'success',
              message: '当前报告已提交',
            });
          } else {
            ElMessage({
              type: 'error',
              message: '提交失败，请稍后再试',
            });
          }


          // 重置 currentReport

        } catch (error) {
          console.error('提交报告时出错：', error);
          // 处理请求失败的情况
          ElMessage({
            type: 'error',
            message: '提交报告时出错，请稍后再试',
          });
        }
      }).catch(() => {
        // 用户取消了提交
        ElMessage({
          type: 'success',
          message: '提交已取消',
        });
      });
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
        loadScrollPage();
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
      ).then(async () => {
        // 重新获取一次个人报告
        await proxy.$api.deleteReport([currentReport.value.reportId]);

        ElMessage({
          type: 'success',
          message: '报告已删除',
        })

        personalReports.value = [];
        console.log("personalReports 应为空", personalReports.value)
        pageSearch.pageNum = 1;
        await loadScrollPage();
        allLoaded.value = false;
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
      console.log('index', index);
      currentActiveIndex.value = index;
      getReportShareUserList();
    };

    const getReportShareUserList = async () => {
      // 如果currentReport.value.shareUserId是空数组或空或者undefined，则不执行后续操作
      if (currentReport.value.shareUserId === [] || currentReport.value.shareUserId === null || currentReport.value.shareUserId === undefined) {
        currentReportShareUsers.value = [];
        return
      }
      try {
        // 先去除 [ 和 ] 再按,拆分
        let userIds = currentReport.value.shareUserId.replace(/[\[\]]/g, '').split(',').map(Number);
        currentReportShareUsers.value = await proxy.$api.getReportShareUserList(userIds);

        // 确保返回数据有效
        if (!Array.isArray(currentReportShareUsers.value) || currentReportShareUsers.value.length === 0) {
          console.warn("用户列表为空");
        }
      } catch (error) {
        console.error("获取用户列表失败:", error);
      }
    }
    const getReportShareUserListByIds = async (ids) => {
      try {
        // 先去除 [ 和 ] 再按,拆分
        currentReportShareUsers.value = await proxy.$api.getReportShareUserList(ids);

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
      console.log("当前加载的页：" + pageSearch.pageNum);

      // 获取新数据并追加到显示列表中
      const newReports = await getPersonalReport();

      pageSearch.pageNum += 1;

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
      event.target.src = defaultAvatar; // 本地默认图片路径
    };

    const getShareUserList = async () => {
      // 获取当前用户信息
      // 获取当前用户的分享用户列表，把shareUserList拷贝给shareUsers
      shareUsers.value = await proxy.$api.getShareUserList();
    }

    const handleAddSharer = () => {
      dialogVisible.value = true;
      // getShareUserList();
      console.log('dialogVisible', dialogVisible)
    }

    const handleSelectShareUserSubmit = () => {
      dialogVisible.value = false;
      getReportShareUserListByIds(submitReport.userIDS);
    }

    // 处理全选框的变化
    const handleCheckAll = () => {
      // 如果是全选状态
      if (multiSelectUser.checkAll) {
        // 全选时，所有用户都选中
        submitReport.userIDS = shareUsers.value.map(user => user.userId);
        console.log('全选时，所有用户都选中', submitReport.userIDS)
      } else {
        // 如果取消全选，则清空选中的用户
        submitReport.userIDS = [];
      }
      // 更新不确定状态
      multiSelectUser.indeterminate = submitReport.userIDS.length > 0 && submitReport.userIDS.length < shareUsers.length;
    };

    const setupDynamicWatchers = () => {
      watch(
          () => submitReport.userIDS, // 监听动态绑定的 model 值
          (newVal) => {
            const totalOptions = shareUsers.value.map((opt) => opt.userId);
            if (!Array.isArray(newVal)) {
              multiSelectUser.checkAll = false;
              multiSelectUser.indeterminate = false;
            } else {
              const selectedCount = newVal.length;
              if (selectedCount === 0) {
                multiSelectUser.checkAll = false;
                multiSelectUser.indeterminate = false;
              } else if (selectedCount === totalOptions.length) {
                multiSelectUser.checkAll = true;
                multiSelectUser.indeterminate = false;
              } else {
                multiSelectUser.checkAll = false;
                multiSelectUser.indeterminate = true;
              }
            }
          },
          {immediate: true} // 初始化时触发
      );
    };

    const handleRemoveUser = (user) => {
      // Remove user logic
      submitReport.userIDS = submitReport.userIDS.filter(id => id !== user.userId);
      console.log('删除后的 userIDS', submitReport.userIDS)
      // shareUsers.value = shareUsers.value.filter(user => submitReport.userIDS.includes(user.userId));
      console.log('删除后的 shareUsers', currentReportShareUsers.value)
      console.log('删除前的 currentReportShareUsers', currentReportShareUsers.value)
      currentReportShareUsers.value = currentReportShareUsers.value.filter(item => item.userId !== user.userId);
      console.log('删除后的 currentReportShareUsers', currentReportShareUsers.value)
      console.log('Removed user', user);
    };

    onMounted(async () => {
      console.log("默认用户图片地址：", defaultAvatar);
      await loadScrollPage();
      await getReportShareUserList();
      await getShareUserList();
      setupDynamicWatchers();
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
      handleAddSharer,
      formatDateTime,
      formatDate,
      shareUsers,
      submitReport,
      multiSelectUser,
      handleCheckAll,
      handleRemoveUser,
      handleSelectShareUserSubmit,
      // selectRef,
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

  :deep(#rcreate_editor.edui-default) {
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

.no-share-user-box {
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

.no-share-user-text {
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
  border: 2px #c7c7c7;
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

.user-avatar-container {
  position: relative;
  display: inline-block;
}

.delete-icon {
  position: absolute;
  top: -5px;
  right: -9px;
  //background-color: red;
  color: red;
  border-radius: 50%;
  width: 17px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

//.el-menu-item {
//  overflow: hidden;
//  transition: transform 0.3s ease; /* 添加动画效果，使放大平滑 */
//}
//.el-menu-item:hover {
//  transform: scale(1.05); /* 只放大高度，不放大宽度 */
//}
</style>
