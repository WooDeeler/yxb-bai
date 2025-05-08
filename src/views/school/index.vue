<template>
  <div class="school-container">
    <div class="school-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增院校
      </el-button>
      <el-select
        v-model="searchType"
        placeholder="请选择院校类型"
        style="width: 200px; margin-left: 16px"
        clearable
        @clear="handleSearch"
        @change="handleSearch"
      >
        <el-option label="综合性大学" value="综合性大学" />
        <el-option label="理工类大学" value="理工类大学" />
        <el-option label="农林类大学" value="农林类大学" />
        <el-option label="师范类大学" value="师范类大学" />
      </el-select>
      <el-input
        v-model="searchName"
        placeholder="请输入院校名称搜索"
        style="width: 200px; margin-left: 16px"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      >
        <template #suffix>
          <el-icon class="el-input__icon" @click="handleSearch"><Search /></el-icon>
        </template>
      </el-input>
      <el-input
        v-model="searchCity"
        placeholder="请输入城市搜索"
        style="width: 200px; margin-left: 16px"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      >
        <template #suffix>
          <el-icon class="el-input__icon" @click="handleSearch"><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <el-table
      v-loading="loading"
      :data="schoolList"
      style="width: 100%; margin-top: 20px"
      border
    >
      <el-table-column label="校徽" width="80">
        <template #default="{ row }">
          <el-image
            :src="row.badge"
            :preview-src-list="[row.badge]"
            fit="contain"
            style="width: 50px; height: 50px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="院校名称" width="120" />
      <el-table-column prop="city" label="所在地" width="80" />
      <el-table-column prop="type" label="类型" width="80" />
      <el-table-column prop="introduction" label="简介" min-width="200" />
      <el-table-column prop="majorInfo" label="专业信息" width="200" />
      <el-table-column prop="tags" label="标签" width="180" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="total > 0"
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
    />

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增院校' : '编辑院校'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="校徽" prop="badge">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleBadgeSuccess"
            :before-upload="beforeBadgeUpload"
          >
            <img v-if="form.badge" :src="form.badge" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="院校名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入院校名称" />
        </el-form-item>
        <el-form-item label="所在地" prop="city">
          <el-input v-model="form.city" placeholder="请输入所在地" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="综合性大学" value="综合性大学" />
            <el-option label="理工类大学" value="理工类大学" />
            <el-option label="农林类大学" value="农林类大学" />
            <el-option label="师范类大学" value="师范类大学" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input
            v-model="form.introduction"
            type="textarea"
            :rows="3"
            placeholder="请输入院校简介"
          />
        </el-form-item>
        <el-form-item label="专业信息" prop="majorInfo">
          <el-input
            v-model="form.majorInfo"
            type="textarea"
            :rows="3"
            placeholder="请输入专业信息"
          />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入标签，多个标签用逗号分隔" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { schoolApi } from '@/api'

const loading = ref(false)
const schoolList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchName = ref('')
const searchType = ref('')
const searchCity = ref('')
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

const form = reactive({
  id: '',
  badge: '',
  name: '',
  type: '',
  city: '',
  tags: '',
  introduction: '',
  majorInfo: '',
})

const rules = {
  badge: [{ required: false, message: '请上传校徽', trigger: 'change' }],
  name: [{ required: true, message: '请输入院校名称', trigger: 'blur' }],
  city: [{ required: true, message: '请输入所在地', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  introduction: [{ required: true, message: '请输入院校简介', trigger: 'blur' }],
  majorInfo: [{ required: true, message: '请输入专业信息', trigger: 'blur' }],
  tags: [{ required: true, message: '请输入标签', trigger: 'blur' }]
}

// 处理校徽上传成功
const handleBadgeSuccess = (res) => {
  form.badge = res.data.url
}

// 校徽上传前的验证
const beforeBadgeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('校徽必须是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('校徽大小不能超过 2MB!')
    return false
  }
  return true
}

// 获取院校列表
async function getSchoolList() {
  try {
    loading.value = true
    const res = await schoolApi.list({
      page: currentPage.value,
      size: pageSize.value,
    })
    if (res.data.code === 200) {
      schoolList.value = res.data.data.list
      total.value = res.data.data.total
      console.log(res)
    } else {
      ElMessage.error(res.message || '获取院校列表失败')
    }
  } catch (error) {
    console.error('获取院校列表失败:', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

async function condQueryUniv() {
  try {
    loading.value = true
    const res = await schoolApi.condQuery({
      name: searchName.value,
      type: searchType.value,
      city: searchCity.value,
      page: currentPage.value,
      size: pageSize.value
    })
    if (res.data.code === 200) {
      schoolList.value = res.data.data.list
      total.value = res.data.data.total
    } else {
      ElMessage.error(res.message || '获取院校列表失败')
    }
  } catch (error) {
    console.error('获取院校列表失败:', error)
    ElMessage.error('获取失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  condQueryUniv()
}

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  condQueryUniv()
}

// 重置表单
const resetForm = () => {
  form.name = ''
  form.city = ''
  form.type = ''
  form.introduction = ''
  form.majorInfo = ''
  form.tags = ''
  form.badge = ''
  formRef.value?.resetFields()
}

// 处理新增
const handleAdd = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 处理提交
const handleSubmit = () => {
  formRef.value?.validate(valid => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          schoolApi.create(form)
          ElMessage.success('新增成功')
        } else {
          schoolApi.update(form)
          ElMessage.success('编辑成功')
        }
        dialogVisible.value = false
        getSchoolList()
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '新增失败' : '编辑失败')
      }
    }
  })
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确认删除该院校吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    try {
      const formData = new FormData();
      formData.append('id', row.id);
      schoolApi.delete(formData)
      ElMessage.success('删除成功')
      getSchoolList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

onMounted(() => {
  getSchoolList()
})
</script>

<style scoped>
.school-container {
  padding: 20px;
}

.school-header {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>