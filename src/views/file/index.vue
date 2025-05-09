<template>
  <div class="file-container">
    <div class="file-header">
      <el-button type="primary" @click="handleUpload">
        <el-icon><Upload /></el-icon>上传文件
      </el-button>
      <el-input
        v-model="fileType"
        placeholder="请输入文件类型搜索"
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
        v-model="materialType"
        placeholder="请输入资料类型搜索"
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
      :data="fileList"
      style="width: 100%; margin-top: 20px"
      border
    >
      <el-table-column prop="name" label="文件名" min-width="200" />
      <el-table-column prop="memorySize" label="大小" width="120">
        <template #default="{ row }">
          {{ formatFileSize(row.memorySize) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="上传时间" width="180" >
        <template #default="{ row }">
          {{ new Date(row.updateTime).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
        </template>
      </el-table-column>
      <el-table-column prop="materialType" label="资料类型" width="120">
        <template #default="{ row }">
          {{ studyTypeMap[row.materialType] }}
        </template>
      </el-table-column>
      <el-table-column prop="fileType" label="文件类型" width="120">
        <template #default="{ row }">
          {{ fileTypeMap[row.fileType] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleDownload(row)">下载</el-button>
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
      v-model="uploadDialogVisible"
      title="上传文件"
      width="400px"
    >
      <el-form
        ref="uploadFormRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="文件类型" prop="fileType">
          <el-select v-model="form.fileType" placeholder="请选择文件类型">
            <el-option
              v-for="(value, key) in fileTypeMap"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="资料类型" prop="materialType">
          <el-select v-model="form.materialType" placeholder="请选择资料类型">
            <el-option
              v-for="(value, key) in studyTypeMap"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文件" prop="file">
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Upload, UploadFilled } from '@element-plus/icons-vue'
import { fileApi } from '@/api'

const store = useStore()

const loading = ref(false)
const fileList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(15)
const fileType = ref('')
const materialType = ref('')
const uploadDialogVisible = ref(false)
const fileTypeMap = {1: '课件', 2: '真题', 3: '资料', 4: '笔记'};
const studyTypeMap = {1: '高数', 2: '英语', 3: '政治', 4: '专业课'};

const uploadHeaders = {
  Authorization: `Bearer ${store.getters.token}`
}

const uploadFormRef = ref()
const form = reactive({
  id: '',
  name: '',
  memorySize: '',
  materialType: '',
  fileType: '',
  file: null
})

const rules = {
  materialType: [{ required: true, message: '请选择资料类型', trigger: 'change' }],
  fileType: [{ required: true, message: '请选择文件类型', trigger: 'change' }],
  file: [{ required: false, message: '请上传文件', trigger: 'change' }]
}


// 获取文件列表
const getFileList = async () => {
  loading.value = true
  try {
    const res = await fileApi.query({
      page: currentPage.value,
      size: pageSize.value,
      fileType: fileType.value,
      materialType: materialType.value
    })
    fileList.value = res.data.data.list
    total.value = res.data.data.total
  } catch (error) {
    console.error('获取文件列表失败：', error)
  } finally {
    loading.value = false
  }
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
  fileType.value = Object.keys(fileTypeMap).find(key => fileTypeMap[key] === fileType.value) || '';
  materialType.value = Object.keys(studyTypeMap).find(key => studyTypeMap[key] === materialType.value) || '';
  getFileList();
  fileType.value = '';
  materialType.value = '';
}

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  getFileList()
}

// 处理上传按钮点击
const handleUpload = () => {
  uploadDialogVisible.value = true
}

// 上传前校验
const beforeUpload = (file) => {
  const isLt100M = file.size / 1024 / 1024 < 100
  if (!isLt100M) {
    ElMessage.error('上传文件大小不能超过 100MB!')
    return false
  }
  return true
}

// 处理文件变化
const handleFileChange = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file.raw)
    await fileApi.upload(formData)
    
    // 更新表单中的文件信息
    form.name = file.raw.name
    form.memorySize = file.raw.size
    
    ElMessage.success('上传成功')
  } catch (error) {
    console.error('上传失败：', error)
    ElMessage.error('上传失败')
  }
}

// 处理下载
const handleDownload = async (row) => {
  try {
    const res = await fileApi.download(row.name)
    const blob = new Blob([res.data])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = row.name
    link.click()
    window.URL.revokeObjectURL(link.href)
  } catch (error) {
    ElMessage.error('下载失败')
  }
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确认删除该文件吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const formData = new FormData() 
      formData.append('id', row.id)
      await fileApi.delete(formData)
      ElMessage.success('删除成功')
      getFileList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 提交上传
const submitUpload = async () => {
  try {
    await uploadFormRef.value.validate()
  
    // 提交表单数据
    await fileApi.add(form)
    
    ElMessage.success('上传成功')
    uploadDialogVisible.value = false
    getFileList()
    
    // 重置表单
    uploadFormRef.value.resetFields()
    form.file = null
  } catch (error) {
    console.error('上传失败：', error)
    ElMessage.error('上传失败')
  }
}

onMounted(() => {
  getFileList()
})
</script>

<style scoped>
.file-container {
  padding: 20px;
}

.file-header {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.upload-demo {
  text-align: center;
}
</style>

