<template>
  <div class="user-header">
    <el-form :inline="true" :model="formSearch">
      <el-form-item label="用户名">
        <el-input v-model="formSearch.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="工号">
        <el-input v-model="formSearch.userAddress" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门">
        <el-input v-model="formSearch.userAddress" placeholder="请选择部门" />
      </el-form-item>
      <el-form-item label="出生日期">
<!--        <el-input v-model="formSearch.userName" placeholder="请选择出生日期" />-->
        <el-date-picker
            v-model="formSearch.userBirth"
            type="date"
            label="出生日期"
            placeholder="请输入出生日期"
            style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="入职日期">
        <!--        <el-input v-model="formSearch.userName" placeholder="请选择出生日期" />-->
        <el-date-picker
            v-model="formSearch.userJoinDate"
            type="date"
            label="入职日期"
            placeholder="请输入入职日期"
            style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="formSearch.userAddress" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formSearch.userAddress" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formSearch.userAddress" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>
    <!-- 右侧按钮区域 -->
    <div class="right-container">
      <el-button type="info" @click="handleSearch">搜索</el-button>
      <div style="display: flex; margin-top: 15px">
        <el-button type="danger" @click="handleDeleteAll" style="margin-right: 8px;">× 批量删除</el-button>
        <el-button type="primary" @click="handleAdd">+ 新增</el-button>
      </div>
    </div>
  </div>
  <div class="table">
    <el-table :data="list" style="width: 100%" table-layout="fixed" @selection-change="handleSelectionChange" >
        <el-table-column fixed type="selection" width="55" align="center"/>
        <el-table-column
            v-for="item in tableLabel"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            :width="item.width ? item.width : auto"
            align="center"
            :fixed="item.fixed ? item.fixed : false"
        >
          <template v-if ="item.prop === 'status'" #default="scope">
            <el-tag
                :type="scope.row.status === '在职' ? 'primary' : 'info'"
                disable-transitions
            >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column class="last-column" fixed="right" label="操作" min-width="180" header-align="center" align="center">
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
    <el-pagination
        small
        background
        layout="prev, pager, next"
        :total="config.total"
        @current-change="changePage"
        class="pager mt-4"
    />
  </div>
  <el-dialog
      v-model="dialogVisible"
      :title="action == 'add' ? '新增用户' : '编辑用户'"
      width="35%"
      :before-close="handleClose"
  >
    <el-form :inline="true" :model="formUser" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item
              label="姓名"
              prop="name"
              :rules="[{ required: true, message: '姓名是必填项' }]"
          >
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="年龄"
              prop="age"
              :rules="[
              { required: true, message: '年龄是必填项' },
              { type: 'number', message: '年龄必须是数字' },
            ]"
          >
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
              label="性别"
              prop="sex"
              :rules="[{ required: true, message: '性别是必选项' }]"
          >
            <el-select v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="0" />
              <el-option label="女" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="出生日期"
              prop="birth"
              :rules="[{ required: true, message: '出生日期是必选项' }]"
          >
            <el-date-picker
                v-model="formUser.birth"
                type="date"
                label="出生日期"
                placeholder="请输入"
                style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
            label="地址"
            prop="addr"
            :rules="[{ required: true, message: '地址是必填项' }]"
        >
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确定</el-button
        >
      </span>
    </template> -->
  </el-dialog>
</template>


<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
  reactive, computed,
} from "vue";
import { formatDateTime } from '@/utils/format';

export default defineComponent({
  setup() {
    // const tableLayout = ref<TableInstance['tableLayout']>('fixed')
    const { proxy } = getCurrentInstance();
    const list = ref([]);
    const tableLabel = reactive([
      {
        prop: "userName",
        label: "姓名",
        fixed: 'left',
      },
      {
        prop: "roleName",
        label: "系统角色",
        fixed: '',
      },
      {
        prop: "departmentName",
        label: "部门",
        fixed: 'left',
      },
      {
        prop: "userImage",
        label: "员工头像",
        width: 150,
      },
      {
        prop: "empNum",
        label: "工号",
        width: 150,
      },
      {
        prop: "telephone",
        label: "手机号",
        width: 150,
      },
      {
        prop: "email",
        label: "邮箱",
        width: 220,
      },
      {
        prop: "status",
        label: "状态",
      },
      {
        prop: "ctTime",
        label: "创建时间",
        width: 220,
      },
      {
        prop: "upTime",
        label: "更新时间",
        width: 220,
      },
    ]);
    const selectedIds = ref([]);

    const userDataTest = ref ({
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
        {
          userId: 6,
          userName: "黄岚",
          roleName: "user",
          departmentName: "销售部",
          userImage: "SHhufLveRR",
          empNum: "5855972111",
          telephone: "760-6340-3641",
          email: "huang12@qq.com",
          status: 1,
          ctTime: "2024-09-26T06:05:57.000+00:00",
          upTime: null
        },
        {
          userId: 1,
          userName: "梁震南",
          roleName: "boss",
          departmentName: "销售部",
          userImage: "1yeWOPS3Kd",
          empNum: "5938189848",
          telephone: "192-0151-2897",
          email: "liangzhenn8@qq.com",
          status: 0,
          ctTime: "2024-09-10T07:13:01.000+00:00",
          upTime: "2024-09-10T07:13:01.000+00:00"
        },
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
        {
          userId: 6,
          userName: "黄岚",
          roleName: "user",
          departmentName: "销售部",
          userImage: "SHhufLveRR",
          empNum: "5855972111",
          telephone: "760-6340-3641",
          email: "huang12@qq.com",
          status: 1,
          ctTime: "2024-09-26T06:05:57.000+00:00",
          upTime: null
        },
        {
          userId: 1,
          userName: "梁震南",
          roleName: "boss",
          departmentName: "销售部",
          userImage: "1yeWOPS3Kd",
          empNum: "5938189848",
          telephone: "192-0151-2897",
          email: "liangzhenn8@qq.com",
          status: 0,
          ctTime: "2024-09-10T07:13:01.000+00:00",
          upTime: "2024-09-10T07:13:01.000+00:00"
        },
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
        {
          userId: 6,
          userName: "黄岚",
          roleName: "user",
          departmentName: "销售部",
          userImage: "SHhufLveRR",
          empNum: "5855972111",
          telephone: "760-6340-3641",
          email: "huang12@qq.com",
          status: 1,
          ctTime: "2024-09-26T06:05:57.000+00:00",
          upTime: null
        },
        {
          userId: 1,
          userName: "梁震南",
          roleName: "boss",
          departmentName: "销售部",
          userImage: "1yeWOPS3Kd",
          empNum: "5938189848",
          telephone: "192-0151-2897",
          email: "liangzhenn8@qq.com",
          status: 0,
          ctTime: "2024-09-10T07:13:01.000+00:00",
          upTime: "2024-09-10T07:13:01.000+00:00"
        },
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
        {
          userId: 6,
          userName: "黄岚",
          roleName: "user",
          departmentName: "销售部",
          userImage: "SHhufLveRR",
          empNum: "5855972111",
          telephone: "760-6340-3641",
          email: "huang12@qq.com",
          status: 1,
          ctTime: "2024-09-26T06:05:57.000+00:00",
          upTime: null
        },
        {
          userId: 1,
          userName: "梁震南",
          roleName: "boss",
          departmentName: "销售部",
          userImage: "1yeWOPS3Kd",
          empNum: "5938189848",
          telephone: "192-0151-2897",
          email: "liangzhenn8@qq.com",
          status: 0,
          ctTime: "2024-09-10T07:13:01.000+00:00",
          upTime: "2024-09-10T07:13:01.000+00:00"
        },
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
          userName: "小李",
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

    onMounted(() => {
      getUserData(config);
    });
    const config = reactive({
      total: 0,
      page: 1,
      userName: "",
      userSex: "",
      userBirth: "",
      userAddress: "",
    });
    const getUserData = async (config) => {
      // 通过 mock 或请求获取用户数据
      // let res = await proxy.$api.getUserData(config);
      // config.total = res.count;
      // list.value = res.list.map((item) => {
      //   item.sexLabel = item.sex === 0 ? "女" : "男";
      //   return item;
      // });

      // 保持 userDataTest 的数据不变
      config.total = userDataTest.value.total;

      // 创建一个新的数据集合，不直接修改 userDataTest
      list.value = userDataTest.value.records.map((item) => {
        let newItem = { ...item }; // 克隆一份数据
        newItem.roleName = newItem.roleName === "admin" ? "管理员" :
            (newItem.roleName === "boss" ? "老板" :
                (newItem.roleName === "user" ? "普通用户" : "其他用户"));
        newItem.ctTime = newItem.ctTime ? formatDateTime(newItem.ctTime) : '-'; // 格式化创建时间
        newItem.upTime = newItem.upTime ? formatDateTime(newItem.upTime) : '-'; // 格式化更新时间
        newItem.status = newItem.status === 1 ? "在职" : "离职"; // 格式化状态
        return newItem; // 返回新的对象
      });
    };
    const changePage = (page) => {
      // console.log(page);
      config.page = page;
      getUserData(config);
    };
    const formSearch = reactive({
      userName: "",
      userSex: "",
      userBirth: "",
      userAddress: "",
      userJoinDate: "",
    });
    const handleSearch = () => {
      config.userName = formSearch.userName;
      getUserData(config);
    };
    // 控制模态框的显示隐藏
    const dialogVisible = ref(false);
    const handleClose = (done) => {
      ElMessageBox.confirm("确定关闭吗?")
          .then(() => {
            proxy.$refs.userForm.resetFields();
            done();
          })
          .catch(() => {
            // catch error
          });
    };
    // 添加用户的form数据
    const formUser = reactive({
      name: "", // 添加用户的 用户名
      age: "",
      sex: "",
      birth: "",
      addr: "",
    });
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
    const onSubmit = () => {
      proxy.$refs.userForm.validate(async (valid) => {
        if (valid) {
          if (action.value == "add") {
            formUser.birth = timeFormat(formUser.birth);
            let res = await proxy.$api.addUser(formUser);
            if (res) {
              // console.log(proxy.$refs);
              dialogVisible.value = false;
              proxy.$refs.userForm.resetFields();
              getUserData(config);
            }
          } else {
            // 编辑的接口
            formUser.sex == "男" ? (formUser.sex = 1) : (formUser.sex = 0);
            let res = await proxy.$api.editUser(formUser);
            if (res) {
              // console.log(proxy.$refs);
              dialogVisible.value = false;
              proxy.$refs.userForm.resetFields();
              getUserData(config);
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
    // 取消
    const handleCancel = () => {
      dialogVisible.value = false;
      proxy.$refs.userForm.resetFields();
    };
    // 区分编辑和新增
    const action = ref("add");
    // 编辑用户
    const handleEdit = (row) => {
      // 浅拷贝

      action.value = "edit";
      dialogVisible.value = true;
      row.sex == 1 ? (row.sex = "男") : (row.sex = "女");
      proxy.$nextTick(() => {
        Object.assign(formUser, row);
      });
    };
    // 新增用户
    const handleAdd = () => {
      action.value = "add";
      dialogVisible.value = true;
    };
    // 删除用户
    const handleDelete = (row) => {
      ElMessageBox.confirm("你确定删除吗?")
          .then(async () => {
            await proxy.$api.deleteUser({
              id: row.id,
            });

            ElMessage({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
            getUserData(config);
          })
          .catch(() => {
            // catch error
          });
    };

    // 复选框勾选状态改变时的处理函数
    const handleSelectionChange = (selectedItems) => {
      selectedIds.value = selectedItems.map(item => item.userId); // 提取选中的userId
      console.log(selectedIds.value)
    };

    return {
      list,
      tableLabel,
      // tableLayout,
      config,
      changePage,
      formSearch,
      handleSearch,
      dialogVisible,
      handleClose,
      formUser,
      onSubmit,
      handleCancel,
      action,
      handleEdit,
      handleAdd,
      handleDelete,
      handleSelectionChange,
      // formatDateTime,
      // handleDeleteAll,
    };
  },
});
</script>

<style lang="less" scoped>
.table {
  background-color: #fafafa;
  position: relative;
  height: 80%;
  //max-height: 80%;
  .el-table {
    --el-table-border-color: #c1c1c1b0;
    --el-table-row-hover-bg-color: #fff3df;
    --el-table-header-text-color: #333;
    --el-table-header-bg-color: #e5e5e5;
    --el-table-tr-bg-color: #f3f3f3;
    --el-table-fixed-left-column: inset 10px 0 10px -10px rgba(0,0,0,0.15);
    --el-table-fixed-right-column: inset -10px 0 10px -10px rgba(0,0,0,0.15);
    color: #454545;
    //min-height: auto !important;
    height: 100%;
    /* 滚动条样式，确保滚动 */
    //overflow-y: auto;
  }


  .el-table-column {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .pager {
    position: absolute;
    right: 0;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

.user-header {
  display: flex;
  justify-content: space-between;

  .el-form-item {
    margin-right: 18px;
    margin-bottom: 12px;
  }
  .right-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .el-button {
      min-width: 75px;
    }
  }
}

</style>