<template>
  <div class="news-container">
    <div class="news-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增新闻
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="newsList"
      style="width: 100%; margin-top: 20px"
      border
    >
      <el-table-column prop="title" label="标题" width="240" />
      <el-table-column prop="theme" label="主题" width="120" />
      <el-table-column prop="content" label="内容" min-width="200">
        <template #default="{ row }">
          <div v-if="!row.showFullContent">
            {{ row.content.slice(0, 20) }}...
            <el-button type="text" @click="row.showFullContent = true">展开</el-button>
          </div>
          <div v-else>
            {{ row.content }}
            <el-button type="text" @click="row.showFullContent = false">收起</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="80">
        <template #default="{ row }">
          <el-image
            :src="row.images"
            :preview-src-list="[row.images]"
            fit="contain"
            style="width: 50px; height: 50px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="publishSource" label="来源" width="120" />
      <el-table-column prop="publishTime" label="发布时间" width="110">
        <template #default="{ row }">
          {{ new Date(row.publishTime).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="120" />
      <el-table-column prop="relatedUniversity" label="关联院校" width="120" />
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
      :title="dialogType === 'add' ? '新增新闻' : '编辑新闻'"
      width="800px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入新闻标题" />
        </el-form-item>
        <el-form-item label="主题" prop="theme">
          <el-input v-model="form.theme" placeholder="请输入新闻主题" />
        </el-form-item>
        <el-form-item label="来源" prop="publishSource">
          <el-input v-model="form.publishSource" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="10"
            placeholder="请输入新闻内容"
          />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="相关大学" prop="relatedUniversity">
          <el-input v-model="form.relatedUniversity" placeholder="请输入相关大学" />
        </el-form-item>
        <el-form-item label="图片" prop="images">
          <el-upload
            class="news-image-upload"
            action="/api/upload"
            :show-file-list="true"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :limit="1"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
            </template>
          </el-upload>
          <el-image
            v-if="form.images"
            :src="form.images"
            class="preview-image"
            style="width: 100px; height: 100px; margin-top: 10px"
          />
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
import { newsApi } from '@/api'

const loading = ref(false)
const newsList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

const form = reactive({
  id: '',
  theme: '',
  title: '',
  images: '',
  content: '',
  tags: '',
  publishSource: '',
  publishTime: '',
  relatedUniversity: ''
})

const rules = {
  title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
  theme: [{ required: true, message: '请输入新闻主题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入新闻内容', trigger: 'blur' }],
  publishSource: [{ required: true, message: '请输入来源', trigger: 'blur' }],
  images: [{ required: false, message: '请上传图片', trigger: 'change' }],
  tags: [{ required: true, message: '请选择状态', trigger: 'change' }],
  relatedUniversity: [{ required: false, message: '请输入相关大学', trigger: 'blur' }],
}

// 获取新闻列表
const getNewsList = async () => {
  loading.value = true
  try {
    const res = await newsApi.list({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    newsList.value = res.data.data.list.map(item => ({ ...item, showFullContent: false }))
    total.value = res.data.data.total
  } catch (error) {
    console.error('获取新闻列表失败：', error)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  getNewsList()
}

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  getNewsList()
}

// 重置表单
const resetForm = () => {
  form.title = ''
  form.theme = ''
  form.content = ''
  form.publishSource = ''
  form.tags = ''
  form.relatedUniversity = ''
  form.images = ''
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
  formRef.value?.validate(async valid => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await newsApi.create(form)
          ElMessage.success('新增成功')
        } else {
          await newsApi.update(form)
          ElMessage.success('编辑成功')
        }
        dialogVisible.value = false
        getNewsList()
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '新增失败' : '编辑失败')
      }
    }
  })
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确认删除该新闻吗？',
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
      newsApi.delete(formData)
      ElMessage.success('删除成功')
      getNewsList()
    } catch (error) {
      console.log(error)
      ElMessage.error('删除失败')
    }
  })
}

const handleUploadSuccess = (response) => {
  form.images = response.data.url
  ElMessage.success('上传成功')
}

const beforeUpload = (file) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('只能上传JPG/PNG格式的图片！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB！')
    return false
  }
  return true
}

onMounted(() => {
  getNewsList()
})
</script>


<style scoped>
.news-container {
  padding: 20px;
}

.news-header {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.news-image-upload {
  display: flex;
  flex-direction: column;
}

.preview-image {
  object-fit: cover;
  border-radius: 4px;
}
</style>