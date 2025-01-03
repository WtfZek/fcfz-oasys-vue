<template>
  <el-card class="my-card">
    <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
      <el-form
          ref="formRef"
          :model="formModel"
          label-width="120px"
          class="dynamic-form"
      >
        <el-form-item>
          <span>{{ formTemplate.templateName }}</span>
        </el-form-item>

        <el-form-item :prop="`formName`" label="表单名称"
                      :rules="[{ required: true, message: '表单名称为必填字段', trigger: 'blur'}]">
          <el-input
              v-model="formModel[`formName`]"
              placeholder="请输入表单名称"
          />
        </el-form-item>

        <template v-for="field in formTemplate.templateFields" :key="field.id">

          <el-form-item
              v-if="(field.formItemType === 'single_select') && field.isVisible === 1"
              :label="field.fieldTitle"
              :prop="`field_${field.fieldId}`"
              :rules="field.validationRule"
          >
            <el-select
                v-model="formModel[`field_${field.fieldId}`]"
                clearable
                :placeholder="field.defaultValue"
                style="width: 260px"
            >
              <el-option
                  v-for="item in field.fieldOptions"
                  :key="item.optionValue"
                  :label="item.optionLabel"
                  :value="item.optionValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item
              v-if="(field.formItemType === 'multiple_select' || field.formItemType === 'user_select') && field.isVisible === 1"
              :label="field.fieldTitle"
              :prop="`field_${field.fieldId}`"
              :rules="field.validationRule"
          >
            <el-select
                v-model="formModel[`field_${field.fieldId}`]"
                clearable
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="2"
                style="width: 260px"
            >
              <template #header>
                <el-checkbox
                    v-model="field.checkAll"
                    :indeterminate="field.indeterminate"
                    @change="handleCheckAll(field, field.checkAll)"
                >
                  全部
                </el-checkbox>
              </template>
              <el-option
                  v-for="item in field.fieldOptions"
                  :key="item.optionValue"
                  :label="item.optionLabel"
                  :value="item.optionValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item
              v-if="(field.formItemType === 'input') && field.isVisible === 1"
              :label="field.fieldTitle"
              :prop="`field_${field.fieldId}`"
              :rules="field.validationRule"
          >
            <el-input
                v-model="formModel[`field_${field.fieldId}`]"
                :placeholder="field.defaultValue"
            />
          </el-form-item>

          <el-form-item
              v-if="(field.formItemType === 'text-input' || field.formItemType === 'rich-text-editor') && field.isVisible === 1"
              :label="field.fieldTitle"
              :prop="`field_${field.fieldId}`"
              :rules="field.validationRule"
          >
            <el-input
                v-model="formModel[`field_${field.fieldId}`]"
                :autosize="{ minRows: 3, maxRows: 10}"
                resize="none"
                type="textarea"
                :placeholder="field.defaultValue"
            />
          </el-form-item>

          <el-form-item
              v-if="(field.formItemType === 'datetime_piker') && field.isVisible === 1"
              :label="field.fieldTitle"
              :prop="`field_${field.fieldId}`"
              :rules="field.validationRule"
          >
            <el-date-picker
                v-model="formModel[`field_${field.fieldId}`]"
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="field.defaultValue"
                style="width: 260px"
            />
          </el-form-item>

          <el-form-item
              v-if="(field.formItemType === 'date_piker') && field.isVisible === 1"
              :label="field.fieldTitle"
              :prop="`field_${field.fieldId}`"
              :rules="field.validationRule"
          >
            <el-date-picker
                v-model="formModel[`field_${field.fieldId}`]"
                type="date"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="field.defaultValue"
                style="width: 260px"
            />
          </el-form-item>

          <el-form-item
              v-if="(field.formItemType === 'image_upload') && field.isVisible === 1"
              :label="field.fieldTitle"
              :prop="`field_${field.fieldId}`"
              :rules="field.validationRule"
          >
            <el-upload action="#" list-type="picture-card" :auto-upload="false">
              <el-icon>
                <Plus/>
              </el-icon>

              <template #file="{ file }">
                <div>
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
                  <span class="el-upload-list__item-actions">
                    <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                    >
                    <el-icon><zoom-in/></el-icon>
                    </span>
                    <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                    >
                      <el-icon><Download/></el-icon>
                    </span>
                    <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                    >
                    <el-icon><Delete/></el-icon>
                  </span>
                  </span>
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item
              v-if="(field.formItemType === 'file_upload') && field.isVisible === 1"
              :label="field.fieldTitle"
              :prop="`field_${field.fieldId}`"
              :rules="field.validationRule"
          >
            <el-upload
                class="upload-demo"
                drag
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                multiple
            >
              <el-icon class="el-icon--upload">
                <upload-filled/>
              </el-icon>
              <div class="el-upload__text">
                拖动文件到这里，或 <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  小于 500kb 的 jpg/png 文件
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <!-- 可扩展其他字段类型 -->
        </template>

        <!--          来一个el按钮-->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>


    </div>

  </el-card>

  <div v-html="htmlContent"></div>

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
import {ref, reactive, onMounted, onBeforeMount, watch, getCurrentInstance, nextTick} from 'vue';

export default {
  setup() {

    const formRef = ref(null); // 用于表单引用
    const checkAll = ref(false) // 全选标志
    const indeterminate = ref(false) // 不确定状态
    // const value = ref(['多选项1','多选项2']) // 当前选中项

    const htmlContent = ref(
        '<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><span style="font-size: 0.9em; color: #888;">表单名称：</span><br/><div style="margin: 4px 0;">4探亲4太其4太</div></div><br/><div><span style="font-size: 0.9em; color: #888;">请假类型：</span><br/><div style="margin: 4px 0;">年假</div></div><br/><div><span style="font-size: 0.9em; color: #888;">请假开始时间：</span><br/><div style="margin: 4px 0;">2024-11-27 16:21:02</div></div><br/><div><span style="font-size: 0.9em; color: #888;">请假结束时间：</span><br/><div style="margin: 4px 0;">2024-11-30 00:00:00</div></div><br/><div><span style="font-size: 0.9em; color: #888;">请假事由：</span><br/><div style="margin: 4px 0;">2让4让他父亲4frt</div></div><br/><div><span style="font-size: 0.9em; color: #888;">测试用多选项：</span><br/><div style="margin: 4px 0;"><ul style="margin: 4px 0; padding-left: 20px;"><li>多选项5</li><li>多选项1</li><li>多选项3</li></ul></div></div><br/><div><span style="font-size: 0.9em; color: #888;">测试富文本编辑框：</span><br/><div style="margin: 4px 0;">2前提取4太</div></div><br/></div>'
    );

    const formModel = reactive({});

    // const formTemplate = reactive({
    //   "templateId": 1,
    //   "templateName": "请假",
    //   "isSys": "1",
    //   "templateType": "approval_leave",
    //   "category": "排班",
    //   "status": "0",
    //   "updatedTime": null,
    //   "templateFields": [
    //     {
    //       "fieldId": 1,
    //       "fieldTitle": "请假类型",
    //       "fieldType": "varchar",
    //       "fieldSort": 1,
    //       "validationRule": [
    //         {
    //           "required": true,
    //           "message": "请假类型不能为空",
    //           "trigger": "change"
    //         }
    //       ],
    //       "isRequired": 1,
    //       "formItemType": "single_select",
    //       "defaultValue": "请输入",
    //       "isSummary": 1,
    //       "isVisible": 1,
    //       "fieldOptions": [
    //         {
    //           "id": 1,
    //           "templateFieldId": 1,
    //           "optionValue": "年假",
    //           "optionLabel": "年假",
    //           "oprionSort": 1
    //         },
    //         {
    //           "id": 2,
    //           "templateFieldId": 1,
    //           "optionValue": "事假",
    //           "optionLabel": "事假",
    //           "oprionSort": 2
    //         },
    //         {
    //           "id": 3,
    //           "templateFieldId": 1,
    //           "optionValue": "病假",
    //           "optionLabel": "病假",
    //           "oprionSort": 3
    //         },
    //         {
    //           "id": 4,
    //           "templateFieldId": 1,
    //           "optionValue": "调休",
    //           "optionLabel": "调休",
    //           "oprionSort": 4
    //         },
    //         {
    //           "id": 5,
    //           "templateFieldId": 1,
    //           "optionValue": "产假",
    //           "optionLabel": "产假",
    //           "oprionSort": 5
    //         },
    //         {
    //           "id": 6,
    //           "templateFieldId": 1,
    //           "optionValue": "陪产假",
    //           "optionLabel": "陪产假",
    //           "oprionSort": 6
    //         },
    //         {
    //           "id": 7,
    //           "templateFieldId": 1,
    //           "optionValue": "婚假",
    //           "optionLabel": "婚假",
    //           "oprionSort": 7
    //         },
    //         {
    //           "id": 8,
    //           "templateFieldId": 1,
    //           "optionValue": "例假",
    //           "optionLabel": "例假",
    //           "oprionSort": 8
    //         },
    //         {
    //           "id": 9,
    //           "templateFieldId": 1,
    //           "optionValue": "丧假",
    //           "optionLabel": "丧假",
    //           "oprionSort": 9
    //         }
    //       ]
    //     },
    //     {
    //       "fieldId": 2,
    //       "fieldTitle": "请假开始时间",
    //       "fieldType": "datetime",
    //       "fieldSort": 2,
    //       "validationRule": [
    //         {
    //           "required": true,
    //           "message": "请假开始时间不能为空",
    //           "trigger": "blur"
    //         }
    //       ],
    //       "isRequired": 1,
    //       "formItemType": "datetime_piker",
    //       "defaultValue": "请选择日期",
    //       "isSummary": 1,
    //       "isVisible": 1,
    //       "fieldOptions": null
    //     },
    //     {
    //       "fieldId": 3,
    //       "fieldTitle": "请假结束时间",
    //       "fieldType": "datetime",
    //       "fieldSort": 3,
    //       "validationRule": [
    //         {
    //           "required": true,
    //           "message": "请假结束时间不能为空",
    //           "trigger": "blur"
    //         }
    //       ],
    //       "isRequired": 1,
    //       "formItemType": "datetime_piker",
    //       "defaultValue": "请选择日期",
    //       "isSummary": 1,
    //       "isVisible": 1,
    //       "fieldOptions": null
    //     },
    //     {
    //       "fieldId": 4,
    //       "fieldTitle": "请假时长（天）",
    //       "fieldType": "int",
    //       "fieldSort": 4,
    //       "validationRule": [
    //         {
    //           "required": true,
    //           "message": "请假时长不能为空",
    //           "trigger": "blur"
    //         }
    //       ],
    //       "isRequired": 1,
    //       "formItemType": "input",
    //       "defaultValue": "自动计算",
    //       "isSummary": 0,
    //       "isVisible": 0,
    //       "fieldOptions": null
    //     },
    //     {
    //       "fieldId": 5,
    //       "fieldTitle": "请假事由",
    //       "fieldType": "longtext",
    //       "fieldSort": 5,
    //       "validationRule": [
    //         {
    //           "required": true,
    //           "message": "请假事由不能为空",
    //           "trigger": "blur"
    //         }
    //       ],
    //       "isRequired": 1,
    //       "formItemType": "text-input",
    //       "defaultValue": "请输入",
    //       "isSummary": 1,
    //       "isVisible": 1,
    //       "fieldOptions": null
    //     },
    //     {
    //       "fieldId": 6,
    //       "fieldTitle": "测试用多选项",
    //       "fieldType": "multi-varchar",
    //       "fieldSort": 6,
    //       "validationRule": [
    //         {
    //           "required": true,
    //           "message": "测试用多选项不能为空",
    //           "trigger": "change"
    //         }
    //       ],
    //       "isRequired": 1,
    //       "formItemType": "multiple_select",
    //       "defaultValue": "请选择多选项",
    //       "isSummary": 0,
    //       "isVisible": 1,
    //       "fieldOptions": [
    //         {
    //           "id": 10,
    //           "templateFieldId": 6,
    //           "optionValue": "多选项1",
    //           "optionLabel": "多选项1",
    //           "oprionSort": 1
    //         },
    //         {
    //           "id": 11,
    //           "templateFieldId": 6,
    //           "optionValue": "多选项2",
    //           "optionLabel": "多选项2",
    //           "oprionSort": 2
    //         },
    //         {
    //           "id": 12,
    //           "templateFieldId": 6,
    //           "optionValue": "多选项3",
    //           "optionLabel": "多选项3",
    //           "oprionSort": 3
    //         },
    //         {
    //           "id": 13,
    //           "templateFieldId": 6,
    //           "optionValue": "多选项4",
    //           "optionLabel": "多选项4",
    //           "oprionSort": 4
    //         },
    //         {
    //           "id": 14,
    //           "templateFieldId": 6,
    //           "optionValue": "多选项5",
    //           "optionLabel": "多选项5",
    //           "oprionSort": 5
    //         }
    //       ]
    //     },
    //     {
    //       "fieldId": 7,
    //       "fieldTitle": "测试多选用户数据",
    //       "fieldType": "multi-bigint",
    //       "fieldSort": 7,
    //       "validationRule": [
    //         {
    //           "required": true,
    //           "message": "测试多选用户数据不能为空",
    //           "trigger": "change"
    //         }
    //       ],
    //       "isRequired": 1,
    //       "formItemType": "user_select",
    //       "defaultValue": "请选择用户",
    //       "isSummary": 0,
    //       "isVisible": 0,
    //       "fieldOptions": null
    //     },
    //     {
    //       "fieldId": 8,
    //       "fieldTitle": "测试富文本编辑框",
    //       "fieldType": "longtext",
    //       "fieldSort": 8,
    //       "validationRule": [
    //         {
    //           "required": true,
    //           "message": "测试富文本编辑框不能为空",
    //           "trigger": "blur"
    //         },
    //         {
    //           "pattern": "^1[3-9]\\d{9}$",
    //           "message": "请输入有效的手机号",
    //           "trigger": "blur"
    //         }
    //       ],
    //       "isRequired": 1,
    //       "formItemType": "rich-text-editor",
    //       "defaultValue": "编辑内容...",
    //       "isSummary": 0,
    //       "isVisible": 1,
    //       "fieldOptions": null
    //     }
    //   ]
    // });

    const formTemplate = reactive({});

    let formData = reactive({
      "formId": null,
      "formName": null,
      "formTemplateId": null,
      "formRouter": null,
      "isScheduled": null,
      "sendTime": null,
      "status": null,
      "formValues": [
        {
          "fieldId": null,
          "fieldValue": null,
        },
      ],
    });

    // const setupDynamicWatchers = () => {
    //   formTemplate.templateFields.forEach((field) => {
    //     if (field.formItemType === "multiple_select") {
    //       watch(
    //           () => formModel[`field_${field.fieldId}`], // 监听动态绑定的 model 值
    //           (newVal) => {
    //             const totalOptions = field.fieldOptions.map((opt) => opt.optionValue);
    //             if (!Array.isArray(newVal)) {
    //               field.checkAll = false;
    //               field.indeterminate = false;
    //             } else {
    //               const selectedCount = newVal.length;
    //               if (selectedCount === 0) {
    //                 field.checkAll = false;
    //                 field.indeterminate = false;
    //               } else if (selectedCount === totalOptions.length) {
    //                 field.checkAll = true;
    //                 field.indeterminate = false;
    //               } else {
    //                 field.checkAll = false;
    //                 field.indeterminate = true;
    //               }
    //             }
    //           },
    //           {immediate: true} // 初始化时触发
    //       );
    //     }
    //   });
    // };

    const handleCheckAll = (field, value) => {
      const allOptions = field.fieldOptions.map(option => option.optionValue);
      formModel[`field_${field.fieldId}`] = value ? allOptions : [];
      field.indeterminate = false;
    };

    // const setupDynamicCalculations = () => {
    //   formTemplate.templateFields.forEach((field) => {
    //     if (field.autoCalculationExpression) {
    //       // 提取依赖字段
    //       const dependentFields = field.autoCalculationExpression.match(/field_\d+/g) || [];
    //
    //       // 动态监听所有依赖字段
    //       dependentFields.forEach((dependentField) => {
    //         const targetField = formTemplate.templateFields.find(
    //             (f) => `field_${f.id}` === dependentField
    //         );
    //
    //         if (targetField) {
    //           watch(
    //               () => targetField.fieldValue,
    //               () => {
    //                 calculateFieldValue(field);
    //               }
    //           );
    //         }
    //       });
    //     }
    //   });
    // };

    // 计算字段的值
    const calculateFieldValue = (field) => {
      if (!field.autoCalculationExpression) return;

      try {
        // 动态生成计算函数
        const calculationFunc = new Function(
            ...formTemplate.templateFields.map((f) => `field_${f.id}`),
            `return ${field.autoCalculationExpression};`
        );

        // 提取当前字段值
        const args = formTemplate.templateFields.map((f) => {
          if (f.fieldType === 'datetime') {
            // 转换 datetime 为时间戳
            return new Date(f.fieldValue).getTime();
          }
          return f.fieldValue;
        });

        // 执行计算
        let result = calculationFunc(...args);


        // 如果字段类型为 "int"，向下取整
        if (field.fieldType === 'int') {
          result = Math.floor(result);
        }

        // 将结果精确到 0.5 天
        result = Math.round(result * 2) / 2;

        // 更新字段值
        field.fieldValue = result;
      } catch (error) {
        console.error('计算表达式错误:', error);
      }
    };

    function transformToFormData(formTemplate) {
      // 从原始数据提取需要的字段
      const {formId, formName, templateId, formRouter, isScheduled, sendTime, status, templateFields} = formTemplate;

      // 构造目标格式中的 formValues 数组
      // const formValues = templateFields.map(field => ({
      //   fieldId: field.fieldId,
      //   fieldValue: field.fieldValue
      // }));

      // 返回目标格式的数据
      formData = {
        formId: formId || null,
        formName: formModel[`formName`] || null,
        templateId: templateId || null,
        formRouter: formRouter || null,
        isScheduled: isScheduled || "0",
        sendTime: sendTime || null,
        status: status || "1",
        // formValues,
        formValues: formTemplate.templateFields.map((field) => ({
          fieldId: field.fieldId,
          fieldTitle: field.fieldTitle,
          fieldValue: formModel[`field_${field.fieldId}`],
        })),
      };

    }

    const {proxy} = getCurrentInstance();
    const handleSubmit = async () => {
      // 调用 validate 方法进行校验
      // 获取到真正的表单元素
      formRef.value.validate(async valid => {
        if (valid) {
          // 表单所有元素通过验证
          await proxy.$api.addFrom(formData);
        } else {
          ElMessage.error('请检查填写内容');
        }
      });
      transformToFormData(formTemplate)
    }

    const initFormModel = () => {
      console.log('formTemplate of initFormModel', formTemplate)
      formTemplate.templateFields.forEach((field) => {
        formModel[`field_${field.fieldId}`] = field.fieldValue || (field.formItemType === "multiple_select" ? [] : null);
      });
    }

    const parseRegexPatterns = (formTemplate) => {
      // 遍历 templateFields 数组
      formTemplate.templateFields.forEach(field => {
        if (field.validationRule && Array.isArray(field.validationRule)) {
          // 遍历 validationRule 数组
          field.validationRule.forEach(rule => {
            // 检查是否存在 pattern 字段，并且其值是字符串
            if (rule.pattern && typeof rule.pattern === 'string') {
              // 正则表达式字符串以 "/" 包围，去除前后的 "/"
              const regexStr = rule.pattern.slice(1, -1); // 去掉 "/"
              try {
                // 创建 RegExp 对象
                rule.pattern = new RegExp(regexStr);
              } catch (error) {
                console.error("无效的正则表达式:", rule.pattern);
              }
            }
          });
        }
      });
    }

    const handleCancel = () => {

    }

    const getFormTemplateById = async (id) => {
      try {
        let res = await proxy.$api.getFormTemplate(id); // 更新 formTemplate
        Object.assign(formTemplate, res);
        console.log('formTemplate', formTemplate)
      } catch (error) {
        console.error("获取表单模板失败", error);
      }
    };

    onBeforeMount(async () => {
      await getFormTemplateById(1); // 确保模板数据加载完成
      // setupDynamicWatchers();
      // setupDynamicCalculations();
      initFormModel(); // 确保 DOM 渲染后初始化表单
      parseRegexPatterns(formTemplate); // 解析验证规则
      console.log('formData', formData);
      // console.log(formData)
      // console.log(JSON.stringify(formData, null, 2));
    });

    return {
      htmlContent,
      formModel,
      formData,
      formRef,
      checkAll,
      indeterminate,
      formTemplate,
      handleCancel,
      handleCheckAll,
      handleSubmit,
    }
  }
}
</script>

<style lang="less" scoped>
.my-card {
  //自动显示滚动条
  overflow-y: auto;
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

.el-menu-item {
  overflow: hidden;
  transition: transform 0.3s ease; /* 添加动画效果，使放大平滑 */
}

.el-menu-item:hover {
  transform: scale(1.05); /* 只放大高度，不放大宽度 */
}
</style>
