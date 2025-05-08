<template>
  <div class="file-container">
    <div class="file-header">
      <el-button type="primary" @click="handleUpload">
        <el-icon><Upload /></el-icon>上传文件
      </el-button>
      <el-input
        v-model="searchQuery"
        placeholder="请输入文件名搜索"
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
      <el-table-column prop="fileName" label="文件名" min-width="200" />
      <el-table-column prop="fileSize" label="大小" width="120">
        <template #default="{ row }">
          {{ formatFileSize(row.fileSize) }}
        </template>
      </el-table-column>
      <el-table-column prop="uploadTime" label="上传时间" width="180" />
      <el-table-column prop="uploader" label="上传者" width="120" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            @click="handleDownload(row)"
          >下载</el-button>
          <el-button
            type="danger"
            link
            @click="handleDelete(row)"
          >删除</el-button>
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
      <el-upload
        class="upload-demo"
        drag
        action="/api/file/upload"
        :headers="uploadHeaders"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeUpload"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Upload, UploadFilled } from '@element-plus/icons-vue'
import { fileApi } from '@/api'

const store = useStore()

const loading = ref(false)
const fileList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const uploadDialogVisible = ref(false)

const uploadHeaders = {
  Authorization: `Bearer ${store.getters.token}`
}

// 获取文件列表
const getFileList = async () => {
  loading.value = true
  try {
    const res = await fileApi.list({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value
    })
    fileList.value = res.data.list
    total.value = res.data.total
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
  currentPage.value = 1
  getFileList()
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

// 处理上传成功
const handleUploadSuccess = () => {
  ElMessage.success('上传成功')
  uploadDialogVisible.value = false
  getFileList()
}

// 处理上传失败
const handleUploadError = () => {
  ElMessage.error('上传失败')
}

// 处理下载
const handleDownload = async (row) => {
  try {
    const res = await fileApi.download(row.id)
    const blob = new Blob([res.data])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = row.fileName
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
      await fileApi.delete(row.id)
      ElMessage.success('删除成功')
      getFileList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
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