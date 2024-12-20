<template>
  <div class="user-header">
    <el-form :inline="true" :model="formSearch">
      <el-collapse v-model="activeCollapse" @change="handleCollapseChange">
        <el-collapse-item name="1" :icon="CaretRight" :is-active="false">
          <!--      <el-form-item label="用户名">-->
          <!--        <el-input clearable v-model="formSearch.userName" placeholder="请输入用户名" />-->
          <!--      </el-form-item>-->
          <!--      <el-form-item label="工号">-->
          <!--        <el-input clearable v-model="formSearch.empNum" placeholder="请输入工号" />-->
          <!--      </el-form-item>-->
          <!--      </el-form-item>-->
          <!--      <el-form-item label="入职日期">-->
          <!--        &lt;!&ndash;        <el-input v-model="formSearch.userName" placeholder="请选择出生日期" />&ndash;&gt;-->
          <!--        <el-date-picker-->
          <!--            clearable-->
          <!--            v-model="formSearch.timeIn"-->
          <!--            type="date"-->
          <!--            label="入职日期"-->
          <!--            placeholder="请输入入职日期"-->
          <!--            style="width: 100%"-->
          <!--        />-->
          <!--      </el-form-item>-->
          <template #title>
            <div @click.stop> <!-- 这个 @click.stop 很有用 -->

              <el-form-item label="查找用户名">
                <el-input
                    clearable
                    @clear="handleClear"
                    v-model="formSearch['userName']"
                    placeholder="请输入查询内容"
                    class="input-with-select"
                >
                  <!--          <template #prepend>-->
                  <!--            <el-select v-model="selectedField" placeholder="Select" style="width: 120px" @change="handleSelectedFieldChange">-->
                  <!--              <el-option label="用户名" value="userName" />-->
                  <!--              <el-option label="工号" value="empNum" />-->
                  <!--              <el-option label="部门" value="departmentName" />-->
                  <!--              <el-option label="入职日期" value="timeIn" />-->
                  <!--            </el-select>-->
                  <!--          </template>-->
                  <!--          <template #prefix>-->
                  <!--            <el-button >-->
                  <!--              <el-icon ><Plus/></el-icon>-->
                  <!--            </el-button>-->
                  <!--          </template>-->
                  <template #append>
                    <el-button @click="handleSearch">
                      <el-icon>
                        <Search/>
                      </el-icon>
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="查找部门">
                <el-input
                    clearable
                    @clear="handleClear"
                    v-model="formSearch['departmentName']"
                    placeholder="请输入查询内容"
                    class="input-with-select"
                >
                  <template #append>
                    <el-button @click="handleSearch">
                      <el-icon>
                        <Search/>
                      </el-icon>
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="查找工号">
                <el-input
                    clearable
                    @clear="handleClear"
                    v-model="formSearch['empNum']"
                    placeholder="请输入查询内容"
                    class="input-with-select"
                >
                  <template #append>
                    <el-button @click="handleSearch">
                      <el-icon>
                        <Search/>
                      </el-icon>
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="查找手机号">
                <el-input
                    clearable
                    @clear="handleClear"
                    v-model="formSearch['telephone']"
                    placeholder="请输入查询内容"
                    class="input-with-select"
                >
                  <template #append>
                    <el-button @click="handleSearch">
                      <el-icon>
                        <Search/>
                      </el-icon>
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </template>

          <el-form-item label="查找邮箱">
            <el-input
                clearable
                @clear="handleClear"
                v-model="formSearch['email']"
                placeholder="请输入查询内容"
                class="input-with-select"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon>
                    <Search/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <!--      <el-form-item label="">-->
          <!--        <el-select v-model="selectedDateModel" placeholder="Select" style="width: 100px" @change="handleSelectedDateModelChange">-->
          <!--          <el-option label="精确查找" value="jq" />-->
          <!--          <el-option label="区间查找" value="qj" />-->
          <!--        </el-select>-->
          <!--        <el-select v-model="selectedDateField" placeholder="Select" style="width: 120px" @change="handleSelectedDateFieldChange">-->
          <!--          <el-option label="入职日期" value="timeIn" />-->
          <!--          <el-option label="创建日期" value="ctTime" />-->
          <!--          <el-option label="修改日期" value="upTime" />-->
          <!--        </el-select>-->
          <!--        <span>-->
          <!--          <el-date-picker-->
          <!--              clearable-->
          <!--              @clear="handleClear"-->
          <!--              v-if="selectedDateModel === 'jq'"-->
          <!--              v-model="formSearch[selectedDateField]"-->
          <!--              type="date"-->
          <!--              label="出生日期"-->
          <!--              placeholder="请输入出生日期"-->
          <!--              style="width: 100%"-->
          <!--          />-->
          <!--          <el-date-picker-->
          <!--              clearable-->
          <!--              @clear="handleClear"-->
          <!--              v-if="selectedDateModel === 'qj'"-->
          <!--              v-model="formSearch[selectedDateField+selectedDateModel]"-->
          <!--              type="daterange"-->
          <!--              unlink-panels-->
          <!--              range-separator="到"-->
          <!--              start-placeholder="开始时间"-->
          <!--              end-placeholder="结束时间"-->
          <!--              :shortcuts="shortcuts"-->
          <!--              :size="size"-->
          <!--          />-->
          <!--        </span>-->
          <!--        <span>-->
          <!--          <el-button @click="handleSearch">-->
          <!--              <el-icon ><Search/></el-icon>-->
          <!--          </el-button>-->
          <!--        </span>-->
          <!--      </el-form-item>-->
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <!-- 右侧按钮区域 -->
    <div class="right-container">
      <el-button type="danger" @click="handleDeleteAll">× 批量删除</el-button>
      <el-button type="primary" @click="handleAdd">+ 新增</el-button>
    </div>
  </div>
  <div class="table" :style="tableStyle">
    <el-table v-loading="tableLoading" :data="list" style="width: 100%" table-layout="fixed"
              :default-sort="{ prop: 'ctTime', order: 'descending' }" @selection-change="handleSelectionChange">
      <el-table-column cell-class-name="first-column" fixed type="selection" width="55" align="center"/>
      <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width ? item.width : auto"
          align="center"
          :fixed="item.fixed ? item.fixed : false"
          :filters="item.filters ? item.filters : null"
          :filter-method="item.filters ? filterMethod : null"
          :filter-multiple="item.filters ? false : null"
          :sortable="item.sortable ? item.sortable : false"
      >
        <template #header="scope">
          <span>{{ item.label }}</span>
          <!-- 切换锁定状态按钮 -->
          <el-tooltip :content="item.fixed ? '取消固定' : '将该列固定到左侧'" placement="top" :hide-after="500">
            <span @click="toggleFixed(item)"
                  style=" margin-left: 5px;">
              <el-icon v-if="item.fixed" color="#289eea"> <!-- 如果已固定，显示Unlock图标 -->
                <Unlock/>
              </el-icon>
              <el-icon v-else> <!-- 如果未固定，显示Lock图标 -->
                <Lock/>
              </el-icon>
            </span>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-tag
              v-if="item.prop === 'status'"
              :type="scope.row.status === '在职' ? 'success' :
                (scope.row.status === '离职') ? 'info' :
                  (scope.row.status === '出差') ? 'primary' : 'warning'"
              disable-transitions
          >{{ scope.row.status }}
          </el-tag>
          <img
              v-if="item.prop === 'userImage'"
              class="userImage"
              :src="scope.row.userImage || defaultAvatar"
              @error="handleImageError"
              :alt="scope.row.userName"
          />
        </template>
        </el-table-column>
      <el-table-column class="last-column" fixed="right" label="操作" min-width="180" header-align="center"
                       align="center">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    <el-pagination-->
    <!--        small-->
    <!--        background-->
    <!--        layout="prev, pager, next"-->
    <!--        :total="pageSearch.total"-->
    <!--        :page-size="pageSearch.pageSize"-->
    <!--        :current-page="pageSearch.pageNum"-->
    <!--        @current-change="changePage"-->
    <!--        class="pager"-->
    <!--    />-->
    <el-pagination
        small
        background
        @size-change="changeSizePage"
        :total="pageSearch.total"
        :current-page="pageSearch.pageNum"
        :page-size="pageSearch.pageSize"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
        layout="sizes, prev, pager, next, jumper, total"
        @current-change="changeCurrentPage"
        class="pager"
    />
  </div>
  <!--  <el-dialog-->
  <!--      v-model="dialogVisible"-->
  <!--      :title="action == 'add' ? '新增用户' : '编辑用户'"-->
  <!--      width="35%"-->
  <!--      :before-close="handleClose"-->
  <!--  >-->
  <!--  </el-dialog>-->

  <el-drawer
      v-model="dialogVisible"
      :show-close="false"
      :before-close="handleClose"
      style="min-width: 600px"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 v-if="action === 'edit'" :id="titleId" :class="titleClass">编辑用户</h4>
      <h4 v-if="action === 'add'" :id="titleId" :class="titleClass">新增用户</h4>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left">
          <CircleCloseFilled/>
        </el-icon>
        关闭
      </el-button>
    </template>
    <el-form :inline="true" :model="formUserInfo" ref="userInfoForm">
      <el-row>
        <el-col :span="12">
          <el-form-item
              label="姓名"
              prop="userName"
              :rules="[{ required: true, message: '姓名是必填项' }]"
              style="width: 90%"
          >
            <el-input v-model="formUserInfo.userName" placeholder="请输入姓名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="部门"
              prop="departmentId"
              :rules="[{ required: true, message: '部门是必选项' }]"
              style="width: 90%"
          >
            <el-select v-model="formUserInfo.departmentId" placeholder="请选择部门">
              <el-option
                  v-for="item in tableLabel[2].filters"
                  :label="item.text"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
              label="系统角色"
              prop="roleId"
              :rules="[
                { required: true, message: '角色是必填项' },
              ]"
              style="width: 90%"
          >
            <el-select v-if="opsUserRole = 1"
                       :disabled="!(opsUserRole === 1 || opsUserRole === 2) || formUserInfo.userId === opsUserId && action !== 'add'"
                       v-model="formUserInfo.roleId" placeholder="请选择系统角色">
              <el-option
                  v-for="role in formRoles"
                  :key="role.label"
                  :label="role.label"
                  :value="role.value"
              />
            </el-select>
            <el-select v-if="opsUserRole === 2 && formUserInfo.roleId !== 1"
                       :disabled="!(opsUserRole === 1 || opsUserRole === 2) || formUserInfo.userId === opsUserId && action !== 'add'"
                       v-model="formUserInfo.roleId" placeholder="请选择系统角色">
              <el-option
                  v-for="role in lowFormRoles"
                  :key="role.label"
                  :label="role.label"
                  :value="role.value"
              />
            </el-select>
            <el-input
                v-if="formUserInfo.roleId === 1 && opsUserRole !== 1 "
                :placeholder="'超级管理员'"
                default-value="'超级管理员'"
                :disabled="true"
            />
            <!--            <el-select v-if="!(opsUserRole === 1 || opsUserRole === 2) || formUserInfo.userId === opsUserId"-->
            <!--                       placeholder="请选择系统角色">-->
            <!--              <el-option-->
            <!--                  v-for="role in formRoles.filter(role => opsUserRole !== 2 || role.value !== 1)"-->
            <!--                  :key="role.label"-->
            <!--                  :label="role.label"-->
            <!--                  :value="role.value"-->
            <!--              />-->
            <!--            </el-select>-->
            <!--            <el-input-->
            <!--                v-model="formUserInfo.roleId"-->
            <!--                default-value="'fw'"-->
            <!--                :disabled="false"-->
            <!--                v-if="!(opsUserRole !== 1 && opsUserRole !== 2 || formUserInfo.userId === opsUserId)"-->
            <!--            />-->

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="工号"
              prop="empNum"
              :rules="[{ required: true, message: '工号是必填项' }]"
              style="width: 90%"
          >
            <el-input v-model="formUserInfo.empNum" placeholder="请输入工号"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
              label="手机号"
              prop="telephone"
              :rules="[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]"
              style="width: 90%"
          >
            <el-input v-model="formUserInfo.telephone" placeholder="请输入手机号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="邮箱"
              prop="email"
              :rules="[{ type: 'email', message: '请输入正确的邮箱地址' }]"
              style="width: 90%"
          >
            <el-input v-model="formUserInfo.email" placeholder="请输入电子邮箱"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
              label="状态"
              prop="status"
              :rules="[{ required: true, message: '状态是必填项' }]"
              style="width: 90%"
          >
            <el-select v-model="formUserInfo.status" placeholder="请选择状态">
              <el-option
                  v-for="status in formStatuses"
                  :key="status.value"
                  :label="status.label"
                  :value="status.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="入职时间"
              prop="timeIn"
              :rules="[{ required: true, message: '日志时间是必填项' }]"
              style="width: 90%"
          >
            <el-date-picker
                v-model="formUserInfo.timeIn"
                type="datetime"
                placeholder="选择日期"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="action === 'add'" :span="12">
          <el-form-item
              label="身份证号"
              prop="birthdayNum"
              :rules="[{}]"
              style="width: 90%"
          >
            <el-input v-model="formUserInfo.birthdayNum" placeholder="请输入身份证号码"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row style="justify-content: flex-end">-->
      <!--        <el-form-item>-->
      <!--          <el-button type="primary" @click="handleCancel">取消</el-button>-->
      <!--          <el-button type="primary" @click="onSubmit">确定</el-button>-->
      <!--        </el-form-item>-->
      <!--      </el-row>-->
    </el-form>
    <!-- 使用 footer 插槽放置按钮 -->
    <template #footer>
      <div style="text-align: right; ">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-drawer>

  <!--  </el-dialog>-->
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
  reactive, computed,
} from "vue";
import {CaretRight} from '@element-plus/icons-vue'
import {formatDateTime, parseToISO8601} from '@/utils/format';
import {Plus} from "@element-plus/icons-vue";
import defaultAvatar from '@/assets/images/defaultUser.png';

export default defineComponent({
  components: {Plus},
  setup() {

    const activeCollapse = ref([]);

    const userInfoForm = ref({});

    // const tableLayout = ref<TableInstance['tableLayout']>('fixed')
    const {proxy} = getCurrentInstance();
    const dataList = ref([]);
    const selectedField = ref('userName');
    const selectedDateField = ref('timeIn');
    const selectedDateModel = ref('jq');
    const tableLoading = ref(true);
    const tableLabel = reactive([
      {
        prop: "userName",
        label: "姓名",
        width: 100,
        fixed: 'left',
        disabled: false,
      },
      {
        prop: "roleName",
        label: "系统角色",
        width: 115,
        fixed: false,
        disabled: false,
      },
      {
        prop: "departmentName",
        label: "部门",
        width: 150,
        fixed: 'left',
        disabled: false,
        filters: [
          {text: '销售部', value: 1},
          {text: '人事部', value: 2},
          {text: '综合部', value: 3},
          {text: '财务部', value: 4},
          {text: '技术部', value: 5},
          {text: '行政部', value: 6},
          {text: '市场部', value: 7},
          {text: '运营部', value: 8},
        ]
      },
      {
        prop: "userImage",
        label: "员工头像",
        width: 150,
        fixed: false,
        disabled: false,
      },
      {
        prop: "empNum",
        label: "工号",
        width: 150,
        fixed: false,
        disabled: false,
        sortable: true,
      },
      {
        prop: "telephone",
        label: "手机号",
        width: 150,
        fixed: false,
        disabled: false,
      },
      {
        prop: "email",
        label: "邮箱",
        width: 220,
        fixed: false,
        disabled: false,
      },
      {
        prop: "status",
        label: "状态",
        width: 110,
        fixed: false,
        disabled: false,
        filters: [
          {text: '在职', value: '在职'},
          {text: '离职', value: '离职'},
        ]
      },
      {
        prop: "sex",
        label: "性别",
        width: 110,
        fixed: false,
        disabled: false,
        filters: [
          {text: '男', value: '男'},
          {text: '女', value: '女'},
        ]
      },
      {
        prop: "birth",
        label: "出生日期",
        width: 220,
        fixed: false,
        disabled: true,
        sortable: true,
      },
      {
        prop: "timeIn",
        label: "入职时间",
        width: 220,
        fixed: false,
        disabled: true,
        sortable: true,
      },
      {
        prop: "ctTime",
        label: "创建时间",
        width: 220,
        fixed: false,
        disabled: true,
        sortable: true,
      },
      {
        prop: "upTime",
        label: "更新时间",
        width: 220,
        fixed: false,
        disabled: true,
        sortable: true,
      },
    ]);
    const selectedIds = ref([]);

    const userDataTest = reactive ({
      records: [
        {
          userId: 7,
          userName: "涂子航",
          roleName: "admin",
          departmentName: "人事部",
          userImage: "ssss",
          empNum: "20221107040",
          telephone: "13094295529",
          email: "3109702282@qq.com",
          status: 1,
          ctTime: "2024-09-30T02:01:21.000+00:00",
          upTime: "2024-09-30T02:01:22.000+00:00"
        },
        {
          userId: 8,
          userName: "小尹",
          roleName: "admin",
          departmentName: "综合部",
          userImage: "sdasdsa",
          empNum: "2424389790",
          telephone: "2313231",
          email: "swz2424389790@gmail.com",
          status: 1,
          ctTime: "2024-09-26T06:06:01.000+00:00",
          upTime: null
        },
      ],
      total: 15,
      size: 10,
      current: 1,
      pages: 1
    });

    const opsUserRole = ref(3);

    const opsUserId = ref();

    const formStatuses = ([
      {label: '在职', value: 1},
      {label: '出差', value: 2},
      {label: '离职', value: 0},
    ]);

    const lowFormRoles = ref([
      {label: '管理员', value: 2},
      {label: '普通员工', value: 3}
    ]);

    const formRoles = ref([
      {label: '管理员', value: 2},
      {label: '普通员工', value: 3},
      {label: '超级管理员', value: 1},
    ]);

    const formSearch = reactive({
      userName: null,
      empNum: null,
      departmentName: null,
      telephone: null,
      email: null,
      timeIn: null,
      timeInqj: null,
      birthdayNum: null,
    });

    const pageSearch = reactive({
      pageNum: 1,
      pageSize: 20,
      total: null,
      data: formSearch,
    });

    const getUserDataList = async (pageParams) => {
      // 通过 mock 或请求获取用户数据
      // let res = await proxy.$api.getUserData(config);
      // config.total = res.count;
      // list.value = res.list.map((item) => {
      //   item.sexLabel = item.sex === 0 ? "女" : "男";
      //   return item;
      // });

      let res = await proxy.$api.getUserList(pageParams);

      // 保持 userDataTest 的数据不变
      pageSearch.total = res.total;
      pageSearch.pageSize = res.size;
      pageSearch.pageNum = res.current;

      // 创建一个新的数据集合，不直接修改 userDataTest
      dataList.value = res.records.map((item) => {
        let newItem = {...item}; // 克隆一份数据
        newItem.roleName = newItem.roleName === "admin" ? "管理员" :
            (newItem.roleName === "boss" ? "超级管理员" :
                (newItem.roleName === "user" ? "普通用户" : "其他用户"));
        newItem.timeIn = newItem.timeIn ? formatDateTime(newItem.timeIn) : '-'; // 格式化创建时间
        newItem.ctTime = newItem.ctTime ? formatDateTime(newItem.ctTime) : '-'; // 格式化创建时间
        newItem.upTime = newItem.upTime ? formatDateTime(newItem.upTime) : '-'; // 格式化更新时间
        newItem.status = (newItem.status === 1) ? "在职" :
            (newItem.status === 0) ? "离职" :
                (newItem.status === 2) ? "出差" : "其他"; // 格式化状态

        newItem.sex = newItem.sex === "1" ? "男" : "女"; // 格式化状态
        return newItem; // 返回新的对象
      });
      tableLoading.value = false;
    };
    const changeSizePage = (sizePage) => {
      // console.log(page);
      pageSearch.pageNum = 1;
      pageSearch.pageSize = sizePage;
      getUserDataList(pageSearch);
    };
    const changeCurrentPage = (currentPage) => {
      // console.log(page);
      pageSearch.pageNum = currentPage;
      getUserDataList(pageSearch);
    };
    // 添加用户的form数据
    const formUserInfo = reactive({
      userId: null,
      userName: null,
      roleId: null,
      roleName: null,
      departmentId: null,
      userImage: null,
      empNum: null,
      telephone: null,
      email: null,
      status: null,
      timeIn: null,
      ctTime: null,
      upTime: null,
      userPassword: null,
      birthdayNum: null,
      deleted: 0
    });

    const handleSearch = async () => {
      pageSearch.pageNum = 1;
      await getUserDataList(pageSearch);
    };
    // 控制模态框的显示隐藏
    const dialogVisible = ref(false);
    const handleClose = (done) => {
      ElMessageBox.confirm("确认未提交前关闭吗?")
          .then(() => {
            proxy.$refs.userInfoForm.resetFields();
            done();
          })
          .catch(() => {
            // catch error
          });
    };

    const timeFormat = (time) => {
      var time = new Date(time);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();

      function add(m) {
        return m < 10 ? "0" + m : m;
      }

      return year + "-" + add(month) + "-" + add(date);
    };
    // 添加用户
    const onSubmit = async () => {
      console.log('formUserInfo', formUserInfo)
      proxy.$refs.userInfoForm.validate(async (valid) => {
        if (valid) {
          if (action.value === "add") {
            // formUserInfo.birth = timeFormat(formUserInfo.birth);
            console.log('formatBeforFormUserInfo', formUserInfo)
            formUserInfo.status === "在职" ? formUserInfo.status = 1 : (formUserInfo.status === "出差" ? formUserInfo.status = 2 : formUserInfo.status = 0);
            formUserInfo.upTime = formUserInfo.upTime && formUserInfo.upTime !== '-' ? parseToISO8601(formatDateTime(formUserInfo.upTime)) : null;
            formUserInfo.ctTime = formUserInfo.upTime && formUserInfo.upTime !== '-' ? parseToISO8601(formatDateTime(formUserInfo.ctTime)) : null;
            formUserInfo.timeIn = formUserInfo.upTime && formUserInfo.upTime !== '-' ? parseToISO8601(formatDateTime(formUserInfo.timeIn)) : null;
            console.log('formUserInfo', formUserInfo)
            formUserInfo.userId = null;
            let res = await proxy.$api.saveUser(formUserInfo);
            console.log('res', res)
            if (res) {
              // console.log(proxy.$refs);
              dialogVisible.value = false;
              proxy.$refs.userInfoForm.resetFields();
              getUserDataList(pageSearch);
              getOpsUser();
            }
          } else if (action.value === "edit") {
            // 编辑的接口
            console.log('formatBeforFormUserInfo', formUserInfo)
            formUserInfo.status === "在职" ? formUserInfo.status = 1 : (formUserInfo.status === "出差" ? formUserInfo.status = 2 : formUserInfo.status = 0);
            formUserInfo.upTime = formUserInfo.upTime && formUserInfo.upTime !== '-' ? parseToISO8601(formatDateTime(formUserInfo.upTime)) : null;
            formUserInfo.ctTime = formUserInfo.upTime && formUserInfo.upTime !== '-' ? parseToISO8601(formatDateTime(formUserInfo.ctTime)) : null;
            formUserInfo.timeIn = formUserInfo.upTime && formUserInfo.upTime !== '-' ? parseToISO8601(formatDateTime(formUserInfo.timeIn)) : null;
            console.log('formUserInfo', formUserInfo)
            let res = await proxy.$api.updateUser(formUserInfo);
            console.log('res', res)
            if (res) {
              // console.log(proxy.$refs);
              dialogVisible.value = false;
              proxy.$refs.userInfoForm.resetFields();
              getUserDataList(pageSearch);
              getOpsUser();
            }
          }
        } else {
          ElMessage({
            showClose: true,
            message: "请输入正确的内容",
            type: "error",
          });
        }
      });
    };

    // const handleClose = (done) => {
    //   if (loading.value) {
    //     return
    //   }
    //   ElMessageBox.confirm('Do you want to submit?')
    //       .then(() => {
    //         loading.value = true
    //         timer = setTimeout(() => {
    //           done()
    //           // 动画关闭需要一定的时间
    //           setTimeout(() => {
    //             loading.value = false
    //           }, 400)
    //         }, 2000)
    //       })
    //       .catch(() => {
    //         // catch error
    //       })
    // }

    // 取消
    const handleCancel = () => {
      dialogVisible.value = false;
      proxy.$refs.userInfoForm.resetFields();
    };
    // 区分编辑和新增
    const action = ref("add");
    // 编辑用户
    const handleEdit = (row) => {
      // 浅拷贝
      action.value = "edit";
      dialogVisible.value = true;
      proxy.$nextTick(() => {
        Object.assign(formUserInfo, row);
        console.log('row', row);
        console.log('formUserInfo', formUserInfo);
      });
    };
    // 新增用户
    const handleAdd = () => {
      action.value = "add";
      dialogVisible.value = true;
    };
    // 删除用户
    const handleDelete = (row) => {
      console.log("row.id", row.userId)
      ElMessageBox.confirm("你确定删除吗?")
          .then(async () => {
            await proxy.$api.deleteUser([row.userId]);

            ElMessage({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
            getUserDataList(pageSearch);
          })
          .catch(() => {
            // catch error
          });
    };

    // 删除用户
    const handleDeleteAll = (row) => {
      // 如果selectedIds为空弹出提示“当前没有任何选中的记录”
      if (selectedIds.value.length === 0) {
        ElMessage({
          showClose: true,
          message: "当前没有任何选中的记录",
          type: "warning",
        });
        return;
      } else {
        ElMessageBox.confirm("你确定要批量删除吗?")
            .then(async () => {
              await proxy.$api.deleteUser(selectedIds.value);

              ElMessage({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
              getUserDataList(pageSearch);
            })
            .catch(() => {
              // catch error
            });
      }

    };

    // 复选框勾选状态改变时的处理函数
    const handleSelectionChange = (selectedItems) => {
      selectedIds.value = selectedItems.map(item => item.userId); // 提取选中的userId
      console.log(selectedIds.value)
    };

    const filterMethod = (value, row, column) => {
      const property = column['property']
      return row[property] === value
    }

    // 切换固定列的状态
    const toggleFixed = (item) => {
      if (item.fixed) {
        item.fixed = false; // 取消固定
      } else {
        item.fixed = 'left'; // 固定到左侧
      }
    };

    // 方法
    const handleSelectedFieldChange = (newVal) => {

      // 清空所有相关字段，或者根据需要清空特定字段
      Object.keys(formSearch).forEach((key) => {
        if (key !== newVal) {
          formSearch[key] = null;
        }
      });
      // 如果需要只清空当前选择的字段，可以使用：
      // formSearch[newVal] = '';
    };

    const handleSelectedDateFieldChange = (newVal) => {
      // 清空日期相关的字段
      formSearch.timeIn = null;
      formSearch.ctTime = null;
      formSearch.upTime = null;
      // 根据选择的日期字段清空相关数据
      if (newVal) {
        formSearch[newVal] = null;
        formSearch[newVal + 'qj'] = [];
      }
    };

    const handleSelectedDateModelChange = (newVal) => {
      // 清空当前选择的日期字段数据
      if (newVal === 'jq') {
        // 如果选择精确查找，只保留单个日期字段
        formSearch[selectedDateField.value] = null;
      } else if (newVal === 'qj') {
        // 如果选择区间查找，清空区间查找相关的字段
        formSearch[selectedDateField.value + 'qj'] = [];
      }
    };

    const handleClear = () => {
      // 清空搜索表单数据
      handleSearch(pageSearch);
    };

    const handleImageError = (event) => {
      event.target.src = defaultAvatar; // 本地默认图片路径
    };

    const getOpsUser = async () => {
      let userInfo = await proxy.$api.getUserInfo();
      if (userInfo) {
        opsUserRole.value = userInfo.roleId;
        opsUserId.value = userInfo.userId;
      }
      console.log('opsUserRole', opsUserRole.value)
      console.log('opsUserId', opsUserId.value)
    }

    // 监听 table 的动态样式
    const tableStyle = computed(() => {
      // 判断是否展开
      return activeCollapse.value.includes("1")
          ? {height: "calc(100% - 75px - 44px)"}
          : {height: "calc(100% - 75px)"};
    });

    // Collapse 状态改变时的回调
    const handleCollapseChange = (names) => {
      activeCollapse.value = names;
    };

    const filteredRoles = computed(() => {
      // 如果 `opsUserRole === 2`，过滤掉 `超级管理员`
      if (opsUserRole.value === 2) {
        return formRoles.value.filter(role => role.value !== 1);
      }
      return formRoles;
    });

    onMounted(() => {
      getUserDataList(pageSearch);
      getOpsUser();
    });

    return {
      defaultAvatar,
      list: dataList,
      tableLabel,
      // tableLayout,
      userInfoForm,
      pageSearch,
      selectedField,
      selectedDateField,
      selectedDateModel,
      tableLoading,
      changeCurrentPage,
      changeSizePage,
      formStatuses,
      formRoles,
      formSearch,
      handleSearch,
      dialogVisible,
      handleClose,
      formUserInfo,
      onSubmit,
      handleCancel,
      action,
      handleEdit,
      handleAdd,
      handleDelete,
      handleSelectionChange,
      filterMethod,
      toggleFixed,
      handleSelectedFieldChange,
      handleSelectedDateFieldChange,
      handleSelectedDateModelChange,
      handleClear,
      handleImageError,
      // formatDateTime,
      handleDeleteAll,
      opsUserRole,
      opsUserId,
      filteredRoles,
      CaretRight,
      tableStyle,
      activeCollapse,
      lowFormRoles,
      handleCollapseChange,
    };
  },
});
</script>

<style lang="less" scoped>
.table {
  background-color: #fafafa;
  position: relative;
  //height: calc(100% - 75px);
  min-width: 1200px;
  //max-height: 80%;
  .el-table {
    --el-table-border-color: #c1c1c1b0;
    --el-table-row-hover-bg-color: #fff3df;
    --el-table-header-text-color: #333;
    --el-table-header-bg-color: #e5e5e5;
    --el-table-tr-bg-color: #f3f3f3;
    --el-table-fixed-left-column: inset 10px 0 10px -10px rgba(0, 0, 0, 0.15);
    --el-table-fixed-right-column: inset -10px 0 10px -10px rgba(0, 0, 0, 0.15);
    color: #454545;
    //min-height: auto !important;
    height: 100%;
    //height: auto;
    /* 滚动条样式，确保滚动 */
    //overflow-y: auto;

    /* 发现样式在f12中修改成功，但是代码中修改失败时可以使用深选择器穿透 /deep/ 和 :: v-deep 在 vue3 中过时了*/

    :deep(.el-table__column-filter-trigger) {
      margin-left: 5px; /* 这将应用到子组件中的样式 */
    }
  }

  //:deep(.el-table__row) {
  //  transition: transform 0.3s ease; /* 添加动画效果，使放大平滑 */
  //}
  //:deep(.el-table__row:hover) {
  //  transform: scale(1.1); /* 放大1.1倍 */
  //}

  .pager {
    position: absolute;
    right: 0;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}


.first-column,
.last-column {
  //display: flex;
  //align-items: center;
  //justify-content: center;
}

.user-header {
  display: flex;
  justify-content: space-between;
  min-width: 1200px;


  :deep(.el-collapse-item__content) {
    padding: 0;
  }

  .el-form {
    //display: flex;
    width: 100%;
  }

  .el-form-item {

    // 水平居中
    align-items: center;
    justify-content: space-between;
    margin: 6px 6px 6px 12px;
    //margin-bottom: 12px;


    span {
      display: flex;
    }
  }

  .right-container {
    display: flex;
    //justify-content: space-between; /* 使子元素两端对齐 */

    .el-button {
      min-width: 75px;
      margin: 8px;
      //transition: transform 0.3s ease; /* 添加动画效果，使放大平滑 */
    }

    //.el-button:hover {
    //  transform: scale(1.1); /* 放大1.1倍 */
    //}
  }
}

.userImage {
  width: 40px; /* Adjust size as needed */
  height: 40px;
  border-radius: 10%; /* 轻度圆角 */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  display: block;
  margin: auto;
  //border: 1px solid #e0e0e0;
  //transition: transform 0.2s ease;
}

</style>